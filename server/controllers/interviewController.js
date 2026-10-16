import mongoose from "mongoose";
import Interview from "../models/Interview.js";
import { generateQuestions, evaluateAnswers } from "../services/aiService.js";

const LEVELS = ["Easy", "Medium", "Hard"];
const COUNTS = [3, 5, 10];
const MAX_ANSWER_LENGTH = 3000;

// Sirf usi user ka interview dhundo jo logged in hai (dusre ka data na dikhe)
async function findOwnInterview(id, userId) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Interview.findOne({ _id: id, user: userId });
}

// AI fail ho jaye to user ko saaf message do
function aiError(res, err) {
  console.error("AI error:", err.message);
  return res.status(502).json({
    message: "The AI could not respond right now. Please wait a minute and try again.",
  });
}

// POST /api/interviews/start   body: { role, level, count }
export async function startInterview(req, res) {
  const body = req.body || {};
  const role = String(body.role || "").trim();
  const { level } = body;
  const count = Number(body.count);

  if (!role || role.length > 60) {
    return res.status(400).json({ message: "Choose a role (max 60 characters)" });
  }
  if (!LEVELS.includes(level)) {
    return res.status(400).json({ message: "Level must be Easy, Medium or Hard" });
  }
  if (!COUNTS.includes(count)) {
    return res.status(400).json({ message: "Number of questions must be 3, 5 or 10" });
  }

  // AI busy ho to bhi practice set se questions aa jaate hain (Plan B)
  let generated;
  try {
    generated = await generateQuestions(role, level, count);
  } catch (err) {
    return aiError(res, err);
  }

  const interview = await Interview.create({
    user: req.userId,
    role,
    level,
    questions: generated.questions.map((question) => ({ question })),
    questionSource: generated.source,
  });

  res.status(201).json(interview);
}

// POST /api/interviews/:id/submit   body: { answers: ["...", "..."] }
export async function submitInterview(req, res) {
  const interview = await findOwnInterview(req.params.id, req.userId);
  if (!interview) return res.status(404).json({ message: "Interview not found" });
  if (interview.status === "completed") {
    return res.status(400).json({ message: "This interview is already submitted" });
  }

  const { answers } = req.body || {};
  if (!Array.isArray(answers) || answers.length !== interview.questions.length) {
    return res.status(400).json({ message: "Send one answer for every question" });
  }

  const items = interview.questions.map((q, i) => ({
    question: q.question,
    answer: String(answers[i] || "").slice(0, MAX_ANSWER_LENGTH),
  }));

  let result;
  try {
    result = await evaluateAnswers(interview.role, interview.level, items);
  } catch (err) {
    return aiError(res, err);
  }

  applyResult(interview, items, result);
  await interview.save();
  res.json(interview);
}

// POST /api/interviews/:id/review   -> basic scoring wale interview ko AI se dobara check karwao
export async function reviewWithAI(req, res) {
  const interview = await findOwnInterview(req.params.id, req.userId);
  if (!interview) return res.status(404).json({ message: "Interview not found" });
  if (interview.status !== "completed") {
    return res.status(400).json({ message: "Submit the interview first" });
  }
  if (interview.reviewedBy === "ai") {
    return res.status(400).json({ message: "This interview already has AI feedback" });
  }

  const items = interview.questions.map((q) => ({ question: q.question, answer: q.answer }));

  let result;
  try {
    // Yahan Plan B nahi: AI se hi chahiye, warna saaf error
    result = await evaluateAnswers(interview.role, interview.level, items, { allowFallback: false });
  } catch (err) {
    return aiError(res, err);
  }

  applyResult(interview, items, result);
  await interview.save();
  res.json(interview);
}

// Result (AI ya basic) ko interview mein bharo aur total score nikalo
function applyResult(interview, items, result) {
  interview.questions.forEach((q, i) => {
    q.answer = items[i].answer;
    q.score = result.evaluations[i].score;
    q.feedback = result.evaluations[i].feedback;
    q.idealAnswer = result.evaluations[i].idealAnswer;
  });

  // Total score = sab scores ka percentage
  const sum = interview.questions.reduce((total, q) => total + q.score, 0);
  interview.totalScore = Math.round((sum / (interview.questions.length * 10)) * 100);
  interview.overallFeedback = result.overallFeedback;
  interview.reviewedBy = result.source;
  interview.status = "completed";
}

// GET /api/interviews   -> dashboard ke liye list (naye pehle)
export async function listInterviews(req, res) {
  const interviews = await Interview.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .select("role level status totalScore reviewedBy createdAt questions")
    .lean();

  res.json(
    interviews.map(({ questions, ...rest }) => ({
      ...rest,
      questionCount: questions.length,
    }))
  );
}

// GET /api/interviews/:id   -> ek interview (interview page / result page)
export async function getInterview(req, res) {
  const interview = await findOwnInterview(req.params.id, req.userId);
  if (!interview) return res.status(404).json({ message: "Interview not found" });
  res.json(interview);
}
