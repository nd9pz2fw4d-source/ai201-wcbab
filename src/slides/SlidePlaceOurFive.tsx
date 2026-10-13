import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, RotateCcw } from "lucide-react";
import { Interactive, SlideButton } from "../components/Interactive";
import { Headline } from "../components/Text";
import { opportunities } from "../data/opportunities";
import { opportunityTypes, suggestedOpportunityType } from "../data/strategy";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

const LABEL_W = 560;
const COL_W = 280;

/** Click a cell to place each priority opportunity on the ladder. Never advances the slide. */
export default function SlidePlaceOurFive() {
  const [placed, setPlaced] = useSlideState<Record<string, number>>("placeFive", {});
  const suggested = opportunities.every((o) => placed[o.label] === suggestedOpportunityType[o.label]);

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[80px]">
        <Headline>Where do our five sit?</Headline>
      </div>
      <Interactive className="absolute left-[100px] top-[250px] flex flex-col gap-3">
        {/* Column headers: the four kinds of opportunity */}
        <div className="flex">
          <div style={{ width: LABEL_W }} />
          {opportunityTypes.map((t, i) => (
            <div key={t.name} className="flex flex-col items-center px-2 text-center" style={{ width: COL_W }}>
              <span className="text-[22px] font-bold" style={{ color: theme.muted }}>
                {i + 1}
              </span>
              <span className="text-[25px] font-medium leading-tight" style={{ color: theme.brandPrimary }}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
        {opportunities.map((o) => {
          const Icon = o.icon;
          return (
            <div key={o.label} className="flex items-center rounded-2xl bg-white" style={{ boxShadow: "0 1px 0 #C9DDEA" }}>
              <div className="flex items-center gap-4 px-6 py-4" style={{ width: LABEL_W }}>
                <span className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full" style={{ background: theme.brandAccent }}>
                  <Icon size={30} color={theme.brandPrimary} />
                </span>
                <span className="text-[27px] font-medium leading-tight" style={{ color: theme.ink }}>
                  {o.label}
                </span>
              </div>
              {opportunityTypes.map((t, i) => {
                const on = placed[o.label] === i;
                return (
                  <button
                    key={t.name}
                    type="button"
                    data-interactive
                    aria-label={`${o.label}: ${t.name}`}
                    className="grid h-[88px] place-items-center"
                    style={{ width: COL_W }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaced((p) => ({ ...p, [o.label]: on ? -1 : i }));
                    }}
                  >
                    <motion.span
                      className="block h-[46px] w-[46px] rounded-full"
                      style={{ background: on ? theme.agent : "#EEF3F7", boxShadow: on ? "0 0 0 6px rgba(31,181,168,0.2)" : "inset 0 0 0 2px #DDE7EE" }}
                      animate={{ scale: on ? 1 : 0.7 }}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
        <div className="mt-4 flex items-center gap-4">
          <SlideButton tone="gold" className="!py-3 !text-[24px]" onClick={() => setPlaced({ ...suggestedOpportunityType })}>
            <Lightbulb size={26} /> Show a suggested placement
          </SlideButton>
          <SlideButton tone="ghost" className="!py-3 !text-[24px]" onClick={() => setPlaced({})}>
            <RotateCcw size={24} /> Reset
          </SlideButton>
          <AnimatePresence>
            {suggested && (
              <motion.span
                className="ml-4 text-[28px] font-medium"
                style={{ color: theme.brandPrimary }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                A strong first wave. Next: the journey.
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Interactive>
    </div>
  );
}
