"use client";

/**
 * Page title block.
 *
 * Two treatments, and the choice is about hierarchy rather than preference:
 *
 *   default      a ruled header. Dense data routes — Explore, Compare, Insights, Settings.
 *   variant="console"  corner brackets, display type, telemetry on a rail. Used where the page
 *                      is a station readout rather than a document.
 *
 * `telemetry` is optional and additive either way: pages with a meaningful instrument readout
 * pass it in, pages without are unaffected. It renders under the title on narrow screens and to
 * the right of the actions on wide ones, so the heading never gets squeezed.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  telemetry,
  variant = "default",
  children,
}) {
  const isConsole = variant === "console";

  return (
    <header
      className={
        isConsole
          ? "fx-frame flex flex-wrap items-start justify-between gap-x-8 gap-y-5 pb-6"
          : "flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b border-line pb-5"
      }
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className={`fx-label mb-2 ${isConsole ? "text-brand" : ""}`.trim()}>{eyebrow}</p>
        ) : null}
        <h1
          className={
            isConsole
              ? "font-display text-hud-sm font-semibold tracking-[-0.02em] text-ink"
              : "font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl"
          }
        >
          {title}
        </h1>
        {description ? (
          <p
            className={
              isConsole
                ? "mt-3 max-w-xl text-sm leading-relaxed text-ink-muted"
                : "mt-2 text-sm leading-relaxed text-ink-muted"
            }
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>

      <div className="flex flex-col items-start gap-3">
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        {telemetry ? (
          <div
            className={
              isConsole
                ? "flex flex-wrap items-center gap-x-5 gap-y-2 pl-4"
                : "flex flex-wrap items-center gap-x-4 gap-y-1.5"
            }
            style={isConsole ? { borderLeft: "1px solid var(--fx-hairline)" } : undefined}
          >
            {telemetry}
          </div>
        ) : null}
      </div>
    </header>
  );
}
