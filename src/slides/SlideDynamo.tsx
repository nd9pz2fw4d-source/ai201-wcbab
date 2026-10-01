import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { dynamo } from "../data/strategy";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const W = 440;
const H = 300;

/** A factory floor plan: machines, and how power reaches them. */
function FloorPlan({ stage }: { stage: number }) {
  const machines = [
    { x: 60, y: 70 }, { x: 170, y: 70 }, { x: 280, y: 70 }, { x: 390, y: 70 },
    { x: 60, y: 210 }, { x: 170, y: 210 }, { x: 280, y: 210 }, { x: 390, y: 210 },
  ];
  const redesigned = stage === 2;
  const source = stage === 0 ? theme.muted : theme.brandAccent;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect x={4} y={4} width={W - 8} height={H - 8} rx={16} fill="#F2F7FA" stroke="#DDE7EE" strokeWidth={3} />
      {!redesigned && (
        <>
          {/* Line shafts and belts from one central power source */}
          <line x1={30} y1={140} x2={W - 30} y2={140} stroke={theme.muted} strokeWidth={6} />
          {machines.map((m, i) => (
            <line key={i} x1={m.x} y1={m.y + (m.y < 140 ? 22 : -22)} x2={m.x} y2={140} stroke={theme.muted} strokeWidth={2} strokeDasharray="4 4" />
          ))}
          <circle cx={30} cy={140} r={24} fill={source} />
        </>
      )}
      {machines.map((m, i) => (
        <g key={i}>
          <rect x={m.x - 26} y={m.y - 22} width={52} height={44} rx={8} fill="#fff" stroke={theme.brandPrimary} strokeWidth={3} />
          {redesigned && <circle cx={m.x + 20} cy={m.y - 18} r={10} fill={theme.brandAccent} />}
        </g>
      ))}
      {redesigned && (
        <path d="M30 140 C120 110 320 170 420 140" fill="none" stroke={theme.agent} strokeWidth={5} strokeDasharray="10 8" />
      )}
    </svg>
  );
}

export default function SlideDynamo() {
  return (
    <TeachLayout strand="where" headline="The gain came from redesign">
      <div className="absolute left-[100px] top-[300px] flex items-start gap-6">
        {dynamo.stages.map((s, i) => (
          <div key={s.when} className="flex items-start gap-6">
            <motion.div
              className="flex w-[480px] flex-col gap-4 rounded-3xl bg-white p-5"
              style={{ boxShadow: i === 2 ? `0 0 0 4px ${theme.agent}, 0 14px 36px rgba(12,53,83,0.1)` : "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.35 }}
            >
              <FloorPlan stage={i} />
              <div className="px-2">
                <div className="text-[22px] font-medium uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
                  {s.when}
                </div>
                <div className="mt-1 text-[28px] font-medium leading-snug" style={{ color: theme.ink }}>
                  {s.label}
                </div>
                {s.result && (
                  <div className="mt-3 text-[32px] font-bold" style={{ color: i === 2 ? theme.agent : theme.human }}>
                    {s.result}
                  </div>
                )}
              </div>
            </motion.div>
            {i < dynamo.stages.length - 1 && (
              <motion.div className="mt-[140px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.35 }}>
                <ArrowRight size={44} color={theme.brandAccent} strokeWidth={2.6} />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <motion.div
        className="absolute left-[100px] top-[870px] text-[32px] font-medium"
        style={{ color: theme.brandPrimary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        Copilot on the old process is the motor on the old layout.
      </motion.div>
      <div className="absolute left-[100px] top-[930px] text-[20px]" style={{ color: theme.muted }}>
        Source: {dynamo.source}
      </div>
    </TeachLayout>
  );
}
