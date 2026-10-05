import { CircleHelp, FileText, FlaskConical, Layers, Orbit, Rss } from "lucide-react";

/**
 * The dataset, counted. This is the dashboard.
 *
 * `/` used to render seven blocks for roughly two thousand pixels of scroll: a research prompt, an
 * environment overview with a flame envelope, a lead record with nine recorded conditions, three
 * further records, this strip, and a four-card navigation grid. Four of those are now gone, and
 * what remains is the numbers plus links to where the reading happens.
 *
 * So this component stopped being a summary at the bottom of a page and became the page. That is
 * why it is the only thing here with a heading, and why the heading is screen-reader-only: six
 * tiles and a link row do not need a visible title to be legible, but they do need a real one to
 * be navigable.
 *
 * Every figure is counted from the loaded records by `lib/api/dashboard.js`. None of them can be
 * edited without editing the data. The previous headline numbers came from `PROTOTYPE_METRICS` —
 * "1,240+ experiments", "380+ papers", "342 AI insights" — which described a dataset that has
 * never existed in this repository, and they were deleted rather than relabelled.
 *
 * The unit under each figure is the part that carries the honesty. "indexed" and "cited" both
 * read as claims about provenance — they imply something was retrieved, checked and
 * cross-referenced — and for demonstration records neither is true. Every unit below states what
 * was actually done: counted from the loaded set, or authored by the dataset's authors. Nothing
 * in this strip should be quotable as a verified research figure, because nothing in it is one.
 *
 * "Problems" is `researchGaps`, the collection that already backs the Research Gaps tab on
 * /insights and the Unknowns section on /mission-lab. Severity is split into its own figure
 * because three of the five gaps are High and a flat "5" would hide the actionable part. The
 * count is not a metric to be proud of and is not styled as one — it is the reason the site is
 * worth reading, so it sits second, next to the record count it is a judgement about.
 */
export default function MetricStrip({ dataset }) {
  const metrics = [
    {
      id: "records",
      label: "Experiments",
      value: dataset.records,
      unit: "records loaded",
      icon: "flaskConical",
    },
    {
      id: "problems",
      label: "Problems",
      value: dataset.problems,
      unit: `${dataset.problemsHigh} high severity`,
      icon: "help",
      hint: "Open research gaps — questions this dataset cannot currently answer",
    },
    {
      id: "sources",
      label: "Sources",
      value: dataset.sources,
      unit: "listed by the authors",
      icon: "fileText",
    },
    {
      id: "findings",
      label: "Findings",
      value: dataset.findings,
      unit: "across all records",
      icon: "rss",
    },
    {
      id: "missions",
      label: "Missions",
      value: dataset.missions,
      unit: `${dataset.missions - dataset.missionsWithRecords} without records`,
      icon: "orbit",
      hint: "Destinations modelled, and how many have no experimental data at their gravity",
    },
    {
      id: "variables",
      label: "Variables",
      value: dataset.variablesPerRecord,
      unit: "recorded per record",
      icon: "layers",
    },
  ];

  const ICONS = {
    flaskConical: FlaskConical,
    fileText: FileText,
    rss: Rss,
    orbit: Orbit,
    layers: Layers,
    help: CircleHelp,
  };

  return (
    <section aria-labelledby="metric-strip-title" className="space-y-2.5">
      <h2 id="metric-strip-title" className="sr-only">
        Dataset scale and open problems
      </h2>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric, index) => {
          const Icon = ICONS[metric.icon];
          return (
            <div
              key={metric.id}
              className="fx-panel-flat fx-instrument-edge relative space-y-1.5 overflow-hidden px-3.5 py-3"
              title={metric.hint}
            >
              <div className="flex items-center justify-between gap-1.5">
                <p className="fx-label">{metric.label}</p>
                <Icon className="size-3 text-ink-faint" aria-hidden="true" />
              </div>

              <p className="fx-numeric text-xl font-bold leading-none text-ink">{metric.value}</p>

              <div className="flex items-center justify-between gap-1.5">
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
        than a chart because three numbers do not need one — but it is on the dashboard because
        the grade of the evidence is the single most important qualification on everything here.
        Ten High against four Limited is the fact that should temper every other figure on this
        page, so it sits directly beneath them rather than behind a link.
      */}
      <p className="fx-telemetry flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
        <span className="fx-telemetry-label">Evidence</span>
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