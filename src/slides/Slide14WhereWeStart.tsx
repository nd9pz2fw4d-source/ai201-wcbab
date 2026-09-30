import { motion } from "framer-motion";
import { ClaimJourney, stationXY } from "../components/ClaimJourney";
import { Headline } from "../components/Text";
import { stationIndex } from "../data/journey";
import { opportunities } from "../data/opportunities";
import { theme } from "../theme";

/** Gold markers dropping onto their stations, under the station labels. */
function Markers() {
  return (
    <g>
      {opportunities.map((o, k) => {
        const i = stationIndex(o.station);
        const { x, y } = stationXY(i);
        const Icon = o.icon;
        const top = y + 150;
        return (
          <motion.g
            key={o.label}
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.5 + k * 0.25 }}
          >
            <line x1={x} y1={y + 118} x2={x} y2={top} stroke={theme.brandAccent} strokeWidth={4} />
            <circle cx={x} cy={top + 34} r={34} fill={theme.brandAccent} />
            <Icon x={x - 18} y={top + 16} width={36} height={36} color={theme.brandPrimary} strokeWidth={2.2} />
            <foreignObject x={x - 104} y={top + 76} width={208} height={120}>
              <div
                style={{ color: theme.brandPrimary, fontSize: 24, lineHeight: 1.15, fontWeight: 500, textAlign: "center" }}
              >
                {o.label}
              </div>
            </foreignObject>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function Slide14WhereWeStart() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[120px] top-[80px]">
        <Headline>Where we start</Headline>
      </div>
      <div className="absolute left-[80px] top-[230px]">
        <ClaimJourney era={4} marks={false} position={1} pages={3} labelSize={24} overlayTop={<Markers />} />
      </div>
    </div>
  );
}
