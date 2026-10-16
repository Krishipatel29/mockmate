import { Link, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Landing from "./pages/Landing.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Setup from "./pages/Setup.jsx";
import Interview from "./pages/Interview.jsx";
import Result from "./pages/Result.jsx";
// Dashboard mein graph library (Recharts) bhaari hai, isliye ye page zaroorat padne par hi load hota hai
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

function NotFound() {
  return (
    <PageTransition className="text-center">
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-ink-soft">This page does not exist.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Go home
      </Link>
    </PageTransition>
  );
}

export default function App() {
  const location = useLocation();

  // Torch effect: mouse jis ".spot" card par ho, uske andar mouse ki position CSS ko batao
  useEffect(() => {
    function onMove(e) {
      const card = e.target.closest?.(".spot");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      {/* Har page ke upar halki si roshni */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px]"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,241,196,0.06), transparent)" }}
      />
      <Navbar />
      {/* AnimatePresence: purana page "exit" animation ke saath jata hai, naya aata hai */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
          <Route path="/interview/:id" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={null}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
