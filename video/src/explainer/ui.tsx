import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { fadeUp, popIn, useIn } from "../anim";
import { DeloitteLogo, WcbLogo, theme } from "../brand";
import { useBeat } from "./beat";

// The explainer follows the deck's content slides (src/theme.ts, src/slides/*): a light WCB blue
// background, deep blue headings, white cards with a thin outline, WCB blue for AI and agents,
// WCB green for people, and the WCB and Deloitte logos.

/** Which part of the explainer each scene belongs to, shown in the pill above the heading. */
const partOf = (n: number) =>
  n <= 1 ? "Welcome" : n <= 4 ? "Part 1 · What AI is" : n <= 9 ? "Part 2 · Agents" : n <= 12 ? "Part 3 · Executive work" : "What stays human";

/** A content scene: light background, part pill, heading (the script's scene title) and logos. */
export function SceneShell({ children, heading }: { children: ReactNode; heading?: string }) {
  const beat = useBeat();
  const head = useIn(0.1);
  return (
    <AbsoluteFill style={{ background: theme.brandLight, color: theme.ink, fontFamily: "Roboto, sans-serif" }}>
      <div style={{ position: "absolute", left: 80, top: 52, ...fadeUp(head, 20) }}>
        <span
          style={{
            display: "inline-block",
            padding: "8px 22px",
            borderRadius: 999,
            background: theme.paper,
            color: theme.brandDeep,
            fontSize: 26,
            fontWeight: 500,
          }}
        >
          {partOf(beat.n)}
        </span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 520, top: 110, fontSize: 68, fontWeight: 500, lineHeight: 1.1, color: theme.brandPrimary, ...fadeUp(head) }}>
        {heading ?? beat.title}
      </div>
      <div style={{ position: "absolute", right: 80, top: 56, display: "flex", alignItems: "center", gap: 22 }}>
        <WcbLogo height={52} on="light" />
        <div style={{ width: 2, height: 36, background: theme.line }} />
        <DeloitteLogo height={28} on="light" />
      </div>
      {children}
    </AbsoluteFill>
  );
}

/** A white card with the deck's thin outline. */
export function Card({ children, style, tone = "agent" }: { children: ReactNode; style?: CSSProperties; tone?: "agent" | "human" | "plain" | "risk" }) {
  const border = tone === "human" ? theme.human : tone === "risk" ? theme.risk : tone === "agent" ? theme.brandSky : theme.line;
  return (
    <div
      style={{
        background: theme.paper,
        color: theme.ink,
        borderRadius: 20,
        border: `3px solid ${border}`,
        padding: "24px 28px",
        boxShadow: "0 10px 24px rgba(12,53,83,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A filled circle with an icon: WCB blue for AI and agents, WCB green for people. */
export function IconDot({ Icon, size = 72, tone = "agent" }: { Icon: LucideIcon; size?: number; tone?: "agent" | "human" | "risk" | "gold" }) {
  const bg = tone === "human" ? theme.human : tone === "risk" ? theme.risk : tone === "gold" ? theme.brandAccent : theme.agent;
  return (
    <div style={{ flex: "none", width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={size * 0.52} color={theme.paper} strokeWidth={2} />
    </div>
  );
}

/** Absolutely placed block. */
export function At({ x, y, w, h, children, style }: { x: number; y: number; w?: number; h?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>;
}

/** Pops its children in at `at` seconds into the scene. */
export function Pop({ at, children, style }: { at: number; children: ReactNode; style?: CSSProperties }) {
  const p = useIn(at);
  return <div style={{ ...popIn(p), ...style }}>{children}</div>;
}

/** Slides its children up into place at `at` seconds into the scene. */
export function Rise({ at, children, style }: { at: number; children: ReactNode; style?: CSSProperties }) {
  const p = useIn(at);
  return <div style={{ ...fadeUp(p), ...style }}>{children}</div>;
}

export const blue = (text: string) => <span style={{ color: theme.brandSecondary }}>{text}</span>;
export const green = (text: string) => <span style={{ color: theme.human }}>{text}</span>;
