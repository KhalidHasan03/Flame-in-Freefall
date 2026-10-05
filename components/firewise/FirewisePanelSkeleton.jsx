/**
 * Placeholder frame for the Firewise route while `FirewiseView` resolves.
 *
 * Exists because `FirewiseView` reads `?ask=` via `useSearchParams`, which makes the route
 * client-rendered and requires a Suspense boundary above it. The boundary needs a fallback, and
 * this is that fallback.
 *
 * Deliberately shaped like `FirewisePanel` rather than a spinner: the header bar, the notice strip
 * and the input footer occupy the same positions and heights they will once the panel mounts, so
 * resolving the boundary does not shift the page. A centred spinner would have been three lines
 * instead of this file and would have made the route visibly jump on every arrival.
 *
 * Uses the existing `fx-skeleton` shimmer from `globals.css` rather than introducing an animation
 * here, so the placeholder matches whatever the design system's loading treatment already is. The
 * whole block is `aria-hidden` and carries a single status message, because a screen reader should
 * hear "loading" once, not announce a dozen decorative bars.
 */
export default function FirewisePanelSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-elevated/40"
    >
      <span className="sr-only">Loading Firewise</span>

      <div aria-hidden="true" className="flex flex-col" style={{ height: "100%" }}>
        {/* Mirrors FirewisePanel's header bar. */}
        <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <div className="fx-skeleton size-4 shrink-0 rounded" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="fx-skeleton h-2.5 w-28 rounded" />
            <div className="fx-skeleton h-2 w-40 rounded" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="fx-skeleton size-7 rounded" />
          </div>
        </div>

        {/* Mirrors FirewisePanel's prototype-notice strip. */}
        <div className="border-b border-line px-3 py-2">
          <div className="fx-skeleton h-3 w-full rounded" />
        </div>

        {/* Mirrors the empty-state area, which is what a first arrival actually sees. */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-8">
          <div className="fx-skeleton size-8 rounded-full" />
          <div className="fx-skeleton h-2.5 w-40 rounded" />
          <div className="fx-skeleton h-2.5 w-64 max-w-full rounded" />
          <div className="fx-skeleton h-2.5 w-48 max-w-full rounded" />
        </div>

        {/* Mirrors FirewisePanel's input footer. */}
        <div className="border-t border-line px-3 py-3">
          <div className="fx-skeleton h-10 w-full rounded-[var(--radius-hud)]" />
        </div>
      </div>
    </div>
  );
}