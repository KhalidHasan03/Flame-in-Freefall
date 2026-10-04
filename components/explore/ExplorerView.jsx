"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SearchX, X } from "lucide-react";
import { EXPLORE_PAGE_SIZE, PROTOTYPE_LABELS, SORT_OPTIONS } from "@/lib/constants";
import { filterExperiments, scoreExperiment, sortExperiments } from "@/lib/calculations";
import Button from "@/components/shared/Button";
import ChannelLabel from "@/components/shared/ChannelLabel";
import EmptyState from "@/components/shared/EmptyState";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import { Select } from "@/components/shared/Form";
import ExperimentCard from "./ExperimentCard";

const EMPTY_FILTERS = {
  program: "all",
  fuel: "all",
  topic: "all",
  type: "all",
  evidence: "all",
  gravity: "all",
  airflow: "all",
  mission: "all",
};

const GRAVITY_BANDS = [
  { value: "all", label: "Any gravity" },
  { value: "microgravity", label: "Microgravity (μg)" },
  { value: "low", label: "Low (0.001–0.5g)" },
  { value: "partial", label: "Partial (0.5–1g)" },
  { value: "ground", label: "Ground (1g)" },
];

const toOptions = (values) => [{ value: "all", label: "All" }, ...values.map((v) => ({ value: v, label: v }))];

export default function ExplorerView({ experiments, facets, missions }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const activeCount = Object.entries(filters).filter(([, value]) => value !== "all").length;

  const mission = filters.mission === "all" ? null : filters.mission;

  const results = useMemo(() => {
    const filtered = filterExperiments(experiments, { query, filters, mission });
    return sortExperiments(filtered, sort, mission);
  }, [experiments, query, filters, mission, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / EXPLORE_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = results.slice((safePage - 1) * EXPLORE_PAGE_SIZE, safePage * EXPLORE_PAGE_SIZE);

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setPage(1);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Panel className="h-max space-y-4 p-4 lg:sticky lg:top-4">
        <div className="flex items-center justify-between gap-2">
          <ChannelLabel className="min-w-0">
            <Filter className="size-3.5" aria-hidden="true" />
            Filters
          </ChannelLabel>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
            >
              <X className="size-3" aria-hidden="true" />
              Clear {activeCount}
            </button>
          ) : null}
        </div>

        <Select
          label="Programme"
          value={filters.program}
          onChange={(event) => setFilter("program", event.target.value)}
          options={toOptions(facets.programs)}
        />
        <Select
          label="Fuel"
          value={filters.fuel}
          onChange={(event) => setFilter("fuel", event.target.value)}
          options={[{ value: "all", label: "All" }, ...facets.fuels]}
        />
        <Select
          label="Topic"
          value={filters.topic}
          onChange={(event) => setFilter("topic", event.target.value)}
          options={toOptions(facets.topics)}
        />
        <Select
          label="Experiment type"
          value={filters.type}
          onChange={(event) => setFilter("type", event.target.value)}
          options={toOptions(facets.types)}
        />
        <Select
          label="Gravity band"
          value={filters.gravity}
          onChange={(event) => setFilter("gravity", event.target.value)}
          options={GRAVITY_BANDS}
        />
        <Select
          label="Airflow"
          value={filters.airflow}
          onChange={(event) => setFilter("airflow", event.target.value)}
          options={toOptions(["Low", "Medium", "High"])}
        />
        <Select
          label="Evidence level"
          value={filters.evidence}
          onChange={(event) => setFilter("evidence", event.target.value)}
          options={toOptions(["High", "Medium", "Limited"])}
        />
        <Select
          label="Environment"
          value={filters.mission}
          onChange={(event) => setFilter("mission", event.target.value)}
          options={[{ value: "all", label: "All" }, ...missions.map((m) => ({ value: m.id, label: m.name }))]}
        />

        <PrototypeNotice compact label={PROTOTYPE_LABELS.dataset} message={PROTOTYPE_LABELS.sampleNote} />
      </Panel>

      <div className="space-y-4">
        <Panel className="flex flex-wrap items-center gap-3 p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
              aria-hidden="true"
            />
            <label htmlFor="explore-search" className="sr-only">
              Search experiments
            </label>
            <input
              id="explore-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search titles, findings, fuels, tags…"
              className="fx-input pl-8"
            />
          </div>

          <div className="w-48">
            <label htmlFor="explore-sort" className="sr-only">
              Sort results
            </label>
            <select
              id="explore-sort"
              className="fx-input"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </div>

          {/*
            The match count is an instrument reading, not a badge: it states the ratio and the
            page position in the same tabular face as the telemetry elsewhere in the product.
          */}
          <div className="fx-telemetry items-center border-l border-line pl-3">
            <span className="fx-telemetry-label">Matched</span>
            <span className="fx-telemetry-value text-ink">
              {results.length}
              <span className="text-ink-faint"> / {experiments.length}</span>
            </span>
            <span className="fx-telemetry-label hidden sm:inline">
              page {safePage} of {pageCount}
            </span>
          </div>
        </Panel>

        {visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No experiments match these filters"
            description="The loaded dataset covers a specific set of configurations. Relaxing a filter or clearing them all usually finds a match."
            action={
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((experiment) => (
                <li key={experiment.id}>
                  <ExperimentCard
                    experiment={experiment}
                    relevance={scoreExperiment({ experiment, query, mission })}
                    params={{
                      gravity: experiment.gravity,
                      oxygen: experiment.oxygen,
                      pressure: experiment.pressure,
                      airflow: experiment.airflow,
                      fuel: experiment.fuel,
                      temperature: experiment.temperature,
                    }}
                  />
                </li>
              ))}
            </ul>

            {pageCount > 1 ? (
              <Panel className="flex items-center justify-between gap-3 px-3 py-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  Previous
                </Button>
                <span className="fx-numeric text-xs text-ink-muted">
                  Page {safePage} of {pageCount}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={safePage === pageCount}
                >
                  Next
                </Button>
              </Panel>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}