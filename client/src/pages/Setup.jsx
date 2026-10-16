import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import ThinkingDots from "../components/ThinkingDots.jsx";
import api, { errorMessage } from "../api/client.js";

const ROLES = [
  "React Developer",
  "Node.js Developer",
  "MERN Stack Developer",
  "Java Developer",
  "Python Developer",
  "Data Analyst",
  "DSA Basics",
  "HR Round",
];
const LEVELS = ["Easy", "Medium", "Hard"];
const COUNTS = [3, 5, 10];

// Pill buttons ka group; chuna hua option peeche ek sliding pill se dikhta hai
function Segmented({ name, options, value, onChange, format = (v) => v }) {
  return (
    <div className="inline-flex rounded-full border border-line bg-card p-1" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            value === opt ? "text-on-ink" : "text-ink-soft hover:text-ink"
          }`}
        >
          {value === opt && (
            <motion.span
              layoutId={`pill-${name}`}
              className="absolute inset-0 rounded-full bg-ink"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative">{format(opt)}</span>
        </button>
      ))}
    </div>
  );
}

export default function Setup() {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES[0]);
  const [customRole, setCustomRole] = useState("");
  const [level, setLevel] = useState("Medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Custom role likha ho to wahi use hoga
  const finalRole = customRole.trim() || role;

  async function handleStart() {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/interviews/start", { role: finalRole, level, count });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <ThinkingDots label={`Writing ${count} ${level.toLowerCase()} questions for ${finalRole}...`} />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-3xl">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Set up your interview</h1>
      <p className="mt-2 text-ink-soft">Choose what you want to practise. You can change this every time.</p>

      <section className="mt-10">
        <h2 className="text-lg font-bold">Role</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ROLES.map((r) => {
            const active = !customRole.trim() && role === r;
            return (
              <motion.button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setCustomRole("");
                }}
                whileTap={{ scale: 0.96 }}
                aria-pressed={active}
                className={`rounded-2xl border-2 px-3 py-4 text-left text-sm font-semibold transition-colors ${
                  active ? "border-ink bg-ink text-on-ink" : "spot border-line bg-card hover:border-ink"
                }`}
              >
                {r}
              </motion.button>
            );
          })}
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm text-ink-soft">Or type your own role</span>
          <input
            className="field"
            placeholder="For example: Flutter Developer"
            value={customRole}
            maxLength={60}
            onChange={(e) => setCustomRole(e.target.value)}
          />
        </label>
      </section>

      <section className="mt-10 flex flex-wrap gap-x-12 gap-y-8">
        <div>
          <h2 className="mb-3 text-lg font-bold">Level</h2>
          <Segmented name="level" options={LEVELS} value={level} onChange={setLevel} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">Questions</h2>
          <Segmented name="count" options={COUNTS} value={count} onChange={setCount} />
        </div>
      </section>

      {error && (
        <p role="alert" className="mt-8 rounded-xl bg-miss/10 px-4 py-3 text-sm font-medium text-miss">
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button onClick={handleStart} className="btn btn-primary">
          Start interview
        </button>
        <p className="text-sm text-ink-soft">
          {finalRole}, {level.toLowerCase()}, {count} questions
        </p>
      </div>
    </PageTransition>
  );
}
