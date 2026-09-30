// Brand tokens. Every colour in the deck comes from here.
//
// WCB-Alberta values were pulled from wcb.ab.ca on 2026-09-30:
//   - logo SVG (/assets/images/WCB-logo.svg): letters #80C3E2, text #231F20
//   - site.css: primary blue #3399CC (links, headings), hover blue #117BBC,
//     green #98C857 (list accents), gold #FBB43A (active steps, help icons),
//     header tint #D3F1FC, footer tint #DAF3FC, body text #494949
//   - font: Roboto (bundled locally, see main.tsx)
// The site has no dark navy, so `brandPrimary` is a deep blue derived from
// WCB blue for stage contrast. // VERIFY with WCB brand team.
export const theme = {
  brandPrimary: "#0C3553", // deep blue: dark backgrounds, headings (derived)
  brandDeep: "#117BBC", // WCB hover / dark blue
  brandSecondary: "#3399CC", // WCB primary blue: shapes, the claim file
  brandSky: "#80C3E2", // WCB logo blue
  brandAccent: "#FBB43A", // WCB gold: key moments, calls to action
  brandLight: "#F2FAFE", // soft WCB tint: light backgrounds
  brandTint: "#D3F1FC", // WCB header tint
  brandGreen: "#98C857", // WCB green: "back at work"
  ink: "#16334A", // body text on light
  muted: "#5B7085", // secondary text
  paper: "#FFFFFF",
  line: "#C9DDEA", // quiet lines on light backgrounds

  // Meaning colours
  human: "#E07A5F", // a person deciding
  agent: "#1FB5A8", // AI or agents
  risk: "#D64545", // risk moments only
} as const;

export type ThemeToken = keyof typeof theme;

// CSS variable names used by Tailwind (see tailwind.config.ts).
export const cssVars: Record<string, string> = {
  "--brand-primary": theme.brandPrimary,
  "--brand-deep": theme.brandDeep,
  "--brand-secondary": theme.brandSecondary,
  "--brand-sky": theme.brandSky,
  "--brand-accent": theme.brandAccent,
  "--brand-light": theme.brandLight,
  "--brand-green": theme.brandGreen,
  "--ink": theme.ink,
  "--muted": theme.muted,
  "--human": theme.human,
  "--agent": theme.agent,
  "--risk": theme.risk,
};

