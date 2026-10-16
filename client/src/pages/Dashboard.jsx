import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageTransition from "../components/PageTransition.jsx";
import ThinkingDots from "../components/ThinkingDots.jsx";
import { scoreTone } from "../utils/score.js";
import { useAuth } from "../context/AuthContext.jsx";
import api, { errorMessage } from "../api/client.js";

function shortDate(d) {
  return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// Graph par hover karne par dikhne wala box
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 text-sm shadow-sm">
      <p className="font-bold">{p.score}%</p>
      <p className="text-ink-soft">
        {p.role}, {p.date}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/interviews")
      .then(({ data }) => setInterviews(data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) {
    return (
      <PageTransition>
        <p className="text-miss">{error}</p>
      </PageTransition>
    );
  }
  if (!interviews) {
    return (
      <PageTransition>
        <ThinkingDots label="Loading your interviews..." />
      </PageTransition>
    );
  }

  const done = interviews.filter((i) => i.status === "completed");
  const average = done.length ? Math.round(done.reduce((s, i) => s + i.totalScore, 0) / done.length) : null;
  const best = done.length ? Math.max(...done.map((i) => i.totalScore)) : null;

  // Graph ke liye purane se naye ki taraf
  const chartData = [...done].reverse().map((i) => ({
    date: shortDate(i.createdAt),
    score: i.totalScore,
    role: i.role,
  }));

  const stats = [
    { label: "Interviews completed", value: done.length },
    { label: "Average score", value: average === null ? "-" : `${average}%` },
    { label: "Best score", value: best === null ? "-" : `${best}%` },
  ];

  return (
    <PageTransition>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Hi {user?.name?.split(" ")[0]}</h1>
          <p className="mt-1 text-ink-soft">Here is how your practice is going.</p>
        </div>
        <Link to="/setup" className="btn btn-primary">
          New interview
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="mt-12 rounded-3xl border-2 border-dashed border-line p-10 text-center">
          <h2 className="text-2xl font-bold">No interviews yet</h2>
          <p className="mt-2 text-ink-soft">Take your first mock interview. It takes about fifteen minutes.</p>
          <Link to="/setup" className="btn btn-primary mt-6">
            Start your first interview
          </Link>
        </div>
      ) : (
        <>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="spot rounded-2xl border border-line bg-card p-5">
                <dt className="text-sm text-ink-soft">{s.label}</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold">{s.value}</dd>
              </div>
            ))}
          </dl>

          {chartData.length >= 2 && (
            <section className="mt-8 rounded-3xl border border-line bg-card p-5 sm:p-7">
              <h2 className="text-lg font-bold">Score over time</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--color-ink-soft)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "var(--color-ink-soft)", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-ink-soft)", strokeDasharray: "4 4" }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-ink)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-ink)", stroke: "var(--color-card)", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "var(--color-marker)", stroke: "var(--color-ink)", strokeWidth: 2 }}
                      animationDuration={1200}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <h2 className="mt-12 text-2xl font-bold">All interviews</h2>
          <ul className="mt-5 space-y-3">
            {interviews.map((item, i) => {
              const completed = item.status === "completed";
              const tone = completed ? scoreTone(item.totalScore) : null;
              return (
                <motion.li
                  key={item._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.05 }}
                >
                  <Link
                    to={completed ? `/result/${item._id}` : `/interview/${item._id}`}
                    className="spot flex items-center gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-ink"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.role}</p>
                      <p className="text-sm text-ink-soft">
                        {item.level}, {item.questionCount} questions, {shortDate(item.createdAt)}
                      </p>
                    </div>
                    {completed ? (
                      <div className="text-right">
                        <p className="font-display text-2xl font-extrabold" style={{ color: tone.color }}>
                          {item.totalScore}%
                        </p>
                        <p className="text-xs font-semibold" style={{ color: tone.color }}>
                          {tone.label}
                        </p>
                      </div>
                    ) : (
                      <span className="rounded-full bg-marker px-3 py-1 text-xs font-bold text-on-ink">Continue</span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </>
      )}
    </PageTransition>
  );
}
