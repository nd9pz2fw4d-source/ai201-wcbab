import { useCallback, useEffect, useMemo, useState } from "react";
import type { SessionLength } from "../config";

interface Includable {
  id: string;
  include: SessionLength[];
}

/**
 * The URL hash is the slide's number (1-based) in slides/index.ts, e.g. `#/7`.
 * A slide id also works, e.g. `#/sort`, and is rewritten to the number.
 */
function readHash(slides: Includable[]): number | null {
  const match = window.location.hash.match(/^#\/([\w-]+)/);
  if (!match) return null;
  if (/^\d+$/.test(match[1])) return Number(match[1]) - 1;
  const i = slides.findIndex((s) => s.id === match[1]);
  return i >= 0 ? i : null;
}

export function useDeckNavigation<T extends Includable>(slides: T[], sessionLength: SessionLength) {
  const visible = useMemo(
    () => slides.map((s, i) => (s.include.includes(sessionLength) ? i : -1)).filter((i) => i >= 0),
    [slides, sessionLength],
  );

  // Closest visible slide at or after `i` (or the last visible one).
  const snap = useCallback(
    (i: number) => visible.find((v) => v >= i) ?? visible[visible.length - 1],
    [visible],
  );

  const [index, setIndex] = useState(() => snap(readHash(slides) ?? 0));
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = useCallback(
    (i: number) => {
      const target = snap(Math.max(0, Math.min(slides.length - 1, i)));
      setIndex((current) => {
        if (target !== current) setDirection(target > current ? 1 : -1);
        return target;
      });
    },
    [slides.length, snap],
  );

  const next = useCallback(() => {
    setIndex((current) => {
      const n = visible.find((v) => v > current);
      if (n === undefined) return current;
      setDirection(1);
      return n;
    });
  }, [visible]);

  const prev = useCallback(() => {
    setIndex((current) => {
      const p = [...visible].reverse().find((v) => v < current);
      if (p === undefined) return current;
      setDirection(-1);
      return p;
    });
  }, [visible]);

  const first = useCallback(() => goTo(visible[0]), [goTo, visible]);
  const last = useCallback(() => goTo(visible[visible.length - 1]), [goTo, visible]);

  // A change in session length can hide the current slide: move forward to a visible one.
  useEffect(() => {
    setIndex((current) => snap(current));
  }, [snap]);

  // Keep the URL hash in step so a refresh keeps your place.
  useEffect(() => {
    const hash = `#/${index + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
  }, [index]);

  useEffect(() => {
    const onHash = () => {
      const h = readHash(slides);
      if (h !== null) goTo(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo, slides]);

  const position = visible.indexOf(index); // 0-based among visible slides
  return { index, direction, visible, position, total: visible.length, next, prev, first, last, goTo };
}
