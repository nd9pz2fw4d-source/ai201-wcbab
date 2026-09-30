import { motion } from "framer-motion";
import { timeHorizon } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

// Plot area, in stage pixels.
const X0 = 250;
const X1 = 1380;
const Y0 = 880; // bottom
const Y1 = 330; // top
const T0 = 2023;
const T1 = 2026.25;
const LOG_MIN = Math.log10(1);
const LOG_MAX = Math.log10(600);

const toYear = (d: string) => {
  const [y, m] = d.split("-").map(Number);
  return y + (m - 1) / 12;
};
const px = (d: string) => X0 + ((toYear(d) - T0) / (T1 - T0)) * (X1 - X0);
const py = (min: number) => Y0 - ((Math.log10(min) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (Y0 - Y1);

const yTicks = [
  { v: 1, label: "1 min" },
  { v: 10, label: "10 min" },
  { v: 60, label: "1 hour" },
  { v: 480, label: "8 hours" },
];
const xTicks = [2023, 2024, 2025, 2026];

// Direct labels on a few points only; every point has a hover title.
const labelled: Record<string, { text: string; dx: number; dy: number; anchor: "start" | "end" }> = {
  "GPT-4": { text: "about 3½ minutes", dx: 22, dy: -18, anchor: "start" },
  "Claude 3.7 Sonnet": { text: "about 1 hour", dx: -22, dy: -18, anchor: "end" },
  "Claude Opus 4.5": { text: "about 5 hours", dx: -22, dy: -22, anchor: "end" },
};

const fmt = (m: number) => (m < 60 ? `${m} minutes` : `${(m / 60).toFixed(1)} hours`);

export default function SlideTimeHorizon() {
  return (
    <TeachLayout strand="where" headline="Tasks it can finish keep getting longer">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {/* Recessive grid and axes */}
        {yTicks.map((t) => (
          <g key={t.v}>
            <line x1={X0} x2={X1} y1={py(t.v)} y2={py(t.v)} stroke="#DDE7EE" strokeWidth={2} />
            <text x={X0 - 18} y={py(t.v) + 8} textAnchor="end" fontSize={24} fill={theme.muted}>
              {t.label}
            </text>
          </g>
        ))}
        {xTicks.map((y) => {
          const x = X0 + ((y - T0) / (T1 - T0)) * (X1 - X0);
          return (
            <text key={y} x={x} y={Y0 + 42} textAnchor="middle" fontSize={24} fill={theme.muted}>
              {y}
            </text>
          );
        })}
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#B9CAD6" strokeWidth={2} />

        {timeHorizon.points.map((p, i) => {
          const x = px(p.date);
          const y = py(p.minutes);
          const lab = labelled[p.model];
          return (
            <motion.g key={p.model} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.2 }}>
              <title>{`${p.model} (${p.date}): ${fmt(p.minutes)}`}</title>
              {/* Generous invisible hit target for the hover title */}
              <circle cx={x} cy={y} r={26} fill="transparent" />
              <circle cx={x} cy={y} r={12} fill={theme.agent} stroke={theme.brandLight} strokeWidth={3} />
              {lab && (
                <text x={x + lab.dx} y={y + lab.dy} textAnchor={lab.anchor} fontSize={26} fontWeight={500} fill={theme.ink}>
                  {lab.text}
                  <tspan x={x + lab.dx} dy={28} fontSize={20} fontWeight={400} fill={theme.muted}>
                    {p.model}
                  </tspan>
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Headline numbers */}
      <motion.div
        className="absolute left-[1480px] top-[340px] flex w-[360px] flex-col gap-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
      >
        <div>
          <div className="text-[76px] font-bold leading-none" style={{ color: theme.brandPrimary }}>
            Doubling
          </div>
          <div className="mt-3 text-[32px] font-medium" style={{ color: theme.ink }}>
            every 4 to 7 months
          </div>
        </div>
        <div className="text-[24px] leading-snug" style={{ color: theme.muted }}>
          Length of task, timed by a skilled person, that AI agents finish half the time
        </div>
      </motion.div>

      <div className="absolute left-[250px] top-[950px] text-[20px]" style={{ color: theme.muted }}>
        Source: {timeHorizon.source}. Software and research tasks.
      </div>
    </TeachLayout>
  );
}
