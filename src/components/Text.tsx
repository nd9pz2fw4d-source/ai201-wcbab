import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** The one line of on-screen text most slides carry. */
export function Headline({
  children,
  tone = "light",
  delay = 0.2,
  size = 76,
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  delay?: number;
  size?: number;
  className?: string;
}) {
  return (
    <motion.h1
      className={`font-medium leading-[1.08] tracking-[-0.01em] ${className}`}
      style={{ fontSize: size, color: tone === "dark" ? "#fff" : "var(--brand-primary)" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.h1>
  );
}
