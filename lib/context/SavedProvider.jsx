"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import usePersistentState from "@/lib/usePersistentState";

const EMPTY = {
  experiments: [],
  insights: [],
  comparisons: [],
  answers: [],
};

/**
 * Saved items are stored per bucket rather than as one record so clearing one category never
 * discards the others.
 */
const BUCKETS = [
  { id: "experiments", key: STORAGE_KEYS.savedExperiments },
  { id: "insights", key: STORAGE_KEYS.savedInsights },
  { id: "comparisons", key: STORAGE_KEYS.savedComparisons },
  { id: "answers", key: STORAGE_KEYS.savedAnswers },
];

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const [experiments, setExperiments] = usePersistentState(STORAGE_KEYS.savedExperiments, EMPTY.experiments);
  const [insights, setInsights] = usePersistentState(STORAGE_KEYS.savedInsights, EMPTY.insights);
  const [comparisons, setComparisons] = usePersistentState(STORAGE_KEYS.savedComparisons, EMPTY.comparisons);
  const [answers, setAnswers] = usePersistentState(STORAGE_KEYS.savedAnswers, EMPTY.answers);

  const saved = useMemo(
    () => ({ experiments, insights, comparisons, answers }),
    [experiments, insights, comparisons, answers],
  );

  const setters = useMemo(
    () => ({
      experiments: setExperiments,
      insights: setInsights,
      comparisons: setComparisons,
      answers: setAnswers,
    }),
    [setExperiments, setInsights, setComparisons, setAnswers],
  );

  const toggle = useCallback(
    (bucket, item) => {
      const set = setters[bucket];
      if (!set) return;
      set((list) =>
        list.some((entry) => entry.id === item.id)
          ? list.filter((entry) => entry.id !== item.id)
          : [item, ...list],
      );
    },
    [setters],
  );

  const remove = useCallback(
    (bucket, id) => {
      setters[bucket]?.((list) => list.filter((entry) => entry.id !== id));
    },
    [setters],
  );

  const clearBucket = useCallback(
    (bucket) => setters[bucket]?.([]),
    [setters],
  );

  /** Clears the four saved buckets only — settings, comparisons and conversations are untouched. */
  const clearAll = useCallback(() => {
    BUCKETS.forEach(({ id }) => setters[id](EMPTY[id]));
  }, [setters]);

  const value = useMemo(
    () => ({
      saved,
      total: experiments.length + insights.length + comparisons.length + answers.length,
      isSaved: (bucket, id) => (saved[bucket] ?? []).some((entry) => entry.id === id),
      toggle,
      remove,
      clearBucket,
      clearAll,
    }),
    [saved, experiments, insights, comparisons, answers, toggle, remove, clearBucket, clearAll],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used inside SavedProvider");
  return context;
}