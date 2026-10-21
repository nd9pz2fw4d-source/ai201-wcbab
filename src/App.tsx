import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { config, plannedMinutes, SESSION_LENGTHS as LENGTHS, type ActId, type SessionLength } from "./config";
import { Controls } from "./components/Controls";
import { Footer } from "./components/Footer";
import { PresenterTimer } from "./components/PresenterTimer";
import { ScaledStage } from "./components/ScaledStage";
import { SlideMenu } from "./components/SlideMenu";
import { SlideSorter } from "./components/SlideSorter";
import { useDeckNavigation } from "./hooks/useDeckNavigation";
import { useFullscreen } from "./hooks/useFullscreen";
import { useIdle } from "./hooks/useIdle";
import { presets, type PresetId } from "./data/presets";
import { slides } from "./slides";
import { toneBackground } from "./theme";

const LENGTH_KEY = "ftc.sessionLength";
const PICK_KEY = "ftc.picked.v2";

// config.ts sets the default. `?length=120` in the URL, or the menu switch, overrides it.
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

/** Slide ids in deck order, keeping only ids that exist. */
const inDeckOrder = (ids: readonly string[]) => slides.filter((s) => ids.includes(s.id)).map((s) => s.id);
const presetIds = (p: PresetId) => inDeckOrder(presets[p].ids);
const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

// The slides to present: the presenter's own pick (slide sorter) kept in this browser, else the
// default preset (unless the URL asks for a length). null = the standard version for the session length.
function initialPick(): string[] | null {
  try {
    const saved = JSON.parse(localStorage.getItem(PICK_KEY) ?? "null");
    // A saved preset is stored by name, so edits to presets.ts still reach it.
    if (typeof saved === "string" && saved in presets) return presetIds(saved as PresetId);
    if (saved === "standard") return null;
    if (Array.isArray(saved)) {
      const ids = inDeckOrder(saved);
      if (ids.length) return ids;
    }
  } catch {
    /* storage unavailable or unreadable */
  }
  // `?length=75` asks for a standard version instead of the default preset.
  if (new URLSearchParams(window.location.search).has("length")) return null;
  return config.defaultPreset ? presetIds(config.defaultPreset) : null;
}

function save(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const INTERACTIVE = "button, a, input, select, textarea, [data-interactive]";
const FOCUSABLE = "button, a, [role='button'], [role='radio'], [tabindex]:not([tabindex='-1'])";

export default function App() {
  const [sessionLength, setSessionLength] = useState<SessionLength>(initialLength);
  const [picked, setPicked] = useState<string[] | null>(initialPick);
  const nav = useDeckNavigation(slides, sessionLength, picked);
  const [sorterOpen, setSorterOpen] = useState(false);
  const fullscreen = useFullscreen();
  const idle = useIdle(2000);
  const [menuOpen, setMenuOpen] = useState(false);
  const [timerOn, setTimerOn] = useState(config.showPresenterTimer);
  const [actSeconds, setActSeconds] = useState<Partial<Record<ActId, number>>>({});

  const slide = slides[nav.index];
  const act = slide.act;

  // Choosing a length means its standard version, so it clears any pick.
  const changeLength = useCallback((l: SessionLength) => {
    setSessionLength(l);
    setPicked(null);
    save(LENGTH_KEY, String(l));
    save(PICK_KEY, JSON.stringify("standard"));
  }, []);

  const pick = useCallback((ids: string[]) => {
    setPicked(ids);
    const preset = (Object.keys(presets) as PresetId[]).find((p) => sameIds(presetIds(p), ids));
    save(PICK_KEY, JSON.stringify(preset ?? ids));
  }, []);
  const pickedPreset = picked ? (Object.keys(presets) as PresetId[]).find((p) => sameIds(presetIds(p), picked)) : undefined;

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
      if (e.defaultPrevented) return; // a control already handled it (e.g. a sort card)
      // Tab to a button, then Space or Enter presses it rather than changing slides.
      if ((k === " " || k === "Enter") && t?.closest(FOCUSABLE)) return;
      if (sorterOpen) {
        if (k === "Escape" || k === "s" || k === "S") setSorterOpen(false);
        return;
      }
      if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " " || k === "Spacebar") {
        e.preventDefault();
        nav.next();
      } else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") {
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
      } else if (k === "s" || k === "S") {
        setMenuOpen(false);
        setSorterOpen(true);
      } else if (k === "t" || k === "T") {
        setTimerOn((o) => !o);
      } else if (k === "Escape") {
        if (menuOpen) setMenuOpen(false);
        else fullscreen.exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav, fullscreen, menuOpen, sorterOpen]);

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
    if (menuOpen || sorterOpen) return;
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
  const shownIds = nav.visible.map((i) => slides[i].id);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`fixed inset-0 select-none ${controlsVisible ? "" : "hide-cursor"}`}
        onClick={onStageClick}
      >
        <ScaledStage background={toneBackground[slide.tone]}>
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
          picked={picked}
          pickedLabel={pickedPreset ? presets[pickedPreset].label : undefined}
          onOpenSorter={() => {
            setMenuOpen(false);
            setSorterOpen(true);
          }}
          timerOn={timerOn}
          onToggleTimer={() => setTimerOn((o) => !o)}
        />

        <SlideSorter
          open={sorterOpen}
          onClose={() => setSorterOpen(false)}
          slides={slides}
          shown={shownIds}
          onPick={pick}
          onStandard={changeLength}
          presets={(Object.keys(presets) as PresetId[]).map((p) => ({ label: presets[p].label, ids: presetIds(p) }))}
          presetLabel={pickedPreset ? presets[pickedPreset].label : undefined}
          sessionLength={sessionLength}
          custom={picked !== null}
        />
      </div>
    </MotionConfig>
  );
}
