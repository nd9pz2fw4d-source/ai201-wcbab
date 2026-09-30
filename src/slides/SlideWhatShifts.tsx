import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { shifts } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

export default function SlideWhatShifts() {
  return (
    <TeachLayout strand="where" headline="What shifts for us">
      <div className="absolute left-[160px] top-[300px] flex w-[1600px] flex-col gap-7">
        <div className="flex text-[24px] font-medium uppercase tracking-[0.18em]">
          <span className="w-[640px]" style={{ color: theme.muted }}>
            From
          </span>
          <span className="ml-[140px]" style={{ color: theme.agent }}>
            To
          </span>
        </div>
        {shifts.map((s, i) => (
          <div key={s.from} className="flex items-center">
            <motion.div
              className="w-[640px] rounded-2xl bg-white px-8 py-5 text-[38px]"
              style={{ color: theme.muted, boxShadow: "0 1px 0 #C9DDEA" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.25 }}
            >
              {s.from}
            </motion.div>
            <motion.div
              className="grid w-[140px] place-items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.25 }}
            >
              <ArrowRight size={52} color={theme.brandAccent} strokeWidth={2.6} />
            </motion.div>
            <motion.div
              className="flex-1 rounded-2xl px-8 py-5 text-[38px] font-medium text-white"
              style={{ background: theme.agent }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.25 }}
            >
              {s.to}
            </motion.div>
          </div>
        ))}
      </div>
    </TeachLayout>
  );
}
