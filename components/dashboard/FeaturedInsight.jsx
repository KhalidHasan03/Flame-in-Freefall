import Link from "next/link";
import { ArrowUpRight, FileText, Quote } from "lucide-react";
import Badge from "@/components/shared/Badge";
import Keyline from "@/components/shared/Keyline";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SaveButton from "@/components/shared/SaveButton";
import SectionHeader from "@/components/shared/SectionHeader";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import { formatScore } from "@/lib/formatters";

/*
  Labels for the recorded conditions.

  Not title-cased from the key. The records spell these in camelCase for code, and rendering
  `flameSpread` or `extinctionBehavior` as a field label puts an implementation detail in front of
  the reader — it reads as a bug even when the value beside it is correct. Spelling them out also
  settles the awkward cases properly: "Extinction behaviour", not "Extinction Behavior", matching
  the rest of the interface.

  Anything not listed falls back to a spaced, capitalised key, so a new variable shows up with a
  slightly raw label rather than being dropped.
*/
const VARIABLE_LABELS = {
  fuel: "Fuel",
  gravity: "Gravity",
  oxygen: "Oxygen",
  pressure: "Pressure",
  flow: "Airflow",
  temperature: "Initial temperature",
  flameDuration: "Flame duration",
  flameSpread: "Lateral spread",
  extinctionBehavior: "Extinction behaviour",
  luminosity: "Luminosity",
  sooting: "Sooting",
  oxygenConcentration: "Oxygen concentration",
};

function label(key) {
  const known = VARIABLE_LABELS[key];
  if (known) return known;
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/**
 * One record, in full, rather than a list of six summaries.
 *
 * The dashboard previously led with `RecentInsightsPanel`, which stacked six cards of
 * id / topic / badge / one-line summary / relevance score. Every one of them asked the reader to
 * make a decision before they had any context, and the list was drawn from a hardcoded array in
 * `lib/api/dashboard.js` rather than from the records themselves.
 *
 * This panel takes the single record the selector in `lib/api/dashboard.js` already chose — the
 * highest-scoring High-evidence orbital record that carries a source — and gives it room: the
 * finding in full, the measured conditions, and the source count. One thing, readable, with the
 * route to the other twenty-five underneath it.
 *
 * The record arrives whole rather than projected, because every field rendered here is read
 * directly off it. Trimming it at the API boundary would mean maintaining a dashboard-shaped
 * subset of an experiment record, which is the thing most likely to go stale.
 */
export default function FeaturedInsight({ record }) {
  if (!record) return null;

  /*
    The conditions are rendered from `variables` by key rather than by a fixed list, so a new
    recorded variable appears here without a change to this file.
  */
  const conditions = Object.entries(record.variables ?? {});
  const sourceCount = record.sourceIds?.length ?? 0;

  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionHeader
        eyebrow="Lead record"
        icon={Quote}
        title="Highest-evidence orbital finding"
        description="Selected by a fixed rule — traceable to a source, graded High evidence, orbital, highest evidence score — so the dashboard's lead is reproducible rather than curated."
        action={
          <Link href={`/experiments/${record.id}`} className="fx-btn fx-btn-ghost h-7 px-2 text-[11px]">
            Full record
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          href={`/experiments/${record.id}`}
          className="fx-numeric text-sm font-bold text-brand hover:underline"
        >
          {record.id}
        </Link>
        <Badge tone="neutral">{record.topic}</Badge>
        <Badge tone="info">{record.evidenceLevel} evidence</Badge>
        <Badge tone="neutral">{record.program}</Badge>
        <SaveButton
          bucket="insights"
          item={{ id: record.id, title: record.title, topic: record.topic }}
          labelKey="title"
          size="sm"
        />
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-ink">
          {record.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{record.keyFinding}</p>
      </div>

      <Keyline />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="fx-label">Recorded conditions</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3">
            {conditions.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="fx-telemetry-label">{label(key)}</dt>
                <dd className="text-xs font-medium leading-snug text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex shrink-0 items-center gap-5 sm:flex-col sm:items-end sm:gap-2">
          <div className="text-right">
            <p className="fx-telemetry-label">Evidence score</p>
            <p className="fx-numeric text-2xl font-bold leading-none text-ink">
              {formatScore(record.evidenceScore)}
            </p>
          </div>
          <p className="fx-telemetry flex items-center gap-1.5 text-ink-muted">
            <FileText className="size-3.5 shrink-0" aria-hidden="true" />
            {sourceCount} source{sourceCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <PrototypeNotice compact label={PROTOTYPE_LABELS.dataset} message={PROTOTYPE_LABELS.dataPending} />
    </Panel>
  );
}