import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, RotateCcw } from "lucide-react";
import { Interactive, SlideButton } from "../components/Interactive";
import { Headline } from "../components/Text";
import { quiz } from "../data/designAgent";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

/** Quick quiz: four questions. The room calls an answer, the presenter clicks it. */
export default function SlideQuiz() {
  const [picks, setPicks] = useSlideState<Record<number, number>>("quiz:picks", {});
  const all = () => setPicks(Object.fromEntries(quiz.map((q, i) => [i, q.answer])));

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[70px]">
        <Headline size={68}>Quick quiz</Headline>
      </div>
      <Interactive className="absolute right-[100px] top-[84px] flex gap-3">
        <SlideButton tone="gold" className="!px-6 !py-3 !text-[22px]" onClick={all}>
          <Eye size={24} /> Show all answers
        </SlideButton>
        <SlideButton tone="ghost" className="!px-6 !py-3 !text-[22px]" onClick={() => setPicks({})}>
          <RotateCcw size={22} /> Reset
        </SlideButton>
      </Interactive>

      <Interactive className="absolute left-[100px] right-[100px] top-[200px] grid grid-cols-2 gap-8">
        {quiz.map((q, i) => {
          const pick = picks[i];
          const done = pick === q.answer;
          return (
            <motion.div
              key={q.q}
              className="flex h-[360px] flex-col rounded-3xl bg-white px-8 py-6"
              style={{ boxShadow: "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[24px] font-bold" style={{ background: theme.brandAccent, color: theme.brandPrimary }}>
                  {i + 1}
                </span>
                <span className="text-[30px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
                  {q.q}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                {q.options.map((o, k) => {
                  const right = done && k === q.answer;
                  const wrong = pick === k && k !== q.answer;
                  return (
                    <motion.button
                      key={o}
                      type="button"
                      aria-label={`Question ${i + 1}: ${o}`}
                      onClick={() => setPicks((p) => ({ ...p, [i]: k }))}
                      animate={wrong ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center gap-3 rounded-2xl px-4 py-2 text-left text-[23px] leading-snug"
                      style={{
                        background: right ? theme.human : "#F2F7FA",
                        color: right ? "#fff" : wrong ? "#A3B3C2" : theme.ink,
                        textDecoration: wrong ? "line-through" : undefined,
                      }}
                    >
                      <span className="w-7 shrink-0 font-bold">{right ? <Check size={24} strokeWidth={3} /> : String.fromCharCode(65 + k)}</span>
                      {o}
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {done && (
                  <motion.div className="mt-auto text-[22px] font-medium" style={{ color: theme.human }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {q.why}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </Interactive>
    </div>
  );
}
