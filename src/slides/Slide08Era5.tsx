import { motion } from "framer-motion";
import { Gavel, Headset, SearchCheck, Stethoscope, FolderOpen } from "lucide-react";
import { ClaimJourney, JW, stationXY } from "../components/ClaimJourney";
import { theme } from "../theme";
import { EraLayout } from "./EraLayout";

// Where the zoomed-out journey sits on the stage.
const LEFT = 250;
const TOP = 300;
const WIDTH = 1420;
const S = WIDTH / JW;

const teams = [
  { label: "Contact centre", icon: Headset, station: 0 },
  { label: "Claims", icon: FolderOpen, station: 2 },
  { label: "Medical review", icon: Stethoscope, station: 4 },
  { label: "Audit", icon: SearchCheck, station: 6 },
  { label: "Appeals", icon: Gavel, station: 7 },
];
const TEAM_Y = 830;
const teamX = (i: number) => 330 + i * 315;

export default function Slide08Era5() {
  return (
    <EraLayout era={5} headline="Not faster steps. A better journey." human={25} ai={75}>
      {/* Teal lines joining the teams to the journey and to each other */}
      <svg className="absolute inset-0" width={1920} height={1080}>
        <motion.line
          x1={teamX(0)}
          y1={TEAM_Y}
          x2={teamX(teams.length - 1)}
          y2={TEAM_Y}
          stroke={theme.agent}
          strokeWidth={5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        />
        {teams.map((t, i) => {
          const s = stationXY(t.station);
          return (
            <motion.path
              key={t.label}
              d={`M${teamX(i)} ${TEAM_Y} C${teamX(i)} ${TEAM_Y - 110} ${LEFT + s.x * S} ${TOP + s.y * S + 190} ${LEFT + s.x * S} ${TOP + s.y * S + 125}`}
              fill="none"
              stroke={theme.agent}
              strokeWidth={3}
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ delay: 1.1 + i * 0.12, duration: 0.8 }}
            />
          );
        })}
      </svg>

      <motion.div
        className="absolute"
        style={{ left: LEFT, top: TOP, transformOrigin: "50% 40%" }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <ClaimJourney
          era={5}
          width={WIDTH}
          labelSize={26}
          travel="loop"
          speed="fastest"
          extraClaims={3}
          stationRoles={{
            report: "assist",
            register: "automate",
            sort: "automate",
            evidence: "assist",
            medical: "assist",
            entitlement: "human",
            benefits: "assist",
            close: "human",
          }}
          humanCheckpoints={["entitlement", "close"]}
          agents={[
            { from: 0, to: 2, duration: 1.1 },
            { from: 2, to: 4, duration: 1.1, delay: 0.3 },
            { from: 4, to: 6, duration: 1.1, delay: 0.6 },
          ]}
          pages={3}
        />
      </motion.div>

      {teams.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.div
            key={t.label}
            className="absolute flex flex-col items-center gap-2"
            style={{ left: teamX(i), top: TEAM_Y - 38, x: "-50%" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <span className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white" style={{ boxShadow: `0 0 0 4px ${theme.agent}` }}>
              <Icon size={38} color={theme.agent} />
            </span>
            <span className="whitespace-nowrap text-[26px] font-medium" style={{ color: theme.ink }}>
              {t.label}
            </span>
          </motion.div>
        );
      })}
    </EraLayout>
  );
}
