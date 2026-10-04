"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readSnapshot, subscribe, writeValue } from "@/lib/storage";

/**
 * `useState` backed by localStorage, implemented as an external-store subscription rather than
 * a write-then-mirror effect. Reads during SSR and the hydration pass return `fallback`, then
 * React re-renders with the stored value once the client store is checked — so there is no
 * hydration mismatch and no cascading render.
 */
export default function usePersistentState(key, fallback, { merge = false } = {}) {
  const getSnapshot = useCallback(() => readSnapshot(key, fallback, merge), [key, fallback, merge]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next) => {
      // Resolve functional updates against the live snapshot so two updates in one tick compose.
      const current = readSnapshot(key, fallback, merge);
      const resolved = typeof next === "function" ? next(current) : next;
      writeValue(key, resolved);
    },
    [key, fallback, merge],
  );

  return [value, setValue];
}