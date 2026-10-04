"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { MAX_COMPARISON_SIZE } from "@/lib/constants";
import { STORAGE_KEYS } from "@/lib/storage";
import usePersistentState from "@/lib/usePersistentState";

const EMPTY_IDS = [];

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [stored, setIds] = usePersistentState(STORAGE_KEYS.compare, EMPTY_IDS);

  // A stored list longer than the cap would come from an older build; trim on read.
  const ids = useMemo(
    () => (Array.isArray(stored) ? stored.slice(0, MAX_COMPARISON_SIZE) : EMPTY_IDS),
    [stored],
  );

  const add = useCallback(
    (id) => {
      let outcome = "added";
      setIds((current) => {
        const list = Array.isArray(current) ? current : EMPTY_IDS;
        if (list.includes(id)) {
          outcome = "present";
          return list;
        }
        if (list.length >= MAX_COMPARISON_SIZE) {
          outcome = "full";
          return list;
        }
        return [...list, id];
      });
      return outcome;
    },
    [setIds],
  );

  const remove = useCallback(
    (id) => setIds((current) => (Array.isArray(current) ? current : EMPTY_IDS).filter((item) => item !== id)),
    [setIds],
  );

  const toggle = useCallback(
    (id) => {
      let outcome = "added";
      setIds((current) => {
        const list = Array.isArray(current) ? current : EMPTY_IDS;
        if (list.includes(id)) {
          outcome = "removed";
          return list.filter((item) => item !== id);
        }
        if (list.length >= MAX_COMPARISON_SIZE) {
          outcome = "full";
          return list;
        }
        return [...list, id];
      });
      return outcome;
    },
    [setIds],
  );

  const clear = useCallback(() => setIds(EMPTY_IDS), [setIds]);

  const reorder = useCallback(
    (from, to) =>
      setIds((current) => {
        const list = Array.isArray(current) ? current : EMPTY_IDS;
        if (to < 0 || to >= list.length || from === to) return list;
        const next = [...list];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      }),
    [setIds],
  );

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      max: MAX_COMPARISON_SIZE,
      isFull: ids.length >= MAX_COMPARISON_SIZE,
      isSelected: (id) => ids.includes(id),
      add,
      remove,
      toggle,
      clear,
      reorder,
    }),
    [ids, add, remove, toggle, clear, reorder],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used inside CompareProvider");
  return context;
}