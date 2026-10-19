import { Bot, FolderOpen, UserRound } from "lucide-react";
import { Easing } from "remotion";
import { stations, theme } from "../brand";

// The claim journey as a row of eight stations with the claim file hopping along it.
// Used by both choruses: the first shows the journey; the last shows who does what on it.

const LEFT = 80;
const WIDTH = 1760;
const STEP = WIDTH / stations.length;
const LINE_Y = 560;

export type Role = "agent" | "person";

/**
 * Claim position (in stations) at time t, hopping from station `from` at t0 to station `to` at t1
 * and pausing briefly at each station on the way. Clamped outside [t0, t1].
 */
export const hops = (t: number, from: number, to: number, t0: number, t1: number): number => {
  const n = to - from;
  if (n <= 0) return from;
  const x = ((t - t0) / (t1 - t0)) * n;
  if (x <= 0) return from;
  if (x >= n) return to;
  const i = Math.floor(x);
  return from + i + Easing.inOut(Easing.cubic)(Math.min(1, (x - i) / 0.7));
};

interface Props {
  /** Claim position in stations, 0 to 7. */
  pos: number;
  /** Who does the work at each station. Without it, stations light up teal as the claim passes. */
  roles?: Role[];
  /** 0 to 1: dims every station except `focus`. */
  dim?: number;
  focus?: number;
  /** "light" for the explainer's light scenes; "dark" (default) for the music video. */
  tone?: "dark" | "light";
}

export function ClaimTrack({ pos, roles, dim = 0, focus, tone = "dark" }: Props) {
  const light = tone === "light";
  const x = LEFT + STEP * (pos + 0.5);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: LEFT + STEP / 2,
          width: WIDTH - STEP,
          top: LINE_Y - 4,
          height: 8,
          borderRadius: 4,
          background: "rgba(128,195,226,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LEFT + STEP / 2,
          width: x - (LEFT + STEP / 2),
          top: LINE_Y - 4,
          height: 8,
          borderRadius: 4,
          background: theme.brandAccent,
        }}
      />

      {stations.map((s, i) => {
        const lit = pos >= i - 0.05;
        const role = roles?.[i];
        const fill = role === "person" ? theme.human : theme.agent;
        const Icon = s.icon;
        // A station's role badge pops in as the claim approaches, and is full size once it lands.
        const badge = Math.max(0, Math.min(1, (pos - i + 0.35) * 3));
        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: LEFT + STEP * i,
              width: STEP,
              top: LINE_Y - 65,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: i === focus ? 1 : 1 - 0.6 * dim,
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: lit ? fill : light ? theme.paper : theme.brandPrimary,
                border: `5px solid ${lit ? fill : theme.brandSky}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${lit && Math.abs(pos - i) < 0.3 ? 1.12 : 1})`,
              }}
            >
              <Icon size={60} color={lit || !light ? theme.paper : theme.brandSky} strokeWidth={2} />
            </div>
            <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.2, textAlign: "center", fontWeight: 500, color: light ? (lit ? theme.brandPrimary : theme.muted) : lit ? theme.paper : theme.brandSky }}>
              {s.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            {role && (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  background: fill,
                  color: theme.paper,
                  fontSize: 24,
                  fontWeight: 700,
                  opacity: badge,
                  transform: `scale(${0.6 + 0.4 * badge})`,
                }}
              >
                {role === "person" ? <UserRound size={24} strokeWidth={2.5} /> : <Bot size={24} strokeWidth={2.5} />}
                {role === "person" ? "Person" : "Agent"}
              </div>
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: x - 50,
          top: LINE_Y - 190,
          width: 100,
          height: 100,
          borderRadius: 24,
          background: theme.brandAccent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 16px 30px rgba(0,0,0,0.35)",
          transform: `translateY(${-Math.abs(Math.sin((pos % 1) * Math.PI)) * 40}px)`,
        }}
      >
        <FolderOpen size={56} color={theme.brandPrimary} strokeWidth={2.2} />
      </div>
    </>
  );
}

/** Horizontal centre of station i, for placing callouts above it. */
export const stationX = (i: number) => LEFT + STEP * (i + 0.5);
