import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { Interactive, SlideButton } from "./Interactive";

export interface VoteOption {
  id: string;
  label: string;
  visual?: ReactNode;
}

/**
 * Large tiles the presenter clicks to count the room's show of hands.
 * Click adds a mark, right-click takes one away. Never advances the slide.
 */
export function VoteTiles({ id, options }: { id: string; options: VoteOption[] }) {
  const [counts, setCounts] = useSlideState<Record<string, number>>(`votes:${id}`, {});
  const max = Math.max(1, ...options.map((o) => counts[o.id] ?? 0));
  const bump = (key: string, d: number) =>
    setCounts((c) => ({ ...c, [key]: Math.max(0, (c[key] ?? 0) + d) }));

  return (
    <Interactive className="flex flex-col items-center gap-10">
      <div className="flex gap-7">
        {options.map((o, i) => {
          const n = counts[o.id] ?? 0;
          const lead = n > 0 && n === max;
          return (
            <motion.button
              key={o.id}
              type="button"
              data-interactive
              onClick={(e) => {
                e.stopPropagation();
                bump(o.id, 1);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                bump(o.id, -1);
              }}
              className="relative flex h-[440px] w-[300px] flex-col items-center overflow-hidden rounded-3xl bg-white pt-9 text-center"
              style={{
                boxShadow: lead ? `0 0 0 5px ${theme.brandAccent}, 0 16px 40px rgba(12,53,83,0.18)` : "0 1px 0 #C9DDEA, 0 10px 30px rgba(12,53,83,0.08)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="grid h-[120px] place-items-center">{o.visual}</div>
              <div className="mt-4 px-5 text-[28px] font-medium leading-tight" style={{ color: theme.brandPrimary }}>
                {o.label}
              </div>
              {/* Marks */}
              <div className="mt-auto flex w-full flex-col items-center gap-3 pb-7">
                <div className="flex min-h-[64px] max-w-[250px] flex-wrap justify-center gap-2">
                  {Array.from({ length: Math.min(n, 24) }, (_, k) => (
                    <motion.span
                      key={k}
                      className="h-[26px] w-[26px] rounded-full"
                      style={{ background: theme.brandAccent }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  ))}
                </div>
                <div className="text-[52px] font-bold tabular-nums leading-none" style={{ color: n ? theme.brandPrimary : "#C9DDEA" }}>
                  {n}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <SlideButton tone="ghost" className="!px-6 !py-2 !text-[22px]" onClick={() => setCounts({})}>
        <RotateCcw size={22} /> Reset
      </SlideButton>
    </Interactive>
  );
}
