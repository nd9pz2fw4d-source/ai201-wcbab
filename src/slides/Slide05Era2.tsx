import { motion } from "framer-motion";
import { ChartColumn, TrendingUp } from "lucide-react";
import { ClaimJourney, pointAt, stationXY } from "../components/ClaimJourney";
import { theme } from "../theme";
import { EraLayout } from "./EraLayout";

const SORT = 2;

/** A forecast of incoming volume, hovering over the whole journey. */
function Forecast() {
  const pts: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const t = k / 60;
    const x = pointAt(t).x;
    const y = -70 + 26 * Math.sin(t * 9) + 14 * Math.sin(t * 23);
    pts.push(`${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const line = pts.join(" ");
  const area = `${line} L${pointAt(1).x} -10 L${pointAt(0).x} -10 Z`;
  return (
    <g>
      <motion.path d={area} fill={theme.brandSecondary} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: 0.8, duration: 0.8 }} />
      <motion.path
        d={line}
        fill="none"
        stroke={theme.brandSecondary}
        strokeWidth={4}
        strokeDasharray="10 8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      />
      <g transform={`translate(${pointAt(0).x - 70} -70)`}>
        <circle r={26} fill={theme.brandSecondary} />
        <TrendingUp x={-15} y={-15} width={30} height={30} color="#fff" />
      </g>
    </g>
  );
}

/** Small charts at "Sort and assign" and a complexity score tag on the claim. */
function SortCharts() {
  const { x, y } = stationXY(SORT);
  return (
    <g>
      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}>
        <g transform={`translate(${x - 92} ${y + 4})`}>
          <rect x={-40} y={-30} width={60} height={50} rx={8} fill="#fff" stroke={theme.brandSecondary} strokeWidth={2} />
          {[14, 26, 20, 34].map((h, i) => (
            <rect key={i} x={-33 + i * 12} y={14 - h} width={8} height={h} rx={2} fill={theme.brandSecondary} />
          ))}
        </g>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7, duration: 0.5 }}>
        <g transform={`translate(${x + 100} ${y - 150})`}>
          <rect x={0} y={-30} width={290} height={60} rx={30} fill={theme.brandPrimary} />
          <ChartColumn x={16} y={-14} width={28} height={28} color={theme.brandAccent} />
          <text x={54} y={9} fontSize={24} fontWeight={500} fill="#fff">
            Complexity
          </text>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={212 + i * 24} cy={0} r={9} fill={i < 2 ? theme.brandAccent : "#C9DDEA"} />
          ))}
        </g>
      </motion.g>
    </g>
  );
}

export default function Slide05Era2() {
  return (
    <EraLayout era={2} headline="It could predict. It couldn't read or act." human={90} ai={10}>
      <div className="absolute left-[80px] top-[380px]">
        <ClaimJourney
          era={2}
          travel="once"
          position={SORT}
          speed="medium"
          stationRoles={{ sort: "assist" }}
          pages={3}
          overlay={<Forecast />}
          overlayTop={<SortCharts />}
        />
      </div>
    </EraLayout>
  );
}
