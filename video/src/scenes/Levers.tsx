import { interpolate } from "remotion";
import { fadeUp, popIn, useIn, useSeconds } from "../anim";
import { theme } from "../brand";
import { deloitteSource, leverStats, levers } from "../content";
import { Header } from "../components/Header";
import { SourceNote } from "../components/SourceNote";
import { Stage } from "../components/Stage";

/** When each lever is sung (seconds into the section); the lyric lines are 2 s apart. */
const PULL_AT = [0, 4, 8, 12, 14];
const STATS_AT = 16;
const GOAL_AT = 20;

// 24 s. Deloitte's five levers get pulled one by one, then the numbers and the one goal.
export function Levers() {
  const t = useSeconds();
  const head = useIn(0);
  const goal = useIn(GOAL_AT);

  return (
    <Stage chip="Context: Deloitte">
      <Header />
      <div style={{ position: "absolute", left: 80, right: 80, top: 160, height: 90 }}>
        <div style={{ position: "absolute", fontSize: 64, fontWeight: 900, opacity: head * (1 - goal) }}>
          Five levers for the future of comp
        </div>
        <div style={{ position: "absolute", fontSize: 64, fontWeight: 900, ...fadeUp(goal) }}>
          Every lever, one goal: <span style={{ color: theme.brandAccent }}>return to work (RTW)</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 80, right: 80, top: 270, display: "flex", gap: 28 }}>
        {levers.map((l, i) => (
          <LeverCard key={l.name} n={i + 1} name={l.name} detail={l.detail} Icon={l.icon} pulledAt={PULL_AT[i]} t={t} />
        ))}
      </div>

      <div style={{ position: "absolute", left: 80, right: 80, top: 720, display: "flex", gap: 28 }}>
        {leverStats.map((s, i) => (
          <Stat key={s.value} value={s.value} label={s.label} delay={STATS_AT + i * 0.6} grow={i === 0 ? 1.4 : 1} />
        ))}
      </div>
      <SourceNote text={deloitteSource} />
    </Stage>
  );
}

function LeverCard({
  n,
  name,
  detail,
  Icon,
  pulledAt,
  t,
}: {
  n: number;
  name: string;
  detail: string;
  Icon: (typeof levers)[number]["icon"];
  pulledAt: number;
  t: number;
}) {
  const appear = useIn(pulledAt * 0.1);
  const pull = useIn(pulledAt, 10);
  const on = pull > 0.5;
  // The knob travels down the slot as the lever is pulled.
  const knobY = interpolate(pull, [0, 1], [0, 70]);
  const glow = on ? Math.max(0, 1 - (t - pulledAt) / 1.5) : 0;

  return (
    <div
      style={{
        ...fadeUp(appear, 20),
        flex: 1,
        height: 420,
        borderRadius: 28,
        background: on ? theme.paper : "rgba(255,255,255,0.12)",
        color: on ? theme.ink : theme.brandTint,
        padding: "26px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: `0 0 ${40 * glow}px ${theme.brandAccent}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: on ? theme.brandDeep : theme.brandSky, letterSpacing: 1 }}>LEVER {n}</div>
        <div style={{ position: "relative", width: 34, height: 110, borderRadius: 17, background: on ? theme.line : "rgba(255,255,255,0.2)" }}>
          <div
            style={{
              position: "absolute",
              left: -3,
              top: knobY,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: on ? theme.brandAccent : theme.brandSky,
            }}
          />
        </div>
      </div>
      <Icon size={64} color={on ? theme.agent : theme.brandSky} strokeWidth={2} style={{ marginTop: -40, flexShrink: 0 }} />
      <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.1, color: on ? theme.brandPrimary : theme.paper }}>{name}</div>
      <div style={{ fontSize: 27, lineHeight: 1.3, color: on ? theme.muted : theme.brandSky }}>{detail}</div>
    </div>
  );
}

function Stat({ value, label, delay, grow }: { value: string; label: string; delay: number; grow: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        flex: grow,
        borderRadius: 24,
        border: `3px solid ${theme.brandAccent}`,
        background: "rgba(251,180,58,0.1)",
        padding: "18px 28px",
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div style={{ fontSize: 66, fontWeight: 900, color: theme.brandAccent, whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ fontSize: 27, lineHeight: 1.25 }}>{label}</div>
    </div>
  );
}
