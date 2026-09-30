import { WCB_LOGO_BLUE, WCB_LOGO_TEXT, WCB_LOGO_VIEWBOX, wcbAlberta, wcbLetters, wcbText } from "./wcbLogoPaths";

// WCB's light-background rendering (their share image, /assets/images/WCB_logo_og.jpg) draws the
// Alberta outline in light grey and the letters a little deeper, so it reads on white with no backing.
const LIGHT_OUTLINE = "#C8C8CB";
const LIGHT_LETTERS = "#64B0E0";

interface Props {
  height: number;
  /** "dark" for dark backgrounds: the small wordmark text turns white. */
  on?: "light" | "dark";
}

/**
 * WCB-Alberta logo, drawn from the paths in WCB's own SVG, on a transparent background.
 * Dark slides: WCB's own SVG colours with a white wordmark. Light slides: WCB's light-background colours.
 */
export function WcbLogo({ height, on = "dark" }: Props) {
  return (
    <svg viewBox={WCB_LOGO_VIEWBOX} height={height} width={(height * 266) / 73} role="img" aria-label="WCB-Alberta">
      {wcbLetters.map((d, i) => (
        <path key={`l${i}`} d={d} fill={on === "dark" ? WCB_LOGO_BLUE : LIGHT_LETTERS} />
      ))}
      {wcbText.map((d, i) => (
        <path key={`t${i}`} d={d} fill={on === "dark" ? "#FFFFFF" : WCB_LOGO_TEXT} />
      ))}
      {wcbAlberta.map((d, i) => (
        <path key={`a${i}`} d={d} fill={on === "dark" ? "#FFFFFF" : LIGHT_OUTLINE} />
      ))}
    </svg>
  );
}
