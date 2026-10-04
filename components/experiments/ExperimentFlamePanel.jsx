"use client";

import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import FlameVisual from "@/components/flame/FlameVisual";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import { getFlameProfile } from "@/lib/flameGeometry";
import { useMemo } from "react";

/** Flame rendered from the record's own recorded conditions. */
export default function ExperimentFlamePanel({ experiment }) {
  const params = useMemo(
    () => ({
      gravity: experiment.gravity,
      oxygen: experiment.oxygen,
      pressure: experiment.pressure,
      airflow: experiment.airflow,
      fuel: experiment.fuel,
      temperature: experiment.temperature,
    }),
    [experiment],
  );

  const profile = useMemo(() => getFlameProfile(params), [params]);

  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionHeader
        eyebrow="Illustration"
        icon={Flame}
        title="Reconstructed flame"
        description="Stylised rendering from this record's recorded conditions. Adjust the parameters in Flame Lab to compare."
        action={
          <Link href="/flame-lab" className="fx-btn fx-btn-ghost h-7 px-2 text-[11px]">
            Flame Lab
          </Link>
        }
      />

      <div className="fx-grid-bg relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface-raised/45">
        <FlameVisual params={params} className="h-64 w-full" />
      </div>

      <dl className="grid grid-cols-3 gap-3 border-t border-line pt-3.5">
        {[
          { label: "Sphericity", value: `${Math.round(profile.sphericity * 100)}%` },
          { label: "Luminosity", value: `${Math.round(profile.luminosity * 100)}%` },
          { label: "Elongation", value: `${profile.elongation.toFixed(2)}×` },
        ].map((item) => (
          <div key={item.label}>
            <dt className="fx-label">{item.label}</dt>
            <dd className="fx-numeric mt-0.5 text-sm font-bold text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      <PrototypeNotice
        compact
        label={PROTOTYPE_LABELS.illustration}
        message="Derived from the demonstration geometry model, not from measurements in this record."
      />

      <p className="flex items-center gap-1.5 text-[10px] text-ink-faint">
        <Sparkles className="size-3" aria-hidden="true" />
        Compare against another configuration in Flame Lab.
      </p>
    </Panel>
  );
}