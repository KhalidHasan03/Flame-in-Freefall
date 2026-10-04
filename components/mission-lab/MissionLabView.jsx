"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CircleHelp, Lightbulb, Orbit, SearchX } from "lucide-react";
import { calculateMissionRelevance } from "@/lib/calculations";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import Badge from "@/components/shared/Badge";
import Panel from "@/components/shared/Panel";
import ProgressBar from "@/components/shared/ProgressBar";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import { EvidenceBadge } from "@/components/shared/StatusBadges";
import ScoreRing from "@/components/shared/ScoreRing";
import MissionSelector from "@/components/mission/MissionSelector";
import EnvironmentPlateCard from "@/components/dashboard/EnvironmentPlateCard";
import { ENVIRONMENT_PLATES } from "@/components/dashboard/EnvironmentPlate";
import MoonMarsPanel from "@/components/dashboard/MoonMarsPanel";

/**
 * Mission Lab.
 *
 * Also the home of the environment plates and the Moon/Mars comparison, both of which used to sit
 * on the dashboard. That is where they belong rather than merely where there was room: the plate
 * row is driven by the selector at the top of this page, and the Moon/Mars rows answer a
 * mission-design question rather than a dataset question. The `moonMars` payload arrives from the
 * server, so the plates stay static drawings and the plate row does not follow the selector —
 * showing all four at once is the comparison, and each plate labels its own gravity.
 */
export default function MissionLabView({
  missions,
  experiments,
  findingsByMission,
  gaps,
  moonMars,
}) {
  const [missionId, setMissionId] = useState("moon");
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  const findings = findingsByMission[missionId] ?? [];
  const missionGaps = gaps.filter((gap) => gap.affectedMissions?.includes(missionId));

  const ranked = useMemo(
    () =>
      experiments
        .map((experiment) => ({
          experiment,
          relevance: calculateMissionRelevance({ mission: missionId, experiment }),
        }))
        .sort((a, b) => b.relevance.score - a.relevance.score)
        .slice(0, 6),
    [experiments, missionId],
  );

  const best = ranked[0];

  return (
    <div className="space-y-4">
      <MissionSelector
        missions={missions}
        value={missionId}
        onChange={setMissionId}
        legend="Mission environment"
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Panel variant="instrument" tone="signal" className="space-y-3.5 p-5">
          <SectionHeader eyebrow="Environment" icon={Orbit} title={mission.name} />
          <dl className="grid grid-cols-2 gap-3">
            {[
              { label: "Gravity", value: mission.gravityLabel },
              { label: "Atmosphere", value: mission.atmosphereLabel },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-elevated/30 px-3 py-2">
                <dt className="fx-label">{item.label}</dt>
                <dd className="mt-0.5 text-xs font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <p className="text-xs leading-relaxed text-ink-muted">{mission.context}</p>

          <div className="rounded-lg border border-line bg-elevated/25 px-3 py-2.5">
            <p className="fx-label mb-1">Combustion environment</p>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              {mission.combustionEnvironment}
            </p>
          </div>

          <div className="rounded-lg border border-ember/25 bg-ember/[0.07] px-3 py-2.5">
            <p className="fx-label mb-1 flex items-center gap-1.5 text-ember">
              <AlertTriangle className="size-3" aria-hidden="true" />
              Primary concern
            </p>
            <p className="text-[11px] leading-relaxed text-ink-muted">{mission.primaryConcern}</p>
          </div>

          <ul className="space-y-1.5 border-t border-line pt-3.5">
            {mission.concerns.map((concern) => (
              <li key={concern} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                <span className="text-[11px] leading-relaxed text-ink-muted">{concern}</span>
              </li>
            ))}
          </ul>

          <p className="flex gap-2 rounded-lg border border-line bg-elevated/25 px-3 py-2 text-[10px] leading-relaxed text-ink-faint">
            <CircleHelp className="mt-px size-3 shrink-0" aria-hidden="true" />
            {mission.caveat}
          </p>
        </Panel>

        <div className="space-y-4">
          <Panel className="space-y-4 p-5">
            <SectionHeader
              eyebrow="Scoring"
              title={`Research relevance to ${mission.name}`}
              description="Prototype similarity scoring across gravity, atmosphere, fuel and experimental confidence."
            />

            {best ? (
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-elevated/30 px-3.5 py-3">
                <ScoreRing value={best.relevance.score} label="Best match" size={104} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/experiments/${best.experiment.id}`}
                    className="fx-numeric text-xs font-bold text-brand hover:underline"
                  >
                    {best.experiment.id}
                  </Link>
                  <p className="mt-0.5 text-xs font-medium leading-snug text-ink">
                    {best.experiment.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">
                    Highest-scoring record for this environment. Even the best match is a partial match —
                    the dataset contains no combustion data at {mission.gravityLabel}.
                  </p>
                </div>
              </div>
            ) : null}

            <ul className="space-y-2">
              {ranked.map(({ experiment, relevance }) => (
                <li key={experiment.id}>
                  <Link
                    href={`/experiments/${experiment.id}`}
                    className="block rounded-lg border border-line bg-elevated/25 px-3 py-2.5 transition-colors hover:border-brand/45"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className="fx-numeric text-[10px] font-bold text-brand">
                          {experiment.id}
                        </span>
                        <EvidenceBadge level={experiment.evidenceLevel} showLabel={false} />
                      </span>
                      <span className="fx-numeric text-xs font-semibold text-brand">
                        {relevance.score}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-snug text-ink">{experiment.title}</p>
                    <div className="mt-2">
                      <ProgressBar value={relevance.score} tone="brand" showValue={false} size="sm" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <PrototypeNotice
              compact
              label={PROTOTYPE_LABELS.model}
              message={PROTOTYPE_LABELS.relevanceNote}
            />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="flex flex-col gap-3 p-5">
              <SectionHeader eyebrow="Synthesis" icon={Lightbulb} title="Mission findings" />
              {findings.length ? (
                <ul className="space-y-2.5">
                  {findings.map((finding) => (
                    <li key={finding.id} className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="fx-numeric mt-0.5 text-[10px] font-bold text-brand">
                          {finding.id}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium leading-snug text-ink">{finding.title}</p>
                          <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                            {finding.statement ?? finding.detail}
                          </p>
                          {finding.supportingIds?.length ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
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
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex items-center gap-2 text-[11px] text-ink-faint">
                  <SearchX className="size-3.5" aria-hidden="true" />
                  No mission-specific findings recorded.
                </p>
              )}
            </Panel>

            <Panel className="flex flex-col gap-3 p-5">
              <SectionHeader eyebrow="Unknowns" icon={CircleHelp} title="Research gaps" />
              {missionGaps.length ? (
                <ul className="space-y-2.5">
                  {missionGaps.map((gap) => (
                    <li key={gap.id} className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="fx-numeric mt-0.5 text-[10px] font-bold text-ember">
                          {gap.id}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium leading-snug text-ink">{gap.title}</p>
                          <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                            {gap.detail}
                          </p>
                          <Badge tone="ember" className="mt-1.5">
                            {gap.severity ?? "Uncharacterised"}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex items-center gap-2 text-[11px] text-ink-faint">
                  <SearchX className="size-3.5" aria-hidden="true" />
                  No gaps recorded for this environment.
                </p>
              )}
            </Panel>
          </div>
        </div>
      </div>

      {/*
        All four plates at once, rather than the selected one. The row is the comparison: the point
        is that one flame model produces four different envelopes, and collapsing that to a single
        plate would remove the only reason to show them together.
      */}
      <section aria-labelledby="plates-heading" className="space-y-4 pt-2">
        <SectionHeader
          id="plates-heading"
          eyebrow="Combustion by environment"
          icon={Orbit}
          title="Same flame, four gravity fields"
          description="How the combustion envelope changes from a buoyant terrestrial baseline down to a closed-volume free fall. Each silhouette is derived from the shared flame model, using each world's real gravity. Illustrative, not measured."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ENVIRONMENT_PLATES.map((plate) => (
            <EnvironmentPlateCard key={plate.id} plate={plate} />
          ))}
        </div>
      </section>

      {moonMars?.rows?.length ? (
        <MoonMarsPanel rows={moonMars.rows} moon={moonMars.moon} mars={moonMars.mars} />
      ) : null}
    </div>
  );
}