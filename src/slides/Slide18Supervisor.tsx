import { motion, useReducedMotion } from "framer-motion";
import { BellRing, Eye, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { ClaimJourney, stationXY } from "../components/ClaimJourney";
import { Headline } from "../components/Text";
import type { StationId } from "../data/journey";
import { theme } from "../theme";
import { riskAgents, riskRoles } from "./riskJourney";

const CAUGHT = 3; // "Gather evidence": where the old doctor's note was misread

/** The supervisor agent: a larger teal ring that watches the other agents and flags to a person. */
function Supervisor({ caught }: { caught: boolean }) {
  const reduce = useReducedMotion();
  const start = stationXY(0);
  const end = stationXY(CAUGHT);
  const person = { x: end.x + 250, y: end.y + 175 };
  return (
    <g>
      <motion.g
        initial={{ x: reduce ? end.x : start.x, y: end.y - 310 }}
        animate={{ x: end.x, y: end.y - 310 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      >
        <motion.circle
          r={78}
          fill="rgba(31,181,168,0.08)"
          stroke={theme.agent}
          strokeWidth={7}
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <Eye x={-30} y={-30} width={60} height={60} color={theme.agent} strokeWidth={2} />
        {/* Its gaze to the station below */}
        <path d="M-40 70 L-110 250 L110 250 L40 70 Z" fill={theme.agent} opacity={0.08} />
      </motion.g>

      {caught && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <motion.path
            d={`M${end.x + 50} ${end.y + 30} Q${end.x + 120} ${person.y} ${person.x - 40} ${person.y}`}
            fill="none"
            stroke={theme.human}
            strokeWidth={4}
            strokeDasharray="8 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <g transform={`translate(${person.x} ${person.y})`}>
            <circle r={44} fill={theme.human} />
            <UserRound x={-24} y={-24} width={48} height={48} color="#fff" strokeWidth={2.2} />
            <g transform="translate(40 -40)">
              <circle r={22} fill={theme.brandAccent} />
              <BellRing x={-13} y={-13} width={26} height={26} color={theme.brandPrimary} strokeWidth={2.4} />
            </g>
          </g>
        </motion.g>
      )}
    </g>
  );
}

export default function Slide18Supervisor() {
  const [alerts, setAlerts] = useState<StationId[]>([]);
  useEffect(() => {
    const id = window.setTimeout(() => setAlerts(["evidence"]), 1300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <Headline>Oversight that never sleeps</Headline>
      </div>
      <div className="absolute left-[80px] top-[340px]">
        <ClaimJourney
          era={4}
          position={CAUGHT}
          travel="once"
          stationRoles={riskRoles}
          agents={riskAgents}
          alerts={alerts}
          humanCheckpoints={["entitlement"]}
          pages={3}
          overlayTop={<Supervisor caught={alerts.length > 0} />}
        />
      </div>
    </div>
  );
}
