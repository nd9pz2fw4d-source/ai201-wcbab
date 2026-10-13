import { AnimatePresence, motion } from "framer-motion";
import { Eye, Pause, Play, RotateCcw, SkipForward, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { ClaimJourney } from "../components/ClaimJourney";
import { Interactive, SlideButton } from "../components/Interactive";
import { Headline } from "../components/Text";
import { liveTrace } from "../data/agentTraces";
import { stationIndex } from "../data/journey";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

// Slow enough for the presenter to narrate each step. The one sequence that runs longer than 2.5 seconds.
const STEP_MS = 3500;

/** A small stop sign. */
function StopSign({ size, filled, count }: { size: number; filled: boolean; count?: number }) {
  const r = size / 2;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) * (2 * i + 1);
    return `${r + r * Math.cos(a)},${r + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size}>
      <polygon points={pts} fill={filled ? theme.risk : "#fff"} stroke={filled ? theme.risk : "#D7C9C9"} strokeWidth={3} />
      <text x={r} y={r + size * 0.13} textAnchor="middle" fontSize={count ? size * 0.42 : size * 0.26} fontWeight={700} fill={filled ? "#fff" : "#C9B5B5"}>
        {count ? count : "STOP"}
      </text>
    </svg>
  );
}

/** The trace plays in order; the room votes stop signs onto steps where a person should step in. */
export default function Slide10LiveMoment() {
  const [shown, setShown] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [votes, setVotes] = useSlideState<Record<number, number>>("live:votes", {});
  const [suggest, setSuggest] = useSlideState("live:suggest", false);
  const done = shown >= liveTrace.length;

  useEffect(() => {
    if (!playing || done) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, shown, done]);

  const current = liveTrace[shown - 1];
  const vote = (i: number, d: number) => setVotes((v) => ({ ...v, [i]: Math.max(0, (v[i] ?? 0) + d) }));

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[60px]">
        <Headline>Where should a person step in?</Headline>
      </div>

      <Interactive className="absolute left-[100px] top-[190px] flex w-[1120px] flex-col gap-[6px]">
        <AnimatePresence initial={false}>
          {liveTrace.slice(0, shown).map((s, i) => {
            const n = votes[i] ?? 0;
            const hint = suggest && s.stepInHint;
            const isCurrent = i === shown - 1 && !done;
            return (
              <motion.div
                key={i}
                className="flex h-[62px] items-center gap-4 rounded-xl bg-white pl-4 pr-2"
                style={{ boxShadow: hint ? `0 0 0 4px ${theme.human}` : isCurrent ? `0 0 0 3px ${theme.agent}` : "0 1px 0 #C9DDEA" }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="w-[72px] text-[22px] tabular-nums" style={{ color: theme.muted }}>
                  {s.time}
                </span>
                <span className="h-[14px] w-[14px] shrink-0 rounded-full" style={{ background: theme.agent }} />
                <span className="flex-1 truncate text-[26px] font-medium" style={{ color: theme.ink }}>
                  {s.text}
                </span>
                {hint && (
                  <span className="flex items-center gap-2 rounded-full px-3 py-1 text-[19px] font-medium text-white" style={{ background: theme.human }}>
                    <UserRound size={18} /> A person steps in
                  </span>
                )}
                <span className="w-[150px] shrink-0 text-right text-[18px]" style={{ color: theme.muted }}>
                  {s.who}
                </span>
                <button
                  type="button"
                  data-interactive
                  aria-label={`Stop sign on: ${s.text}`}
                  title="Click to add a stop sign, right-click to remove one"
                  className="grid h-[54px] w-[54px] shrink-0 place-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    vote(i, 1);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    vote(i, -1);
                  }}
                >
                  <motion.span key={n} initial={{ scale: n ? 1.3 : 1 }} animate={{ scale: 1 }}>
                    <StopSign size={48} filled={n > 0} count={n} />
                  </motion.span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Interactive>

      {/* Where the claim is, and the controls */}
      <div className="absolute right-[70px] top-[200px] flex w-[560px] flex-col items-center gap-8">
        <ClaimJourney era={4} width={560} labels={false} position={stationIndex(current.station)} pages={2} />
        <div className="text-center text-[24px] leading-snug" style={{ color: theme.muted }}>
          Step {shown} of {liveTrace.length}. Click a stop sign where a person should step in.
        </div>
        <Interactive className="flex flex-wrap justify-center gap-3">
          {!done && (
            <SlideButton tone="teal" className="!px-6 !py-3 !text-[22px]" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause size={24} /> : <Play size={24} />} {playing ? "Pause" : "Play"}
            </SlideButton>
          )}
          {!done && (
            <SlideButton tone="ghost" className="!px-6 !py-3 !text-[22px]" onClick={() => setShown((n) => Math.min(liveTrace.length, n + 1))}>
              <SkipForward size={24} /> Next step
            </SlideButton>
          )}
          {done && (
            <SlideButton tone="coral" className="!px-6 !py-3 !text-[22px]" onClick={() => setSuggest((v) => !v)}>
              <Eye size={24} /> {suggest ? "Hide" : "Show"} suggested stops
            </SlideButton>
          )}
          <SlideButton
            tone="ghost"
            className="!px-6 !py-3 !text-[22px]"
            onClick={() => {
              setVotes({});
              setSuggest(false);
              setShown(1);
              setPlaying(true);
            }}
          >
            <RotateCcw size={22} /> Replay
          </SlideButton>
        </Interactive>
      </div>
    </div>
  );
}
