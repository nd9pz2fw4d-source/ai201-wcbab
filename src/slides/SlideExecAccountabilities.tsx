import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Headline } from "../components/Text";
import { execAccountabilities } from "../data/strategy";
import { theme } from "../theme";

/** What only executives can do to drive adoption. */
export default function SlideExecAccountabilities() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <Headline>What only executives can do</Headline>
      </div>
      <div className="absolute left-[100px] right-[100px] top-[280px] grid grid-cols-3 gap-8">
        {execAccountabilities.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.text}
              className="flex min-h-[220px] items-center gap-6 rounded-3xl bg-white px-8 py-8"
              style={{ boxShadow: `0 0 0 3px ${theme.human}, 0 14px 32px rgba(12,53,83,0.08)` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <span className="grid h-[86px] w-[86px] shrink-0 place-items-center rounded-full" style={{ background: theme.human }}>
                <Icon size={44} color="#fff" />
              </span>
              <span className="text-[32px] font-medium leading-snug" style={{ color: theme.brandPrimary }}>
                {a.text}
              </span>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        className="absolute inset-x-0 top-[830px] flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="flex items-center gap-4 rounded-full px-9 py-4 text-[32px] font-medium" style={{ background: theme.brandPrimary, color: "#fff" }}>
          <Sparkles size={32} color={theme.brandAccent} /> And use it yourself, visibly
        </span>
      </motion.div>
    </div>
  );
}
