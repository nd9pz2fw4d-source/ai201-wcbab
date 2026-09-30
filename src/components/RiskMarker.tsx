import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { theme } from "../theme";

/** A red-edged label with an icon and a few words. Risk moments only. */
export function RiskMarker({ label, delay = 0, size = "md" }: { label: string; delay?: number; size?: "sm" | "md" }) {
  const big = size === "md";
  return (
    <motion.div
      className="inline-flex items-center gap-3 rounded-xl bg-white"
      style={{
        border: `3px solid ${theme.risk}`,
        padding: big ? "12px 22px" : "8px 16px",
        boxShadow: "0 6px 18px rgba(214,69,69,0.18)",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <TriangleAlert size={big ? 32 : 24} color={theme.risk} strokeWidth={2.4} />
      <span className="font-medium" style={{ color: theme.risk, fontSize: big ? 28 : 22 }}>
        {label}
      </span>
    </motion.div>
  );
}
