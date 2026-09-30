import { motion } from "framer-motion";
import { CircleHelp, Quote, Search } from "lucide-react";
import { groundingSources } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const panel = "absolute top-[280px] h-[620px] w-[800px] rounded-3xl bg-white p-10 shadow-[0_1px_0_#C9DDEA,0_12px_32px_rgba(12,53,83,0.08)]";

/** Placeholder lines stand in for an answer, so the slide asserts no policy facts. */
function AnswerLines({ color, widths }: { color: string; widths: number[] }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      {widths.map((w, i) => (
        <div key={i} className="h-[14px] rounded" style={{ width: `${w}%`, background: color }} />
      ))}
    </div>
  );
}

function Question() {
  return (
    <div className="self-end rounded-2xl rounded-br-sm px-6 py-4 text-[28px] text-white" style={{ background: theme.human }}>
      What does our policy say?
    </div>
  );
}

export default function SlideGrounding() {
  return (
    <TeachLayout strand="how" headline="Give it the right sources">
      {/* Without sources */}
      <motion.div className={`${panel} left-[100px] flex flex-col gap-8`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="text-[30px] font-medium" style={{ color: theme.muted }}>
          Without sources
        </div>
        <Question />
        <motion.div className="flex items-start gap-5 rounded-2xl p-6" style={{ background: "#EEF3F7" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <AnswerLines color="#C9D6E0" widths={[92, 80, 86, 60]} />
          <CircleHelp size={56} color={theme.human} className="shrink-0" />
        </motion.div>
        <div className="mt-auto text-[40px] font-medium" style={{ color: theme.human }}>
          Guesses
        </div>
      </motion.div>

      {/* With sources */}
      <motion.div className={`${panel} left-[1020px] flex flex-col gap-6`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="text-[30px] font-medium" style={{ color: theme.agent }}>
          With sources
        </div>
        <Question />
        <div className="flex items-center gap-2">
          <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full" style={{ background: theme.agent }}>
            <Search size={26} color="#fff" />
          </span>
          {groundingSources.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border-2 px-3 py-3 text-[20px] font-medium"
                style={{ borderColor: theme.agent, color: theme.ink }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + i * 0.2 }}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full text-[16px] font-bold text-white" style={{ background: theme.brandPrimary }}>
                  {i + 1}
                </span>
                <Icon size={22} color={theme.agent} />
                {s.label}
              </motion.div>
            );
          })}
        </div>
        <motion.div className="flex items-start gap-5 rounded-2xl p-6" style={{ background: "#E6F6F4" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          <AnswerLines color="#A7DDD7" widths={[90, 84, 70]} />
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Quote size={36} color={theme.agent} />
            <div className="flex gap-2">
              {[1, 2].map((n) => (
                <span key={n} className="grid h-9 w-9 place-items-center rounded-full text-[18px] font-bold text-white" style={{ background: theme.brandPrimary }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="mt-auto text-[40px] font-medium" style={{ color: theme.agent }}>
          Cites
        </div>
      </motion.div>
    </TeachLayout>
  );
}
