import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Interactive, SlideButton } from "../components/Interactive";
import { readinessDimensions } from "../data/osOfWork";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

const CX = 1470;
const CY = 610;
const R = 220;
const N = readinessDimensions.length;
const axis = (i: number, r: number) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
};

/** Save the room's scores as a CSV file (works offline). */
function download(scores: Record<string, number>) {
  const rows = [["Foundation", "Score (1 to 5)"], ...readinessDimensions.map((d) => [d.label, String(scores[d.id] ?? "")])];
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `wcb-ai-readiness-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function SlideReadiness() {
  const [scores, setScores] = useSlideState<Record<string, number>>("readiness", {});
  const scored = readinessDimensions.filter((d) => scores[d.id]);
  const weakest = scored.length >= 3 ? [...scored].sort((a, b) => scores[a.id] - scores[b.id]).slice(0, 2).map((d) => d.id) : [];
  const poly = readinessDimensions.map((d, i) => axis(i, (R * (scores[d.id] ?? 0)) / 5)).map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <motion.h1 className="text-[76px] font-medium leading-[1.08]" style={{ color: theme.brandPrimary }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          How ready are we?
        </motion.h1>
      </div>

      <Interactive className="absolute left-[100px] top-[250px] flex w-[880px] flex-col gap-3">
        {readinessDimensions.map((d) => {
          const weak = weakest.includes(d.id);
          return (
            <div key={d.id} className="flex items-center gap-4 rounded-2xl bg-white px-6 py-3" style={{ boxShadow: weak ? `0 0 0 3px ${theme.brandAccent}` : "0 1px 0 #C9DDEA" }}>
              <span className="flex-1 text-[27px] font-medium" style={{ color: theme.ink }}>
                {d.label}
              </span>
              {weak && (
                <span className="rounded-full px-3 py-1 text-[19px] font-bold" style={{ background: theme.brandAccent, color: theme.brandPrimary }}>
                  Invest first
                </span>
              )}
              {[1, 2, 3, 4, 5].map((n) => {
                const on = (scores[d.id] ?? 0) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    data-interactive
                    aria-label={`${d.label}: ${n}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setScores((s) => ({ ...s, [d.id]: s[d.id] === n ? 0 : n }));
                    }}
                    className="grid h-[54px] w-[54px] place-items-center rounded-full text-[23px] font-bold"
                    style={{ background: on ? theme.agent : "#EEF3F7", color: on ? "#fff" : theme.muted }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          );
        })}
        <div className="mt-3 flex gap-4">
          <SlideButton tone="gold" className="!py-3 !text-[22px]" disabled={scored.length === 0} onClick={() => download(scores)}>
            <Download size={24} /> Save the room's scores
          </SlideButton>
          <SlideButton tone="ghost" className="!py-3 !text-[22px]" onClick={() => setScores({})}>
            <RotateCcw size={22} /> Reset
          </SlideButton>
        </div>
      </Interactive>

      {/* Radar */}
      <svg className="absolute inset-0" width={1920} height={1080} style={{ pointerEvents: "none" }}>
        {[1, 2, 3, 4, 5].map((k) => (
          <polygon key={k} points={readinessDimensions.map((_, i) => axis(i, (R * k) / 5)).map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#DDE7EE" strokeWidth={2} />
        ))}
        {readinessDimensions.map((d, i) => {
          const p = axis(i, R);
          const l = axis(i, R + 52);
          return (
            <g key={d.id}>
              <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#DDE7EE" strokeWidth={2} />
              <text x={l.x} y={l.y + 8} textAnchor={Math.abs(l.x - CX) < 10 ? "middle" : l.x > CX ? "start" : "end"} fontSize={24} fontWeight={weakest.includes(d.id) ? 700 : 500} fill={weakest.includes(d.id) ? "#8A5A00" : theme.muted}>
                {d.short}
              </text>
            </g>
          );
        })}
        {scored.length > 0 && (
          <motion.polygon points={poly} fill={theme.agent} fillOpacity={0.25} stroke={theme.agent} strokeWidth={4} animate={{ points: poly }} transition={{ duration: 0.4 }} />
        )}
      </svg>
    </div>
  );
}
