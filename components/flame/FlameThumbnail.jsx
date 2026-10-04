"use client";

import FlameVisual from "./FlameVisual";

/** Compact flame preview used on experiment cards and in the comparison tray. */
export default function FlameThumbnail({ params, className = "", label }) {
  return (
    <div
      className={`fx-grid-bg relative flex items-end justify-center overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface-raised/45 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "radial-gradient(ellipse at 50% 100%, var(--fx-ember), transparent 70%)", opacity: 0.12 }}
      />
      <FlameVisual params={params} animated={false} showBurner={false} className="h-full w-full" />
      {label ? (
        <span className="fx-label absolute left-2 top-2 rounded bg-surface/80 px-1.5 py-0.5 backdrop-blur-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}