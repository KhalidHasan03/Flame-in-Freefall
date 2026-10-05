"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FlameThumbnail from "@/components/flame/FlameThumbnail";
import Badge from "@/components/shared/Badge";
import CompareToggle from "@/components/shared/CompareToggle";
import SaveButton from "@/components/shared/SaveButton";
import { EvidenceBadge } from "@/components/shared/StatusBadges";
import { formatDate } from "@/lib/formatters";

/** Result card in the Explorer grid. */
export default function ExperimentCard({ experiment, relevance, params }) {
  return (
    <article className="fx-panel fx-panel-hover group flex flex-col overflow-hidden">
      <div className="relative">
        <FlameThumbnail
          params={params}
          className="h-32 w-full border-0 border-b border-line"
          label={experiment.gravityLabel ?? experiment.variables?.gravity}
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <SaveButton
            bucket="experiments"
            item={{
              id: experiment.id,
              title: experiment.title,
              program: experiment.program,
              topic: experiment.topic,
            }}
            size="sm"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={`/experiments/${experiment.id}`}
            className="fx-numeric text-xs font-bold text-brand hover:underline"
          >
            {experiment.id}
          </Link>
          <Badge tone="neutral">{experiment.program}</Badge>
          <EvidenceBadge level={experiment.evidenceLevel} showLabel={false} />
        </div>

        <h3 className="text-xs font-semibold leading-snug text-ink">
          <Link href={`/experiments/${experiment.id}`} className="hover:text-brand">
            {experiment.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-xs leading-relaxed text-ink-muted">{experiment.keyFinding}</p>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-2.5 text-[11px]">
          <div>
            <dt className="text-ink-faint">Gravity</dt>
            <dd className="text-ink-muted">{experiment.variables?.gravity ?? experiment.gravity}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Date</dt>
            <dd className="text-ink-muted">{formatDate(experiment.date)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2.5">
          <span className="text-[10px] text-ink-faint">
            Relevance{" "}
            <span className="fx-numeric font-semibold text-brand">{relevance}%</span>
          </span>
          <div className="flex items-center gap-1.5">
            <CompareToggle id={experiment.id} compact />
            <Link
              href={`/experiments/${experiment.id}`}
              className="fx-btn fx-btn-ghost h-7 px-2 text-[11px]"
              aria-label={`Open ${experiment.id}`}
            >
              Open
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}