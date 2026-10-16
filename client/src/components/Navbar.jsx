import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`;

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        {user ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/setup" className={(state) => `${linkClass(state)} hidden sm:inline`}>
              New interview
            </NavLink>
            <button onClick={handleLogout} className="text-sm font-medium text-ink-soft hover:text-ink">
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary !py-2 text-sm">
              Sign up free
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
