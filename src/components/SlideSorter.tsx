import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { actLabels, actOrder, SESSION_LENGTHS, type SessionLength } from "../config";
import type { SlideDef } from "../slides/types";
import { toneBackground } from "../theme";
import { STAGE_H, STAGE_W } from "./ScaledStage";

interface Props {
  open: boolean;
  onClose: () => void;
  slides: SlideDef[];
  /** Ids currently in the deck, in deck order. */
  shown: string[];
  onPick: (ids: string[]) => void;
  /** Reset to a standard version (clears the pick). */
  onStandard: (l: SessionLength) => void;
  sessionLength: SessionLength;
  /** True when the presenter has their own pick (not a standard version). */
  custom: boolean;
}

const THUMB_W = 256;
const SCALE = THUMB_W / STAGE_W;

/** A live, non-interactive miniature of one slide. Mounts once it scrolls into view. */
function Thumb({ slide, sessionLength, root }: { slide: SlideDef; sessionLength: SessionLength; root: HTMLElement | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { root, rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [root, seen]);
  const C = slide.component;
  return (
    <div ref={ref} className="relative overflow-hidden" style={{ width: THUMB_W, height: STAGE_H * SCALE, background: toneBackground[slide.tone] }}>
      {seen && (
        <div ref={(el) => el?.setAttribute("inert", "")} aria-hidden className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${SCALE})` }}>
          <C sessionLength={sessionLength} />
        </div>
      )}
    </div>
  );
}

/** Slide sorter: every slide as a thumbnail with a check mark. Checked slides are the ones presented. */
export function SlideSorter(p: Props) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const picked = new Set(p.shown);
  const order = (ids: Set<string>) => p.slides.filter((s) => ids.has(s.id)).map((s) => s.id);
  const toggle = (ids: string[], on: boolean) => {
    const next = new Set(picked);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    p.onPick(order(next));
  };
  const acts = actOrder.filter((a) => p.slides.some((s) => s.act === a));

  return (
    <AnimatePresence>
      {p.open && (
        <motion.div
          key="sorter"
          data-interactive
          role="dialog"
          aria-label="Pick your slides"
          className="absolute inset-0 z-[60] flex flex-col bg-brand-primary text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 px-8 py-5">
            <div>
              <div className="text-2xl font-medium">Pick your slides</div>
              <div className="text-sm text-white/60">
                <span className="tabular-nums">{picked.size}</span> of {p.slides.length} picked
                {p.custom ? " · your own pick" : ` · the ${p.sessionLength}-minute version`}. Only checked slides are presented.
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/60">Start from</span>
              {SESSION_LENGTHS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => p.onStandard(l)}
                  className={`rounded-full px-3 py-1 tabular-nums ${!p.custom && l === p.sessionLength ? "bg-brand-accent text-brand-primary" : "bg-white/10 hover:bg-white/20"}`}
                >
                  {l} min
                </button>
              ))}
              <button type="button" onClick={() => p.onPick(p.slides.map((s) => s.id))} className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">
                All
              </button>
              <button type="button" onClick={() => p.onPick([])} className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">
                None
              </button>
            </div>
            <button
              type="button"
              onClick={p.onClose}
              disabled={picked.size === 0}
              className="ml-auto rounded-full bg-brand-accent px-6 py-2 text-base font-medium text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {picked.size === 0 ? "Pick at least one slide" : `Done · present ${picked.size} slides`}
            </button>
          </header>

          <div ref={setScroller} className="flex-1 overflow-y-auto px-8 pb-10 pt-4">
            {/* Thumbnails are previews only: no motion, so they show each slide settled. */}
            <MotionConfig reducedMotion="always">
              {acts.map((act) => {
                const inAct = p.slides.filter((s) => s.act === act);
                const n = inAct.filter((s) => picked.has(s.id)).length;
                const all = n === inAct.length;
                return (
                  <section key={act} className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggle(inAct.map((s) => s.id), !all)}
                      aria-label={`${all ? "Unpick" : "Pick"} all of ${actLabels[act]}`}
                      className="mb-3 flex items-center gap-3 rounded-lg py-1 pr-3 text-left hover:bg-white/5"
                    >
                      <span className={`grid h-6 w-6 place-items-center rounded-md border-2 ${n ? "border-brand-accent bg-brand-accent text-brand-primary" : "border-white/40"}`}>
                        {all ? <Check size={16} strokeWidth={3} /> : n ? <Minus size={16} strokeWidth={3} /> : null}
                      </span>
                      <span className="text-sm uppercase tracking-wider text-brand-sky">{actLabels[act]}</span>
                      <span className="text-sm tabular-nums text-white/50">
                        {n} of {inAct.length}
                      </span>
                    </button>
                    <ul className="grid gap-5" style={{ gridTemplateColumns: `repeat(auto-fill, ${THUMB_W}px)` }}>
                      {inAct.map((s) => {
                        const on = picked.has(s.id);
                        const number = p.slides.indexOf(s) + 1;
                        const position = p.shown.indexOf(s.id) + 1;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              aria-pressed={on}
                              aria-label={`Pick: ${s.title}`}
                              onClick={() => toggle([s.id], !on)}
                              className={`group relative block w-full overflow-hidden rounded-xl text-left outline-none ring-offset-2 ring-offset-brand-primary transition focus-visible:ring-2 focus-visible:ring-white ${
                                on ? "ring-[3px] ring-brand-accent" : "ring-1 ring-white/15 hover:ring-white/40"
                              }`}
                            >
                              <div className={`transition ${on ? "" : "opacity-35 grayscale"}`}>
                                <Thumb slide={s} sessionLength={p.sessionLength} root={scroller} />
                              </div>
                              {on && (
                                <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs tabular-nums text-white" title="Position in your talk">
                                  {position}
                                </span>
                              )}
                              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-2 text-[13px] leading-snug">
                                <span
                                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                                    on ? "border-brand-accent bg-brand-accent text-brand-primary" : "border-white/60 text-transparent"
                                  }`}
                                >
                                  <Check size={15} strokeWidth={3} />
                                </span>
                                <span className="tabular-nums text-white/40">{number}</span>
                                <span className={on ? "text-white" : "text-white/50"}>{s.title}</span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </MotionConfig>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
