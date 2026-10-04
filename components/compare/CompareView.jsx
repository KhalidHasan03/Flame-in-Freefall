"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitCompareArrows, Lightbulb, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { buildDifferenceSummary, getOxygenDifference } from "@/lib/calculations";
import { MAX_COMPARISON_SIZE, PROTOTYPE_LABELS } from "@/lib/constants";
import { useCompare } from "@/lib/context/CompareProvider";
import Panel from "@/components/shared/Panel";
import Button from "@/components/shared/Button";
import EmptyState from "@/components/shared/EmptyState";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import Badge from "@/components/shared/Badge";
import CompareTable from "./CompareTable";

/** Picker used to add records to the tray when fewer than three are selected. */
function AddPicker({ experiments, selected, onAdd }) {
  const [query, setQuery] = useState("");
  const remaining = experiments.length - selected.length;

  const matches = useMemo(() => {
    if (remaining <= 0) return [];
    const needle = query.trim().toLowerCase();
    return experiments
      .filter((experiment) => !selected.includes(experiment.id))
      .filter(
        (experiment) =>
          !needle ||
          experiment.id.toLowerCase().includes(needle) ||
          experiment.title.toLowerCase().includes(needle) ||
          experiment.program.toLowerCase().includes(needle),
      )
      .slice(0, 6);
  }, [experiments, selected, query, remaining]);

  if (remaining <= 0) {
    return (
      <p className="rounded-lg border border-line bg-elevated/30 px-3 py-2 text-[11px] text-ink-muted">
        Comparison is full at {MAX_COMPARISON_SIZE} experiments. Remove one to add another.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
        <label htmlFor="compare-picker" className="sr-only">
          Search for an experiment to add
        </label>
        <input
          id="compare-picker"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Add another experiment…"
          className="fx-input h-8 pl-8 text-xs"
        />
      </div>
      <ul className="space-y-1">
        {matches.map((experiment) => (
          <li key={experiment.id}>
            <button
              type="button"
              onClick={() => onAdd(experiment.id)}
              className="flex w-full items-center gap-2 rounded-lg border border-line bg-elevated/40 px-2.5 py-1.5 text-left transition-colors hover:border-brand/50"
            >
              <span className="fx-numeric text-[10px] font-bold text-brand">{experiment.id}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] text-ink-muted">
                {experiment.title}
              </span>
              <span className="fx-label shrink-0">{experiment.program}</span>
            </button>
          </li>
        ))}
        {matches.length === 0 ? (
          <li className="px-2 py-1 text-[11px] text-ink-faint">No further records match that search.</li>
        ) : null}
      </ul>
    </div>
  );
}

export default function CompareView({ experiments }) {
  const { ids, remove, clear, add, max } = useCompare();
  const router = useRouter();
  const selected = useMemo(
    () => ids.map((id) => experiments.find((experiment) => experiment.id === id)).filter(Boolean),
    [ids, experiments],
  );

  const summary = useMemo(() => buildDifferenceSummary(selected), [selected]);
  const oxygenGap = getOxygenDifference(selected);

  if (selected.length === 0) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        title="Nothing to compare yet"
        description={`Add up to ${max} experiments from the Explorer, or search for one here, to see their recorded conditions side by side.`}
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
        <span className="fx-label">In comparison</span>
        {selected.map((experiment) => (
          <span
            key={experiment.id}
            className="fx-chip border-brand/35 bg-brand/12 text-brand"
          >
            <span className="fx-numeric">{experiment.id}</span>
            <button
              type="button"
              onClick={() => remove(experiment.id)}
              aria-label={`Remove ${experiment.id} from comparison`}
              className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-brand/20"
            >
              <span aria-hidden="true">×</span>
            </button>
          </span>
        ))}
        <span className="fx-numeric ml-auto text-[10px] text-ink-faint">
          {selected.length} / {max}
        </span>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={clear}>
          Clear
        </Button>
      </Panel>

      {selected.length < 2 ? (
        <Panel className="p-5">
          <SectionHeader
            eyebrow="One more"
            title="Add a second experiment"
            description="A comparison needs at least two records."
          />
          <div className="mt-3.5">
            <AddPicker experiments={experiments} selected={ids} onAdd={add} />
          </div>
        </Panel>
      ) : (
        <>
          <Panel className="space-y-3 p-5">
            <SectionHeader
              eyebrow="Difference summary"
              icon={Lightbulb}
              title="What actually differs"
              description="Generated from the comparison table below. Read it as a pointer to the variables, not as a conclusion."
            />
            <p className="rounded-lg border border-brand/25 bg-brand/[0.07] px-3 py-2.5 text-xs leading-relaxed text-ink">
              {summary}
            </p>
            {oxygenGap !== null ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="ember">Oxygen spread</Badge>
                <span className="fx-numeric text-xs text-ink-muted">{oxygenGap.toFixed(1)} % O₂</span>
              </div>
            ) : null}
            <PrototypeNotice
              compact
              label={PROTOTYPE_LABELS.dataset}
              message="Records are synthetic, so this summary describes the loaded sample only."
            />
          </Panel>

          <Panel className="p-5">
            <SectionHeader eyebrow="Field by field" title="Recorded conditions" />
            <div className="mt-3.5">
              <CompareTable experiments={selected} />
            </div>
          </Panel>

          {selected.length < max ? (
            <Panel className="p-5">
              <SectionHeader eyebrow="Add another" title="Extend the comparison" />
              <div className="mt-3.5">
                <AddPicker experiments={experiments} selected={ids} onAdd={add} />
              </div>
            </Panel>
          ) : null}
        </>
      )}

      <p className="text-center text-[11px] text-ink-faint">
        Need a different angle?{" "}
        <Link href="/insights" className="text-brand hover:underline">
          Check conflicting results
        </Link>{" "}
        across the whole dataset.
      </p>
    </div>
  );
}