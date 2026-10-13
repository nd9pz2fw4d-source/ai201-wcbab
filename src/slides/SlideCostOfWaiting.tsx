import { motion } from "framer-motion";
import { Sparkles, TrendingDown, Users } from "lucide-react";
import { READINESS_YEARS } from "../data/osOfWork";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

// Plot area (stage pixels) and domain. Linear scale, so compounding shows as a curve.
const X0 = 150;
const X1 = 1180;
const Y0 = 880; // bottom
const Y1 = 300; // top
const T0 = 2026;
const T1 = 2031;
const NOW = 2026.8; // October 2026
const DOUBLING_YEARS = 7 / 12; // METR long-run doubling, about 7 months
const WAIT = 1; // the "wait a year" scenario

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

/** Value left on the table: area between the two lines, from now until we are ready. */
function gapArea(start: number) {
  const end = start + READINESS_YEARS;
  let a = 0;
  for (let i = 0; i < 400; i++) {
    const t = NOW + ((end - NOW) * (i + 0.5)) / 400;
    a += capability(t) - usable(t, start);
  }
  return (a * (end - NOW)) / 400;
}

const scenarios = [
  { n: 1, label: "Start now", start: NOW, color: theme.human, dash: undefined, gapOpacity: 1, delay: 2.0 },
  { n: 2, label: "Wait a year", start: NOW + WAIT, color: theme.muted, dash: "12 10", gapOpacity: 0.32, delay: 3.8 },
].map((s) => ({ ...s, ready: s.start + READINESS_YEARS }));

const timesMore = Math.round(gapArea(NOW + WAIT) / gapArea(NOW));
const year = (t: number) => Math.floor(t);
// Swatch area matches the gap ratio.
const swatch = (n: number) => Math.round(28 * (n === 1 ? 1 : Math.sqrt(gapArea(NOW + WAIT) / gapArea(NOW))));

const peoplePoints = [
  { icon: TrendingDown, text: "Skills fade while the world moves on" },
  { icon: Sparkles, text: "People want to learn the latest tools" },
  { icon: Users, text: "No one wants to feel left behind" },
];

const fade = (delay: number, y = 14) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
});

export default function SlideCostOfWaiting() {
  return (
    <TeachLayout strand="where" headline="The cost of waiting">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {[2026, 2027, 2028, 2029, 2030, 2031].map((y) => (
          <g key={y}>
            <line x1={px(y)} x2={px(y)} y1={Y1} y2={Y0} stroke="#E4EEF5" strokeWidth={2} />
            <text x={px(y)} y={Y0 + 38} textAnchor="middle" fontSize={22} fill={theme.muted}>
              {y}
            </text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#B9CAD6" strokeWidth={2} />

        {/* Gaps: the late one first (larger, lighter), the start-now one on top */}
        {[...scenarios].reverse().map((s) => (
          <motion.path
            key={`gap-${s.n}`}
            d={`${path(capability, NOW, s.ready)} ${path((t) => usable(t, s.start), s.ready, NOW).replace(/^M/, "L")} Z`}
            fill={theme.brandAccent}
            initial={{ opacity: 0 }}
            animate={{ opacity: s.gapOpacity }}
            transition={{ delay: s.delay + 1.0, duration: 0.6 }}
          />
        ))}

        <motion.path d={path(capability, T0, T1)} fill="none" stroke={theme.agent} strokeWidth={6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.5 }} />
        <motion.text x={px(2030.78)} y={Y1 + 24} textAnchor="end" fontSize={26} fontWeight={700} fill={theme.agent} {...fade(1.4, 0)}>
          What AI can do
        </motion.text>

        {scenarios.map((s) => (
          <g key={s.n}>
            <motion.path
              d={path((t) => usable(t, s.start), T0, s.ready)}
              fill="none"
              stroke={s.color}
              strokeWidth={6}
              strokeDasharray={s.dash}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: s.delay, duration: 1.2, ease: "easeInOut" }}
            />
            <motion.g {...fade(s.delay + 1.1, 0)}>
              <circle cx={px(s.ready)} cy={py(capability(s.ready))} r={24} fill={s.color} stroke="#fff" strokeWidth={4} />
              <text x={px(s.ready)} y={py(capability(s.ready)) + 9} textAnchor="middle" fontSize={26} fontWeight={700} fill="#fff">
                {s.n}
              </text>
            </motion.g>
          </g>
        ))}

        <motion.g {...fade(2.8, 0)}>
          <rect x={X0 + 20} y={Y1 + 4} width={34} height={22} rx={4} fill={theme.brandAccent} opacity={0.6} />
          <text x={X0 + 66} y={Y1 + 23} fontSize={24} fontWeight={500} fill="#8A5A00">
            Value we leave on the table
          </text>
        </motion.g>
      </svg>

      <div className="absolute left-[1240px] top-[250px] flex w-[590px] flex-col gap-4">
        {scenarios.map((s) => (
          <motion.div key={s.n} className="flex items-center gap-5 rounded-3xl bg-white px-6 py-4" style={{ boxShadow: "0 1px 0 #C9DDEA, 0 10px 28px rgba(12,53,83,0.08)" }} {...fade(s.delay + 1.1)}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[26px] font-bold text-white" style={{ background: s.color }}>
              {s.n}
            </span>
            <div className="flex-1">
              <div className="text-[30px] font-bold leading-tight" style={{ color: theme.ink }}>
                {s.label}
              </div>
              <div className="text-[23px]" style={{ color: theme.muted }}>
                Ready by {year(s.ready)}
              </div>
            </div>
            <span className="rounded-md" style={{ background: theme.brandAccent, opacity: s.gapOpacity + 0.15, width: swatch(s.n), height: swatch(s.n) }} />
          </motion.div>
        ))}

        <motion.div className="flex items-center gap-4 px-2 pt-1" {...fade(5.6)}>
          <span className="text-[84px] font-bold leading-none" style={{ color: "#B57A00" }}>
            {timesMore}×
          </span>
          <span className="text-[28px] font-medium leading-tight" style={{ color: theme.ink }}>
            more value left on the table if we wait one year
          </span>
        </motion.div>

        {/* Waiting also costs our people */}
        <motion.div className="mt-1 rounded-3xl px-7 py-5 text-white" style={{ background: theme.human }} {...fade(6.6)}>
          <div className="text-[30px] font-bold">Waiting also costs our people</div>
          <div className="mt-3 flex flex-col gap-2">
            {peoplePoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-[25px]">
                <Icon size={30} className="shrink-0" /> {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute left-[150px] top-[945px] w-[1680px] text-[18px]" style={{ color: theme.muted }}>
        Illustrative. AI line extends METR's long-run trend (task length doubling about every 7 months, software tasks) and holds only if the trend continues. Readiness assumed to take {READINESS_YEARS} years.
      </div>
    </TeachLayout>
  );
}
