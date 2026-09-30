import { AnimatePresence, motion } from "framer-motion";
import { EyeOff, Hand, TriangleAlert, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { RiskId, TraceStep } from "../data/agentTraces";
import { theme } from "../theme";

interface Props {
  steps: TraceStep[];
  /** How many steps are on screen. */
  shown: number;
  /** Steps the room called "stop" on. */
  stopped?: number[];
  /** Hide the faulty step's text until the reveal. */
  hideFaulty?: boolean;
  /** Steps carrying these risks get a red edge. */
  risks?: RiskId[];
  /** Pulse the row with this index. */
  focus?: number | null;
  rowHeight?: number;
  width?: number;
  tone?: "light" | "dark";
}

/** A vertical, step-by-step replay of what an agent did, one line per step. */
export function AgentTrace({
  steps,
  shown,
  stopped = [],
  hideFaulty = false,
  risks = [],
  focus = null,
  rowHeight = 72,
  width = 760,
  tone = "light",
}: Props) {
  const dark = tone === "dark";
  return (
    <div className="relative" style={{ width }}>
      {/* The spine */}
      <div
        className="absolute bottom-3 top-3 w-[3px] rounded"
        style={{ left: 130, background: dark ? "rgba(255,255,255,0.18)" : "#DDEBF4" }}
      />
      <AnimatePresence initial={false}>
        {steps.slice(0, shown).map((s, i) => {
          const isStop = stopped.includes(i);
          const hidden = hideFaulty && s.faulty;
          const risky = !!s.risk && risks.includes(s.risk);
          const person = s.actor === "person";
          const dot = risky ? theme.risk : person ? theme.human : theme.agent;
          return (
            <motion.div
              key={i}
              className="relative flex items-center"
              style={{ height: rowHeight }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span
                className="w-[104px] shrink-0 text-right text-[24px] tabular-nums"
                style={{ color: dark ? "rgba(255,255,255,0.55)" : theme.muted }}
              >
                {s.time}
              </span>
              <span className="relative z-10 ml-[14px] grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full" style={{ background: dot }}>
                {person && <UserRound size={16} color="#fff" />}
              </span>
              <motion.div
                className="ml-5 flex min-w-0 flex-1 items-center gap-4 rounded-xl px-5"
                style={{
                  height: rowHeight - 14,
                  background: isStop ? theme.human : hidden ? (dark ? "rgba(255,255,255,0.08)" : "#EAF1F6") : dark ? "rgba(255,255,255,0.08)" : "#fff",
                  boxShadow: risky
                    ? `inset 6px 0 0 ${theme.risk}, 0 1px 0 #C9DDEA`
                    : isStop
                      ? "0 10px 26px rgba(224,122,95,0.35)"
                      : dark
                        ? undefined
                        : "0 1px 0 #C9DDEA",
                  color: isStop ? "#fff" : dark ? "#fff" : theme.ink,
                }}
                animate={focus === i ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={{ duration: 0.8, repeat: focus === i ? Infinity : 0 }}
              >
                {hidden ? (
                  <span className="flex items-center gap-3 text-[26px] italic" style={{ color: theme.muted }}>
                    <EyeOff size={26} /> Hidden step
                  </span>
                ) : (
                  <>
                    <span className="truncate text-[27px] font-medium">{s.text}</span>
                    <span
                      className="ml-auto shrink-0 text-[19px]"
                      style={{ color: isStop ? "rgba(255,255,255,0.85)" : dark ? "rgba(255,255,255,0.5)" : theme.muted }}
                    >
                      {s.who}
                    </span>
                    {risky && <TriangleAlert size={26} color={theme.risk} className="shrink-0" />}
                    {isStop && <Hand size={28} className="shrink-0" />}
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/** Plays steps one at a time. Pausing holds the count. */
export function useTracePlayer(total: number, stepMs: number, paused = false, startDelayMs = 400) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (paused || shown >= total) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? startDelayMs : stepMs);
    return () => window.clearTimeout(id);
  }, [paused, shown, total, stepMs, startDelayMs]);
  return [shown, setShown] as const;
}
