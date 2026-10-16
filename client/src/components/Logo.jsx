import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="MockMate home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#FFE14D" />
        <path
          d="M8 10.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5l-4.5 4v-4H11a3 3 0 0 1-3-3z"
          fill="#000000"
        />
        <path
          d="M12.5 13.6l2.2 2.2 4.6-4.6"
          stroke="#FFE14D"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-xl font-bold">MockMate</span>
    </Link>
  );
}
