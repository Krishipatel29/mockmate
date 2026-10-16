import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import HeroDemo from "../components/HeroDemo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const HEADLINE = "Practise the interview before the interview.";

const STEPS = [
  {
    title: "Pick a role and level",
    text: "React developer, Java developer, HR round or your own role. Easy, medium or hard.",
  },
  {
    title: "Answer one question at a time",
    text: "The AI interviewer writes fresh questions for you. Take your time and type your answer.",
  },
  {
    title: "Get a score on every answer",
    text: "See what you got right, what was missing, and a model answer to learn from.",
  },
];

// Upar se girti hui spotlight ki roshni (hot seat wala feel)
function Spotlight() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[900px] w-[1100px] -translate-x-1/2 blur-2xl"
      style={{
        background:
          "conic-gradient(from 157deg at 50% 0%, transparent 0deg, rgba(255,241,196,0.16) 23deg, transparent 46deg, transparent 360deg)",
        maskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.75, 1] }}
      transition={{ duration: 1.6, delay: 0.1, times: [0, 0.5, 0.65, 1] }}
    />
  );
}

export default function Landing() {
  const { user } = useAuth();
  const startLink = user ? "/setup" : "/signup";
  const words = HEADLINE.split(" ");

  return (
    <PageTransition className="overflow-x-clip">
      {/* Hero: beech mein stage, upar se spotlight */}
      <section className="relative isolate flex flex-col items-center pt-6 text-center sm:pt-12">
        <Spotlight />

        <h1 aria-label={HEADLINE} className="max-w-4xl text-5xl font-extrabold leading-[0.98] sm:text-7xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="mr-[0.22em] inline-block"
              initial={{ opacity: 0, y: "0.35em", filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.5, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-lg text-ink-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          An AI interviewer asks you real questions for your role, then scores every answer and tells you exactly what
          to improve.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
        >
          <Link to={startLink} className="btn btn-primary">
            Start a mock interview
          </Link>
          {user && (
            <Link to="/dashboard" className="btn btn-ghost">
              See my progress
            </Link>
          )}
        </motion.div>

        {/* Stage: demo card, neeche zameen par roshni ka gol ghera */}
        <motion.div
          className="relative mt-16 w-full max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <HeroDemo />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 left-1/2 -z-10 h-24 w-[130%] -translate-x-1/2 rounded-[50%] blur-2xl"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,241,196,0.18), transparent 70%)" }}
          />
        </motion.div>
      </section>

      {/* Ek session kaise chalta hai: asli sequence hai, isliye numbered */}
      <section className="mt-32 sm:mt-40">
        <h2 className="text-3xl font-bold sm:text-4xl">How a session works</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              className="border-t border-line pt-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
            >
              <span className="font-display text-4xl font-extrabold text-marker">{i + 1}</span>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="spot mt-24 flex flex-col items-start gap-5 rounded-3xl border border-line bg-card p-8 sm:mt-32 sm:flex-row sm:items-center sm:justify-between sm:p-12">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Your next interview is closer than you think.</h2>
          <p className="mt-2 text-ink-soft">A five-question round takes about fifteen minutes.</p>
        </div>
        <Link to={startLink} className="btn shrink-0 bg-marker text-on-ink hover:bg-ink">
          Start practising
        </Link>
      </section>

      <footer className="mt-16 text-center text-sm text-ink-soft">
        MockMate. Built with React, Node, Express, MongoDB and Gemini.
      </footer>
    </PageTransition>
  );
}
