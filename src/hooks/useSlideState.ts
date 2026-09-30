import { useCallback, useState } from "react";

const store = new Map<string, unknown>();

/**
 * useState that survives leaving and returning to a slide during the session
 * (vote counts, sort board, reveals). Resets on page reload.
 */
export function useSlideState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => (store.has(key) ? (store.get(key) as T) : initial));
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        store.set(key, v);
        return v;
      });
    },
    [key],
  );
  return [value, set] as const;
}
