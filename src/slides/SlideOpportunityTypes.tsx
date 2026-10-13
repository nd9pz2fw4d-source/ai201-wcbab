import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { Headline } from "../components/Text";
import { opportunityTypes } from "../data/strategy";
import { theme } from "../theme";

const STEP_W = 400;
const GAP = 24;
const LEFT = (1920 - (STEP_W * 4 + GAP * 3)) / 2;
const BASE = 900;
const heights = [330, 400, 470, 540];
const fills = ["#D7EEF8", theme.brandSky, theme.brandSecondary, theme.brandPrimary];

/** A ladder: personal productivity at the bottom, new services at the top. */
export default function SlideOpportunityTypes() {
  const execLeft = LEFT + 2 * (STEP_W + GAP);
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <Headline>Four kinds of AI opportunity</Headline>
      </div>

      {/* Executive-led bracket over the top two rungs */}
      <motion.div
        className="absolute flex items-center justify-center gap-3 rounded-t-2xl border-x-4 border-t-4 pb-3 pt-2 text-[26px] font-bold"
        style={{ left: execLeft, width: STEP_W * 2 + GAP, top: BASE - heights[3] - 80, height: 70, borderColor: theme.human, color: theme.human }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <UserRound size={28} /> Executive-led
      </motion.div>

      {opportunityTypes.map((t, i) => {
        const dark = i >= 2;
        return (
          <motion.div
            key={t.name}
            className="absolute flex flex-col gap-3 rounded-t-3xl p-7"
            style={{ left: LEFT + i * (STEP_W + GAP), width: STEP_W, top: BASE - heights[i], height: heights[i], background: fills[i], color: dark ? "#fff" : theme.brandPrimary, originY: 1 }}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.3 + i * 0.25, duration: 0.5 }}
          >
            <span className="grid h-[54px] w-[54px] place-items-center rounded-full text-[28px] font-bold" style={{ background: dark ? "rgba(255,255,255,0.2)" : "#fff" }}>
              {i + 1}
            </span>
            <span className="text-[36px] font-bold leading-tight">{t.name}</span>
            <span className="text-[25px] leading-snug" style={{ opacity: 0.9 }}>
              {t.example}
            </span>
            <span
              className="mt-auto self-start rounded-full px-4 py-1.5 text-[22px] font-medium"
              style={{ background: t.executive ? theme.human : dark ? "rgba(255,255,255,0.2)" : "#fff", color: t.executive ? "#fff" : "inherit" }}
            >
              Owner: {t.owner}
            </span>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute flex items-center gap-4 text-[26px] font-medium"
        style={{ left: LEFT, top: BASE + 24, color: theme.muted }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        More value, more change to how we work
        <svg width={820} height={20}>
          <line x1={0} y1={10} x2={800} y2={10} stroke={theme.muted} strokeWidth={3} />
          <path d="M800 2 L816 10 L800 18 Z" fill={theme.muted} />
        </svg>
      </motion.div>
    </div>
  );
}
