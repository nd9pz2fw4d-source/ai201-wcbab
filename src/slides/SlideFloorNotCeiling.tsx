import { motion } from "framer-motion";
import { Hand, Sparkles } from "lucide-react";
import { ClaimJourney } from "../components/ClaimJourney";
import { handsOnOneClaim } from "../data/claimFacts";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";
import { riskRoles } from "./riskJourney";

const panel = "absolute top-[280px] flex h-[660px] w-[820px] flex-col rounded-3xl bg-white p-9 shadow-[0_1px_0_#C9DDEA,0_14px_36px_rgba(12,53,83,0.08)]";
const outcomes = ["Time to decision", "Return to work", "Worker experience"];

export default function SlideFloorNotCeiling() {
  return (
    <TeachLayout strand="where" headline="Copilot is the floor, not the ceiling">
      {/* Personal productivity: every hand a little faster, same journey */}
      <motion.div className={`${panel} left-[100px]`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="text-[36px] font-bold" style={{ color: theme.brandPrimary }}>
          Faster hands
        </div>
        <div className="mt-6 grid grid-cols-6 gap-x-6 gap-y-5 self-center">
          {Array.from({ length: handsOnOneClaim }, (_, i) => (
            <motion.span
              key={i}
              className="relative grid h-[72px] w-[72px] place-items-center rounded-full"
              style={{ background: theme.human }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <Hand size={38} color="#fff" />
              <span className="absolute -right-2 -top-2 grid h-[32px] w-[32px] place-items-center rounded-full bg-white" style={{ boxShadow: `0 0 0 3px ${theme.agent}` }}>
                <Sparkles size={18} color={theme.agent} />
              </span>
            </motion.span>
          ))}
        </div>
        <div className="mt-4 self-center">
          <ClaimJourney era={3} width={720} labels={false} travel="loop" speed="medium" pages={2} />
        </div>
        <div className="mt-auto text-[30px] font-medium" style={{ color: theme.muted }}>
          Each person a bit faster. Same journey.
        </div>
      </motion.div>

      {/* Transformation: the journey itself is redesigned */}
      <motion.div className={`${panel} left-[1000px]`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="text-[36px] font-bold" style={{ color: theme.agent }}>
          A better journey
        </div>
        <div className="mt-6 self-center">
          <ClaimJourney era={5} width={720} labels={false} travel="loop" speed="fast" extraClaims={1} stationRoles={riskRoles} humanCheckpoints={["entitlement", "close"]} pages={2} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {outcomes.map((o, i) => (
            <motion.span
              key={o}
              className="rounded-full px-5 py-2 text-[24px] font-medium text-white"
              style={{ background: theme.agent }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
            >
              {o}
            </motion.span>
          ))}
        </div>
        <div className="mt-auto text-[30px] font-medium" style={{ color: theme.brandPrimary }}>
          Work redesigned. Outcomes change.
        </div>
      </motion.div>
    </TeachLayout>
  );
}
