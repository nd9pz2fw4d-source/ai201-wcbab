import { motion, useReducedMotion } from "framer-motion";
import { Cloud, MousePointer2, UserRound } from "lucide-react";
import { computerAgentTraits, computerAgents } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const CARD_W = 500;
const GAP = 60;
const LEFT = (1920 - (CARD_W * 3 + GAP * 2)) / 2;

// Where the pointer clicks inside each little screen, in turn.
const clicks = [
  { x: 60, y: 60 },
  { x: 250, y: 118 },
  { x: 150, y: 176 },
  { x: 300, y: 60 },
];

/** A cloud computer with an agent's pointer working its apps. */
function CloudScreen({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto h-[250px] w-[400px]">
      <Cloud className="absolute -top-9 left-1/2 -translate-x-1/2" size={70} color={theme.brandSky} strokeWidth={1.6} />
      <div className="absolute inset-x-0 bottom-0 top-3 overflow-hidden rounded-2xl border-[5px] bg-[#EEF5FA]" style={{ borderColor: theme.brandPrimary }}>
        {/* App windows on the screen */}
        {[
          { l: 18, t: 18, w: 170, h: 90 },
          { l: 205, t: 30, w: 170, h: 120 },
          { l: 40, t: 125, w: 220, h: 80 },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-lg bg-white" style={{ left: b.l, top: b.t, width: b.w, height: b.h, boxShadow: "0 1px 0 #C9DDEA" }}>
            <div className="h-[16px] rounded-t-lg" style={{ background: i === 1 ? theme.agent : "#DDE7EE" }} />
            <div className="m-2 h-[6px] w-3/4 rounded bg-[#E4EEF5]" />
            <div className="m-2 h-[6px] w-1/2 rounded bg-[#E4EEF5]" />
          </div>
        ))}
        <motion.div
          className="absolute"
          initial={{ x: clicks[0].x, y: clicks[0].y }}
          animate={reduce ? undefined : { x: clicks.map((c) => c.x), y: clicks.map((c) => c.y) }}
          transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <MousePointer2 size={34} color={theme.brandPrimary} fill={theme.agent} strokeWidth={1.6} />
        </motion.div>
      </div>
    </div>
  );
}

export default function SlideComputerAgents() {
  return (
    <TeachLayout strand="where" headline="Agents now have their own computers">
      {computerAgents.map((a, i) => (
        <motion.div
          key={a.name}
          className="absolute top-[300px] flex flex-col items-center gap-5 rounded-3xl bg-white px-6 pb-7 pt-12"
          style={{ left: LEFT + i * (CARD_W + GAP), width: CARD_W, boxShadow: "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.09)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.2 }}
        >
          <CloudScreen delay={i * 0.8} />
          <div className="text-center">
            <div className="text-[40px] font-bold" style={{ color: theme.brandPrimary }}>
              {a.name}
            </div>
            <div className="text-[24px]" style={{ color: theme.muted }}>
              {a.maker} · {a.when}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-x-0 top-[800px] flex justify-center gap-5">
        {computerAgentTraits.map((t, i) => (
          <motion.div
            key={t.label}
            className="flex items-center gap-3 rounded-full px-7 py-4 text-[28px] font-medium"
            style={{ background: t.human ? theme.human : "#fff", color: t.human ? "#fff" : theme.brandPrimary, boxShadow: t.human ? undefined : `0 0 0 3px ${theme.agent}` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.15 }}
          >
            {t.human && <UserRound size={28} />}
            {t.label}
          </motion.div>
        ))}
      </div>
    </TeachLayout>
  );
}
