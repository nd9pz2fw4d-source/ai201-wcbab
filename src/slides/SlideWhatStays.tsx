import { motion } from "framer-motion";
import { HeartHandshake, MessageCircle, Scale, ShieldCheck } from "lucide-react";
import { ClaimFile } from "../components/ClaimFile";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const CX = 960;
const CY = 640;
const values = [
  { label: "Judgment", icon: Scale, x: 520, y: 470 },
  { label: "Empathy", icon: HeartHandshake, x: 1400, y: 470 },
  { label: "Accountability", icon: ShieldCheck, x: 520, y: 830 },
  { label: "The worker's voice", icon: MessageCircle, x: 1400, y: 830 },
];

export default function SlideWhatStays() {
  return (
    <TeachLayout strand="where" headline="What doesn't change">
      <svg className="absolute inset-0" width={1920} height={1080}>
        <motion.circle cx={CX} cy={CY} r={230} fill="none" stroke={theme.human} strokeWidth={6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2 }} />
        <g transform={`translate(${CX} ${CY}) scale(1.5)`}>
          <ClaimFile pages={3} />
        </g>
      </svg>
      {values.map((v, i) => {
        const Icon = v.icon;
        return (
          <motion.div
            key={v.label}
            className="absolute flex items-center gap-5 rounded-3xl bg-white px-7 py-5"
            style={{ left: v.x, top: v.y, x: "-50%", y: "-50%", boxShadow: `0 0 0 3px ${theme.human}, 0 12px 30px rgba(12,53,83,0.08)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.2 }}
          >
            <span className="grid h-[76px] w-[76px] place-items-center rounded-full" style={{ background: theme.human }}>
              <Icon size={40} color="#fff" />
            </span>
            <span className="whitespace-nowrap text-[38px] font-medium" style={{ color: theme.brandPrimary }}>
              {v.label}
            </span>
          </motion.div>
        );
      })}
    </TeachLayout>
  );
}
