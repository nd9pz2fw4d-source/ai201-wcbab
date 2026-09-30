import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** 0 to 1 spring that starts `delay` seconds into the current sequence. */
export const useIn = (delay = 0, damping = 14): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay * fps, fps, config: { damping, mass: 0.8 } });
};

/** Seconds elapsed in the current sequence. */
export const useSeconds = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const fadeUp = (p: number, distance = 40): CSSProperties => ({
  opacity: Math.min(1, p),
  transform: `translateY(${(1 - p) * distance}px)`,
});

export const popIn = (p: number): CSSProperties => ({
  opacity: Math.min(1, p * 1.5),
  transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
});

/** Linear 0 to 1 between two times in seconds, clamped. */
export const progress = (t: number, from: number, to: number): number =>
  interpolate(t, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
