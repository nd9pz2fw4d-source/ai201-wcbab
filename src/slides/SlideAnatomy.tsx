import { motion } from "framer-motion";
import { Brain, Database, ScrollText, Target, UserRound, Wrench } from "lucide-react";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const CX = 960;
const CY = 590;

const parts = [
  { icon: Target, title: "Goal", text: "What to achieve", x: 520, y: 370 },
  { icon: ScrollText, title: "Instructions", text: "Rules it must follow", x: 1400, y: 370 },
  { icon: Wrench, title: "Tools", text: "Systems it can use", x: 420, y: 760 },
  { icon: Database, title: "Memory", text: "What it knows about this claim", x: 1500, y: 760 },
  { icon: UserRound, title: "A person", text: "Approves and decides", x: 960, y: 880, human: true },
];

export default function SlideAnatomy() {
  return (
    <TeachLayout strand="how" headline="What makes an agent">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {parts.map((p, i) => (
          <motion.line
            key={p.title}
            x1={CX}
            y1={CY}
            x2={p.x}
            y2={p.y}
            stroke={p.human ? theme.human : theme.agent}
            strokeWidth={4}
            strokeDasharray="8 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
          />
        ))}
      </svg>

      <motion.div
        className="absolute flex h-[260px] w-[260px] flex-col items-center justify-center rounded-full text-white"
        style={{ left: CX - 130, top: CY - 130, background: theme.agent, boxShadow: "0 20px 50px rgba(31,181,168,0.35)" }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
      >
        <Brain size={84} strokeWidth={1.6} />
        <span className="mt-2 text-[34px] font-bold">Model</span>
        <span className="text-[22px] opacity-90">Reasons and writes</span>
      </motion.div>

      {parts.map((p, i) => {
        const Icon = p.icon;
        const color = p.human ? theme.human : theme.agent;
        return (
          <motion.div
            key={p.title}
            className="absolute flex w-[390px] items-center gap-5 rounded-3xl bg-white px-6 py-5"
            style={{ left: p.x - 195, top: p.y - 60, boxShadow: `0 0 0 3px ${color}, 0 12px 30px rgba(12,53,83,0.08)` }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.15 }}
          >
            <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full" style={{ background: color }}>
              <Icon size={38} color="#fff" />
            </span>
            <span className="flex flex-col">
              <span className="text-[32px] font-bold" style={{ color: theme.brandPrimary }}>
                {p.title}
              </span>
              <span className="text-[23px] leading-tight" style={{ color: theme.muted }}>
                {p.text}
              </span>
            </span>
          </motion.div>
        );
      })}
    </TeachLayout>
  );
}
