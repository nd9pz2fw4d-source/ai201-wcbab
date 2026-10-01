import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Headline } from "../components/Text";
import { objectives } from "../data/strategy";
import { theme } from "../theme";

/** The three learning objectives, one per act. */
export default function SlideObjectives() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[120px] top-[90px]">
        <Headline>Three things to leave with</Headline>
      </div>
      <div className="absolute left-[120px] right-[120px] top-[330px] flex gap-10">
        {objectives.map((o, i) => {
          const Icon = o.icon;
          return (
            <motion.div
              key={o.act}
              className="flex flex-1 flex-col gap-7 rounded-3xl bg-white p-10"
              style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.08)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
            >
              <div className="flex items-center gap-5">
                <span className="grid h-[90px] w-[90px] place-items-center rounded-full" style={{ background: theme.brandAccent }}>
                  <Icon size={46} color={theme.brandPrimary} strokeWidth={2} />
                </span>
                <span className="flex flex-col">
                  <span className="text-[22px] font-medium uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
                    Act {i + 1}
                  </span>
                  <span className="text-[38px] font-bold" style={{ color: theme.brandPrimary }}>
                    {o.act}
                  </span>
                </span>
              </div>
              <div className="text-[38px] font-medium leading-snug" style={{ color: theme.ink }}>
                {o.text}
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        className="absolute inset-x-0 top-[790px] flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="flex items-center gap-4 rounded-full px-9 py-4 text-[34px] font-medium text-white" style={{ background: theme.brandPrimary }}>
          <Sparkles size={34} color={theme.brandAccent} /> One thread through all three: AI is more than Copilot
        </span>
      </motion.div>
    </div>
  );
}
