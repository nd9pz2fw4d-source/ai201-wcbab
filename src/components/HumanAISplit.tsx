import { motion } from "framer-motion";
import { Sparkles, UserRound } from "lucide-react";
import { theme } from "../theme";

/**
 * How the work is shared. Widths are illustrative, not measured.
 * The coral side always keeps its "decides" label: people stay accountable.
 */
export function HumanAISplit({ human, ai, width = 820 }: { human: number; ai: number; width?: number }) {
  const total = human + ai || 1;
  const h = (human / total) * 100;
  return (
    <div style={{ width }}>
      <div className="flex h-[64px] overflow-hidden rounded-full bg-white shadow-[0_1px_0_#C9DDEA]">
        <motion.div
          className="flex h-full min-w-[250px] items-center gap-3 pl-6 text-white"
          style={{ background: theme.human }}
          initial={{ width: "100%" }}
          animate={{ width: `${h}%` }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
        >
          <UserRound size={30} strokeWidth={2.2} />
          <span className="whitespace-nowrap text-[26px] font-medium">People</span>
          <span className="whitespace-nowrap rounded-full bg-white/25 px-3 py-0.5 text-[20px] font-medium">decides</span>
        </motion.div>
        {ai > 0 && (
          <motion.div
            className="flex h-full flex-1 items-center justify-end gap-3 pr-6 text-white"
            style={{ background: theme.agent }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <span className="whitespace-nowrap text-[26px] font-medium">AI</span>
            <Sparkles size={28} strokeWidth={2} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
