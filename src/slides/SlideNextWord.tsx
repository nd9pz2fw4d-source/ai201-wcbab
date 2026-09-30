import { motion } from "framer-motion";
import { BookOpen, SearchX } from "lucide-react";
import { nextWord } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const BAR_MAX = 440;

export default function SlideNextWord() {
  const top = nextWord.candidates[0];
  const max = Math.max(...nextWord.candidates.map((c) => c.p));
  return (
    <TeachLayout strand="how" headline="It predicts the next word">
      {/* The sentence so far, with a gap */}
      <div className="absolute left-[100px] top-[420px] flex items-baseline gap-5 text-[76px] font-medium" style={{ color: theme.ink }}>
        {nextWord.prompt.map((w, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
            {w}
          </motion.span>
        ))}
        <span className="relative inline-block min-w-[230px] border-b-[6px] text-center" style={{ borderColor: theme.brandAccent }}>
          <motion.span
            className="inline-block"
            style={{ color: theme.agent }}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          >
            {top.word}
          </motion.span>
        </span>
      </div>

      {/* Every possible next word gets a score */}
      <div className="absolute left-[1150px] top-[290px] flex flex-col gap-5">
        <span className="ml-[190px] text-[22px]" style={{ color: theme.muted }}>
          Score for each possible next word
        </span>
        {nextWord.candidates.map((c, i) => (
          <div key={c.word} className="flex items-center gap-5">
            <span className="w-[170px] text-right text-[34px] font-medium" style={{ color: i === 0 ? theme.brandPrimary : theme.muted }}>
              {c.word}
            </span>
            <div className="h-[44px]" style={{ width: BAR_MAX }}>
              <motion.div
                className="h-full rounded-r-md"
                style={{ background: i === 0 ? theme.agent : "#A7DDD7" }}
                initial={{ width: 0 }}
                animate={{ width: (c.p / max) * BAR_MAX }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Two things to remember */}
      <div className="absolute left-[100px] top-[720px] flex gap-6">
        {[
          { icon: BookOpen, text: "Learned patterns from vast amounts of text", color: theme.agent },
          { icon: SearchX, text: "Predicts. Does not fact-check.", color: theme.human },
        ].map(({ icon: Icon, text, color }, i) => (
          <motion.div
            key={text}
            className="flex items-center gap-4 rounded-2xl bg-white px-7 py-5 text-[30px] font-medium"
            style={{ color: theme.ink, boxShadow: "0 1px 0 #C9DDEA" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 + i * 0.2 }}
          >
            <Icon size={36} color={color} /> {text}
          </motion.div>
        ))}
      </div>
    </TeachLayout>
  );
}
