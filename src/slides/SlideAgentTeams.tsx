import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { BookOpen, ClipboardPen, FolderOpen, FolderSearch, Network, Stethoscope, UserRound } from "lucide-react";
import { useEffect } from "react";
import { teamAgents } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const COORD = { x: 860, y: 380 };
const FILE = { x: 860, y: 840 };
const PERSON = { x: 1620, y: 840 };
const specX = (i: number) => 320 + i * 360;
const SPEC_Y = 620;
const specIcons = [ClipboardPen, FolderSearch, Stethoscope, BookOpen];

type P = { x: number; y: number };

/** A handoff: a dot travelling coordinator → specialist → case file, on repeat. */
function Handoff({ via, delay }: { via: P; delay: number }) {
  const reduce = useReducedMotion();
  const t = useMotionValue(reduce ? 1 : 0);
  const x = useTransform(t, [0, 1, 2], [COORD.x, via.x, FILE.x]);
  const y = useTransform(t, [0, 1, 2], [COORD.y, via.y, FILE.y]);
  useEffect(() => {
    if (reduce) return;
    const c = animate(t, [0, 1, 2], { duration: 2.2, delay, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" });
    return () => c.stop();
  }, [t, delay, reduce]);
  return <motion.circle r={11} fill={theme.brandAccent} stroke="#fff" strokeWidth={3} cx={x} cy={y} />;
}

export default function SlideAgentTeams() {
  return (
    <TeachLayout strand="how" headline="Agents work in teams">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {teamAgents.map((_, i) => (
          <g key={i} opacity={0.5}>
            <line x1={COORD.x} y1={COORD.y} x2={specX(i)} y2={SPEC_Y} stroke={theme.agent} strokeWidth={3} strokeDasharray="6 8" />
            <line x1={specX(i)} y1={SPEC_Y} x2={FILE.x} y2={FILE.y} stroke={theme.agent} strokeWidth={3} strokeDasharray="6 8" />
          </g>
        ))}
        <line x1={FILE.x + 100} y1={FILE.y} x2={PERSON.x - 70} y2={PERSON.y} stroke={theme.human} strokeWidth={4} strokeDasharray="10 8" />
        {teamAgents.map((_, i) => (
          <Handoff key={i} via={{ x: specX(i), y: SPEC_Y }} delay={0.8 + i * 0.6} />
        ))}
      </svg>

      <motion.div
        className="absolute flex flex-col items-center gap-2"
        style={{ left: COORD.x - 150, top: COORD.y - 75, width: 300 }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="grid h-[150px] w-[150px] place-items-center rounded-full" style={{ background: theme.agent, boxShadow: "0 0 0 10px rgba(31,181,168,0.2)" }}>
          <Network size={70} color="#fff" />
        </span>
      </motion.div>
      <div className="absolute text-[30px] font-bold" style={{ left: COORD.x + 100, top: COORD.y - 24, color: theme.brandPrimary }}>
        Coordinator
      </div>

      {teamAgents.map((name, i) => {
        const Icon = specIcons[i % specIcons.length];
        return (
        <motion.div
          key={name}
          className="absolute flex flex-col items-center gap-2"
          style={{ left: specX(i) - 90, top: SPEC_Y - 50, width: 180 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.12 }}
        >
          <span className="grid h-[100px] w-[100px] place-items-center rounded-full border-[6px] bg-white" style={{ borderColor: theme.agent }}>
            <Icon size={44} color={theme.agent} />
          </span>
          <span className="text-[28px] font-medium" style={{ color: theme.ink }}>
            {name}
          </span>
        </motion.div>
        );
      })}

      <motion.div
        className="absolute flex items-center gap-4 rounded-2xl bg-white px-7 py-5"
        style={{ left: FILE.x - 120, top: FILE.y - 50, boxShadow: `0 0 0 3px ${theme.brandSecondary}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <FolderOpen size={40} color={theme.brandSecondary} />
        <span className="text-[28px] font-medium" style={{ color: theme.ink }}>
          Shared case file
        </span>
      </motion.div>

      <motion.div
        className="absolute flex items-center gap-4"
        style={{ left: PERSON.x - 60, top: PERSON.y - 60 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
      >
        <span className="grid h-[120px] w-[120px] place-items-center rounded-full" style={{ background: theme.human }}>
          <UserRound size={62} color="#fff" />
        </span>
        <span className="text-[30px] font-bold" style={{ color: theme.human }}>
          Decides
        </span>
      </motion.div>

      <motion.div
        className="absolute right-[80px] top-[330px] whitespace-nowrap rounded-2xl px-6 py-4 text-[28px] font-medium"
        style={{ background: "#FFF6E6", color: theme.brandPrimary, boxShadow: `inset 5px 0 0 ${theme.brandAccent}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        Handoffs are where errors travel
      </motion.div>
    </TeachLayout>
  );
}
