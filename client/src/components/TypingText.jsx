import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Text ko ek-ek letter karke type hote hue dikhata hai (jaise interviewer likh raha ho).
// Naya text dikhana ho to parent se naya "key" do, taaki typing shuru se ho.
export default function TypingText({ text, speed = 22, onDone, className = "" }) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  // onDone ka latest version ref mein rakho (effect dobara na chale)
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  // Reduce-motion wale users ko poora text turant
  const shown = reduceMotion ? text.length : Math.min(count, text.length);
  const finished = shown >= text.length;

  // Har "speed" milliseconds mein ek letter aur
  useEffect(() => {
    if (reduceMotion || finished) return;
    const timer = setInterval(() => setCount((c) => c + 1), speed);
    return () => clearInterval(timer);
  }, [speed, reduceMotion, finished]);

  // Poora type ho gaya to parent ko batao
  useEffect(() => {
    if (finished) doneRef.current?.();
  }, [finished]);

  return (
    <span className={className}>
      {/* Screen reader ko poora text ek saath milta hai */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {!finished && (
          <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-pulse bg-ink" />
        )}
      </span>
    </span>
  );
}
