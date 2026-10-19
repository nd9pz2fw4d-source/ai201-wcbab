import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../brand";

export interface CaptionLine {
  text: string;
  /** Seconds from the start of the composition. */
  start: number;
  end: number;
  /** Who is speaking, as named in the script. */
  speaker: string;
}

/** Each speaker's name on screen, and its colour. The host is Riphay, who leads the session. */
const speakers: Record<string, { name: string; colour: string }> = {
  Ava: { name: "Ava", colour: theme.brandAccent },
  Sam: { name: "Sam", colour: theme.brandSky },
  Host: { name: "Riphay", colour: theme.brandGreen },
};

/** What is being said, as a caption: many people watch with the sound off. */
export function Caption({ lines }: { lines: CaptionLine[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = lines.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const opacity = interpolate(t - line.start, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 44, pointerEvents: "none" }}>
      <div
        key={line.start}
        style={{
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 18,
          maxWidth: 1640,
          padding: "14px 34px",
          borderRadius: 999,
          background: "rgba(6, 28, 45, 0.82)",
          color: theme.paper,
          fontFamily: "Roboto, sans-serif",
          fontSize: 38,
          fontWeight: 500,
        }}
      >
        <span style={{ flex: "none", color: speakers[line.speaker]?.colour ?? theme.brandSky, fontWeight: 900 }}>{speakers[line.speaker]?.name ?? line.speaker}</span>
        <span>{line.text}</span>
      </div>
    </AbsoluteFill>
  );
}
