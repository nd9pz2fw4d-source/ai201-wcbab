import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Building2, CircleHelp, Landmark, Smartphone, UserRound } from "lucide-react";
import { useEffect } from "react";
import { config } from "../config";
import { agentMeeting } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const WORKER = { x: 380, y: 520 };
const EMPLOYER = { x: 380, y: 830 };
const WCB = { x: 1180, y: 660 };
const PERSON = { x: 1640, y: 660 };

type P = { x: number; y: number };

/** Messages travelling from an outside agent to WCB's agent and back. */
function Message({ from, delay }: { from: P; delay: number }) {
  const reduce = useReducedMotion();
  const t = useMotionValue(reduce ? 0.5 : 0);
  const x = useTransform(t, [0, 1], [from.x + 110, WCB.x - 110]);
  const y = useTransform(t, [0, 1], [from.y, WCB.y]);
  useEffect(() => {
    if (reduce) return;
    const c = animate(t, [0, 1, 0], { duration: 3, delay, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" });
    return () => c.stop();
  }, [t, delay, reduce]);
  return <motion.circle r={12} fill={theme.brandAccent} stroke="#fff" strokeWidth={3} cx={x} cy={y} />;
}

function Party({ p, icon: Icon, label, sub, color }: { p: P; icon: typeof UserRound; label: string; sub?: string; color: string }) {
  return (
    <div className="absolute flex flex-col items-center gap-2" style={{ left: p.x - 150, top: p.y - 90, width: 300 }}>
      <span className="grid h-[130px] w-[130px] place-items-center rounded-full bg-white" style={{ boxShadow: `0 0 0 6px ${color}` }}>
        <Icon size={62} color={color} />
      </span>
      <span className="text-[28px] font-bold" style={{ color: theme.brandPrimary }}>
        {label}
      </span>
      {sub && (
        <span className="text-[21px]" style={{ color: theme.muted }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export default function SlideAgentMeetsAgent() {
  return (
    <TeachLayout strand="where" headline="Their agent will call our agent">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {[WORKER, EMPLOYER].map((p, i) => (
          <line key={i} x1={p.x + 110} y1={p.y} x2={WCB.x - 110} y2={WCB.y} stroke={theme.agent} strokeWidth={3} strokeDasharray="8 8" opacity={0.6} />
        ))}
        <line x1={WCB.x + 110} y1={WCB.y} x2={PERSON.x - 80} y2={PERSON.y} stroke={theme.human} strokeWidth={4} strokeDasharray="10 8" />
        <Message from={WORKER} delay={0.6} />
        <Message from={EMPLOYER} delay={1.8} />
      </svg>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Party p={WORKER} icon={Smartphone} label={agentMeeting.worker} sub={`for ${config.workerName}`} color={theme.agent} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Party p={EMPLOYER} icon={Building2} label={agentMeeting.employer} color={theme.agent} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Party p={WCB} icon={Landmark} label={agentMeeting.wcb} color={theme.brandSecondary} />
      </motion.div>

      {/* The checks WCB's agent must make */}
      <div className="absolute flex flex-col gap-3" style={{ left: WCB.x - 200, top: 320, width: 400 }}>
        {agentMeeting.checks.map((c, i) => (
          <motion.div
            key={c}
            className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-[25px] font-medium"
            style={{ color: theme.brandPrimary, boxShadow: `inset 5px 0 0 ${theme.brandAccent}, 0 1px 0 #C9DDEA` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.25 }}
          >
            <CircleHelp size={28} color={theme.brandAccent} className="shrink-0" /> {c}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute flex flex-col items-center gap-2"
        style={{ left: PERSON.x - 110, top: PERSON.y - 70, width: 220 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="grid h-[120px] w-[120px] place-items-center rounded-full" style={{ background: theme.human }}>
          <UserRound size={62} color="#fff" />
        </span>
        <span className="text-[28px] font-bold" style={{ color: theme.human }}>
          A person decides
        </span>
      </motion.div>
    </TeachLayout>
  );
}
