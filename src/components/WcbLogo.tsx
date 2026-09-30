import { WCB_LOGO_BLUE, WCB_LOGO_TEXT, WCB_LOGO_VIEWBOX, wcbAlberta, wcbLetters, wcbText } from "./wcbLogoPaths";

interface Props {
  height: number;
  /** "dark" for dark backgrounds: the small wordmark text turns white. */
  on?: "light" | "dark";
}

/**
 * WCB-Alberta logo, drawn from the paths in WCB's own SVG, in its own colours.
 * The Alberta outline is white, so on light slides place it on the WCB header tint (as wcb.ab.ca does).
 */
export function WcbLogo({ height, on = "dark" }: Props) {
  return (
    <svg viewBox={WCB_LOGO_VIEWBOX} height={height} width={(height * 266) / 73} role="img" aria-label="WCB-Alberta">
      {wcbLetters.map((d, i) => (
        <path key={`l${i}`} d={d} fill={WCB_LOGO_BLUE} />
      ))}
      {wcbText.map((d, i) => (
        <path key={`t${i}`} d={d} fill={on === "dark" ? "#FFFFFF" : WCB_LOGO_TEXT} />
      ))}
      {wcbAlberta.map((d, i) => (
        <path key={`a${i}`} d={d} fill="#FFFFFF" />
      ))}
    </svg>
  );
}
