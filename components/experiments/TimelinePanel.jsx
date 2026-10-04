import { Database, FileText, Rocket, Waves, Globe, BookOpen, Activity } from "lucide-react";

const ICONS = { globe: Globe, waves: Waves, rocket: Rocket, activity: Activity, book: BookOpen };

/** Horizontal evidence timeline showing how strongly a result is grounded. */
export default function TimelinePanel({ entries }) {
  if (!entries?.length) {
    return (
      <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-ink-faint">
        No timeline recorded for this experiment.
      </p>
    );
  }

  return (
    <ol className="relative space-y-3 pl-1">
      {entries.map((entry, index) => {
        const Icon = ICONS[entry.icon] ?? Database;
        const last = index === entries.length - 1;
        return (
          <li key={`${entry.stage}-${entry.date}`} className="relative flex gap-3 pb-1">
            <div className="flex flex-col items-center">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-elevated">
                <Icon className="size-3.5 text-brand" aria-hidden="true" />
              </span>
              {!last ? <span className="mt-1 w-px flex-1 bg-line" aria-hidden="true" /> : null}
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="text-xs font-semibold text-ink">{entry.label}</p>
                <span className="fx-numeric text-[10px] text-ink-faint">{entry.date}</span>
              </div>
              <p className="fx-label mt-0.5">{entry.stageLabel}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{entry.detail}</p>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-faint">
                <FileText className="size-3" aria-hidden="true" />
                Evidence weight {(entry.weight * 100).toFixed(0)}%
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}