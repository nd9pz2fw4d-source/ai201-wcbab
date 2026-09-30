import type { Config } from "tailwindcss";

// Colours come from CSS variables set from src/theme.ts, so theme.ts stays the
// single source of truth.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          deep: "var(--brand-deep)",
          sky: "var(--brand-sky)",
          accent: "var(--brand-accent)",
          light: "var(--brand-light)",
          green: "var(--brand-green)",
        },
        ink: "var(--ink)",
        muted: "var(--muted)",
        human: "var(--human)",
        agent: "var(--agent)",
        risk: "var(--risk)",
      },
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
