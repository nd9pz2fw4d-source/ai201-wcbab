import { AbsoluteFill } from "remotion";
import { WcbLogo, theme } from "../brand";
import { session } from "../content";

/** WCB logo and programme name, top left, on every scene after the intro. */
export function Header() {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 44, left: 80, display: "flex", alignItems: "center", gap: 24 }}>
        <WcbLogo height={56} on="dark" />
        <div style={{ width: 2, height: 40, background: theme.brandSky, opacity: 0.5 }} />
        <div style={{ fontSize: 26, color: theme.brandSky, fontWeight: 500 }}>{session.programme} · Pre-read</div>
      </div>
    </AbsoluteFill>
  );
}
