import { motion } from "framer-motion";
import { CircleCheck, FileText, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { evalChecks } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

export default function SlideEvaluations() {
  return (
    <TeachLayout strand="how" headline="Test before you trust">
      {/* Test cases: past claims, de-identified */}
      <div className="absolute left-[120px] top-[400px] flex flex-col items-center gap-5">
        <div className="relative h-[240px] w-[220px]">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute grid h-[200px] w-[170px] place-items-center rounded-xl border-2 bg-white"
              style={{ borderColor: theme.line }}
              initial={{ opacity: 0, x: 0, y: 30 }}
              animate={{ opacity: 1, x: i * 9, y: 30 - i * 8 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              {i === 5 && <FileText size={64} color={theme.brandSecondary} />}
            </motion.div>
          ))}
        </div>
        <span className="text-center text-[28px] font-medium leading-tight" style={{ color: theme.ink }}>
          Past claims,
          <br />
          de-identified
        </span>
      </div>

      <svg className="absolute inset-0" width={1920} height={1080}>
        <motion.path d="M400 530 L560 530" stroke={theme.muted} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
        <motion.path d="M780 530 L930 530" stroke={theme.muted} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
      </svg>

      <motion.div
        className="absolute grid h-[180px] w-[180px] place-items-center rounded-full"
        style={{ left: 580, top: 440, background: theme.agent }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Sparkles size={80} color="#fff" />
      </motion.div>

      {/* Scorecard */}
      <motion.div
        className="absolute left-[960px] top-[300px] flex w-[860px] flex-col gap-4 rounded-3xl bg-white p-8"
        style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        {evalChecks.map((c, i) => {
          const ok = c.status === "pass";
          const color = ok ? theme.brandGreen : theme.brandAccent;
          return (
            <div key={c.label} className="flex items-center gap-5">
              <span className="w-[380px] text-[29px] font-medium" style={{ color: theme.ink }}>
                {c.label}
              </span>
              <div className="h-[22px] flex-1 overflow-hidden rounded-full" style={{ background: "#EEF3F7" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: ok ? "100%" : "55%" }}
                  transition={{ delay: 1.0 + i * 0.15, duration: 0.6 }}
                />
              </div>
              <span className="flex w-[160px] items-center gap-2 text-[22px] font-medium" style={{ color: ok ? "#5E8A2A" : "#A86A00" }}>
                {ok ? <CircleCheck size={30} color={color} /> : <TriangleAlert size={30} color={color} />}
                {ok ? "Passes" : "Needs work"}
              </span>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        className="absolute left-[960px] top-[780px] flex items-center gap-4 text-[32px] font-medium"
        style={{ color: theme.brandPrimary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
      >
        <RefreshCw size={36} color={theme.agent} /> Keep testing after launch
      </motion.div>
    </TeachLayout>
  );
}
