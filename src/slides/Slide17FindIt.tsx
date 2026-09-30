import { AnimatePresence, motion } from "framer-motion";
import { ScrollText, ShieldCheck, UserRound, Hand } from "lucide-react";
import { AgentTrace } from "../components/AgentTrace";
import { ClaimJourney, JW, stationXY } from "../components/ClaimJourney";
import { CountdownTimer } from "../components/CountdownTimer";
import { Interactive, SlideButton } from "../components/Interactive";
import { RiskMarker } from "../components/RiskMarker";
import { Headline } from "../components/Text";
import { riskLabels, riskOrder, riskTrace, type RiskId } from "../data/agentTraces";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { riskRoles } from "./riskJourney";

const MINI_LEFT = 1010;
const MINI_TOP = 560;
const MINI_W = 840;
const MS = MINI_W / JW;

const guardrails = [
  { label: "Every step is recorded", station: 2, icon: ScrollText, above: true },
  { label: "A person decides", station: 5, icon: UserRound, above: false },
  { label: "The worker can ask for a human review", station: 7, icon: Hand, above: true },
];

export default function Slide17FindIt() {
  const [revealed, setRevealed] = useSlideState<RiskId[]>("s17:risks", []);
  const [guards, setGuards] = useSlideState("s17:guards", false);
  const last = revealed[revealed.length - 1];
  const focus = last ? riskTrace.findIndex((s) => s.risk === last) : null;

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[64px]">
        <Headline>Find it. Name the owner.</Headline>
      </div>

      <div className="absolute left-[60px] top-[190px]">
        <AgentTrace steps={riskTrace} shown={riskTrace.length} risks={revealed} focus={focus} rowHeight={66} width={900} />
      </div>

      <div className="absolute bottom-[90px] left-[190px] flex items-end gap-10">
        <CountdownTimer minutes={5} size={150} />
        <SlideButton tone="coral" className="mb-[70px]" onClick={() => setGuards((g) => !g)}>
          <ShieldCheck size={30} /> Guardrails
        </SlideButton>
      </div>

      {/* Four risks, hidden behind cards */}
      <Interactive className="absolute left-[1010px] top-[190px] grid grid-cols-2 gap-5">
        {riskOrder.map((id, i) => {
          const open = revealed.includes(id);
          return (
            <button
              key={id}
              type="button"
              data-interactive
              onClick={(e) => {
                e.stopPropagation();
                setRevealed((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
              }}
              className="relative h-[140px] w-[410px]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="open"
                    className="absolute inset-0 grid place-items-center"
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <RiskMarker label={riskLabels[id]} size="sm" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    className="absolute inset-0 grid place-items-center rounded-2xl text-[64px] font-bold"
                    style={{ background: theme.brandPrimary, color: theme.brandAccent }}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {i + 1}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </Interactive>

      {/* Guardrails on the journey */}
      <div className="absolute" style={{ left: MINI_LEFT, top: MINI_TOP }}>
        <ClaimJourney era={4} width={MINI_W} labels={false} showClaim={false} stationRoles={riskRoles} humanCheckpoints={guards ? ["entitlement"] : []} />
      </div>
      <AnimatePresence>
        {guards &&
          guardrails.map((g, k) => {
            const p = stationXY(g.station);
            const x = MINI_LEFT + p.x * MS;
            const y = MINI_TOP + p.y * MS;
            const Icon = g.icon;
            return (
              <motion.div
                key={g.label}
                className="absolute flex w-[230px] flex-col items-center gap-2 text-center"
                style={{
                  left: x,
                  top: g.above ? y - 190 : y + 36,
                  x: "-50%",
                  flexDirection: g.above ? "column" : "column-reverse",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: k * 0.2 }}
              >
                <span className="text-[25px] font-medium leading-tight" style={{ color: theme.human }}>
                  {g.label}
                </span>
                <span className="grid h-[64px] w-[64px] place-items-center rounded-full" style={{ background: theme.human }}>
                  <Icon size={34} color="#fff" />
                </span>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
