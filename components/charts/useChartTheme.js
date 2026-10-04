"use client";

import { useEffect, useState } from "react";

/**
 * SVG attributes cannot read CSS custom properties, so chart colours are resolved from the DOM
 * once and handed to Recharts as literal hex/rgb strings.
 *
 * The read stays dynamic even though there is only one palette now: it costs a single
 * `getComputedStyle` on mount, and it means a future theme switch needs no change here.
 */
const TOKENS = [
  "fx-brand",
  "fx-brand-vivid",
  "fx-info",
  "fx-signal",
  "fx-ember",
  "fx-ember-deep",
  "fx-safe",
  "fx-alert",
  "fx-ink",
  "fx-ink-muted",
  "fx-ink-faint",
  "fx-line",
  "fx-line-strong",
  "fx-hairline",
  "fx-hairline-lit",
  "fx-elevated",
  "fx-panel",
  "fx-plot",
  "fx-grid-line-major",
  "fx-space-star",
];

/**
 * Matches app/globals.css :root exactly. Used for the first render, before the DOM read lands,
 * so it must be updated in the same change as the tokens themselves — a stale value here shows
 * up as a one-frame flash of the previous palette on every chart.
 */
const FALLBACK = {
  "fx-brand": "#ffffff",
  "fx-brand-vivid": "#ffffff",
  "fx-info": "#808080",
  "fx-signal": "#b8b8b8",
  "fx-ember": "#c77b30",
  "fx-ember-deep": "#a85f1e",
  "fx-safe": "#3f7d58",
  "fx-alert": "#b33a32",
  "fx-ink": "#ffffff",
  "fx-ink-muted": "#b8b8b8",
  "fx-ink-faint": "#808080",
  "fx-line": "#292929",
  "fx-line-strong": "#363636",
  "fx-hairline": "rgb(255 255 255 / 0.09)",
  "fx-hairline-lit": "rgb(255 255 255 / 0.28)",
  "fx-elevated": "#161616",
  "fx-panel": "#111111",
  "fx-plot": "#0b0b0b",
  "fx-grid-line-major": "rgb(255 255 255 / 0.08)",
  "fx-space-star": "rgb(255 255 255 / 0.7)",
};

function readTokens() {
  if (typeof window === "undefined") return FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  const next = {};
  TOKENS.forEach((token) => {
    const value = styles.getPropertyValue(`--${token}`).trim();
    next[token] = value || FALLBACK[token];
  });
  return next;
}

export default function useChartTheme() {
  const [colors, setColors] = useState(FALLBACK);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setColors(readTokens()));
    return () => cancelAnimationFrame(frame);
  }, []);

  return colors;
}
