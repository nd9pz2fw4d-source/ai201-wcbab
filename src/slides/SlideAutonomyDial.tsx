import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ShieldCheck, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Interactive } from "../components/Interactive";
import { autonomyLevels } from "../data/teaching";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const CX = 640;
const CY = 820;
const R = 400;
const N = autonomyLevels.length;

// Coral (people do more) through a neutral blue to teal (AI does more).
const segColors = [theme.human, "#EDA792", theme.brandSky, "#7FD3CB", theme.agent];
const polar = (deg: number, r: number) => ({ x: CX + r * Math.cos((deg * Math.PI) / 180), y: CY + r * Math.sin((deg * Math.PI) / 180) });
// Segment k spans 180 + k*36 to 180 + (k+1)*36 degrees (left to right over the top).
const segAngle = (k: number) => 180 + (k + 0.5) * (180 / N);

function arc(k: number) {
  const a0 = 180 + k * (180 / N) + 1;
  const a1 = 180 + (k + 1) * (180 / N) - 1;
  const o0 = polar(a0, R);
  const o1 = polar(a1, R);
  const i1 = polar(a1, R - 90);
  const i0 = polar(a0, R - 90);
  return `M${o0.x} ${o0.y} A${R} ${R} 0 0 1 ${o1.x} ${o1.y} L${i1.x} ${i1.y} A${R - 90} ${R - 90} 0 0 0 ${i0.x} ${i0.y} Z`;
}

export default function SlideAutonomyDial() {
  const [level, setLevel] = useSlideState("dial:level", 2);
  const current = autonomyLevels[level];
  // The needle's angle is animated; its shape is recomputed from the angle.
  const angle = useMotionValue(180);
  useEffect(() => {
    const c = animate(angle, segAngle(level), { type: "spring", stiffness: 90, damping: 14 });
    return () => c.stop();
  }, [angle, level]);
  const needle = useTransform(angle, (a) => {
    const tip = polar(a, R - 110);
    const l = polar(a - 90, 14);
    const r = polar(a + 90, 14);
    return `M${l.x} ${l.y} L${tip.x} ${tip.y} L${r.x} ${r.y} Z`;
  });

  return (
    <TeachLayout strand="how" headline="How much should it do alone?">
      <Interactive className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <svg className="absolute inset-0" width={1920} height={1080} style={{ pointerEvents: "none" }}>
          {autonomyLevels.map((l, k) => {
            const on = k === level;
            const lp = polar(segAngle(k), R + 70);
            return (
              <g key={l.label} style={{ pointerEvents: "auto", cursor: "pointer" }} data-interactive onClick={(e) => { e.stopPropagation(); setLevel(k); }}>
                <motion.path
                  d={arc(k)}
                  fill={segColors[k]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: on ? 1 : 0.35 }}
                  transition={{ delay: 0.2 + k * 0.08 }}
                />
                <text
                  x={lp.x}
                  y={lp.y}
                  textAnchor={k === 0 ? "end" : k === N - 1 ? "start" : "middle"}
                  fontSize={30}
                  fontWeight={on ? 700 : 500}
                  fill={on ? theme.brandPrimary : theme.muted}
                >
                  {l.label}
                </text>
              </g>
            );
          })}
          <motion.path d={needle} fill={theme.brandPrimary} />
          <circle cx={CX} cy={CY} r={34} fill={theme.brandPrimary} />
          <text x={CX - R} y={CY + 50} textAnchor="middle" fontSize={24} fill={theme.human} fontWeight={500}>
            People do more
          </text>
          <text x={CX + R} y={CY + 50} textAnchor="middle" fontSize={24} fill={theme.agent} fontWeight={500}>
            AI does more
          </text>
        </svg>
      </Interactive>

      {/* What this level means on our claim */}
      <motion.div
        key={level}
        className="absolute left-[1300px] top-[400px] flex w-[560px] flex-col gap-6 rounded-3xl bg-white p-9"
        style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="text-[40px] font-bold" style={{ color: theme.brandPrimary }}>
          {current.label}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[22px] uppercase tracking-wider" style={{ color: theme.muted }}>
            On our claim
          </span>
          <span className="text-[30px]" style={{ color: theme.ink }}>
            {current.example}
          </span>
        </div>
        <div className="flex items-start gap-4 rounded-2xl p-5" style={{ background: "#FCEFEA" }}>
          {level < 3 ? <UserRound size={34} color={theme.human} className="shrink-0" /> : <ShieldCheck size={34} color={theme.human} className="shrink-0" />}
          <span className="text-[28px] font-medium" style={{ color: theme.ink }}>
            {current.oversight}
          </span>
        </div>
      </motion.div>
    </TeachLayout>
  );
}
