"use client";

import Link from "next/link";
import { useState } from "react";
import { BaseLineChart } from "@/components/charts/BaseLineChart";
import BaseScatterChart from "@/components/charts/BaseScatterChart";
import Panel from "@/components/shared/Panel";
import Tabs from "@/components/shared/Tabs";
import SectionHeader from "@/components/shared/SectionHeader";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import { Activity, FileText, GitCompareArrows, Orbit, Search, ShieldAlert, Target } from "lucide-react";
import InsightCard from "./InsightCard";
import CoveragePanel from "@/components/dashboard/CoveragePanel";
import RiskPanel from "@/components/dashboard/RiskPanel";

/*
 * `statements` is a fifth category rather than a separate panel. It is the same kind of object as
 * the four beside it — an id, a title, a body, the records it rests on — and putting it in its own
 * panel would have given the same visual weight to two different depths of claim. `patterns` and
 * `findings` are cross-experiment syntheses; a `statement` is one record read by the model.
 */
const TABS = [
  { id: "patterns", label: "Emerging patterns", icon: Activity, count: 0 },
  { id: "findings", label: "High-relevance findings", icon: Target, count: 0 },
  { id: "statements", label: "Model statements", icon: FileText, count: 0 },
  { id: "conflicts", label: "Conflicting results", icon: GitCompareArrows, count: 0 },
  { id: "gaps", label: "Research gaps", icon: Search, count: 0 },
];

/**
 * Map the authored statements onto the shape `InsightCard` already renders.
 *
 * Done here rather than in `lib/api/insights.js` because the mapping is presentational: which
 * field is called `summary` and which is called `statement` is a naming detail of two data
 * modules, and neither should have to care about the other's.
 */
function toCards(statements) {
  return statements.map((statement) => ({
    id: statement.id,
    topic: statement.topic,
    title: statement.title,
    statement: statement.summary,
    strength: statement.evidenceLevel,
    supportingIds: [statement.experimentId],
    meta: `${statement.relevance}% relevance`,
  }));
}

function ChartGrid({ oxygen, airflow, gravity }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="p-5">
        <SectionHeader
          eyebrow="Trend"
          title="Oxygen concentration vs. flame behaviour"
          description="How the reaction zone responds across the oxidiser range."
        />
        <div className="mt-4">
          <BaseLineChart
            data={oxygen.points}
            xKey="oxygen"
            xLabel="% O₂"
            yLabel="relative"
            series={[
              { key: "relativeFlameSize", name: "Relative flame size", color: "fx-ember" },
              { key: "relativeBrightness", name: "Relative brightness", color: "fx-brand" },
            ]}
            caption={oxygen.caption}
          />
        </div>
      </Panel>

      <Panel className="p-5">
        <SectionHeader
          eyebrow="Trend"
          title="Airflow vs. lateral spread rate"
          description="Forced convection against spread, separated by gravity regime."
        />
        <div className="mt-4">
          <BaseLineChart
            data={airflow.points}
            xKey="airflow"
            xLabel="airflow level"
            yLabel="relative spread"
            series={[
              { key: "lowGravity", name: "Reduced gravity", color: "fx-signal" },
              { key: "highGravity", name: "1g reference", color: "fx-ember" },
            ]}
            caption={airflow.caption}
          />
        </div>
      </Panel>

      <Panel className="p-5 lg:col-span-2">
        <SectionHeader
          eyebrow="Derived from the loaded records"
          title="Gravity vs. flame sphericity"
          description="Each point is one liquid-fuel record. Bubble size indicates evidence strength."
        />
        <div className="mt-4">
          <BaseScatterChart
            data={gravity}
            xKey="gravity"
            yKey="sphericity"
            xLabel="gravity (g)"
            yLabel="sphericity index"
            height={260}
            name="Liquid-fuel records"
            caption="Sphericity index is a demonstration heuristic, not a measured morphological quantity."
          />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
          Gravity is on a logarithmic scale because microgravity and 1g differ by six orders of
          magnitude. The visual trend is the one the dataset argues for: removing buoyant transport
          makes the envelope more compact and more nearly spherical.
        </p>
      </Panel>
    </div>
  );
}

export default function InsightsView({
  patterns,
  findings,
  statements,
  conflicts,
  gaps,
  missionFindings,
  series,
  gravity,
  coverage,
  riskFactors,
}) {
  const [tab, setTab] = useState("patterns");

  const sources = { patterns, findings, statements, conflicts, gaps };
  const counts = Object.fromEntries(
    Object.entries(sources).map(([id, list]) => [id, list.length]),
  );
  const tabs = TABS.map((item) => ({ ...item, count: counts[item.id] }));

  const active = toCards(tab === "statements" ? statements : sources[tab]);
  const missionIds = Object.keys(missionFindings);

  return (
    <div className="space-y-6">
      <ChartGrid oxygen={series.oxygen} airflow={series.airflow} gravity={gravity} />

      <Panel className="p-5">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Synthesis"
            icon={Activity}
            title="Cross-experiment insights"
            description="Each entry links to the experiment records it rests on, so the claim and its evidence can be checked together."
          />
          <Tabs tabs={tabs} activeId={tab} onChange={setTab} label="Insight categories" />
          <ul className="grid gap-3 lg:grid-cols-2">
            {active.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                accent={tab === "gaps" ? "ember" : "brand"}
              />
            ))}
          </ul>
          <PrototypeNotice
            label={PROTOTYPE_LABELS.model}
            message="Insights are assembled from the synthetic loaded dataset by the demonstration synthesis model. They demonstrate the intended evidence-linking behaviour, not validated conclusions."
          />
        </div>
      </Panel>

      {/*
        Coverage and risk, side by side and in that order.
        Breadth alone is ambiguous — a dataset can be broad and still leave one question
        unanswerable — so the question of where it is thin only means something next to the
        posture that makes those gaps consequential. On the dashboard these were two panels at
        opposite ends of the page, which read as unrelated.
      */}
      <section aria-labelledby="coverage-heading" className="space-y-4">
        <SectionHeader
          id="coverage-heading"
          eyebrow="Breadth and posture"
          icon={ShieldAlert}
          title="How far the evidence reaches"
          description="Coverage is counted from the loaded records per program. Risk factors are authored demonstration hazards, not measured probabilities — together they say which questions the breadth does not yet answer."
        />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <CoveragePanel programs={coverage.programs} sampleSize={coverage.sampleSize} />
          <RiskPanel factors={riskFactors} note={PROTOTYPE_LABELS.riskNote} />
        </div>
      </section>

      <Panel className="p-5">
        <SectionHeader
          eyebrow="Synthesis"
          icon={Orbit}
          title="Mission-specific findings"
          description="The same records read against each target environment. Full scoring lives in Mission Lab."
        />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {missionIds.map((missionId) => (
            <div key={missionId}>
              <p className="fx-label mb-2 capitalize">{missionId}</p>
              <ul className="space-y-2">
                {missionFindings[missionId].map((finding) => (
                  <li
                    key={finding.id}
                    className="rounded-lg border border-line bg-elevated/25 px-3 py-2.5"
                  >
                    <p className="fx-numeric text-[10px] font-bold text-brand">{finding.id}</p>
                    <p className="mt-0.5 text-xs font-medium leading-snug text-ink">{finding.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{finding.statement}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {finding.supportingIds.map((id) => (
                        <Link
                          key={id}
                          href={`/experiments/${id}`}
                          className="fx-chip border-line text-ink-faint hover:text-brand"
                        >
                          {id}
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}