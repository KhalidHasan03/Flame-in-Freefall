import { FlaskConical, FileText, Layers, Rss } from "lucide-react";

const ICONS = {
  flaskConical: FlaskConical,
  fileText: FileText,
  layers: Layers,
  rss: Rss,
};

/**
 * The four counts a reader of this dashboard should have immediately.
 *
 * These used to be `PROTOTYPE_METRICS` from `lib/constants` — "1,240+ experiments", "380+ papers",
 * "18 key variables", "342 AI insights" — displayed as large figures under a "Prototype figure"
 * label. Every one of those numbers described a dataset that does not exist here. The disclosure
 * was technically accurate and practically useless: a headline figure is read as a fact about what
 * the product holds, and nobody reads the small print before quoting it.
 *
 * So the strip now counts the loaded records instead. Same visual slot, same instrument-channel
 * treatment, four numbers that are true of this build and that update themselves when the
 * demonstration records are replaced by a real API response.
 *
 * Each cell is numbered positionally from the array index, so adding or removing a metric
 * renumbers the strip automatically rather than leaving a gap.
 */
export default function MetricStrip({ dataset }) {
  const metrics = [
    { id: "records", label: "Records", value: dataset.records, unit: "indexed", icon: "flaskConical" },
    { id: "sources", label: "Sources", value: dataset.sources, unit: "cited", icon: "fileText" },
    {
      id: "variables",
      label: "Variables",
      value: dataset.variablesPerRecord,
      unit: "per record",
      icon: "layers",
    },
    {
      id: "programs",
      label: "Programs",
      value: dataset.programs,
      unit: `across ${dataset.destinations} destinations`,
      icon: "rss",
    },
  ];

  return (
    <section aria-labelledby="metric-strip-title" className="space-y-3">
      <h2 id="metric-strip-title" className="sr-only">
        Dataset scale
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = ICONS[metric.icon];
          return (
            <div
              key={metric.id}
              className="fx-panel-flat fx-instrument-edge relative space-y-2 overflow-hidden px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="fx-label">{metric.label}</p>
                <Icon className="size-3.5 text-ink-faint" aria-hidden="true" />
              </div>

              <p className="fx-numeric text-2xl font-bold leading-none text-ink">{metric.value}</p>

              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[10px] text-ink-faint">{metric.unit}</p>
                <span
                  aria-hidden="true"
                  className="fx-numeric text-[10px] font-bold tracking-widest text-ink-faint/70"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/*
        Evidence breakdown, printed from the same counts. Kept as a single line of text rather
        than a chart because four numbers do not need one — but it is on the dashboard because the
        grade of the evidence is the single most important qualification on everything else here.
      */}
      <p className="fx-telemetry flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-muted">
        <span className="fx-telemetry-label">Evidence base</span>
        <span className="fx-numeric font-bold text-ink">{dataset.evidence.High}</span>
        <span className="fx-telemetry-label">High</span>
        <span className="fx-numeric font-bold text-ink">{dataset.evidence.Medium}</span>
        <span className="fx-telemetry-label">Medium</span>
        <span className="fx-numeric font-bold text-ink">{dataset.evidence.Limited}</span>
        <span className="fx-telemetry-label">Limited</span>
      </p>
    </section>
  );
}