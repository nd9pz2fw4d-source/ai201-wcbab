import { AnimatePresence, motion } from "framer-motion";
import { Interactive } from "../components/Interactive";
import { myths } from "../data/teaching";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

/** Four flip cards: the presenter clicks each to turn a myth into the reality. */
export default function SlideMyths() {
  const [open, setOpen] = useSlideState<number[]>("myths:open", []);
  return (
    <TeachLayout strand="how" headline="Myth or reality?">
      <Interactive className="absolute left-[100px] top-[290px] grid grid-cols-2 gap-8">
        {myths.map((m, i) => {
          const flipped = open.includes(i);
          return (
            <button
              key={m.myth}
              type="button"
              data-interactive
              className="relative h-[300px] w-[840px]"
              style={{ perspective: 1200 }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={flipped ? "reality" : "myth"}
                  className="absolute inset-0 flex flex-col items-start justify-center gap-4 rounded-3xl px-12 text-left"
                  style={{
                    background: flipped ? theme.agent : "#fff",
                    boxShadow: flipped ? "0 16px 40px rgba(31,181,168,0.3)" : "0 1px 0 #C9DDEA, 0 12px 30px rgba(12,53,83,0.08)",
                  }}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-[24px] font-bold uppercase tracking-[0.2em]" style={{ color: flipped ? "rgba(255,255,255,0.8)" : theme.human }}>
                    {flipped ? "Reality" : "Myth"}
                  </span>
                  <span className="text-[46px] font-medium leading-tight" style={{ color: flipped ? "#fff" : theme.brandPrimary }}>
                    {flipped ? m.reality : m.myth}
                  </span>
                </motion.div>
              </AnimatePresence>
            </button>
          );
        })}
      </Interactive>
    </TeachLayout>
  );
}
