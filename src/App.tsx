import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { config, plannedMinutes, type ActId, type SessionLength } from "./config";
import { Controls } from "./components/Controls";
import { Footer } from "./components/Footer";
import { PresenterTimer } from "./components/PresenterTimer";
import { ScaledStage } from "./components/ScaledStage";
import { SlideMenu } from "./components/SlideMenu";
import { useDeckNavigation } from "./hooks/useDeckNavigation";
import { useFullscreen } from "./hooks/useFullscreen";
import { useIdle } from "./hooks/useIdle";
import { slides } from "./slides";
import { theme } from "./theme";

const LENGTHS: SessionLength[] = [60, 75, 90];
const LENGTH_KEY = "ftc.sessionLength";

// config.ts sets the default. `?length=60` in the URL, or the menu switch, overrides it.
function initialLength(): SessionLength {
  const fromQuery = Number(new URLSearchParams(window.location.search).get("length"));
  if (LENGTHS.includes(fromQuery as SessionLength)) return fromQuery as SessionLength;
  try {
    const saved = Number(localStorage.getItem(LENGTH_KEY));
    if (LENGTHS.includes(saved as SessionLength)) return saved as SessionLength;
  } catch {
    /* storage unavailable */
  }
  return config.sessionLength;
}

const stageBackground: Record<"dark" | "light" | "dawn", string> = {
  dark: theme.brandPrimary,
  light: theme.brandLight,
  dawn: theme.brandPrimary,
};

const INTERACTIVE = "button, a, input, select, textarea, [data-interactive]";

export default function App() {
  const [sessionLength, setSessionLength] = useState<SessionLength>(initialLength);
  const nav = useDeckNavigation(slides, sessionLength);
  const fullscreen = useFullscreen();
  const idle = useIdle(2000);
  const [menuOpen, setMenuOpen] = useState(false);
  const [timerOn, setTimerOn] = useState(config.showPresenterTimer);
  const [actSeconds, setActSeconds] = useState<Partial<Record<ActId, number>>>({});

  const slide = slides[nav.index];
  const act = slide.act;

  const changeLength = useCallback((l: SessionLength) => {
    setSessionLength(l);
    try {
      localStorage.setItem(LENGTH_KEY, String(l));
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Presenter timer: time accrues to the act of the slide on screen.
  useEffect(() => {
    const id = window.setInterval(() => setActSeconds((s) => ({ ...s, [act]: (s[act] ?? 0) + 1 })), 1000);
    return () => window.clearInterval(id);
  }, [act]);

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Spacebar") {
        e.preventDefault();
        nav.next();
      } else if (k === "ArrowLeft" || k === "PageUp") {
        e.preventDefault();
        nav.prev();
      } else if (k === "Home") {
        e.preventDefault();
        nav.first();
      } else if (k === "End") {
        e.preventDefault();
        nav.last();
      } else if (k === "f" || k === "F") {
        fullscreen.toggle();
      } else if (k === "m" || k === "M") {
        setMenuOpen((o) => !o);
      } else if (k === "t" || k === "T") {
        setTimerOn((o) => !o);
      } else if (k === "Escape") {
        if (menuOpen) setMenuOpen(false);
        else fullscreen.exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav, fullscreen, menuOpen]);

  // After a mouse click on a button, drop its focus so Space navigates instead of pressing it again.
  useEffect(() => {
    const blur = () => {
      const a = document.activeElement as HTMLElement | null;
      if (a && a.tagName === "BUTTON") a.blur();
    };
    window.addEventListener("pointerup", blur);
    return () => window.removeEventListener("pointerup", blur);
  }, []);

  // One click on the slide background = next slide. Interactive elements never advance.
  const onStageClick = (e: MouseEvent) => {
    if (menuOpen) return;
    if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    nav.next();
  };

  // Progress within the current act, for the progress bar.
  const actProgress = useMemo(() => {
    const inAct = nav.visible.filter((i) => slides[i].act === act);
    return (inAct.indexOf(nav.index) + 1) / Math.max(1, inAct.length);
  }, [nav.visible, nav.index, act]);

  const totalSeconds = Object.values(actSeconds).reduce((a, b) => a + (b ?? 0), 0);
  const SlideComponent = slide.component;
  const controlsVisible = !idle || menuOpen;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`fixed inset-0 select-none ${controlsVisible ? "" : "hide-cursor"}`}
        onClick={onStageClick}
      >
        <ScaledStage background={stageBackground[slide.tone]}>
          <AnimatePresence initial={false} custom={nav.direction}>
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 40 * nav.direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 * nav.direction }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <SlideComponent sessionLength={sessionLength} />
            </motion.div>
          </AnimatePresence>
          <Footer tone={slide.tone} showLogo={!slide.largeLogo} />
        </ScaledStage>

        <Controls
          visible={controlsVisible}
          position={nav.position}
          total={nav.total}
          isFullscreen={fullscreen.isFullscreen}
          onMenu={() => setMenuOpen(true)}
          onFullscreen={fullscreen.toggle}
          sessionLength={sessionLength}
          currentAct={act}
          actProgress={actProgress}
        />

        {timerOn && (
          <PresenterTimer
            act={act}
            actSeconds={actSeconds[act] ?? 0}
            plannedMin={plannedMinutes[sessionLength][act] ?? 0}
            totalSeconds={totalSeconds}
            sessionLength={sessionLength}
            onReset={() => setActSeconds({})}
          />
        )}

        <SlideMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          slides={slides}
          current={nav.index}
          onJump={nav.goTo}
          sessionLength={sessionLength}
          onSessionLength={changeLength}
          timerOn={timerOn}
          onToggleTimer={() => setTimerOn((o) => !o)}
        />
      </div>
    </MotionConfig>
  );
}
