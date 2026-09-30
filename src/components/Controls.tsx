import { Maximize, Menu, Minimize } from "lucide-react";
import { actOrder, type ActId, type SessionLength, plannedMinutes } from "../config";
import { theme } from "../theme";

interface Props {
  visible: boolean;
  position: number;
  total: number;
  isFullscreen: boolean;
  onMenu: () => void;
  onFullscreen: () => void;
  sessionLength: SessionLength;
  currentAct: ActId;
  /** Progress through the current act, 0 to 1. */
  actProgress: number;
}

const segmentColor: Record<ActId, string> = {
  opening: theme.brandSky,
  see: theme.brandAccent,
  choose: theme.brandAccent,
  govern: theme.brandAccent,
  discussion: theme.brandSky,
  close: theme.brandSky,
};

export function Controls(p: Props) {
  const plan = plannedMinutes[p.sessionLength];
  const acts = actOrder.filter((a) => plan[a]);
  const currentIdx = acts.indexOf(p.currentAct);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
      style={{ opacity: p.visible ? 1 : 0 }}
    >
      <button
        type="button"
        aria-label="Open slide menu (M)"
        title="Slides (M)"
        onClick={(e) => {
          e.stopPropagation();
          p.onMenu();
        }}
        className="pointer-events-auto absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50"
        style={{ pointerEvents: p.visible ? "auto" : "none" }}
      >
        <Menu size={24} />
      </button>
      <button
        type="button"
        aria-label="Toggle full screen (F)"
        title="Full screen (F)"
        onClick={(e) => {
          e.stopPropagation();
          p.onFullscreen();
        }}
        className="pointer-events-auto absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50"
        style={{ pointerEvents: p.visible ? "auto" : "none" }}
      >
        {p.isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-0.5 text-xs tabular-nums text-white/90 backdrop-blur">
        {p.position + 1} / {p.total}
      </div>

      {/* Progress bar, split by act, widths in proportion to planned minutes. */}
      <div className="absolute inset-x-0 bottom-0 flex h-[5px] gap-[3px]">
        {acts.map((act, i) => {
          const fill = i < currentIdx ? 1 : i === currentIdx ? p.actProgress : 0;
          return (
            <div key={act} className="relative h-full bg-white/15" style={{ flex: plan[act] }} title={act}>
              <div
                className="absolute inset-y-0 left-0 transition-[width] duration-500"
                style={{ width: `${fill * 100}%`, background: segmentColor[act] }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
