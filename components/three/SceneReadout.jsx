"use client";

import { useMemo } from "react";
import { resolveGravityValue } from "@/lib/flameGeometry";
import Readout from "@/components/shared/Readout";

/**
 * Canvas-anchored telemetry.
 *
 * Deliberately DOM rather than drawn in the scene. Text rendered into a WebGL canvas is not
 * selectable, is announced by nothing, gets blurry at any DPR other than the one it was drawn
 * for, and cannot be read at all by a screen reader. The scene shows the flame; this reports
 * the numbers about it.
 *
 * Anchored to the corners of the scene box rather than floating with the object, because these
 * are fixed reference values, not labels attached to a moving thing.
 *
 * @param {object} props
 * @param {object} props.params
 * @param {string} [props.channel="COMB-01"]
 */
export default function SceneReadout({ params, channel = "COMB-01" }) {
  const gravity = useMemo(() => resolveGravityValue(params.gravity), [params.gravity]);

  const rows = [
    { label: "Channel", value: channel, tone: "brand" },
    { label: "Gravity", value: `${gravity.toFixed(2)} g`, tone: gravity < 0.2 ? "ember" : "signal" },
    { label: "O₂", value: `${params.oxygen ?? 21} %`, tone: "signal" },
    { label: "Flow", value: params.airflow ?? "Low", tone: "signal" },
  ];

  return (
    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
      <div className="pointer-events-auto flex flex-col gap-1.5">
        {rows.map((row) => (
          <Readout key={row.label} label={row.label} value={row.value} tone={row.tone} large={false} />
        ))}
      </div>

      <span className="fx-telemetry-label pointer-events-none text-ink-faint">
        Live · WebGL
      </span>
    </div>
  );
}