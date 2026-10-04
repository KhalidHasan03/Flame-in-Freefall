import Panel from "@/components/shared/Panel";
import SectionHeader from "@/components/shared/SectionHeader";
import { ListTree, Sparkles } from "lucide-react";

const ROWS = [
  { key: "fuel", label: "Fuel" },
  { key: "gravity", label: "Gravity" },
  { key: "oxygen", label: "Oxygen" },
  { key: "pressure", label: "Pressure" },
  { key: "flow", label: "Flow" },
  { key: "temperature", label: "Temperature" },
  { key: "flameDuration", label: "Flame duration" },
  { key: "flameSpread", label: "Flame spread" },
  { key: "extinctionBehavior", label: "Extinction behaviour" },
];

/** Recorded conditions and observed behaviour for a single experiment. */
export default function VariablesPanel({ experiment }) {
  const variables = experiment.variables ?? {};
  const behaviour = experiment.observedBehavior ?? {};

  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionHeader
        eyebrow="Record"
        icon={ListTree}
        title="Conditions and observed behaviour"
        description="Values as recorded against this experiment."
      />

      <dl className="divide-y divide-line border-y border-line">
        {ROWS.filter((row) => variables[row.key]).map((row) => (
          <div key={row.key} className="grid gap-1 py-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3">
            <dt className="fx-label pt-0.5">{row.label}</dt>
            <dd className="text-xs leading-relaxed text-ink">{variables[row.key]}</dd>
          </div>
        ))}
      </dl>

      {Object.keys(behaviour).length ? (
        <div className="space-y-2">
          <p className="fx-label flex items-center gap-1.5">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Observed behaviour
          </p>
          <dl className="grid gap-2 sm:grid-cols-3">
            {Object.entries(behaviour).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-line bg-elevated/30 px-3 py-2">
                <dt className="fx-label capitalize">{key}</dt>
                <dd className="mt-1 text-[11px] leading-relaxed text-ink-muted">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </Panel>
  );
}