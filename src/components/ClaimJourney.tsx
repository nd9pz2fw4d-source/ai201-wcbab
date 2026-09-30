import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FileText, MessageCircle, Phone, TriangleAlert, UserRound } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { stations, type StationId } from "../data/journey";
import { theme } from "../theme";
import { CARD_H, ClaimFile } from "./ClaimFile";

// ---------- Geometry (shared with slides that draw overlays) ----------

export const JW = 1760;
export const JH = 520;
const X0 = 120;
const X1 = 1640;
export const PATH_Y = 300;
const AMP = 52;

/** Point on the journey for t in [0, 1] (extrapolates outside). */
export function pointAt(t: number) {
  return { x: X0 + t * (X1 - X0), y: PATH_Y + AMP * Math.sin(2 * Math.PI * t) };
}

export const stationT = (i: number) => i / (stations.length - 1);
export const stationXY = (i: number) => pointAt(stationT(i));

export const journeyPath = (() => {
  const pts: string[] = [];
  for (let k = 0; k <= 140; k++) {
    const t = -0.05 + (k / 140) * 1.1;
    const p = pointAt(t);
    pts.push(`${k === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return pts.join(" ");
})();

// ---------- Types ----------

export type Era = 1 | 2 | 3 | 4 | 5;
export type Role = "human" | "assist" | "automate";
export type Speed = "slow" | "medium" | "fast" | "fastest";

export interface AgentRoute {
  from: number; // station index
  to: number;
  duration?: number;
  delay?: number;
}

export interface ClaimJourneyProps {
  era?: Era;
  /** Station index where the claim sits (animates when it changes). Ignored while travelling. */
  position?: number;
  /** "loop": the claim keeps travelling the journey at `speed`. "once": travels to `position` and stops. */
  travel?: "none" | "loop" | "once";
  speed?: Speed;
  /** Role per station. Missing stations default to "human". */
  stationRoles?: Partial<Record<StationId, Role>>;
  agents?: AgentRoute[];
  humanCheckpoints?: StationId[];
  alerts?: StationId[];
  /** Extra claims travelling at once (era 5). */
  extraClaims?: number;
  showClaim?: boolean;
  pages?: number;
  /** Draw the path in and light stations one by one (title slide). */
  drawIn?: boolean;
  tone?: "light" | "dark";
  /** Rendered width in stage pixels. */
  width?: number;
  labels?: boolean;
  /** Station label size in journey units (raise it when the journey is drawn small). */
  labelSize?: number;
  /** Extra SVG drawn in journey coordinates, under the claim. */
  overlay?: ReactNode;
  /** Extra SVG drawn on top of everything. */
  overlayTop?: ReactNode;
  delay?: number;
  /** Station indexes to dim (for focus). */
  dimmed?: number[];
  /** Show the small era marks around stations. */
  marks?: boolean;
}

const speedTimings: Record<Speed, { move: number; dwell: number }> = {
  slow: { move: 1.5, dwell: 1.4 },
  medium: { move: 0.8, dwell: 0.7 },
  fast: { move: 0.45, dwell: 0.35 },
  fastest: { move: 0.28, dwell: 0.12 },
};

// ---------- Pieces ----------

function RoleNode({ role, r }: { role: Role; r: number }) {
  if (role === "assist") {
    return (
      <>
        <path d={`M0 ${-r} A${r} ${r} 0 0 0 0 ${r} Z`} fill={theme.human} />
        <path d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r} Z`} fill={theme.agent} />
      </>
    );
  }
  return <circle r={r} fill={role === "human" ? theme.human : theme.agent} />;
}

/** Small era marks around a station: paper and phones, charts, chat bubbles, agent dots, network. */
function EraMarks({ era, index, reduce }: { era: Era; index: number; reduce: boolean }) {
  if (era === 1) {
    return (
      <g>
        <g transform="translate(22 -58) rotate(10)">
          <rect x={-14} y={-18} width={28} height={36} rx={3} fill="#fff" stroke={theme.line} strokeWidth={2} />
          <rect x={-10} y={-22} width={28} height={36} rx={3} fill="#fff" stroke={theme.line} strokeWidth={2} />
          <FileText x={-8} y={-18} width={22} height={22} color={theme.muted} />
        </g>
        <g transform="translate(-44 -46)">
          <circle r={15} fill="#fff" stroke={theme.line} strokeWidth={2} />
          <Phone x={-9} y={-9} width={18} height={18} color={theme.muted} />
        </g>
      </g>
    );
  }
  if (era === 2) {
    return (
      <g transform="translate(34 -50)">
        <rect x={-12} y={-16} width={24} height={30} rx={3} fill="#fff" stroke={theme.line} strokeWidth={2} />
        <FileText x={-9} y={-12} width={18} height={18} color={theme.muted} />
      </g>
    );
  }
  if (era === 3) {
    return (
      <g transform="translate(36 -48)">
        <circle r={16} fill="#fff" stroke={theme.agent} strokeWidth={2} />
        <MessageCircle x={-9} y={-9} width={18} height={18} color={theme.agent} />
      </g>
    );
  }
  if (era === 4) {
    // A teal agent dot orbiting the station.
    return (
      <motion.g
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 6 + (index % 3), repeat: Infinity, ease: "linear" }}
      >
        {/* Invisible ring keeps the rotation centred on the station. */}
        <circle r={54} fill="none" />
        <circle cx={0} cy={-54} r={8} fill={theme.agent} />
      </motion.g>
    );
  }
  return <circle r={54} fill="none" stroke={theme.agent} strokeWidth={2} strokeDasharray="4 8" opacity={0.7} />;
}

function AgentDot({ route, reduce }: { route: AgentRoute; reduce: boolean }) {
  const t = useMotionValue(stationT(route.from));
  const x = useTransform(t, (v) => pointAt(v).x);
  const y = useTransform(t, (v) => pointAt(v).y - 26);
  useEffect(() => {
    if (reduce) {
      t.set((stationT(route.from) + stationT(route.to)) / 2);
      return;
    }
    const c = animate(t, [stationT(route.from), stationT(route.to)], {
      duration: route.duration ?? 1.6,
      delay: route.delay ?? 0,
      repeat: Infinity,
      repeatDelay: 0.4,
      ease: "easeInOut",
    });
    return () => c.stop();
  }, [route.from, route.to, route.duration, route.delay, reduce, t]);
  return (
    <motion.g style={{ x, y }}>
      <circle r={13} fill={theme.agent} opacity={0.25} />
      <circle r={8} fill={theme.agent} />
    </motion.g>
  );
}

/** Keyframes that visit each station, pausing at each. */
function loopKeyframes(speed: Speed) {
  const { move, dwell } = speedTimings[speed];
  const n = stations.length;
  const values: number[] = [-0.06];
  const durations: number[] = [];
  for (let i = 0; i < n; i++) {
    values.push(stationT(i), stationT(i));
    durations.push(i === 0 ? move * 0.6 : move, dwell);
  }
  values.push(1.06);
  durations.push(move * 0.6);
  const total = durations.reduce((a, b) => a + b, 0);
  let acc = 0;
  const times = [0, ...durations.map((d) => (acc += d) / total)];
  return { values, times, total };
}

function MovingClaim({
  t,
  pages,
  named,
  scale = 1,
}: {
  t: MotionValue<number>;
  pages: number;
  named: boolean;
  scale?: number;
}) {
  const x = useTransform(t, (v) => pointAt(v).x);
  const y = useTransform(t, (v) => pointAt(v).y - (CARD_H / 2 + 44) * scale);
  const opacity = useTransform(t, [-0.06, -0.01, 1.01, 1.06], [0, 1, 1, 0]);
  return (
    <motion.g style={{ x, y, opacity }}>
      <g transform={`scale(${scale})`}>
        <line x1={0} y1={CARD_H / 2} x2={0} y2={CARD_H / 2 + 30} stroke={theme.brandSecondary} strokeWidth={3} />
        <ClaimFile pages={pages} named={named} />
      </g>
    </motion.g>
  );
}

function Claim({
  travel,
  position,
  speed,
  pages,
  delay,
  reduce,
  named = true,
  scale,
}: {
  travel: "none" | "loop" | "once";
  position: number;
  speed: Speed;
  pages: number;
  delay: number;
  reduce: boolean;
  named?: boolean;
  scale?: number;
}) {
  const start = travel === "none" ? stationT(position) : -0.06;
  const t = useMotionValue(reduce ? stationT(travel === "loop" ? 0 : position) : start);

  useEffect(() => {
    if (reduce) {
      t.set(stationT(travel === "loop" ? 0 : position));
      return;
    }
    if (travel === "loop") {
      const { values, times, total } = loopKeyframes(speed);
      const c = animate(t, values, { duration: total, times, ease: "easeInOut", repeat: Infinity, delay });
      return () => c.stop();
    }
    if (travel === "once") {
      t.set(-0.06);
      const c = animate(t, stationT(position), { duration: 0.22 * (position + 1) + 0.3, ease: "easeInOut", delay });
      return () => c.stop();
    }
    const c = animate(t, stationT(position), { duration: 0.9, ease: "easeInOut", delay });
    return () => c.stop();
  }, [travel, position, speed, delay, reduce, t]);

  return <MovingClaim t={t} pages={pages} named={named} scale={scale} />;
}

// ---------- The journey ----------

export function ClaimJourney({
  era = 1,
  position = 0,
  travel = "none",
  speed = "medium",
  stationRoles = {},
  agents = [],
  humanCheckpoints = [],
  alerts = [],
  extraClaims = 0,
  showClaim = true,
  pages = 2,
  drawIn = false,
  tone = "light",
  width = JW,
  labels = true,
  labelSize = 23,
  overlay,
  overlayTop,
  delay = 0,
  dimmed = [],
  marks = true,
}: ClaimJourneyProps) {
  const reduce = !!useReducedMotion();
  const dark = tone === "dark";
  const road = dark ? "rgba(255,255,255,0.14)" : "#DDEBF4";
  const dash = dark ? "rgba(255,255,255,0.45)" : "#FFFFFF";
  const labelColor = dark ? "rgba(255,255,255,0.9)" : theme.ink;

  return (
    <svg viewBox={`0 0 ${JW} ${JH}`} width={width} height={(width * JH) / JW} style={{ overflow: "visible" }}>
      {/* Road */}
      <motion.path
        d={journeyPath}
        fill="none"
        stroke={road}
        strokeWidth={30}
        strokeLinecap="round"
        initial={drawIn ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay }}
      />
      <motion.path
        d={journeyPath}
        fill="none"
        stroke={dash}
        strokeWidth={3}
        strokeDasharray="14 14"
        initial={drawIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + (drawIn ? 1.2 : 0) }}
      />

      {era === 5 && (
        // Connected network: arcs linking stations that do not sit side by side.
        <g opacity={0.35}>
          {[
            [0, 3],
            [1, 5],
            [2, 6],
            [3, 7],
            [4, 7],
          ].map(([a, b]) => {
            const p = stationXY(a);
            const q = stationXY(b);
            return (
              <motion.path
                key={`${a}-${b}`}
                d={`M${p.x} ${p.y} Q${(p.x + q.x) / 2} ${Math.min(p.y, q.y) - 190} ${q.x} ${q.y}`}
                fill="none"
                stroke={theme.agent}
                strokeWidth={3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: delay + 0.3 + a * 0.1 }}
              />
            );
          })}
        </g>
      )}

      {overlay}

      {/* Stations */}
      {stations.map((s, i) => {
        const { x, y } = stationXY(i);
        const role = stationRoles[s.id] ?? "human";
        const Icon = s.icon;
        const isAlert = alerts.includes(s.id);
        const isDim = dimmed.includes(i);
        return (
          <motion.g
            key={s.id}
            transform={`translate(${x} ${y})`}
            initial={drawIn ? { opacity: 0 } : false}
            animate={{ opacity: isDim ? 0.3 : 1 }}
            transition={{ duration: 0.5, delay: drawIn ? delay + 0.3 + i * 0.16 : 0 }}
          >
            {marks && <EraMarks era={era} index={i} reduce={reduce} />}
            {isAlert && (
              <motion.circle
                r={50}
                fill="none"
                stroke={theme.risk}
                strokeWidth={5}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 1, 0.5, 1], scale: [0.8, 1.08, 1, 1.08] }}
                transition={{ duration: 1.6, repeat: reduce ? 0 : Infinity, repeatType: "mirror" }}
              />
            )}
            <circle r={44} fill={dark ? theme.brandPrimary : "#fff"} />
            <RoleNode role={role} r={38} />
            <Icon x={-19} y={-19} width={38} height={38} color="#fff" strokeWidth={2} />
            {labels && (
              <text textAnchor="middle" fontSize={labelSize} fill={labelColor} fontWeight={500}>
                {s.lines.map((line, k) => (
                  <tspan key={k} x={0} y={55 + labelSize + k * labelSize * 1.17}>
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* Human checkpoints */}
      {humanCheckpoints.map((id) => {
        const i = stations.findIndex((s) => s.id === id);
        const { x, y } = stationXY(i);
        return (
          <motion.g
            key={`h-${id}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.4 }}
          >
            <g transform={`translate(${x - 52} ${y - 52})`}>
              <circle r={24} fill="#fff" stroke={theme.human} strokeWidth={4} />
              <UserRound x={-15} y={-15} width={30} height={30} color={theme.human} strokeWidth={2.4} />
            </g>
          </motion.g>
        );
      })}

      {/* Alert flags */}
      {alerts.map((id) => {
        const i = stations.findIndex((s) => s.id === id);
        const { x, y } = stationXY(i);
        return (
          <motion.g key={`a-${id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <g transform={`translate(${x + 44} ${y - 44})`}>
              <circle r={20} fill={theme.risk} />
              <TriangleAlert x={-12} y={-13} width={24} height={24} color="#fff" strokeWidth={2.4} />
            </g>
          </motion.g>
        );
      })}

      {agents.map((r, k) => (
        <AgentDot key={k} route={r} reduce={reduce} />
      ))}

      {showClaim &&
        Array.from({ length: extraClaims }, (_, k) => (
          <Claim
            key={`x${k}`}
            travel="loop"
            position={0}
            speed={speed}
            pages={1}
            delay={delay + (k + 1) * 0.9}
            reduce={reduce}
            named={false}
            scale={0.62}
          />
        ))}
      {showClaim && (
        <Claim travel={travel} position={position} speed={speed} pages={pages} delay={delay} reduce={reduce} />
      )}

      {overlayTop}
    </svg>
  );
}

