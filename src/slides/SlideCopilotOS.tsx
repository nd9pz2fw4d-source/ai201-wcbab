import { motion } from "framer-motion";
import { MessageSquare, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { copilotGoal, copilotQuote, todayApps } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

// "Today": a person at the centre of many apps.
const T = { x: 470, y: 600 };
const appAt = (i: number) => {
  const a = (i / todayApps.length) * Math.PI * 2 - Math.PI / 2;
  return { x: T.x + 300 * Math.cos(a), y: T.y + 230 * Math.sin(a) };
};

// "Next": a person states a goal; Copilot and its agents work the apps.
const N = { x: 1440, y: 600 };

export default function SlideCopilotOS() {
  return (
    <TeachLayout strand="where" headline="Copilot becomes the operating system of work">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {todayApps.map((_, i) => {
          const p = appAt(i);
          return <line key={i} x1={T.x} y1={T.y} x2={p.x} y2={p.y} stroke={theme.human} strokeWidth={2.5} strokeDasharray="6 6" opacity={0.5} />;
        })}
        <line x1={960} y1={330} x2={960} y2={900} stroke="#DDE7EE" strokeWidth={3} />
        {/* Next: goal → Copilot → agents → apps */}
        <motion.path d={`M${N.x} ${N.y - 150} L${N.x} ${N.y - 70}`} stroke={theme.agent} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2 }} />
        {[-260, -130, 0, 130, 260].map((dx, i) => (
          <motion.path
            key={dx}
            d={`M${N.x} ${N.y + 70} L${N.x + dx} ${N.y + 190}`}
            stroke={theme.agent}
            strokeWidth={3}
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5 + i * 0.08 }}
          />
        ))}
      </svg>

      {/* Today */}
      <div className="absolute left-[100px] top-[300px] text-[30px] font-medium uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
        Today
      </div>
      <span className="absolute grid h-[110px] w-[110px] place-items-center rounded-full" style={{ left: T.x - 55, top: T.y - 55, background: theme.human }}>
        <UserRound size={58} color="#fff" />
      </span>
      {todayApps.map((name, i) => {
        const p = appAt(i);
        return (
          <motion.div
            key={name}
            className="absolute whitespace-nowrap rounded-xl bg-white px-4 py-2 text-[22px] font-medium"
            style={{ left: p.x, top: p.y, x: "-50%", y: "-50%", color: theme.ink, boxShadow: "0 1px 0 #C9DDEA, 0 6px 16px rgba(12,53,83,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            {name}
          </motion.div>
        );
      })}

      {/* Next */}
      <div className="absolute left-[1010px] top-[300px] text-[30px] font-medium uppercase tracking-[0.18em]" style={{ color: theme.agent }}>
        Next
      </div>
      <motion.div
        className="absolute flex items-center gap-4 whitespace-nowrap rounded-full bg-white py-4 pl-4 pr-7 text-[27px]"
        style={{ left: N.x, top: N.y - 205, x: "-50%", color: theme.ink, boxShadow: `0 0 0 3px ${theme.human}` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: theme.human }}>
          <UserRound size={28} color="#fff" />
        </span>
        <MessageSquare size={26} color={theme.human} />
        {copilotGoal}
      </motion.div>
      <motion.div
        className="absolute flex items-center gap-4 rounded-full px-10 py-5 text-[34px] font-bold text-white"
        style={{ left: N.x, top: N.y - 70, x: "-50%", background: theme.agent, boxShadow: "0 0 0 12px rgba(31,181,168,0.18)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
      >
        <Sparkles size={38} /> Copilot
      </motion.div>
      <div className="absolute flex gap-[74px]" style={{ left: N.x - 260 - 28, top: N.y + 180 }}>
        {todayApps.slice(0, 5).map((app, i) => (
          <motion.span
            key={app}
            className="relative grid h-[56px] w-[56px] place-items-center rounded-full border-[5px] bg-white"
            style={{ borderColor: theme.agent }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 + i * 0.08 }}
          >
            <span className="absolute top-[60px] whitespace-nowrap text-[19px] font-medium" style={{ color: theme.muted }}>
              {app}
            </span>
          </motion.span>
        ))}
      </div>
      <motion.div
        className="absolute flex items-center gap-3 whitespace-nowrap text-[24px] font-medium"
        style={{ left: N.x, top: N.y + 290, x: "-50%", color: theme.brandPrimary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        <ShieldCheck size={28} color={theme.human} /> Agents work the apps, within set permissions
      </motion.div>

      {/* The quote */}
      <motion.div
        className="absolute inset-x-0 top-[945px] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <span className="text-[30px] font-medium italic" style={{ color: theme.brandPrimary }}>
          “{copilotQuote.text}”
        </span>
        <span className="ml-4 text-[22px]" style={{ color: theme.muted }}>
          {copilotQuote.who}
        </span>
      </motion.div>
    </TeachLayout>
  );
}
