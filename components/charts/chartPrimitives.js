/**
 * Shared Recharts primitives.
 *
 * The aerospace-telemetry treatment lives here rather than being restated in each chart base:
 * a dark plotting surface, fine grid lines, minimal axes with no vertical rules, and telemetry
 * labels in small mono. Defining it once is what stops the three chart bases from drifting apart
 * and from re-implementing the same four prop objects three times.
 *
 * Every value derives from the resolved token map, so charts follow the active palette without
 * hard-coding a hex.
 */

/** Major grid only, drawn behind the data. Vertical rules are omitted — they add noise, not information. */
export function grid(theme) {
  return {
    stroke: theme["fx-grid-line-major"],
    strokeDasharray: "2 4",
    vertical: false,
  };
}

export function axisTick(theme) {
  return {
    fill: theme["fx-ink-faint"],
    fontSize: 10,
    fontFamily: "var(--font-mono)",
  };
}

/**
 * Axis rule. `strokeLinecap: "square"` keeps the 1px line from blurring at fractional widths,
 * which is what makes an axis look soft rather than drawn.
 */
export function axisLine(theme) {
  return { stroke: theme["fx-hairline"], strokeLinecap: "square" };
}

export function tooltipStyle(theme) {
  return {
    background: theme["fx-elevated"],
    border: `1px solid ${theme["fx-hairline-lit"]}`,
    borderRadius: "8px",
    boxShadow: "0 18px 40px -22px rgba(0,0,0,0.9)",
    fontSize: "0.6875rem",
    color: theme["fx-ink"],
    padding: "8px 10px",
  };
}

export function legendStyle(theme) {
  return { paddingTop: 8, fontSize: "0.6875rem", color: theme["fx-ink-muted"] };
}

/** Axis label in the same register as the ticks, so units read as annotation not as a title. */
export function axisLabel(theme, value, position) {
  return {
    value,
    position,
    fill: theme["fx-ink-faint"],
    fontSize: 9,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.08em",
  };
}
