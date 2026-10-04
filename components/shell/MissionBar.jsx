"use client";

import { Flame, Orbit, Rss } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { useCompare } from "@/lib/context/CompareProvider";

/**
 * Mission bar.
 *
 * The top strip of the console. One row, two ends, nothing stacked:
 *
 *   left   what this is — the tagline, with the attribution beside it once there is room
 *   right  the Compare action, plus dataset status that earns its place only on wide viewports
 *
 * Deliberately thin. The bar is chrome, and every millimetre it takes is a millimetre the data
 * does not get, so the two tiers the previous version stacked vertically are now one line and the
 * status strip appears at `xl` rather than at `lg`. Dropping it earlier is safe: none of these
 * three facts is navigational, so losing them costs orientation but not function.
 *
 * The status readouts are fixed facts about the dataset rather than live feeds, so they are
 * labelled as such and nothing polls them. A number that drifts from the data it describes is
 * worse than a number that never moves.
 */
const FEED = [
  { id: "morphology", label: "Morphology", detail: "Spherical envelope", tone: "text-ember", Icon: Flame },
  { id: "lunar", label: "Lunar gap", detail: "0.16 g — no data", tone: "text-ink-muted", Icon: Orbit },
  { id: "feed", label: "Evidence", detail: "26 records", tone: "text-ink-muted", Icon: Rss },
];

function Pill() {
  const { count } = useCompare();
  if (!count) return null;
  return (
    <span className="fx-numeric ml-1 rounded-full bg-brand/20 px-1.5 text-[10px] font-bold text-brand">
      {count}
    </span>
  );
}

export default function MissionBar() {
  return (
    <header className="fx-hud relative flex h-10 shrink-0 items-center justify-between gap-3 border-b border-line px-3 sm:px-4">
      <p className="min-w-0 truncate text-[11px] font-medium tracking-[0.02em] text-ink-muted">
        {BRAND.lockup.tagline}
        {/* Attribution is part of the sentence, not a second one, and folds away before it can wrap. */}
        <span className="ml-2 hidden text-ink-faint sm:inline">{BRAND.attribution}</span>
      </p>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-3 xl:flex">
          {FEED.map((item, index) => (
            <span
              key={item.id}
              className={`fx-telemetry ${index === 0 ? "" : "border-l border-line pl-3"}`}
            >
              <item.Icon className={`size-3 shrink-0 ${item.tone}`} aria-hidden="true" />
              <span className="fx-telemetry-label">{item.label}</span>
              <span className="fx-telemetry-value">{item.detail}</span>
            </span>
          ))}
        </div>
        <Link href="/compare" className="fx-btn fx-btn-ghost relative text-xs">
          Compare
          <Pill />
        </Link>
      </div>
    </header>
  );
}
