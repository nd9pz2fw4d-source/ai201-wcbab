import { FolderOpen } from "lucide-react";
import { interpolate } from "remotion";
import { fadeUp, popIn, progress, useIn, useSeconds } from "../anim";
import { DeloitteLogo, WcbLogo, theme } from "../brand";
import { session } from "../content";
import { Stage } from "../components/Stage";
import { teaserAt } from "../timeline";

/** Teaser chips, shown in the intro's instrumental stretch in place of the subtitle. */
const teasers = ["One claim", "Three acts", "Eight key terms", "One song"];

// A claim file flies in, gets stamped, and the title lands; then a teaser of what's coming.
export function Intro() {
  const t = useSeconds();
  const fly = useIn(0.2, 12);
  const stamp = useIn(2.5, 9);
  const title = useIn(3.2);
  const sub = useIn(4.2);
  const logos = useIn(5.2);
  const swap = progress(t, teaserAt(0) - 0.4, teaserAt(0));

  const folderX = interpolate(fly, [0, 1], [-1400, 0]);
  const folderSpin = interpolate(fly, [0, 1], [-30, -4]);
  const bob = Math.sin(t * 3) * 6;

  return (
    <Stage tone="dawn">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            transform: `translateX(${folderX}px) translateY(${bob}px) rotate(${folderSpin}deg)`,
            width: 360,
            height: 250,
            borderRadius: 28,
            background: theme.paper,
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: theme.ink,
          }}
        >
          <FolderOpen size={110} color={theme.brandSecondary} strokeWidth={1.8} />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>CLAIM</div>
          <div
            style={{
              position: "absolute",
              right: -70,
              top: -40,
              padding: "10px 22px",
              border: `6px solid ${theme.brandAccent}`,
              borderRadius: 14,
              color: theme.brandAccent,
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: 2,
              background: "rgba(12,53,83,0.9)",
              opacity: Math.min(1, stamp * 2),
              transform: `rotate(12deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
            }}
          >
            PRE-READ
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ ...fadeUp(title), fontSize: 150, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
          Follow the <span style={{ color: theme.brandAccent }}>claim</span>
        </div>
        <div style={{ position: "relative", marginTop: 30, height: 80 }}>
          <div style={{ ...fadeUp(sub), opacity: Math.min(1, sub) * (1 - swap), fontSize: 46, color: theme.brandTint, fontWeight: 400 }}>
            {session.programme}: your two-minute warm-up. Sound on!
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", gap: 28 }}>
            {teasers.map((label, i) => (
              <Teaser key={label} label={label} delay={teaserAt(i)} />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          ...fadeUp(logos),
          position: "absolute",
          left: 0,
          right: 0,
          top: 790,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
        }}
      >
        <WcbLogo height={84} on="dark" />
        <div style={{ width: 2, height: 64, background: theme.brandSky, opacity: 0.5 }} />
        <DeloitteLogo height={46} on="dark" />
      </div>
    </Stage>
  );
}

function Teaser({ label, delay }: { label: string; delay: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        padding: "12px 32px",
        borderRadius: 999,
        background: theme.paper,
        color: theme.brandPrimary,
        fontSize: 40,
        fontWeight: 900,
      }}
    >
      {label}
    </div>
  );
}
