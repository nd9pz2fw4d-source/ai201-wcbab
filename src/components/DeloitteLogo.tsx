import { DELOITTE_GREEN, DELOITTE_VIEWBOX, deloitteDot, deloitteWordmark } from "./deloitteLogoPaths";

/** Deloitte's logo, drawn from the paths in Deloitte's own SVG. */
export function DeloitteLogo({ height, on = "light" }: { height: number; on?: "light" | "dark" }) {
  return (
    <svg viewBox={DELOITTE_VIEWBOX} height={height} width={(height * 182) / 34} role="img" aria-label="Deloitte">
      {deloitteWordmark.map((d, i) => (
        <path key={`w${i}`} d={d} fill={on === "dark" ? "#FFFFFF" : "#000000"} />
      ))}
      {deloitteDot.map((d, i) => (
        <path key={`d${i}`} d={d} fill={DELOITTE_GREEN} />
      ))}
    </svg>
  );
}
