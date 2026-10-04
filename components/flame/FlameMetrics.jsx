"use client";

import { PROTOTYPE_LABELS } from "@/lib/constants";
import { calculatePrototypeTrend } from "@/lib/calculations";
import { Flame, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import ProgressBar from "@/components/shared/ProgressBar";

const METRICS = [
  { id: "flameSize", label: "Relative flame size", key: "value", direction: "higher" },
  { id: "flameShape", label: "Elongation vs. spherical", key: "value" },
  { id: "spreadTendency", label: "Flame spread tendency", key: "value" },
  { id: "extinctionTendency", label: "Extinction tendency", key: "value" },
  { id: "detectionDifficulty", label: "Detection difficulty", key: "value" },
];

/** Readout of the demonstration trend model. Nothing here is a measured quantity. */
export default function FlameMetrics({ params, className = "" }) {
  const trend = useMemo(() => calculatePrototypeTrend(params), [params]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-3.5">
        {METRICS.map((metric) => {
          const entry = trend[metric.id];
          return (
            <div key={metric.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-xs text-ink-muted">{metric.label}</span>
                <span className="text-right">
                  <span className="fx-numeric text-xs font-semibold text-ink">{entry.value}%</span>
                  {entry.label ? <span className="ml-1.5 text-[10px] text-ink-faint">{entry.label}</span> : null}
                </span>
              </div>
              <ProgressBar value={entry.value} tone={entry.tone} showValue={false} size="sm" />
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-line bg-elevated/40 px-3 py-2.5">
        <p className="fx-label mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          Modelled trend
        </p>
        <p className="text-xs leading-relaxed text-ink-muted">{trend.observedTrend}</p>
      </div>

      <PrototypeNotice
        compact
        label={PROTOTYPE_LABELS.illustration}
        message="Values come from a demonstration trend model, not from combustion measurements."
      />

      <p className="flex items-center gap-1.5 text-[10px] text-ink-faint">
        <Flame className="size-3" aria-hidden="true" />
        <span className="fx-numeric">model: {trend.model}</span>
      </p>
    </div>
  );
}