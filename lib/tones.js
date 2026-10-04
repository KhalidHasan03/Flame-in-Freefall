/**
 * Semantic tone maps.
 *
 * Every status in the app is expressed as text plus an icon through one of these tones, never
 * as colour alone. Keeping the class strings in one file stops the same tone drifting between
 * a badge, a bar and a chart legend.
 *
 * MONOCHROME SCALE. Five of the seven tones are neutral; only `ember`, `alert` and `safe`
 * carry a hue, and each of those three means something specific:
 *
 *   ember   fire, combustion, warnings, and "limited evidence"
 *   alert   critical fire conditions
 *   safe    verified evidence
 *
 * The practical consequence worth stating: `EVIDENCE_TONE` below maps High -> safe,
 * Medium -> signal, Limited -> ember, which in this palette reads as green / grey / amber. A
 * three-step scientific severity scale built from permitted hues, where before the same three
 * tones were green / cyan / orange and the cyan step was carrying no meaning of its own.
 *
 * Because every tone resolves to a `--fx-*` token, the whole map follows the active theme
 * automatically. Charts that need a literal colour resolve the same tokens through
 * `components/charts/useChartTheme.js` rather than hard-coding a hex here.
 */

export const TONES = {
  neutral: {
    text: "text-ink-muted",
    surface: "bg-elevated/60",
    border: "border-line",
    bar: "bg-ink-faint",
  },
  /** Identity and emphasis. White, so it never competes with the reserved status hues. */
  brand: {
    text: "text-ink",
    surface: "bg-ink/10",
    border: "border-ink/25",
    bar: "bg-ink",
  },
  /** Informational context. The quietest of the three neutrals. */
  info: {
    text: "text-ink-faint",
    surface: "bg-ink-faint/10",
    border: "border-ink-faint/30",
    bar: "bg-ink-faint",
  },
  /** Telemetry and evidence. Sits between brand and info on the value scale. */
  signal: {
    text: "text-ink-muted",
    surface: "bg-ink-muted/12",
    border: "border-ink-muted/35",
    bar: "bg-ink-muted",
  },
  ember: {
    text: "text-ember",
    surface: "bg-ember/12",
    border: "border-ember/35",
    bar: "bg-ember",
  },
  alert: {
    text: "text-alert",
    surface: "bg-alert/12",
    border: "border-alert/35",
    bar: "bg-alert",
  },
  safe: {
    text: "text-safe",
    surface: "bg-safe/12",
    border: "border-safe/35",
    bar: "bg-safe",
  },
};

export function tone(name) {
  return TONES[name] ?? TONES.neutral;
}

/*
 * Evidence, confidence and relevance share one scale. `signal` is grey rather than cyan, so
 * "Medium" is now legibly the *absence* of a finding rather than a fourth colour competing
 * with the three that mean something.
 */
export const EVIDENCE_TONE = { High: "safe", Medium: "signal", Limited: "ember" };
export const CONFIDENCE_TONE = { High: "safe", Medium: "signal", Limited: "ember" };
export const RELEVANCE_TONE = { High: "safe", Medium: "signal", Limited: "ember" };