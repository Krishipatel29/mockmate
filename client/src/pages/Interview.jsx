import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import ThinkingDots from "../components/ThinkingDots.jsx";
import TypingText from "../components/TypingText.jsx";
import api, { errorMessage } from "../api/client.js";

// Page refresh hone par bhi likhe hue answers bache rahein (sessionStorage mein)
function loadDraft(id, length) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(`mm_answers_${id}`));
    if (Array.isArray(saved) && saved.length === length) return saved;
  } catch {
    /* kuch nahi mila, khaali answers se shuru */
  }
  return Array(length).fill("");
}
function saveDraft(id, answers) {
  try {
    sessionStorage.setItem(`mm_answers_${id}`, JSON.stringify(answers));
  } catch {
    /* storage band hai to bhi app chalti rahe */
  }
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// Question card left ya right se slide hokar aata hai (aage ya peeche jaane ke hisaab se)
const slide = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 1. Interview load karo
  useEffect(() => {
    api
      .get(`/interviews/${id}`)
      .then(({ data }) => {
        if (data.status === "completed") {
          navigate(`/result/${id}`, { replace: true });
          return;
        }
        setInterview(data);
        setAnswers(loadDraft(id, data.questions.length));
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id, navigate]);

  // 2. Timer: har second +1
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (error && !interview) {
    return (
      <PageTransition>
        <p className="text-miss">{error}</p>
      </PageTransition>
    );
  }
  if (!interview) {
    return (
      <PageTransition>
        <ThinkingDots label="Loading your interview..." />
      </PageTransition>
    );
  }
  if (submitting) {
    return (
      <PageTransition>
        <ThinkingDots label="The interviewer is checking your answers..." />
      </PageTransition>
    );
  }

  const total = interview.questions.length;
  const isLast = current === total - 1;
  const emptyCount = answers.filter((a) => !a.trim()).length;
  const words = answers[current]?.trim() ? answers[current].trim().split(/\s+/).length : 0;

  function updateAnswer(value) {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
    saveDraft(id, next);
  }

  function goTo(index) {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setConfirming(false);
  }

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/interviews/${id}/submit`, { answers });
      sessionStorage.removeItem(`mm_answers_${id}`);
      navigate(`/result/${id}`);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  function handleSubmitClick() {
    if (emptyCount > 0 && !confirming) setConfirming(true);
    else submit();
  }

  return (
    <PageTransition className="max-w-3xl">
      {/* Upar ki patti: role, level, timer */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-card px-3 py-1 text-sm font-semibold border border-line">{interview.role}</span>
        <span className="rounded-full bg-card px-3 py-1 text-sm font-semibold border border-line">{interview.level}</span>
        <span className="ml-auto font-display text-lg font-bold tabular-nums" aria-label="Time spent">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Plan B: AI busy tha to questions practice set se aaye */}
      {interview.questionSource === "practice" && (
        <p className="mt-4 rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink-soft">
          The AI interviewer was busy, so these questions come from the MockMate practice set. Your answers are saved
          and scored the same way.
        </p>
      )}

      {/* Progress bar */}
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <motion.div
          className="h-full rounded-full bg-marker"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Question number buttons: bhara hua = answer likha hai */}
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Jump to question">
        {interview.questions.map((_, i) => {
          const answered = !!answers[i]?.trim();
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Question ${i + 1}${answered ? ", answered" : ""}`}
              aria-current={i === current ? "step" : undefined}
              className={`h-9 w-9 rounded-full text-sm font-bold border-2 transition-colors ${
                i === current
                  ? "border-ink bg-ink text-on-ink"
                  : answered
                  ? "border-marker bg-marker text-on-ink"
                  : "border-line bg-card text-ink-soft hover:border-ink"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question card */}
      <div className="relative mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="spot rounded-3xl border border-line bg-card p-5 sm:p-8"
          >
            <p className="text-sm font-semibold text-ink-soft">
              Question {current + 1} of {total}
            </p>
            <h1 className="mt-2 min-h-[4rem] text-xl font-bold leading-snug sm:text-2xl">
              <TypingText text={interview.questions[current].question} />
            </h1>

            <label className="mt-6 block">
              <span className="sr-only">Your answer</span>
              <textarea
                autoFocus
                value={answers[current] || ""}
                onChange={(e) => updateAnswer(e.target.value)}
                maxLength={3000}
                rows={7}
                placeholder="Type your answer the way you would say it in the interview..."
                className="field resize-y leading-relaxed"
              />
            </label>
            <p className="mt-2 text-right text-xs text-ink-soft">{words} words</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-miss/10 px-4 py-3 text-sm font-medium text-miss">
          {error}
        </p>
      )}

      <AnimatePresence>
        {confirming && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 rounded-xl border border-marker/40 bg-marker/10 px-4 py-3 text-sm font-medium text-marker"
          >
            {emptyCount} {emptyCount === 1 ? "question is" : "questions are"} still empty and will get 0. Press submit
            again to send anyway.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} className="btn btn-ghost">
          Previous
        </button>
        {isLast ? (
          <button onClick={handleSubmitClick} className="btn btn-primary">
            Submit for review
          </button>
        ) : (
          <button onClick={() => goTo(current + 1)} className="btn btn-primary">
            Next question
          </button>
        )}
      </div>
    </PageTransition>
  );
}
