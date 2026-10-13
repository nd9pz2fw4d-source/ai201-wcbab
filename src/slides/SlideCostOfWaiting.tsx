import { motion } from "framer-motion";
import { Interactive } from "../components/Interactive";
import { READINESS_YEARS } from "../data/osOfWork";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

// Plot area (stage pixels) and domain.
const X0 = 170;
const X1 = 1280;
const Y0 = 860; // bottom
const Y1 = 330; // top
const T0 = 2026;
const T1 = 2033;
const NOW = 2026.8; // October 2026
const DOUBLING_YEARS = 7 / 12; // METR long-run doubling, about 7 months
const LMIN = -1.5;
const LMAX = 11;

const capability = (t: number) => (t - NOW) / DOUBLING_YEARS; // log2 of "times today"
const px = (t: number) => X0 + ((t - T0) / (T1 - T0)) * (X1 - X0);
const py = (l: number) => Y0 - ((Math.min(LMAX, Math.max(LMIN, l)) - LMIN) / (LMAX - LMIN)) * (Y0 - Y1);
const smooth = (x: number) => x * x * (3 - 2 * x);

/** What we can use: flat until we start, then catches up with capability over READINESS_YEARS. */
function usable(t: number, start: number) {
  const base = LMIN + 0.3;
  if (t <= start) return base;
  const k = Math.min(1, (t - start) / READINESS_YEARS);
  return base + (capability(t) - base) * smooth(k);
}

function path(f: (t: number) => number, from = T0, to = T1) {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = from + ((to - from) * i) / 120;
    pts.push(`${i ? "L" : "M"}${px(t).toFixed(1)} ${py(f(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function SlideCostOfWaiting() {
  const [start, setStart] = useSlideState("wait:start", 2026.8);
  const ready = start + READINESS_YEARS;
  const multiple = Math.round(2 ** capability(ready));
  const gap = `${path((t) => capability(t), NOW, ready)} L${px(ready)} ${py(usable(ready, start))} ${path((t) => usable(t, start), ready, NOW).slice(1).replace(/^/, "L")} Z`;
  const startLabel = start <= 2026.85 ? "now" : `in ${start.toFixed(1).replace(".0", "")}`;

  return (
    <TeachLayout strand="where" headline="The cost of waiting">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {[2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map((y) => (
          <g key={y}>
            <line x1={px(y)} x2={px(y)} y1={Y1} y2={Y0} stroke="#E4EEF5" strokeWidth={2} />
            <text x={px(y)} y={Y0 + 38} textAnchor="middle" fontSize={22} fill={theme.muted}>
              {y}
            </text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#B9CAD6" strokeWidth={2} />
        {/* The gap: capability we cannot use */}
        <path d={gap} fill={theme.brandAccent} opacity={0.28} />
        <motion.path d={path((t) => capability(t))} fill="none" stroke={theme.agent} strokeWidth={6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }} />
        <path d={path((t) => usable(t, start))} fill="none" stroke={theme.human} strokeWidth={6} />
        <line x1={px(start)} x2={px(start)} y1={Y1} y2={Y0} stroke={theme.human} strokeWidth={2} strokeDasharray="6 6" />
        <circle cx={px(ready)} cy={py(capability(ready))} r={12} fill={theme.human} stroke="#fff" strokeWidth={4} />
        <text x={px(2031.2)} y={py(capability(2031.2)) - 22} textAnchor="end" fontSize={26} fontWeight={700} fill={theme.agent}>
          What AI can do
        </text>
        <text x={px(2027.3)} y={Y0 - 22} fontSize={26} fontWeight={700} fill={theme.human}>
          What we can use
        </text>
      </svg>

      {/* Controls and the readout */}
      <Interactive className="absolute left-[1360px] top-[320px] flex w-[470px] flex-col gap-6">
        <div className="rounded-3xl bg-white p-7" style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}>
          <div className="text-[24px] font-medium uppercase tracking-[0.12em]" style={{ color: theme.muted }}>
            We start building
          </div>
          <div className="text-[56px] font-bold" style={{ color: theme.human }}>
            {startLabel}
          </div>
          <input
            type="range"
            aria-label="When we start building readiness"
            min={2026.8}
            max={2030}
            step={0.1}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            onKeyDown={(e) => e.stopPropagation()}
            className="mt-3 w-full outline-none"
            style={{ accentColor: theme.human, height: 36 }}
          />
          <div className="mt-6 text-[24px]" style={{ color: theme.muted }}>
            Ready by
          </div>
          <div className="text-[44px] font-bold" style={{ color: theme.brandPrimary }}>
            {ready.toFixed(1).replace(".0", "")}
          </div>
          <div className="mt-4 text-[24px] leading-snug" style={{ color: theme.ink }}>
            By then, AI handles tasks about <b style={{ color: theme.agent }}>{multiple.toLocaleString()}×</b> longer than today
          </div>
        </div>
        <div className="flex items-center gap-3 text-[26px] font-medium" style={{ color: "#8A5A00" }}>
          <span className="h-6 w-10 rounded" style={{ background: theme.brandAccent, opacity: 0.5 }} /> The gap: value we leave on the table
        </div>
      </Interactive>

      <div className="absolute left-[170px] top-[935px] text-[19px]" style={{ color: theme.muted }}>
        Illustrative. AI line follows METR's long-run trend (task length doubling about every 7 months, software tasks, if it holds). Readiness assumed to take {READINESS_YEARS} years.
      </div>
    </TeachLayout>
  );
}
