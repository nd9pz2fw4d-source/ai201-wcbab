import { motion } from "framer-motion";
import { signposts } from "../data/teaching";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

// Near signposts are large and low; far ones small and high, toward the horizon.
const spots = [
  { x: 470, y: 820, s: 1 },
  { x: 1450, y: 800, s: 1 },
  { x: 660, y: 600, s: 0.86 },
  { x: 1270, y: 590, s: 0.86 },
  { x: 960, y: 470, s: 0.74 },
];

export default function SlideWhereGoing() {
  return (
    <TeachLayout strand="where" headline="Five things to watch">
      {/* Horizon and road */}
      <div className="absolute inset-x-0 bottom-0 top-[360px]" style={{ background: "linear-gradient(180deg, #FFF3DE 0%, #F2FAFE 45%)" }} />
      <svg className="absolute inset-0" width={1920} height={1080}>
        <motion.path
          d="M700 1080 L940 380 L980 380 L1220 1080 Z"
          fill="#DDEBF4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d="M960 1080 L960 390"
          stroke="#fff"
          strokeWidth={8}
          strokeDasharray="40 30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <circle cx={960} cy={372} r={40} fill={theme.brandAccent} opacity={0.7} />
      </svg>

      {signposts.map((p, i) => {
        const Icon = p.icon;
        const spot = spots[i];
        return (
          <motion.div
            key={p.label}
            className="absolute flex items-center gap-4 rounded-2xl bg-white px-6 py-4"
            style={{
              left: spot.x,
              top: spot.y,
              x: "-50%",
              y: "-50%",
              scale: spot.s,
              boxShadow: `0 0 0 3px ${theme.brandAccent}, 0 14px 34px rgba(12,53,83,0.12)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.28, duration: 0.4 }}
          >
            <span className="grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full" style={{ background: theme.brandAccent }}>
              <Icon size={40} color={theme.brandPrimary} />
            </span>
            <span className="whitespace-nowrap text-[34px] font-medium" style={{ color: theme.brandPrimary }}>
              {p.label}
            </span>
          </motion.div>
        );
      })}
    </TeachLayout>
  );
}
