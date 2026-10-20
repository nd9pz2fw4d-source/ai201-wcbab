import { useEffect, useState } from "react";

/** True after `ms` without mouse movement or Tab. */
export function useIdle(ms = 2000) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), ms);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), ms);
    };
    window.addEventListener("mousemove", wake);
    window.addEventListener("pointerdown", wake);
    const onKey = (e: KeyboardEvent) => e.key === "Tab" && wake();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("pointerdown", wake);
    };
  }, [ms]);

  return idle;
}
