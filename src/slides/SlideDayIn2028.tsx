import { motion } from "framer-motion";
import { Sparkles, UserRound } from "lucide-react";
import { dayIn2028 } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const X0 = 270;
const X1 = 1650;
const LINE_Y = 620;
const at = (i: number) => X0 + (i / (dayIn2028.length - 1)) * (X1 - X0);

/** An adjudicator's day in 2028: agents above the line, the person below. */
export default function SlideDayIn2028() {
  return (
    <TeachLayout strand="where" headline="A day in 2028">
      <div className="absolute left-[100px] top-[280px] flex items-center gap-3 text-[26px] font-medium" style={{ color: theme.agent }}>
        <Sparkles size={30} /> Agents
      </div>
      <div className="absolute left-[100px] top-[860px] flex items-center gap-3 text-[26px] font-medium" style={{ color: theme.human }}>
        <UserRound size={30} /> Adjudicator
      </div>

      <svg className="absolute inset-0" width={1920} height={1080}>
        <motion.line x1={X0 - 40} x2={X1 + 40} y1={LINE_Y} y2={LINE_Y} stroke={theme.brandPrimary} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        {dayIn2028.map((d, i) => {
          const up = d.who === "agent";
          return (
            <motion.line
              key={i}
              x1={at(i)}
              x2={at(i)}
              y1={LINE_Y}
              y2={up ? LINE_Y - 70 : LINE_Y + 70}
              stroke={up ? theme.agent : theme.human}
              strokeWidth={3}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.25 }}
            />
          );
        })}
      </svg>

      {dayIn2028.map((d, i) => {
        const up = d.who === "agent";
        const color = up ? theme.agent : theme.human;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: at(i), top: LINE_Y, x: "-50%", y: "-50%" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.25 }}
          >
            <div className="grid h-[92px] w-[92px] place-items-center rounded-full text-[24px] font-bold text-white" style={{ background: color }}>
              {d.time}
            </div>
            <div
              className="absolute left-1/2 w-[290px] -translate-x-1/2 rounded-2xl bg-white px-5 py-4 text-center text-[25px] font-medium leading-snug"
              style={{
                [up ? "bottom" : "top"]: 150,
                color: theme.ink,
                boxShadow: `0 0 0 3px ${color}, 0 12px 28px rgba(12,53,83,0.08)`,
              }}
            >
              {d.text}
            </div>
          </motion.div>
        );
      })}
    </TeachLayout>
  );
}
