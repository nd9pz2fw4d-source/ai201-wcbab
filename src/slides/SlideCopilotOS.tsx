import { AnimatePresence, motion } from "framer-motion";
import { Check, Play, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { Interactive } from "../components/Interactive";
import { goalExamples, goalSteps } from "../data/osOfWork";
import { copilotQuote, todayApps } from "../data/teaching";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const C = { x: 960, y: 620 };
const appAt = (i: number) => {
  const a = (i / todayApps.length) * Math.PI * 2 - Math.PI / 2;
  return { x: C.x + 420 * Math.cos(a), y: C.y + 240 * Math.sin(a) };
};

/** Today: the person is the glue between apps. */
function Today() {
  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <svg className="absolute inset-0" width={1920} height={1080}>
        {todayApps.map((_, i) => {
          const p = appAt(i);
          return <line key={i} x1={C.x} y1={C.y} x2={p.x} y2={p.y} stroke={theme.human} strokeWidth={3} strokeDasharray="7 7" opacity={0.55} />;
        })}
        {/* Criss-crossing copy and paste between apps */}
        {[[0, 3], [2, 6], [1, 5], [4, 7]].map(([a, b], k) => {
          const p = appAt(a);
          const q = appAt(b);
          return <path key={k} d={`M${p.x} ${p.y} Q${C.x} ${C.y + (k % 2 ? 120 : -120)} ${q.x} ${q.y}`} fill="none" stroke={theme.human} strokeWidth={2} opacity={0.25} />;
        })}
      </svg>
      <span className="absolute grid h-[130px] w-[130px] place-items-center rounded-full" style={{ left: C.x - 65, top: C.y - 65, background: theme.human }}>
        <UserRound size={68} color="#fff" />
      </span>
      {todayApps.map((name, i) => {
        const p = appAt(i);
        return (
          <motion.div
            key={name}
            className="absolute whitespace-nowrap rounded-xl bg-white px-5 py-2.5 text-[25px] font-medium"
            style={{ left: p.x, top: p.y, x: "-50%", y: "-50%", color: theme.ink, boxShadow: "0 1px 0 #C9DDEA, 0 6px 16px rgba(12,53,83,0.08)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            {name}
          </motion.div>
        );
      })}
      <div className="absolute inset-x-0 top-[900px] text-center text-[32px] font-medium" style={{ color: theme.human }}>
        You are the glue between the apps
      </div>
    </motion.div>
  );
}

/** Next: state an outcome; Copilot's agents work the apps; a person approves. */
function Next({ runId }: { runId: number }) {
  const n = goalSteps.length;
  const ax = (i: number) => 360 + i * 300;
  return (
    <motion.div key={runId} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <svg className="absolute inset-0" width={1920} height={1080}>
        {goalSteps.map((_, i) => (
          <motion.path
            key={i}
            d={`M${C.x} 545 C${C.x} 590 ${ax(i)} 580 ${ax(i)} 625`}
            fill="none"
            stroke={theme.agent}
            strokeWidth={3}
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute flex items-center gap-3 rounded-full px-9 py-4 text-[32px] font-bold text-white"
        style={{ left: C.x, top: 450, x: "-50%", background: theme.agent, boxShadow: "0 0 0 12px rgba(51,153,204,0.18)" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles size={36} /> Copilot
      </motion.div>
      {goalSteps.map((s, i) => (
        <motion.div
          key={s.app}
          className="absolute flex w-[260px] flex-col items-center gap-2 text-center"
          style={{ left: ax(i) - 130, top: 625 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.12 }}
        >
          <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full border-[5px] bg-white" style={{ borderColor: theme.agent }}>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.25, type: "spring" }}>
              <Check size={36} color={theme.agent} strokeWidth={3} />
            </motion.span>
          </span>
          <span className="text-[24px] font-bold" style={{ color: theme.brandPrimary }}>
            {s.app}
          </span>
          <span className="text-[21px] leading-tight" style={{ color: theme.muted }}>
            {s.step}
          </span>
        </motion.div>
      ))}
      <motion.div
        className="absolute flex items-center gap-4 rounded-2xl px-7 py-4 text-[28px] font-medium text-white"
        style={{ left: C.x, top: 845, x: "-50%", background: theme.human }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 + n * 0.25 }}
      >
        <UserRound size={32} /> A person approves before anything leaves WCB
      </motion.div>
      <div className="absolute inset-x-0 top-[945px] text-center">
        <span className="text-[26px] font-medium italic" style={{ color: theme.brandPrimary }}>
          “{copilotQuote.text}”
        </span>
        <span className="ml-3 text-[20px]" style={{ color: theme.muted }}>
          {copilotQuote.who}
        </span>
      </div>
    </motion.div>
  );
}

export default function SlideCopilotOS() {
  const [mode, setMode] = useSlideState<"today" | "next">("os:mode", "today");
  const [goal, setGoal] = useSlideState("os:goal", goalExamples[0]);
  const [runId, setRunId] = useState(0);
  const run = () => {
    setMode("next");
    setRunId((r) => r + 1);
  };

  return (
    <TeachLayout strand="where" headline="Copilot becomes an operating system of work">
      <Interactive className="absolute right-[100px] top-[250px] z-10 flex rounded-full bg-white p-1.5 shadow-[0_1px_0_#C9DDEA]">
        {(["today", "next"] as const).map((m) => (
          <button
            key={m}
            type="button"
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              m === "next" ? run() : setMode("today");
            }}
            className="rounded-full px-7 py-3 text-[24px] font-medium"
            style={{ background: mode === m ? (m === "today" ? theme.human : theme.agent) : "transparent", color: mode === m ? "#fff" : theme.brandPrimary }}
          >
            {m === "today" ? "Today" : "Copilot as an OS"}
          </button>
        ))}
      </Interactive>

      {mode === "next" && (
        <Interactive className="absolute left-1/2 top-[335px] z-10 flex w-[1000px] -translate-x-1/2 items-center gap-3 rounded-full bg-white py-2 pl-3 pr-2" style={{ boxShadow: `0 0 0 3px ${theme.human}` }}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: theme.human }}>
            <UserRound size={28} color="#fff" />
          </span>
          <input
            aria-label="Goal for Copilot"
            className="min-w-0 flex-1 bg-transparent text-[28px] outline-none"
            style={{ color: theme.ink }}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") run();
            }}
            placeholder="Type an outcome the room calls out"
          />
          <button
            type="button"
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              run();
            }}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-[24px] font-medium text-white"
            style={{ background: theme.agent }}
          >
            <Play size={24} /> Run
          </button>
        </Interactive>
      )}

      <AnimatePresence mode="wait">{mode === "today" ? <Today key="today" /> : <Next key={`next-${runId}`} runId={runId} />}</AnimatePresence>
    </TeachLayout>
  );
}
