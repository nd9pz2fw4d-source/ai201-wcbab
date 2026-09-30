import { Music } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../brand";
import type { LyricLine } from "../timeline";

/** The sung line, as a caption: many people watch with the sound off. */
export function Caption({ lyrics }: { lyrics: LyricLine[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = lyrics.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const local = t - line.start;
  const opacity = interpolate(local, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 44, pointerEvents: "none" }}>
      <div
        key={line.start}
        style={{
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 18,
          maxWidth: 1600,
          padding: "14px 34px",
          borderRadius: 999,
          background: "rgba(6, 28, 45, 0.78)",
          color: theme.paper,
          fontFamily: "Roboto, sans-serif",
          fontSize: 38,
          fontWeight: 500,
        }}
      >
        <Music size={32} color={theme.brandAccent} strokeWidth={2.5} />
        <span>{line.text}</span>
      </div>
    </AbsoluteFill>
  );
}
