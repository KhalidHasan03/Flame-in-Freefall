"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Bookmark, GitCompareArrows, Trash2 } from "lucide-react";
import { useSaved } from "@/lib/context/SavedProvider";
import { useCompare } from "@/lib/context/CompareProvider";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import EmptyState from "@/components/shared/EmptyState";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import { EvidenceBadge } from "@/components/shared/StatusBadges";
import { PROTOTYPE_LABELS } from "@/lib/constants";

function Bucket({ title, hint, items, render, onRemove, onClear }) {
  if (!items.length) return null;
  return (
    <Panel className="flex flex-col gap-3.5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">
            {title} <span className="fx-numeric ml-1 text-ink-faint">{items.length}</span>
          </h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{hint}</p>
        </div>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={onClear}>
          Clear
        </Button>
      </div>
      <ul className="space-y-2.5">{items.map((item) => render(item, onRemove))}</ul>
    </Panel>
  );
}

export default function SavedView() {
  const { saved, remove, clearBucket, clearAll, total } = useSaved();
  const { add, max } = useCompare();
  const router = useRouter();

  if (total === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Nothing saved yet"
        description="Save an experiment or insight while browsing and it will collect here for later reference."
        action={
          <Button variant="primary" size="sm" onClick={() => router.push("/explore")}>
            Browse experiments
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <Panel className="flex flex-wrap items-center gap-2 p-3">
        <Badge tone="brand" dot>
          {total} saved item{total === 1 ? "" : "s"}
        </Badge>
        <span className="text-[11px] text-ink-faint">Stored in this browser only.</span>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={clearAll} className="ml-auto">
          Clear all
        </Button>
      </Panel>

      <Bucket
        title="Experiments"
        hint="Records you bookmarked while exploring the dataset."
        items={saved.experiments}
        onClear={() => clearBucket("experiments")}
        onRemove={(item) => remove("experiments", item.id)}
        render={(item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-elevated/30 px-3 py-2.5"
          >
            <span className="fx-numeric text-[10px] font-bold text-brand">{item.id}</span>
            <Link href={`/experiments/${item.id}`} className="min-w-0 flex-1 text-xs font-medium text-ink hover:text-brand">
              {item.title}
            </Link>
            {item.topic ? <Badge tone="neutral">{item.topic}</Badge> : null}
            <Button variant="ghost" size="sm" icon={GitCompareArrows} onClick={() => add(item.id)}>
              Compare
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => remove("experiments", item.id)}>
              Remove
            </Button>
          </li>
        )}
      />

      <Bucket
        title="Insights"
        hint="Generated statements you kept for reference."
        items={saved.insights}
        onClear={() => clearBucket("insights")}
        onRemove={(item) => remove("insights", item.id)}
        render={(item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-elevated/30 px-3 py-2.5"
          >
            <span className="fx-numeric text-[10px] font-bold text-brand">{item.id}</span>
            <span className="min-w-0 flex-1 text-xs font-medium text-ink">{item.title}</span>
            {item.topic ? <Badge tone="neutral">{item.topic}</Badge> : null}
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => remove("insights", item.id)}>
              Remove
            </Button>
          </li>
        )}
      />

      {saved.comparisons.length ? (
        <Bucket
          title="Comparisons"
          hint="Saved experiment sets."
          items={saved.comparisons}
          onClear={() => clearBucket("comparisons")}
          onRemove={(item) => remove("comparisons", item.id)}
          render={(item) => (
            <li key={item.id} className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
              <p className="text-xs font-medium text-ink">{item.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {(item.ids ?? []).map((id) => (
                  <Link key={id} href={`/experiments/${id}`} className="fx-chip border-line text-ink-faint hover:text-brand">
                    {id}
                  </Link>
                ))}
              </div>
            </li>
          )}
        />
      ) : null}

      {saved.answers.length ? (
        <Bucket
          title="Saved answers"
          hint="Firewise answers you kept."
          items={saved.answers}
          onClear={() => clearBucket("answers")}
          onRemove={(item) => remove("answers", item.id)}
          render={(item) => (
            <li key={item.id} className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
              <p className="text-xs font-medium text-ink">{item.question ?? item.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                {(item.text ?? "").slice(0, 180)}
              </p>
            </li>
          )}
        />
      ) : null}

      <p className="flex items-center gap-1.5 text-[11px] text-ink-faint">
        <ArrowUpRight className="size-3" aria-hidden="true" />
        Comparison holds {max} experiments. Add records from{" "}
        <Link href="/explore" className="text-brand hover:underline">
          Explore
        </Link>
        .
      </p>

      <PrototypeNotice compact label={PROTOTYPE_LABELS.dataset} message={PROTOTYPE_LABELS.sampleNote} />
    </div>
  );
}