import { motion } from "framer-motion";
import { Sparkles, TrendingDown, Users } from "lucide-react";
import { Interactive } from "../components/Interactive";
import { READINESS_YEARS } from "../data/osOfWork";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

// Plot area (stage pixels) and domain. Linear scale, so compounding shows as a curve.
const X0 = 150;
const X1 = 1180;
const Y0 = 880; // bottom
const Y1 = 300; // top
const T0 = 2026;
const T1 = 2032;
const NOW = 2026.8; // October 2026
const DOUBLING_YEARS = 7 / 12; // METR long-run doubling, about 7 months
const START_MAX = 2029.5;

/** What AI can do, as a multiple of today. */
const capability = (t: number) => 2 ** ((t - NOW) / DOUBLING_YEARS);
const YMAX = capability(T1);
const px = (t: number) => X0 + ((t - T0) / (T1 - T0)) * (X1 - X0);
const py = (v: number) => Y0 - (Math.min(YMAX, Math.max(0, v)) / YMAX) * (Y0 - Y1);
const smooth = (x: number) => x * x * (3 - 2 * x);

/** What we can use: about today's level until we start, then catches up over READINESS_YEARS. */
function usable(t: number, start: number) {
  if (t <= start) return 1;
  const k = Math.min(1, (t - start) / READINESS_YEARS);
  // Readiness builds slowly at first (data, rules, skills), so use stays low until late in the period.
  return 1 + (capability(t) - 1) * smooth(k) ** 2;
}

function path(f: (t: number) => number, from: number, to: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = from + ((to - from) * i) / 160;
    pts.push(`${i ? "L" : "M"}${px(t).toFixed(1)} ${py(f(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}

const peoplePoints = [
  { icon: TrendingDown, text: "Skills fade while the world moves on" },
  { icon: Sparkles, text: "People want to learn the latest tools" },
  { icon: Users, text: "No one wants to feel left behind" },
];

export default function SlideCostOfWaiting() {
  const [start, setStart] = useSlideState("wait:start2", NOW);
  const ready = Math.min(T1, start + READINESS_YEARS);
  const multiple = Math.round(capability(start + READINESS_YEARS));
  const upper = path(capability, NOW, ready);
  const lower = path((t) => usable(t, start), ready, NOW).replace(/^M/, "L");
  const startLabel = start <= NOW + 0.05 ? "now" : `in ${start.toFixed(1).replace(".0", "")}`;

  return (
    <TeachLayout strand="where" headline="The cost of waiting">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {[2026, 2027, 2028, 2029, 2030, 2031, 2032].map((y) => (
          <g key={y}>
            <line x1={px(y)} x2={px(y)} y1={Y1} y2={Y0} stroke="#E4EEF5" strokeWidth={2} />
            <text x={px(y)} y={Y0 + 38} textAnchor="middle" fontSize={22} fill={theme.muted}>
              {y}
            </text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#B9CAD6" strokeWidth={2} />
        <path d={`${upper} ${lower} Z`} fill={theme.brandAccent} opacity={0.35} />
        <motion.path d={path(capability, T0, T1)} fill="none" stroke={theme.agent} strokeWidth={6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6 }} />
        <path d={path((t) => usable(t, start), T0, T1)} fill="none" stroke={theme.human} strokeWidth={6} />
        <line x1={px(start)} x2={px(start)} y1={Y1} y2={Y0} stroke={theme.human} strokeWidth={2} strokeDasharray="6 6" />
        {start + READINESS_YEARS <= T1 && <circle cx={px(ready)} cy={py(capability(ready))} r={12} fill={theme.human} stroke="#fff" strokeWidth={4} />}
        <text x={px(2031.75)} y={Y1 + 70} textAnchor="end" fontSize={26} fontWeight={700} fill={theme.agent}>
          What AI can do
        </text>
        <text x={px(2027)} y={Y0 - 20} fontSize={26} fontWeight={700} fill={theme.human}>
          What we can use
        </text>
        <rect x={X0 + 20} y={Y1 + 4} width={34} height={22} rx={4} fill={theme.brandAccent} opacity={0.5} />
        <text x={X0 + 66} y={Y1 + 23} fontSize={24} fontWeight={500} fill="#8A5A00">
          The gap: value we leave on the table
        </text>
      </svg>

      <Interactive className="absolute left-[1240px] top-[270px] flex w-[590px] flex-col gap-5">
        <div className="rounded-3xl bg-white px-7 py-6" style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-[22px] font-medium uppercase tracking-[0.12em]" style={{ color: theme.muted }}>
              We start building
            </span>
            <span className="text-[46px] font-bold" style={{ color: theme.human }}>
              {startLabel}
            </span>
          </div>
          <input
            type="range"
            aria-label="When we start building readiness"
            min={NOW}
            max={START_MAX}
            step={0.1}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            onKeyDown={(e) => e.stopPropagation()}
            className="mt-2 w-full outline-none"
            style={{ accentColor: theme.human, height: 34 }}
          />
          <div className="mt-3 text-[25px] leading-snug" style={{ color: theme.ink }}>
            Ready by <b>{(start + READINESS_YEARS).toFixed(1).replace(".0", "")}</b>. By then, AI handles tasks about{" "}
            <b style={{ color: theme.agent }}>{multiple.toLocaleString()}×</b> longer than today.
          </div>
        </div>

        {/* Waiting also costs our people */}
        <motion.div
          className="rounded-3xl px-7 py-6 text-white"
          style={{ background: theme.human }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-[30px] font-bold">Waiting also costs our people</div>
          <div className="mt-3 flex flex-col gap-3">
            {peoplePoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-[25px]">
                <Icon size={30} className="shrink-0" /> {text}
              </div>
            ))}
          </div>
        </motion.div>
      </Interactive>

      <div className="absolute left-[150px] top-[945px] w-[1680px] text-[18px]" style={{ color: theme.muted }}>
        Illustrative. AI line extends METR's long-run trend (task length doubling about every 7 months, software tasks) and holds only if the trend continues. Readiness assumed to take {READINESS_YEARS} years.
      </div>
    </TeachLayout>
  );
}
