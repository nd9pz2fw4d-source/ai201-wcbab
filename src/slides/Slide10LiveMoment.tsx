import { motion } from "framer-motion";
import { OctagonX, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { AgentTrace, useTracePlayer } from "../components/AgentTrace";
import { ClaimJourney } from "../components/ClaimJourney";
import { Interactive, SlideButton } from "../components/Interactive";
import { Headline } from "../components/Text";
import { liveTrace } from "../data/agentTraces";
import { stationIndex } from "../data/journey";
import { theme } from "../theme";

// Paced so the room has time to call "stop". The one on-slide sequence that runs longer than 2.5 seconds.
const STEP_MS = 1700;

export default function Slide10LiveMoment() {
  const [paused, setPaused] = useState(false);
  const [stops, setStops] = useState<number[]>([]);
  const [shown, setShown] = useTracePlayer(liveTrace.length, STEP_MS, paused);
  const done = shown >= liveTrace.length;
  const current = liveTrace[Math.max(0, shown - 1)];

  const stop = () => {
    if (paused || shown === 0) return;
    setPaused(true);
    setStops((s) => (s.includes(shown - 1) ? s : [...s, shown - 1]));
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[70px]">
        <Headline>Where should a person step in?</Headline>
      </div>

      <div className="absolute left-[100px] top-[210px]">
        <AgentTrace steps={liveTrace} shown={shown} stopped={stops} rowHeight={68} width={1020} />
      </div>

      <div className="absolute right-[70px] top-[220px] flex w-[700px] flex-col items-center gap-10">
        <ClaimJourney
          era={4}
          width={700}
          labels={false}
          position={stationIndex(current.station)}
          stationRoles={{}}
          pages={2}
        />
        <Interactive className="flex flex-col items-center gap-6">
          <motion.button
            type="button"
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
            disabled={paused || done}
            className="grid h-[250px] w-[250px] place-items-center rounded-full text-white disabled:opacity-50"
            style={{ background: theme.human, boxShadow: "0 18px 40px rgba(224,122,95,0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex flex-col items-center gap-2">
              <OctagonX size={80} strokeWidth={2} />
              <span className="text-[52px] font-bold tracking-wider">STOP</span>
            </span>
          </motion.button>
          <div className="flex h-[70px] gap-4">
            {paused && !done && (
              <SlideButton tone="teal" onClick={() => setPaused(false)}>
                <Play size={28} /> Resume
              </SlideButton>
            )}
            {(done || stops.length > 0) && (
              <SlideButton
                tone="ghost"
                onClick={() => {
                  setStops([]);
                  setPaused(false);
                  setShown(0);
                }}
              >
                <RotateCcw size={26} /> Replay
              </SlideButton>
            )}
          </div>
        </Interactive>
      </div>
    </div>
  );
}
