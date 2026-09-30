import { motion } from "framer-motion";
import { CircleCheck, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { AgentTrace, useTracePlayer } from "../components/AgentTrace";
import { ClaimJourney } from "../components/ClaimJourney";
import { SlideButton } from "../components/Interactive";
import { Headline } from "../components/Text";
import { riskTrace } from "../data/agentTraces";
import type { StationId } from "../data/journey";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { riskAgents, riskRoles } from "./riskJourney";

// The error carries forward, station by station.
const spread: { station: StationId; at: number }[] = [
  { station: "evidence", at: 1100 },
  { station: "medical", at: 1500 },
  { station: "entitlement", at: 1900 },
];

export default function Slide16WentWrong() {
  const [alerts, setAlerts] = useState<StationId[]>([]);
  const [revealed, setRevealed] = useSlideState("s16:revealed", false);
  const [shown] = useTracePlayer(riskTrace.length, 260, false, 300);
  const faulty = riskTrace.findIndex((s) => s.faulty);

  useEffect(() => {
    const timers = spread.map((s) => window.setTimeout(() => setAlerts((a) => [...a, s.station]), s.at));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[70px]">
        <Headline>Everything looked right.</Headline>
      </div>

      <div className="absolute left-[20px] top-[250px]">
        <ClaimJourney
          era={4}
          width={1080}
          labelSize={36}
          travel="once"
          position={5}
          stationRoles={riskRoles}
          agents={riskAgents}
          alerts={alerts}
          pages={4}
        />
      </div>

      {/* The recommendation looks confident and clean */}
      <motion.div
        className="absolute left-[330px] top-[720px] flex items-center gap-6 rounded-3xl bg-white px-8 py-6"
        style={{ boxShadow: `0 0 0 3px ${theme.agent}, 0 16px 40px rgba(12,53,83,0.12)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.4 }}
      >
        <CircleCheck size={64} color={theme.agent} strokeWidth={2} />
        <div className="flex flex-col gap-2">
          <span className="text-[34px] font-medium" style={{ color: theme.brandPrimary }}>
            End benefits
          </span>
          <span className="flex items-center gap-3 text-[22px]" style={{ color: theme.muted }}>
            Confidence
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="h-[14px] w-[34px] rounded-full" style={{ background: i < 4 ? theme.agent : "#DDEBF4" }} />
            ))}
          </span>
        </div>
      </motion.div>

      <div className="absolute right-[40px] top-[210px] flex flex-col items-start gap-6">
        <AgentTrace steps={riskTrace} shown={shown} hideFaulty={!revealed} focus={revealed ? faulty : null} rowHeight={70} width={780} risks={revealed ? ["carried"] : []} />
        {!revealed && (
          <SlideButton tone="gold" className="ml-[150px]" onClick={() => setRevealed(true)}>
            <Eye size={28} /> Show the hidden step
          </SlideButton>
        )}
      </div>
    </div>
  );
}
