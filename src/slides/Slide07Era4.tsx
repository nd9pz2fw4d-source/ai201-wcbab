import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { BookOpen, Database } from "lucide-react";
import { useEffect } from "react";
import { ClaimJourney, stationXY } from "../components/ClaimJourney";
import { theme } from "../theme";
import { EraLayout } from "./EraLayout";

const EVIDENCE = 3;
const MEDICAL = 4;
const ENTITLEMENT = 5;

/** A teal dot running from a point to a station, again and again. */
function Runner({ from, to, delay }: { from: { x: number; y: number }; to: { x: number; y: number }; delay: number }) {
  const reduce = useReducedMotion();
  const p = useMotionValue(reduce ? 0.5 : 0);
  const x = useTransform(p, (v) => from.x + (to.x - from.x) * v);
  const y = useTransform(p, (v) => from.y + (to.y - from.y) * v);
  useEffect(() => {
    if (reduce) return;
    const c = animate(p, [0, 1], { duration: 1.2, delay, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" });
    return () => c.stop();
  }, [p, delay, reduce]);
  return (
    <motion.g style={{ x, y }}>
      <circle r={9} fill={theme.agent} />
    </motion.g>
  );
}

/** Systems feeding evidence, a policy check, and a recommendation with a confidence gauge. */
function AgentWork() {
  const ev = stationXY(EVIDENCE);
  const med = stationXY(MEDICAL);
  const ent = stationXY(ENTITLEMENT);
  const systems = [-110, 0, 110].map((dx) => ({ x: ev.x + dx, y: ev.y + 210 }));
  const policy = { x: med.x + 60, y: med.y + 215 };
  // Confidence gauge: a half dial, needle high.
  const g = { x: ent.x + 10, y: ent.y - 190 };
  return (
    <g>
      {systems.map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1={s.y} x2={ev.x} y2={ev.y + 40} stroke={theme.agent} strokeWidth={2} strokeDasharray="4 6" opacity={0.6} />
          <g transform={`translate(${s.x} ${s.y})`}>
            <rect x={-30} y={-26} width={60} height={52} rx={10} fill="#fff" stroke={theme.agent} strokeWidth={2} />
            <Database x={-15} y={-15} width={30} height={30} color={theme.agent} />
          </g>
          <Runner from={s} to={{ x: ev.x, y: ev.y + 40 }} delay={0.5 + i * 0.35} />
        </g>
      ))}
      <g>
        <line x1={policy.x} y1={policy.y} x2={med.x + 20} y2={med.y + 40} stroke={theme.agent} strokeWidth={2} strokeDasharray="4 6" opacity={0.6} />
        <g transform={`translate(${policy.x} ${policy.y})`}>
          <rect x={-30} y={-26} width={60} height={52} rx={10} fill="#fff" stroke={theme.agent} strokeWidth={2} />
          <BookOpen x={-15} y={-15} width={30} height={30} color={theme.agent} />
        </g>
        <Runner from={policy} to={{ x: med.x + 20, y: med.y + 40 }} delay={0.9} />
      </g>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
        <g transform={`translate(${g.x} ${g.y})`}>
          <rect x={-110} y={-86} width={220} height={120} rx={16} fill="#fff" stroke={theme.agent} strokeWidth={3} />
          <path d="M-70 10 A70 70 0 0 1 70 10" fill="none" stroke="#E4EEF5" strokeWidth={16} strokeLinecap="round" />
          <motion.path
            d="M-70 10 A70 70 0 0 1 70 10"
            fill="none"
            stroke={theme.agent}
            strokeWidth={16}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.78 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          />
          <text y={2} textAnchor="middle" fontSize={20} fontWeight={500} fill={theme.muted}>
            Confidence
          </text>
          <line x1={0} y1={34} x2={0} y2={80} stroke={theme.agent} strokeWidth={3} />
        </g>
      </motion.g>
    </g>
  );
}

export default function Slide07Era4() {
  return (
    <EraLayout era={4} headline="It does the steps. People make the decision." human={40} ai={60}>
      <div className="absolute left-[80px] top-[330px]">
        <ClaimJourney
          era={4}
          travel="loop"
          speed="fast"
          stationRoles={{
            report: "assist",
            register: "automate",
            sort: "assist",
            evidence: "assist",
            medical: "assist",
            entitlement: "human",
            benefits: "assist",
            close: "human",
          }}
          humanCheckpoints={["entitlement"]}
          agents={[
            { from: 0, to: 1, duration: 1.2 },
            { from: 1, to: 3, duration: 1.6, delay: 0.4 },
            { from: 3, to: 4, duration: 1.2, delay: 0.8 },
            { from: 4, to: 5, duration: 1.2, delay: 1.2 },
          ]}
          pages={4}
          overlay={<AgentWork />}
        />
      </div>
    </EraLayout>
  );
}
