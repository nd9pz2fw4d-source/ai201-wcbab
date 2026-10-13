import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { Interactive, SlideButton } from "../components/Interactive";
import { adaptations } from "../data/osOfWork";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

/** Click each row to turn "from" into "to". Never advances the slide. */
export default function SlideAdaptOS() {
  const [open, setOpen] = useSlideState<number[]>("adapt:open", []);
  return (
    <TeachLayout strand="where" headline="How we must adapt">
      <Interactive className="absolute left-[100px] right-[100px] top-[270px] flex flex-col gap-3">
        {adaptations.map((a, i) => {
          const on = open.includes(i);
          return (
            <button
              key={a.area}
              type="button"
              data-interactive
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
              }}
              className="flex h-[88px] items-center gap-6 rounded-2xl bg-white px-8 text-left"
              style={{ boxShadow: on ? `0 0 0 3px ${theme.agent}` : "0 1px 0 #C9DDEA" }}
            >
              <span className="w-[300px] shrink-0 text-[24px] font-medium uppercase tracking-[0.1em]" style={{ color: theme.muted }}>
                {a.area}
              </span>
              <span className="w-[470px] shrink-0 text-[32px]" style={{ color: on ? theme.muted : theme.ink, textDecoration: on ? "line-through" : "none" }}>
                {a.from}
              </span>
              <ArrowRight size={40} color={on ? theme.brandAccent : "#DDE7EE"} strokeWidth={2.6} className="shrink-0" />
              <AnimatePresence mode="wait">
                {on ? (
                  <motion.span key="to" className="text-[32px] font-bold" style={{ color: theme.agent }} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    {a.to}
                  </motion.span>
                ) : (
                  <motion.span key="q" className="text-[30px]" style={{ color: "#C9D6E0" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
        <div className="mt-3 flex gap-4">
          <SlideButton tone="gold" className="!py-3 !text-[24px]" onClick={() => setOpen(adaptations.map((_, i) => i))}>
            <Eye size={26} /> Reveal all
          </SlideButton>
          <SlideButton tone="ghost" className="!py-3 !text-[24px]" onClick={() => setOpen([])}>
            Reset
          </SlideButton>
        </div>
      </Interactive>
    </TeachLayout>
  );
}
