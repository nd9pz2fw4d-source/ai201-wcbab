import { motion } from "framer-motion";
import { Headline } from "../components/Text";
import { evaluationQuestions } from "../data/strategy";
import { theme } from "../theme";

/** The evaluation lens for any AI opportunity. */
export default function SlideFourQuestions() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <Headline>Four questions for any opportunity</Headline>
      </div>
      <div className="absolute left-[100px] right-[100px] top-[290px] grid grid-cols-2 gap-10">
        {evaluationQuestions.map((q, i) => {
          const Icon = q.icon;
          return (
            <motion.div
              key={q.word}
              className="flex min-h-[290px] items-center gap-8 rounded-3xl bg-white px-10 py-9"
              style={{ boxShadow: "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
            >
              <span className="grid h-[110px] w-[110px] shrink-0 place-items-center rounded-full" style={{ background: theme.brandAccent }}>
                <Icon size={56} color={theme.brandPrimary} strokeWidth={2} />
              </span>
              <span className="flex flex-col gap-2">
                <span className="text-[46px] font-bold" style={{ color: theme.brandPrimary }}>
                  {q.word}
                </span>
                <span className="text-[29px] leading-snug" style={{ color: theme.ink }}>
                  {q.question}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
