"use client";

import { Orbit } from "lucide-react";
import { useState } from "react";
import { calculateMissionRelevance } from "@/lib/calculations";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import Panel from "@/components/shared/Panel";
import ProgressBar from "@/components/shared/ProgressBar";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";

/** Mission relevance scoring for a single record, with the per-factor breakdown exposed. */
export default function MissionRelevancePanel({ experiment, missions }) {
  const [missionId, setMissionId] = useState(experiment.mission ?? "iss");
  const result = calculateMissionRelevance({ mission: missionId, experiment });
  const mission = missions.find((item) => item.id === missionId);

  return (
    <Panel className="space-y-4 p-5">
      <SectionHeader
        eyebrow="Mission applicability"
        icon={Orbit}
        title="Relevance to target environment"
        description={mission?.summary}
      />

      <div className="space-y-1.5">
        <label htmlFor="relevance-mission" className="fx-label block">
          Target environment
        </label>
        <select
          id="relevance-mission"
          className="fx-input"
          value={missionId}
          onChange={(event) => setMissionId(event.target.value)}
        >
          {missions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="fx-numeric text-xl font-bold text-brand">{result.score}%</span>
        <span className="text-xs text-ink-muted">prototype match score</span>
      </div>

      <ul className="space-y-2.5 border-t border-line pt-3.5">
        {result.factors.map((factor) => (
          <li key={factor.id}>
            <ProgressBar
              label={`${factor.label} · weight ${Math.round(factor.weight * 100)}%`}
              value={factor.value}
              tone="brand"
              size="sm"
            />
          </li>
        ))}
      </ul>

      <PrototypeNotice compact label={PROTOTYPE_LABELS.model} message={PROTOTYPE_LABELS.relevanceNote} />
    </Panel>
  );
}