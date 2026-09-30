import { motion } from "framer-motion";
import { Eye, KeyRound, PenLine, UserRound, Zap } from "lucide-react";
import { permissionLabels, tools, type Permission } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const columns: { id: Permission; icon: typeof Eye; color: string }[] = [
  { id: "read", icon: Eye, color: theme.agent },
  { id: "draft", icon: PenLine, color: theme.brandSecondary },
  { id: "act", icon: Zap, color: theme.human },
];
const COL_W = 480;
const GAP = 60;
const LEFT = (1920 - (COL_W * 3 + GAP * 2)) / 2;
const colX = (i: number) => LEFT + i * (COL_W + GAP) + COL_W / 2;
const AGENT = { x: 960, y: 330 };

export default function SlideTools() {
  return (
    <TeachLayout strand="how" headline="Tools are its hands">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {columns.map((c, i) => (
          <motion.path
            key={c.id}
            d={`M${AGENT.x} ${AGENT.y + 60} C${AGENT.x} ${AGENT.y + 110} ${colX(i)} ${AGENT.y + 70} ${colX(i)} 470`}
            fill="none"
            stroke={c.color}
            strokeWidth={4}
            strokeDasharray="8 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute grid h-[120px] w-[120px] place-items-center rounded-full"
        style={{ left: AGENT.x - 60, top: AGENT.y - 60, background: theme.agent }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <KeyRound size={56} color="#fff" />
      </motion.div>

      {columns.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.id}
            className="absolute top-[470px] flex flex-col gap-4 rounded-3xl bg-white p-6"
            style={{ left: colX(i) - COL_W / 2, width: COL_W, boxShadow: `0 0 0 3px ${c.color}, 0 12px 30px rgba(12,53,83,0.08)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: c.color }}>
                <Icon size={30} color="#fff" />
              </span>
              <span className="text-[38px] font-bold" style={{ color: theme.brandPrimary }}>
                {permissionLabels[c.id]}
              </span>
              {c.id === "act" && (
                <span className="ml-auto flex items-center gap-2 rounded-full px-3 py-1 text-[20px] font-medium text-white" style={{ background: theme.human }}>
                  <UserRound size={20} /> approves
                </span>
              )}
            </div>
            {tools
              .filter((t) => t.permission === c.id)
              .map((t) => {
                const TIcon = t.icon;
                return (
                  <div key={t.label} className="flex items-center gap-4 rounded-xl px-4 py-3 text-[28px]" style={{ background: "#F2F7FA", color: theme.ink }}>
                    <TIcon size={30} color={c.color} /> {t.label}
                  </div>
                );
              })}
          </motion.div>
        );
      })}

      <motion.div
        className="absolute left-0 right-0 top-[880px] text-center text-[34px] font-medium"
        style={{ color: theme.brandPrimary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        Give it only the access it needs
      </motion.div>
    </TeachLayout>
  );
}
