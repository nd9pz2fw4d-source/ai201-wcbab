import { motion } from "framer-motion";
import { Eye, Route, ShieldCheck } from "lucide-react";
import { theme } from "../theme";
import { ClaimJourney } from "./ClaimJourney";

const acts = {
  "See it": { n: 1, icon: Eye },
  "Choose it": { n: 2, icon: Route },
  "Govern it": { n: 3, icon: ShieldCheck },
} as const;

/** Large, simple act title card. */
export function ActHeader({ act, question }: { act: keyof typeof acts; question: string }) {
  const { n, icon: Icon } = acts[act];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pb-[80px] text-center">
      <div className="absolute inset-x-0 bottom-[-60px] flex justify-center opacity-20">
        <ClaimJourney tone="dark" width={1500} labels={false} showClaim={false} marks={false} />
      </div>
      <motion.div
        className="mb-10 grid h-[132px] w-[132px] place-items-center rounded-full"
        style={{ background: theme.brandAccent }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.1 }}
      >
        <Icon size={66} color={theme.brandPrimary} strokeWidth={2} />
      </motion.div>
      <motion.div
        className="mb-4 text-[32px] font-medium uppercase tracking-[0.2em]"
        style={{ color: theme.brandSky }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Act {n}
      </motion.div>
      <motion.h1
        className="text-[150px] font-bold leading-none text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        {act}
      </motion.h1>
      <motion.p
        className="mt-10 max-w-[1300px] text-[56px] font-light text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {question}
      </motion.p>
    </div>
  );
}
