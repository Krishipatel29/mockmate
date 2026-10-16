import { motion } from "framer-motion";

// AI ka kaam chal raha ho tab teen uchhalte dots + message
export default function ThinkingDots({ label }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="status">
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3 w-3 rounded-full bg-ink"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <p className="font-medium text-ink-soft">{label}</p>
    </div>
  );
}
