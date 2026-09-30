import { motion, useReducedMotion } from "framer-motion";
import { Brain, Database, ScrollText, Target, UserRound, Wrench } from "lucide-react";
import { theme } from "../theme";

const orbit = [Target, ScrollText, Wrench, Database, UserRound];

/** Section card that opens the teaching block inside Act 1. */
export default function SlideHowItWorks() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[140px] top-[330px] max-w-[900px]">
        <motion.div
          className="mb-5 text-[30px] font-medium uppercase tracking-[0.2em]"
          style={{ color: theme.brandSky }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Act 1 · See it
        </motion.div>
        <motion.h1
          className="text-[140px] font-bold leading-none text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          How it works
        </motion.h1>
        <motion.p
          className="mt-10 text-[52px] font-light text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Inside the AI on our claim
        </motion.p>
      </div>

      {/* A lens on one agent: the model at the centre, its parts in orbit. */}
      <svg className="absolute left-[1100px] top-[200px]" width={680} height={680} viewBox="-340 -340 680 680">
        <motion.circle r={300} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} />
        <motion.circle r={210} fill="none" stroke={theme.agent} strokeWidth={3} strokeDasharray="6 10" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }} />
        <motion.g
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <circle r={210} fill="none" />
          {orbit.map((Icon, i) => {
            const a = (i / orbit.length) * Math.PI * 2 - Math.PI / 2;
            const x = 210 * Math.cos(a);
            const y = 210 * Math.sin(a);
            const person = Icon === UserRound;
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, rotate: -360 }}
                transition={{ opacity: { delay: 0.6 + i * 0.15 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
              >
                <circle cx={x} cy={y} r={44} fill={person ? theme.human : theme.brandPrimary} stroke={person ? theme.human : theme.agent} strokeWidth={4} />
                <Icon x={x - 22} y={y - 22} width={44} height={44} color="#fff" strokeWidth={2} />
              </motion.g>
            );
          })}
        </motion.g>
        <motion.g initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.3 }}>
          <circle r={105} fill={theme.agent} />
          <Brain x={-52} y={-52} width={104} height={104} color="#fff" strokeWidth={1.6} />
        </motion.g>
      </svg>
    </div>
  );
}
