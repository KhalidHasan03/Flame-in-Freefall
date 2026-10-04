import { Droplets, Flame, Gauge, Thermometer, Wind } from "lucide-react";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import { PROTOTYPE_LABELS } from "@/lib/constants";

const ICONS = { droplets: Droplets, wind: Wind, flame: Flame, gauge: Gauge, thermometer: Thermometer };

/** Reference panel describing the variables that drive fire risk and the levers available. */
export default function RiskPanel({ factors, note }) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionHeader
        eyebrow="Reference"
        title="Key risk factors"
        description="The variables that most strongly determine whether a fire is sustained, and what can be controlled in a closed volume."
        icon={Flame}
      />

      <ul className="space-y-2.5">
        {factors.map((factor) => {
          const Icon = ICONS[factor.icon] ?? Flame;
          return (
            <li key={factor.key} className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-ember/12">
                  <Icon className="size-3.5 text-ember" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-semibold text-ink">{factor.label}</p>
                  <p className="text-[11px] leading-relaxed text-ink-muted">{factor.description}</p>
                  <p className="text-[10px] leading-relaxed text-ink-faint">
                    <span className="font-semibold text-ink-muted">Control: </span>
                    {factor.control}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <PrototypeNotice compact label={PROTOTYPE_LABELS.model} message={note ?? PROTOTYPE_LABELS.riskNote} />
    </Panel>
  );
}