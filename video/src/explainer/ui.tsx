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
  n <= 1 ? "Welcome" : n <= 5 ? "A Tuesday with AI" : n <= 8 ? "Watch it work" : n === 9 ? "Decode the pitch" : "Before the session";

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

// ---------- Everyday mock-ups: a phone, a chat bubble, an AI assistant window ----------

/** A phone, for the Tuesday scenes. */
export function Phone({ children, x, y, title }: { children: ReactNode; x: number; y: number; title: string }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 440, height: 660, borderRadius: 56, background: theme.brandPrimary, padding: 16, boxShadow: "0 30px 60px rgba(12,53,83,0.25)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 42, background: theme.paper, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "26px 24px 14px", borderBottom: `2px solid ${theme.line}`, fontSize: 26, fontWeight: 700, color: theme.brandPrimary, textAlign: "center" }}>{title}</div>
        <div style={{ flex: 1, padding: 22, display: "flex", flexDirection: "column", gap: 14, justifyContent: "flex-end" }}>{children}</div>
      </div>
    </div>
  );
}

/** A chat bubble: "me" on the right in WCB blue, others on the left in white. */
export function Bubble({ children, me, style }: { children: ReactNode; me?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        alignSelf: me ? "flex-end" : "flex-start",
        maxWidth: "88%",
        padding: "14px 20px",
        borderRadius: 24,
        borderBottomRightRadius: me ? 6 : 24,
        borderBottomLeftRadius: me ? 24 : 6,
        background: me ? theme.agent : theme.brandTint,
        color: me ? theme.paper : theme.ink,
        fontSize: 28,
        lineHeight: 1.3,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** An AI assistant's window, for the three demos. Always marked illustrative: these are made-up examples. */
export function AssistantWindow({ children, x, y, w, h, prompt }: { children: ReactNode; x: number; y: number; w: number; h: number; prompt: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 24, background: theme.paper, border: `3px solid ${theme.brandSky}`, boxShadow: "0 20px 40px rgba(12,53,83,0.12)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", background: theme.brandTint }}>
        {[theme.risk, theme.brandAccent, theme.humanLight].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 10, fontSize: 24, fontWeight: 700, color: theme.brandPrimary }}>AI assistant</span>
        <span style={{ marginLeft: "auto", fontSize: 20, fontWeight: 700, color: theme.brandDeep, background: theme.paper, borderRadius: 999, padding: "4px 14px" }}>Illustrative</span>
      </div>
      <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <Bubble me style={{ fontSize: 26 }}>
          {prompt}
        </Bubble>
        {children}
      </div>
    </div>
  );
}

/** A small rounded label. */
export function Tag({ children, tone = "agent", style }: { children: ReactNode; tone?: "agent" | "human" | "risk" | "gold" | "plain"; style?: CSSProperties }) {
  const bg = { agent: theme.agent, human: theme.human, risk: theme.risk, gold: theme.brandAccent, plain: theme.paper }[tone];
  const fg = tone === "plain" || tone === "gold" ? theme.brandPrimary : theme.paper;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 999, background: bg, color: fg, border: tone === "plain" ? `3px solid ${theme.brandSky}` : "none", fontSize: 28, fontWeight: 700, ...style }}>
      {children}
    </span>
  );
}
