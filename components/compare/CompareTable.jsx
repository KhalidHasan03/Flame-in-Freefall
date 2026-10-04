import { X } from "lucide-react";
import { buildComparisonRows } from "@/lib/calculations";
import Badge from "@/components/shared/Badge";
import DataTable from "@/components/shared/DataTable";
import { EvidenceBadge } from "@/components/shared/StatusBadges";

/**
 * Side-by-side comparison. Columns stay distinct for every field; a differing cell is marked
 * with an icon and the word "differs" so the distinction is not carried by colour alone.
 */
export default function CompareTable({ experiments }) {
  const rows = buildComparisonRows(experiments);

  return (
    <DataTable minWidth="min-w-[860px]" label="Experiment comparison table">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Recorded conditions and conclusions for {experiments.length} selected experiments
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="w-44 px-3 py-2.5">
              <span className="fx-label">Field</span>
            </th>
            {experiments.map((experiment) => (
              <th key={experiment.id} scope="col" className="px-3 py-2.5">
                <span className="fx-numeric block text-xs font-bold text-brand">{experiment.id}</span>
                <span className="mt-0.5 block text-xs font-semibold leading-snug text-ink">
                  {experiment.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-1">
                  <EvidenceBadge level={experiment.evidenceLevel} showLabel={false} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const differs = Boolean(row.difference);
            const normalised = row.values.map((value) => String(value).toLowerCase());
            const distinct = new Set(normalised).size > 1;
            return (
              <tr key={row.field.id} className="border-b border-line/70 last:border-0">
                <th scope="row" className="px-3 py-2.5 align-top">
                  <span className="fx-label">{row.field.label}</span>
                </th>
                {row.values.map((value, index) => {
                  const highlighted = differs && distinct;
                  return (
                    <td
                      key={`${row.field.id}-${experiments[index].id}`}
                      className={`px-3 py-2.5 align-top text-xs leading-relaxed ${
                        highlighted ? "bg-ember/[0.07] text-ink" : "text-ink-muted"
                      }`}
                    >
                      <span>{String(value)}</span>
                      {highlighted ? (
                        <span className="mt-1 block">
                          <Badge tone="ember">differs</Badge>
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </DataTable>
  );
}

export function CompareTableSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="fx-skeleton h-9 rounded" />
      ))}
    </div>
  );
}

export function RemoveColumnButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remove ${label} from comparison`}
      className="fx-btn fx-btn-ghost h-6 w-6 p-0"
    >
      <X className="size-3" aria-hidden="true" />
    </button>
  );
}