import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TypingText from "./TypingText.jsx";

// Landing page ka live demo: question type hota hai -> answer type hota hai -> score ka thappa lagta hai
const EXAMPLES = [
  {
    role: "React Developer",
    question: "Why do we pass a key prop when rendering a list?",
    answer: "Keys help React know which item changed, so it updates only that item instead of re-rendering the whole list.",
    score: 8,
    good: "Clear reason, and you mentioned efficient updates.",
    missing: "Say why using the array index as a key can cause bugs.",
  },
  {
    role: "Node.js Developer",
    question: "What is middleware in Express?",
    answer: "A function that runs between the request and the response, like checking if the user is logged in.",
    score: 7,
    good: "Good real example with the login check.",
    missing: "Mention next() and how middleware passes control forward.",
  },
];

export default function HeroDemo() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  // step 0 = question type ho raha, 1 = answer type ho raha, 2 = result dikh raha
  const [step, setStep] = useState(reduceMotion ? 2 : 0);
  const ex = EXAMPLES[index];

  // Result dikhne ke 4.5 second baad agla example
  useEffect(() => {
    if (step !== 2 || reduceMotion) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % EXAMPLES.length);
      setStep(0);
    }, 4500);
    return () => clearTimeout(t);
  }, [step, reduceMotion]);

  return (
    <div className="relative">
      {/* Peeche ka tilted card: stack jaisa feel */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-3xl border border-line bg-card" aria-hidden="true" />

      <div className="spot relative rounded-3xl border border-line bg-card p-5 text-left shadow-[0_0_90px_-30px_rgba(255,225,77,0.35)] sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-card-2 px-3 py-1 text-xs font-semibold text-ink-soft">{ex.role}</span>
          <span className="text-xs text-ink-soft">Question 1 of 5</span>
        </div>

        <p className="mb-1 text-xs font-semibold text-ink-soft">Interviewer</p>
        <p className="min-h-[3.5rem] font-display text-lg font-bold leading-snug sm:text-xl">
          <TypingText key={`q-${index}`} text={ex.question} onDone={() => setStep((s) => Math.max(s, 1))} />
        </p>

        <div className="mt-5 min-h-[5.5rem] rounded-2xl bg-card-2 p-4">
          <p className="mb-1 text-xs font-semibold text-ink-soft">Your answer</p>
          {step >= 1 && (
            <p className="text-[15px] leading-relaxed">
              <TypingText key={`a-${index}`} text={ex.answer} speed={16} onDone={() => setStep(2)} />
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key={`r-${index}`}
              className="mt-5 flex items-start gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {/* Score ka "thappa" (stamp) */}
              <motion.div
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] border-good font-display text-xl font-extrabold text-good"
                initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 16 }}
              >
                {ex.score}/10
              </motion.div>

              <div className="space-y-1.5 text-sm leading-relaxed">
                <p>
                  <span className="font-semibold text-good">Good: </span>
                  {ex.good}
                </p>
                <p>
                  <span className="font-semibold text-miss">Missing: </span>
                  {/* Highlighter pen chalne wala effect */}
                  <motion.span
                    className="marker"
                    initial={{ backgroundSize: "0% 100%" }}
                    animate={{ backgroundSize: "100% 100%" }}
                    transition={{ delay: 0.35, duration: 0.7, ease: "easeInOut" }}
                  >
                    {ex.missing}
                  </motion.span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
