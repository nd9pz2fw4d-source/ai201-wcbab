import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../brand";

interface Props {
  children: ReactNode;
  /** Small label in the top-right corner. */
  chip?: string;
  tone?: "dark" | "dawn";
}

/** A scene's background and frame. */
export function Stage({ children, chip, tone = "dark" }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = Math.sin(frame / fps / 4) * 20;
  const background =
    tone === "dawn"
      ? `radial-gradient(circle at ${30 + drift}% 20%, ${theme.brandDeep} 0%, ${theme.brandPrimary} 60%)`
      : `radial-gradient(circle at ${70 - drift}% 10%, #164a70 0%, ${theme.brandPrimary} 55%)`;

  return (
    <AbsoluteFill style={{ background, fontFamily: "Roboto, sans-serif", color: theme.paper }}>
      <DotGrid />
      {chip && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 80,
            padding: "10px 24px",
            borderRadius: 999,
            border: `2px solid ${theme.brandSky}`,
            color: theme.brandSky,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {chip}
        </div>
      )}
      {children}
    </AbsoluteFill>
  );
}

function DotGrid() {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${theme.brandSky}22 2px, transparent 2px)`,
        backgroundSize: "48px 48px",
      }}
    />
  );
}
