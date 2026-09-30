import { FolderOpen, HardHat } from "lucide-react";
import { Easing, interpolate } from "remotion";
import { fadeUp, popIn, useIn, useSeconds } from "../anim";
import { stations, theme } from "../brand";
import { Header } from "../components/Header";
import { Stage } from "../components/Stage";

const LEFT = 80;
const WIDTH = 1760;
const STEP = WIDTH / stations.length;
const LINE_Y = 560;
const FIRST = 0.8; // s: claim leaves the first station
const LAST = 13.6; // s: claim reaches the last station

/** Claim position in stations (0 to 7): it hops, pausing briefly at each one. */
const claimAt = (t: number): number => {
  const hop = (LAST - FIRST) / (stations.length - 1);
  const x = (t - FIRST) / hop;
  if (x <= 0) return 0;
  if (x >= stations.length - 1) return stations.length - 1;
  const i = Math.floor(x);
  const f = Easing.inOut(Easing.cubic)(Math.min(1, (x - i) / 0.7));
  return i + f;
};

interface Props {
  /** Final chorus: "a person decides" instead of the journey tagline. */
  tagline: string;
  chip: string;
}

// 16 s. The claim hops along the eight stations of the journey, from report to close.
export function Chorus({ tagline, chip }: Props) {
  const t = useSeconds();
  const title = useIn(0);
  const tag = useIn(8);
  const home = useIn(13.8);
  const pos = claimAt(t);
  const x = LEFT + STEP * (pos + 0.5);

  return (
    <Stage chip={chip}>
      <Header />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", ...fadeUp(title) }}>
        <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: -1 }}>
          Follow the <span style={{ color: theme.brandAccent }}>claim</span>
        </div>
      </div>

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
        const Icon = s.icon;
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
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: lit ? theme.agent : theme.brandPrimary,
                border: `5px solid ${lit ? theme.agent : theme.brandSky}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${lit && Math.abs(pos - i) < 0.3 ? 1.12 : 1})`,
              }}
            >
              <Icon size={60} color={theme.paper} strokeWidth={2} />
            </div>
            <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.2, textAlign: "center", fontWeight: 500, color: lit ? theme.paper : theme.brandSky }}>
              {s.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
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

      <div
        style={{
          ...popIn(home),
          position: "absolute",
          right: 80,
          top: 250,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 28px",
          borderRadius: 999,
          background: theme.brandGreen,
          color: theme.brandPrimary,
          fontSize: 36,
          fontWeight: 900,
        }}
      >
        <HardHat size={40} strokeWidth={2.5} /> Back at work!
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 64, fontWeight: 700, ...fadeUp(tag) }}>
        {tagline}
      </div>
    </Stage>
  );
}
