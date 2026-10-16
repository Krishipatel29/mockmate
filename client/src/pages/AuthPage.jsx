import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { errorMessage } from "../api/client.js";

// Login aur Signup dono ek hi page se: mode="login" ya mode="signup"
export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      // Login se pehle jis page par jaana tha, wahin bhejo
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition className="flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-ink-soft">
          {isSignup ? "Your interviews and scores are saved here." : "Log in to continue practising."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignup && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Name</span>
              <input name="name" value={form.name} onChange={update} className="field" required autoComplete="name" />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              className="field"
              required
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              className="field"
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
            {isSignup && <span className="mt-1 block text-xs text-ink-soft">At least 6 characters</span>}
          </label>

          <AnimatePresence>
            {error && (
              <motion.p
                role="alert"
                className="rounded-xl bg-miss/10 px-4 py-3 text-sm font-medium text-miss"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [8, -6, 4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          {isSignup ? "Already have an account? " : "New to MockMate? "}
          <Link to={isSignup ? "/login" : "/signup"} className="font-semibold text-ink underline underline-offset-4">
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
