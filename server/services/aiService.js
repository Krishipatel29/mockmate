// AI se baat karne wala saara code isi file mein hai.
// Poore interview mein AI sirf 2 baar call hota hai:
//   1. generateQuestions()  -> questions banana
//   2. evaluateAnswers()    -> saare answers ek saath check karna
// Plan B: AI busy ho to practice question bank + basic scoring se kaam chalta hai,
// taaki app kabhi error screen par na ruke.

import { GoogleGenAI } from "@google/genai";
import { pickBankQuestions, bankAnswerFor } from "./questionBank.js";

let client = null;
function getClient() {
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

// AI kabhi kabhi JSON ko ```json ... ``` mein lapet deta hai, use saaf karke parse karo
export function parseJSON(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

// Ye errors "thodi der baad theek ho jaate hain": dobara try karna chahiye
// 429 = limit cross, 500/503/504 = Google ka server busy
const RETRYABLE = [429, 500, 503, 504];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ek model ko ek baar call karo
async function callModel(model, prompt, isMain, timeout) {
  const config = {
    responseMimeType: "application/json", // AI ko bolo sirf JSON de
    httpOptions: { timeout }, // itne time mein jawab nahi to error
  };
  if (isMain) config.thinkingConfig = { thinkingLevel: "LOW" }; // kam sochna = jaldi jawab

  const response = await getClient().models.generateContent({ model, contents: prompt, config });
  return parseJSON(response.text);
}

// Prompt bhejo aur JSON object wapas lo.
// Har model ko 3 baar try, phir bhi na chale to agla backup model.
// Sab milake 60 second se zyada nahi (user ko itna hi wait karna pade).
const TOTAL_BUDGET_MS = 60000;

async function askAI(prompt) {
  const begin = Date.now();
  const mainModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  // Backup models comma se alag: "model-a,model-b"
  const backups = (process.env.GEMINI_BACKUP_MODEL || "gemini-3.5-flash,gemini-3.1-flash-lite")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const models = [...new Set([mainModel, ...backups])];

  let lastError;
  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const timeLeft = TOTAL_BUDGET_MS - (Date.now() - begin);
      if (timeLeft < 5000) {
        console.log("  AI time budget used up");
        throw lastError || new Error("AI time budget used up");
      }
      const started = Date.now();
      console.log(`Asking AI (${model}), try ${attempt}...`);
      try {
        const data = await callModel(model, prompt, model === mainModel, Math.min(45000, timeLeft));
        console.log(`AI replied in ${((Date.now() - started) / 1000).toFixed(1)}s`);
        return data;
      } catch (err) {
        lastError = err;
        console.log(`  failed: ${err.status || ""} ${String(err.message).slice(0, 120)}`);
        if (!RETRYABLE.includes(err.status)) break; // dobara try karne se fayda nahi, agla model
        if (attempt < 3) await wait(2000 * attempt); // 2s, phir 4s ruk ke dobara
      }
    }
  }
  throw lastError;
}

// Plan B chalu hai? (AI_FALLBACK=false likhoge to band ho jayega)
function fallbackAllowed() {
  return process.env.AI_FALLBACK !== "false";
}

// ---------- 1. Questions banana ----------
// Return: { questions: [...], source: "ai" | "practice" }
export async function generateQuestions(role, level, count) {
  if (process.env.AI_MOCK === "true") {
    return { questions: pickBankQuestions(role, count), source: "practice" };
  }

  const prompt = `You are an experienced technical interviewer at a product-based company.
Create exactly ${count} interview questions for a "${role}" candidate.
Difficulty: ${level} (the candidate is a fresher / intern applicant).
Rules:
- Mix concept questions and practical "how would you" questions.
- Each question must be answerable in a few sentences of plain text (no long code).
- Do not number the questions.
Return JSON in this exact shape:
{ "questions": ["question 1", "question 2"] }`;

  try {
    const data = await askAI(prompt);
    const questions = (data.questions || [])
      .filter((q) => typeof q === "string" && q.trim())
      .map((q) => q.trim())
      .slice(0, count);

    if (questions.length < count) throw new Error("AI returned fewer questions than asked");
    return { questions, source: "ai" };
  } catch (err) {
    if (!fallbackAllowed()) throw err;
    console.log("Plan B: AI busy, using practice question set");
    return { questions: pickBankQuestions(role, count), source: "practice" };
  }
}

// ---------- 2. Answers check karna ----------
// items = [{ question, answer }, ...]
// Return: { evaluations, overallFeedback, source: "ai" | "basic" }
// allowFallback = false ho to AI fail hone par error (re-review button ke liye)
export async function evaluateAnswers(role, level, items, { allowFallback = true } = {}) {
  if (process.env.AI_MOCK === "true") return basicEvaluate(items);

  const prompt = `You are a fair but honest interviewer for a "${role}" role (${level} level, fresher candidate).
Evaluate each answer below.
For every item give:
- "score": integer from 0 to 10 (an empty or "I don't know" answer gets 0)
- "feedback": 2-3 short sentences: what was good, then what was missing or wrong
- "idealAnswer": a model answer in 3-5 sentences
Also give "overallFeedback": 2-3 sentences on the candidate's overall performance and the top thing to improve.
Keep the evaluations in the same order as the input.

Input:
${JSON.stringify(items, null, 2)}

Return JSON in this exact shape:
{ "evaluations": [ { "score": 7, "feedback": "...", "idealAnswer": "..." } ], "overallFeedback": "..." }`;

  try {
    const data = await askAI(prompt);
    const evaluations = data.evaluations || [];
    if (evaluations.length !== items.length) {
      throw new Error("AI evaluation count does not match the number of questions");
    }
    return {
      evaluations: evaluations.map((e) => ({
        score: clampScore(e.score),
        feedback: String(e.feedback || ""),
        idealAnswer: String(e.idealAnswer || ""),
      })),
      overallFeedback: String(data.overallFeedback || ""),
      source: "ai",
    };
  } catch (err) {
    if (!allowFallback || !fallbackAllowed()) throw err;
    console.log("Plan B: AI busy, using basic scoring");
    return basicEvaluate(items);
  }
}

// Score ko hamesha 0-10 ke beech ka whole number banao
function clampScore(value) {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

// ---------- Plan B: basic scoring (bina AI ke) ----------
// Answer kitna lamba hai + ideal answer ke kitne key words cover kiye, isse score banta hai.
const STOP_WORDS = new Set(
  ("about after also because been before being between both does doing each from have having into just like " +
    "make more most much only other over same should some such than that their them then there these they this " +
    "those through under very what when where which while will with would your using used uses example otherwise " +
    "means called itself always never every could might first second another thing things").split(" ")
);

function keyWords(text) {
  const words = String(text).toLowerCase().match(/[a-z][a-z0-9+#]*/g) || [];
  return [...new Set(words.filter((w) => w.length > 3 && !STOP_WORDS.has(w)))];
}

const GENERIC_IDEAL =
  "A strong answer defines the concept clearly, explains why it matters, and gives a short real example. " +
  "Use “Get AI review” later for a detailed model answer.";

function basicEvaluate(items) {
  const evaluations = items.map(({ question, answer }) => {
    const ideal = bankAnswerFor(question);
    const text = String(answer || "").trim();
    const wordCount = text ? text.split(/\s+/).length : 0;

    if (!wordCount) {
      return { score: 0, feedback: "No answer was given for this question.", idealAnswer: ideal || GENERIC_IDEAL };
    }

    // Kitne key words cover hue
    const target = keyWords(ideal || question);
    const said = new Set(keyWords(text));
    // Same word ya same shuruaat (hash ~ hashing, collision ~ collisions) dono chalega
    const root = (w) => w.slice(0, 5);
    const saidList = [...said];
    const covered = target.filter((w) => saidList.some((x) => x.startsWith(root(w)) || w.startsWith(root(x))));
    // Chhoote hue key words: pehle wo jo question mein bhi hain, phir lambe words
    const inQuestion = new Set(keyWords(question));
    const missing = target
      .filter((w) => !covered.includes(w))
      .sort((a, b) => inQuestion.has(b) - inQuestion.has(a) || b.length - a.length)
      .slice(0, 3);
    const coverage = target.length ? covered.length / target.length : 0;

    // Lambai ke max 4 points + key words ke max 6 points
    const lengthPoints = wordCount >= 60 ? 4 : wordCount >= 35 ? 3.5 : wordCount >= 20 ? 3 : wordCount >= 10 ? 2 : 1;
    const score = clampScore(lengthPoints + Math.min(6, coverage * 12));

    let feedback;
    if (score >= 7) feedback = "Good answer that covers the main points. Add a short real example to make it even stronger.";
    else if (score >= 4) feedback = "You have the basic idea, but some key points are missing. Compare with the strong answer below.";
    else feedback = "This answer misses most of the key points. Read the strong answer below and practise saying it in your own words.";
    if (wordCount < 15) feedback += " Try to explain in more detail.";
    if (ideal && missing.length && score < 8) feedback += ` Key terms to include: ${missing.join(", ")}.`;

    return { score, feedback, idealAnswer: ideal || GENERIC_IDEAL };
  });

  return {
    evaluations,
    overallFeedback:
      "The AI reviewer was busy, so this result uses MockMate's basic scoring, which checks how complete your answers are " +
      "and how many key points they cover. Use “Get AI review” for detailed feedback once the AI is free.",
    source: "basic",
  };
}
