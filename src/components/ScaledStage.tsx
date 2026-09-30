import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

const StageScaleContext = createContext(1);

/** Current screen pixels per stage pixel. Needed where screen deltas meet stage coordinates (drag and drop). */
export const useStageScale = () => useContext(StageScaleContext);

function fit() {
  return Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
}

/** A 1920x1080 stage, scaled to fit any screen and letterboxed. */
export function ScaledStage({ children, background }: { children: ReactNode; background: string }) {
  const [scale, setScale] = useState(fit);

  useLayoutEffect(() => {
    const onResize = () => setScale(fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#061b2b" }}>
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          marginLeft: -STAGE_W / 2,
          marginTop: -STAGE_H / 2,
          transform: `scale(${scale})`,
          background,
          transition: "background 500ms ease",
        }}
      >
        <StageScaleContext.Provider value={scale}>{children}</StageScaleContext.Provider>
      </div>
    </div>
  );
}
