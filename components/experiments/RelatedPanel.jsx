import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/shared/Badge";
import { EvidenceBadge } from "@/components/shared/StatusBadges";

export default function RelatedPanel({ experiments }) {
  if (!experiments?.length) {
    return (
      <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-ink-faint">
        No related records are declared for this experiment.
      </p>
    );
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {experiments.map((experiment) => (
        <li key={experiment.id}>
          <Link
            href={`/experiments/${experiment.id}`}
            className="fx-panel-flat fx-panel-hover flex h-full flex-col gap-1.5 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="fx-numeric text-[10px] font-bold text-brand">{experiment.id}</span>
              <ArrowUpRight className="size-3 shrink-0 text-ink-faint" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium leading-snug text-ink">{experiment.title}</p>
            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
              <Badge tone="neutral">{experiment.program}</Badge>
              <EvidenceBadge level={experiment.evidenceLevel} showLabel={false} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}