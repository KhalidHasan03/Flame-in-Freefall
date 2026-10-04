"use client";

import { Flame } from "lucide-react";
import ProgressBar from "@/components/shared/ProgressBar";
import { RISK_FACTOR_KEYS } from "@/lib/constants";

const LABELS = {
  oxygen: "Oxygen concentration",
  flow: "Flow / convection",
  fuel: "Fuel type",
  pressure: "Pressure",
  temperature: "Temperature",
};

/** Per-factor output of the demonstration risk model, for the selected mission. */
export default function RiskBreakdown({ risk }) {
  const factors = risk.factors.filter((factor) => RISK_FACTOR_KEYS.includes(factor.key));

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5">
        <span className="fx-label flex items-center gap-1.5">
          <Flame className="size-3.5" aria-hidden="true" />
          Factor scores
        </span>
        <span className="text-right">
          <span className="fx-numeric text-xl font-bold text-ember">{risk.overall.value}%</span>
          <span className="ml-1.5 text-[10px] text-ink-faint">{risk.overall.label}</span>
        </span>
      </div>

      <ul className="space-y-2.5">
        {factors.map((factor) => (
          <li key={factor.key}>
            <ProgressBar
              label={LABELS[factor.key] ?? factor.key}
              value={factor.value}
              tone={factor.tone ?? "ember"}
              size="sm"
            />
          </li>
        ))}
      </ul>

      <p className="fx-numeric text-[10px] text-ink-faint">model: {risk.model}</p>
    </div>
  );
}