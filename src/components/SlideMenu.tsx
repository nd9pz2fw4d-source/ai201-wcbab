import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { actLabels, actOrder, plannedMinutes, SESSION_LENGTHS, type SessionLength } from "../config";
import type { SlideDef } from "../slides/types";

interface Props {
  open: boolean;
  onClose: () => void;
  slides: SlideDef[];
  current: number;
  onJump: (i: number) => void;
  sessionLength: SessionLength;
  onSessionLength: (l: SessionLength) => void;
  timerOn: boolean;
  onToggleTimer: () => void;
}


export function SlideMenu(p: Props) {
  const plan = plannedMinutes[p.sessionLength];
  const acts = actOrder.filter((a) => p.slides.some((s) => s.act === a));

  return (
    <AnimatePresence>
      {p.open && (
        <>
          <motion.div
            key="scrim"
            className="absolute inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              p.onClose();
            }}
          />
          <motion.nav
            key="panel"
            data-interactive
            aria-label="Slides"
            className="absolute bottom-0 left-0 top-0 z-50 flex w-[400px] max-w-[92vw] flex-col bg-brand-primary text-white shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <div className="text-lg font-medium">Follow the claim</div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={p.onClose}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 px-5 pb-4 text-sm">
              <span className="text-white/60">Minutes</span>
              {SESSION_LENGTHS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => p.onSessionLength(l)}
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 tabular-nums ${
                    l === p.sessionLength ? "bg-brand-accent text-brand-primary" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {l}
                </button>
              ))}
              <button
                type="button"
                onClick={p.onToggleTimer}
                className={`ml-auto whitespace-nowrap rounded-full px-2.5 py-1 ${p.timerOn ? "bg-white/25" : "bg-white/10 hover:bg-white/20"}`}
                title="Presenter timer (T)"
              >
                Timer {p.timerOn ? "on" : "off"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {acts.map((act) => {
                const minutes = plan[act];
                return (
                  <section key={act} className="mb-3">
                    <div className="flex items-baseline justify-between px-2 py-1 text-xs uppercase tracking-wider text-brand-sky">
                      <span>{actLabels[act]}</span>
                      <span className="tabular-nums">{minutes ? `${minutes} min` : "not in this version"}</span>
                    </div>
                    <ul>
                      {p.slides.map((s, i) => {
                        if (s.act !== act) return null;
                        const shown = s.include.includes(p.sessionLength);
                        const isCurrent = i === p.current;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              disabled={!shown}
                              onClick={() => {
                                p.onJump(i);
                                p.onClose();
                              }}
                              aria-current={isCurrent ? "true" : undefined}
                              className={`flex w-full items-baseline gap-3 rounded-lg px-2 py-1.5 text-left text-[15px] ${
                                isCurrent
                                  ? "bg-brand-accent text-brand-primary"
                                  : shown
                                    ? "hover:bg-white/10"
                                    : "cursor-not-allowed text-white/35"
                              }`}
                            >
                              <span className="w-6 shrink-0 text-right tabular-nums opacity-70">{i + 1}</span>
                              <span className="flex-1">{s.title}</span>
                              {!shown && <span className="shrink-0 text-[11px] italic">not in this version</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>

            <div className="border-t border-white/10 px-5 py-3 text-[12px] leading-relaxed text-white/55">
              Click or → next · ← back · Home/End · F full screen · M menu · T timer · Esc close
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
