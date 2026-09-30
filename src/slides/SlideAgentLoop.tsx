import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, ListChecks, Play, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { loopSteps, type LoopStage } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const CX = 560;
const CY = 590;
const R = 230;

const nodes: Record<Exclude<LoopStage, "handover">, { label: string; icon: typeof Eye; angle: number }> = {
  plan: { label: "Plan", icon: ListChecks, angle: -90 },
  act: { label: "Act", icon: Play, angle: 30 },
  check: { label: "Check", icon: Eye, angle: 150 },
};
const at = (deg: number, r = R) => ({ x: CX + r * Math.cos((deg * Math.PI) / 180), y: CY + r * Math.sin((deg * Math.PI) / 180) });
const HAND = { x: 1000, y: 920 };
const STEP_MS = 1300;

export default function SlideAgentLoop() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? loopSteps.length - 1 : 0);

  // Walk the loop one step at a time, pause at the handover, then start again.
  useEffect(() => {
    if (reduce) return;
    const last = step === loopSteps.length - 1;
    const id = window.setTimeout(() => setStep(last ? 0 : step + 1), last ? 3500 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [step, reduce]);

  const stage = loopSteps[step].stage;
  const dot = stage === "handover" ? HAND : at(nodes[stage].angle);

  return (
    <TeachLayout strand="how" headline="Plan. Act. Check. Repeat.">
      <svg className="absolute inset-0" width={1920} height={1080}>
        <defs>
          <marker id="loop-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={theme.agent} />
          </marker>
        </defs>
        {/* Arcs between the three stages, clockwise */}
        {[-90, 30, 150].map((a) => {
          const p = at(a + 22);
          const q = at(a + 98);
          return (
            <path
              key={a}
              d={`M${p.x} ${p.y} A${R} ${R} 0 0 1 ${q.x} ${q.y}`}
              fill="none"
              stroke={theme.agent}
              strokeWidth={6}
              markerEnd="url(#loop-arrow)"
              opacity={0.55}
            />
          );
        })}
        {/* Out of the loop: back to a person */}
        <path d={`M${at(150).x} ${at(150).y + 72} C${at(150).x} ${HAND.y} ${CX} ${HAND.y} ${HAND.x - 58} ${HAND.y}`} fill="none" stroke={theme.human} strokeWidth={4} strokeDasharray="10 8" />
        <g transform={`translate(${HAND.x} ${HAND.y})`}>
          <circle r={58} fill={theme.human} />
          <UserRound x={-30} y={-30} width={60} height={60} color="#fff" strokeWidth={2} />
        </g>
        <text x={HAND.x + 80} y={HAND.y + 12} fontSize={30} fontWeight={500} fill={theme.human}>
          Hand to a person
        </text>

        {(Object.keys(nodes) as (keyof typeof nodes)[]).map((k) => {
          const n = nodes[k];
          const p = at(n.angle);
          const Icon = n.icon;
          const on = stage === k;
          return (
            <g key={k} transform={`translate(${p.x} ${p.y})`}>
              <circle r={72} fill={on ? theme.agent : "#fff"} stroke={theme.agent} strokeWidth={5} style={{ transition: "fill 300ms" }} />
              <Icon x={-22} y={-40} width={44} height={44} color={on ? "#fff" : theme.agent} strokeWidth={2.2} />
              <text y={34} textAnchor="middle" fontSize={28} fontWeight={700} fill={on ? "#fff" : theme.brandPrimary}>
                {n.label}
              </text>
            </g>
          );
        })}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={26} fill={theme.muted}>
          Until the goal is met
        </text>
        <text x={CX} y={CY + 28} textAnchor="middle" fontSize={26} fill={theme.muted}>
          or it needs a person
        </text>

        {/* The agent: a teal dot moving between stages */}
        <motion.circle
          r={20}
          fill={theme.brandAccent}
          stroke="#fff"
          strokeWidth={4}
          initial={{ cx: dot.x + 52, cy: dot.y - 52 }}
          animate={{ cx: dot.x + 52, cy: dot.y - 52 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>

      {/* What the agent is doing on our claim */}
      <div className="absolute left-[1080px] top-[300px] flex w-[760px] flex-col gap-3">
        <AnimatePresence initial={false}>
          {loopSteps.slice(0, step + 1).map((s, i) => {
            const person = s.stage === "handover";
            const current = i === step;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-4 rounded-2xl px-5 py-3"
                style={{
                  background: current ? (person ? theme.human : theme.agent) : "#fff",
                  color: current ? "#fff" : theme.ink,
                  boxShadow: "0 1px 0 #C9DDEA",
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className="w-[120px] shrink-0 text-[20px] font-bold uppercase tracking-wider" style={{ opacity: 0.75 }}>
                  {person ? "Person" : s.stage}
                </span>
                <span className="text-[27px] font-medium">{s.text}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </TeachLayout>
  );
}
