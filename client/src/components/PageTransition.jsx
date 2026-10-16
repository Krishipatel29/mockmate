import { motion } from "framer-motion";

// Har page is wrapper mein hota hai: page badalne par halka fade + slide
export default function PageTransition({ children, className = "" }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 ${className}`}
    >
      {children}
    </motion.main>
  );
}
