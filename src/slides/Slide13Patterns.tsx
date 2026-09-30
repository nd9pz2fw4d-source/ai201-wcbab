import { motion } from "framer-motion";
import { Headline } from "../components/Text";
import { theme } from "../theme";

// Deterministic "random" so the picture is the same every time.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const DOTS = 104;
const clusters = [
  { x: 360, y: 470, gold: true },
  { x: 760, y: 400, gold: false },
  { x: 1160, y: 470, gold: true },
  { x: 1560, y: 400, gold: false },
  { x: 360, y: 790, gold: false },
  { x: 760, y: 740, gold: true },
  { x: 1160, y: 800, gold: true },
  { x: 1560, y: 730, gold: true },
];

const dots = (() => {
  const r = rng(7);
  return Array.from({ length: DOTS }, (_, i) => {
    const c = clusters[i % clusters.length];
    const a = r() * Math.PI * 2;
    const d = 18 + r() * 58;
    return {
      sx: 90 + r() * 1740,
      sy: 250 + r() * 700,
      cx: c.x + Math.cos(a) * d,
      cy: c.y + Math.sin(a) * d * 0.85,
      delay: r() * 0.5,
    };
  });
})();

export default function Slide13Patterns() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[120px] top-[90px]">
        <Headline>100+ ideas. About 8 patterns.</Headline>
      </div>
      <svg className="absolute inset-0" width={1920} height={1080}>
        {clusters.map((c, i) => (
          <motion.circle
            key={`g${i}`}
            cx={c.x}
            cy={c.y}
            r={100}
            fill={c.gold ? theme.brandAccent : theme.brandSecondary}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: c.gold ? 0.22 : 0.1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          />
        ))}
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            r={9}
            fill={theme.brandSecondary}
            initial={{ cx: d.sx, cy: d.sy, opacity: 0 }}
            animate={{ cx: [d.sx, d.sx, d.cx], cy: [d.sy, d.sy, d.cy], opacity: [0, 1, 0.9] }}
            transition={{ duration: 1.9, times: [0, 0.35, 1], delay: d.delay * 0.4, ease: "easeInOut" }}
          />
        ))}
        {clusters.map((c, i) =>
          c.gold ? (
            <motion.circle
              key={`c${i}`}
              cx={c.x}
              cy={c.y}
              fill={theme.brandAccent}
              stroke="#fff"
              strokeWidth={5}
              initial={{ r: 0 }}
              animate={{ r: 36 }}
              transition={{ delay: 1.9 + i * 0.05, type: "spring", stiffness: 200, damping: 12 }}
            />
          ) : null,
        )}
      </svg>
    </div>
  );
}
