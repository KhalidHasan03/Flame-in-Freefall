"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import usePersistentState from "@/lib/usePersistentState";

/**
 * FlareNexus is a space-dark product: there is no light theme. The immersive research-console
 * identity depends on the deep-space environment, and a pale mode would flatten the depth
 * ladder that every surface treatment is built on. Presentation preferences that survive the
 * change — density, evidence defaults, disclosure, motion — remain user-controlled here.
 */
const DEFAULT_SETTINGS = {
  compactMode: false,
  showEvidenceByDefault: true,
  showPrototypeLabels: true,
  reduceFlameMotion: false,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = usePersistentState(STORAGE_KEYS.settings, DEFAULT_SETTINGS, {
    merge: true,
  });

  /*
   * A pre-light-theme build may have persisted `theme` into the stored settings object. `merge`
   * only fills in missing keys, so the stale one would survive and imply a preference that no
   * longer exists. Dropping it here keeps the stored shape honest. Runs once, then no-ops.
   */
  useEffect(() => {
    if (!("theme" in settings)) return;
    setSettings((current) => {
      const next = { ...current };
      delete next.theme;
      return next;
    });
  }, [settings, setSettings]);

  // Compact mode is a density override in CSS, driven by one attribute on <html>.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (settings.compactMode) root.setAttribute("data-compact", "true");
    else root.removeAttribute("data-compact");
  }, [settings.compactMode]);

  const update = useCallback(
    (patch) => setSettings((current) => ({ ...current, ...patch })),
    [setSettings],
  );

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [setSettings]);

  const value = useMemo(
    () => ({
      settings,
      update,
      reset,
      defaults: DEFAULT_SETTINGS,
      toggleCompact: () => update({ compactMode: !settings.compactMode }),
      setShowEvidence: (next) => update({ showEvidenceByDefault: next }),
      setShowPrototypeLabels: (next) => update({ showPrototypeLabels: next }),
      setReduceFlameMotion: (next) => update({ reduceFlameMotion: next }),
    }),
    [settings, update, reset],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
