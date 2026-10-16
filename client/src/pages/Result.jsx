import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import ThinkingDots from "../components/ThinkingDots.jsx";
import ScoreRing from "../components/ScoreRing.jsx";
import { scoreTone } from "../utils/score.js";
import api, { errorMessage } from "../api/client.js";

// Ek question ka result: click karne par khulta hai (accordion)
function QuestionResult({ q, index, open, onToggle }) {
  const tone = scoreTone(q.score * 10);

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.08 }}
      className="spot rounded-2xl border border-line bg-card"
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] font-display font-extrabold"
          style={{ borderColor: tone.color, color: tone.color }}
        >
          {q.score}
        </span>
        <span className="flex-1">
          <span className="block text-xs font-semibold text-ink-soft">
            Question {index + 1}, {q.score} out of 10
          </span>
          <span className="mt-1 block font-semibold leading-snug">{q.question}</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="mt-1 text-ink-soft" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-line px-5 pb-6 pt-5 sm:pl-[5.25rem]">
              <div>
                <h3 className="text-sm font-bold">Your answer</h3>
                <p className="mt-1 whitespace-pre-wrap text-ink-soft">
                  {q.answer.trim() || "You left this one empty."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold">Feedback</h3>
                <p className="mt-1">
                  <motion.span
                    className="marker"
                    initial={{ backgroundSize: "0% 100%" }}
                    animate={{ backgroundSize: "100% 100%" }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                  >
                    {q.feedback}
                  </motion.span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold">A strong answer</h3>
                <p className="mt-1 text-ink-soft">{q.idealAnswer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Result() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Basic scoring wale result ko AI se dobara check karwao
  async function getAIReview() {
    setReviewError("");
    setReviewing(true);
    try {
      const { data } = await api.post(`/interviews/${id}/review`);
      setInterview(data);
      setOpenIndex(0);
    } catch (err) {
      setReviewError(errorMessage(err));
    } finally {
      setReviewing(false);
    }
  }

  useEffect(() => {
    api
      .get(`/interviews/${id}`)
      .then(({ data }) => setInterview(data))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <PageTransition>
        <p className="text-miss">{error}</p>
      </PageTransition>
    );
  }
  if (!interview) {
    return (
      <PageTransition>
        <ThinkingDots label="Loading your result..." />
      </PageTransition>
    );
  }
  if (interview.status !== "completed") {
    return (
      <PageTransition>
        <p>This interview is not submitted yet.</p>
        <Link to={`/interview/${id}`} className="btn btn-primary mt-4">
          Continue interview
        </Link>
      </PageTransition>
    );
  }

  const date = new Date(interview.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <PageTransition className="max-w-3xl">
      <section className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
        <ScoreRing percent={interview.totalScore} />
        <div>
          <p className="text-sm text-ink-soft">
            {interview.role}, {interview.level.toLowerCase()} level, {date}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Your interview result</h1>
          <p className="mt-3 leading-relaxed text-ink-soft">{interview.overallFeedback}</p>
        </div>
      </section>

      {/* Plan B: basic scoring hua tha to AI review ka option */}
      {interview.reviewedBy === "basic" && (
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-marker/40 bg-marker/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-marker">Scored with basic checks</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {reviewing
                ? "Asking the AI reviewer. This can take up to a minute..."
                : reviewError || "The AI reviewer was busy. Get detailed AI feedback on the same answers now."}
            </p>
          </div>
          <button onClick={getAIReview} disabled={reviewing} className="btn shrink-0 bg-marker text-on-ink">
            {reviewing ? "Reviewing..." : "Get AI review"}
          </button>
        </section>
      )}

      <h2 className="mt-14 text-2xl font-bold">Answer by answer</h2>
      <ul className="mt-5 space-y-3">
        {interview.questions.map((q, i) => (
          <QuestionResult
            key={i}
            q={q}
            index={i}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/setup" className="btn btn-primary">
          Practise again
        </Link>
        <Link to="/dashboard" className="btn btn-ghost">
          Go to dashboard
        </Link>
      </div>
    </PageTransition>
  );
}
