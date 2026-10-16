import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { scoreTone } from "../utils/score.js";

// Gol ring jo score tak bharti hai, beech mein number 0 se gin kar badhta hai
export default function ScoreRing({ percent, size = 180 }) {
  const [shown, setShown] = useState(0);
  const tone = scoreTone(percent);
  const stroke = 14;
  const radius = (size - stroke) / 2;

  useEffect(() => {
    const controls = animate(0, percent, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [percent]);

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percent / 100 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-5xl font-extrabold" aria-label={`${percent} percent`}>
          {shown}
          <span className="text-2xl">%</span>
        </p>
        <p className="text-sm font-semibold" style={{ color: tone.color }}>
          {tone.label}
        </p>
      </div>
    </div>
  );
}
