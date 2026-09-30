import { RotateCcw } from "lucide-react";
import { actLabels, type ActId } from "../config";
import { theme } from "../theme";

interface Props {
  act: ActId;
  /** Seconds spent in the current act. */
  actSeconds: number;
  /** Planned minutes for the current act. */
  plannedMin: number;
  totalSeconds: number;
  sessionLength: number;
  onReset: () => void;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Small corner display for the presenter's glance. Amber once the act runs 2 minutes over. */
export function PresenterTimer(p: Props) {
  const over = p.actSeconds > (p.plannedMin + 2) * 60;
  return (
    <div
      data-interactive
      onClick={(e) => e.stopPropagation()}
      className="absolute right-4 top-[72px] z-30 flex items-center gap-3 rounded-lg bg-black/45 px-3 py-1.5 text-[13px] tabular-nums text-white/85 backdrop-blur"
      style={{ boxShadow: over ? `inset 0 0 0 2px ${theme.brandAccent}` : undefined }}
    >
      <span>
        <span className="text-white/55">{actLabels[p.act]} </span>
        <span style={{ color: over ? theme.brandAccent : undefined, fontWeight: over ? 700 : 400 }}>
          {mmss(p.actSeconds)}
        </span>
        <span className="text-white/55"> / {p.plannedMin}:00</span>
      </span>
      <span className="text-white/40">·</span>
      <span className="text-white/55">
        {mmss(p.totalSeconds)} / {p.sessionLength}:00
      </span>
      <button type="button" aria-label="Reset presenter timer" title="Reset presenter timer" onClick={p.onReset} className="text-white/50 hover:text-white">
        <RotateCcw size={13} />
      </button>
    </div>
  );
}
