import { motion } from "framer-motion";
import { Bot, ShieldCheck } from "lucide-react";
import { ClaimFile } from "../components/ClaimFile";
import { Headline } from "../components/Text";
import { governanceQuestions } from "../data/strategy";
import { theme } from "../theme";

// Hub (the claim with an agent on it) in the middle, three questions either side.
const CX = 960;
const CY = 565;
const CARD_W = 560;
const CARD_H = 170;
const ROWS = [270, 480, 690];
const LEFT = 90;
const RIGHT = 1920 - 90 - CARD_W;

const cardPos = (i: number) => ({ x: i < 3 ? LEFT : RIGHT, y: ROWS[i % 3] });

/** Act 3 opener: what we govern, before the activity. Six questions every agent on a claim must answer. */
export default function SlideGovernQuestions() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <Headline>Six questions before an agent touches a claim</Headline>
      </div>

      <svg className="absolute inset-0" width={1920} height={1080}>
        {governanceQuestions.map((_, i) => {
          const { x, y } = cardPos(i);
          const ex = i < 3 ? x + CARD_W : x;
          const ey = y + CARD_H / 2;
          return (
            <motion.path
              key={i}
              d={`M${CX} ${CY} C${(CX + ex) / 2} ${CY}, ${(CX + ex) / 2} ${ey}, ${ex} ${ey}`}
              fill="none"
              stroke={theme.line}
              strokeWidth={3}
              strokeDasharray="8 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6 + i * 0.25, duration: 0.5 }}
            />
          );
        })}
        {/* The claim, with an agent working on it, ringed by the guardrails */}
        <motion.circle cx={CX} cy={CY} r={150} fill="#fff" stroke={theme.brandAccent} strokeWidth={6} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 16 }} style={{ transformOrigin: `${CX}px ${CY}px` }} />
        <g transform={`translate(${CX} ${CY + 14}) scale(0.9)`}>
          <ClaimFile pages={4} />
        </g>
        <g transform={`translate(${CX + 106} ${CY - 106})`}>
          <circle r={34} fill={theme.agent} stroke="#fff" strokeWidth={4} />
          <Bot x={-19} y={-19} width={38} height={38} color="#fff" />
        </g>
        <g transform={`translate(${CX - 106} ${CY - 106})`}>
          <circle r={30} fill={theme.brandAccent} stroke="#fff" strokeWidth={4} />
          <ShieldCheck x={-17} y={-17} width={34} height={34} color={theme.brandPrimary} />
        </g>
      </svg>

      {governanceQuestions.map((q, i) => {
        const Icon = q.icon;
        const { x, y } = cardPos(i);
        const human = q.word === "Decided by a person";
        return (
          <motion.div
            key={q.word}
            className="absolute flex items-center gap-6 rounded-3xl bg-white px-7"
            style={{ left: x, top: y, width: CARD_W, height: CARD_H, boxShadow: "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)" }}
            initial={{ opacity: 0, x: i < 3 ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.25 }}
          >
            <span className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full" style={{ background: human ? theme.human : theme.brandAccent }}>
              <Icon size={46} color={human ? "#fff" : theme.brandPrimary} strokeWidth={2} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[38px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
                {q.word}
              </span>
              <span className="text-[27px] leading-snug" style={{ color: theme.ink }}>
                {q.question}
              </span>
            </span>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute left-1/2 top-[900px] flex items-center gap-3 whitespace-nowrap rounded-full px-8 py-3 text-[28px] font-medium text-white"
        style={{ x: "-50%", background: theme.brandPrimary }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
      >
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: theme.brandAccent }} /> Govern an agent like a new hire: an owner, limited access, supervision, a record
      </motion.div>
    </div>
  );
}

