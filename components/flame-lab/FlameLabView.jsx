"use client";

import Link from "next/link";
import { RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { DEFAULT_FLAME_PARAMS, PROTOTYPE_LABELS } from "@/lib/constants";
import { calculatePrototypeTrend, calculateRiskFactors } from "@/lib/calculations";
import { getFlameProfile } from "@/lib/flameGeometry";
import FlameControls from "@/components/flame/FlameControls";
import FlameMetrics from "@/components/flame/FlameMetrics";
import FlameStage from "@/components/three/FlameStage";
import Panel from "@/components/shared/Panel";
import Button from "@/components/shared/Button";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import RiskBreakdown from "./RiskBreakdown";

/** Loads a stored record's conditions into the lab so they can be varied from there. */
function PresetPicker({ experiments, onPick }) {
  const [value, setValue] = useState("");

  const apply = () => {
    if (!value) return;
    const experiment = experiments.find((item) => item.id === value);
    if (!experiment) return;
    onPick({
      gravity: experiment.gravity,
      oxygen: experiment.oxygen,
      pressure: experiment.pressure,
      airflow: experiment.airflow,
      fuel: experiment.fuel,
      temperature: experiment.temperature,
    });
    setValue("");
  };

  return (
    <div className="space-y-2">
      <label htmlFor="lab-preset" className="fx-label block">
        Start from a record
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            id="lab-preset"
            className="fx-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="">Select an experiment…</option>
            {experiments.map((experiment) => (
              <option key={experiment.id} value={experiment.id}>
                {experiment.id} — {experiment.title}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="sm" icon={Search} onClick={apply} disabled={!value}>
          Load
        </Button>
      </div>
    </div>
  );
}

export default function FlameLabView({ missions, experiments }) {
  const [params, setParams] = useState(DEFAULT_FLAME_PARAMS);
  const [mission, setMission] = useState("iss");

  const profile = useMemo(() => getFlameProfile(params), [params]);
  const trend = useMemo(() => calculatePrototypeTrend(params), [params]);
  const risk = useMemo(() => calculateRiskFactors({ mission, params }), [mission, params]);

  const dirty = JSON.stringify(params) !== JSON.stringify(DEFAULT_FLAME_PARAMS);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <Panel className="flex flex-col gap-4 p-5">
          <SectionHeader
            eyebrow="Simulation"
            icon={Sparkles}
            title="Flame preview"
            description="Geometry responds deterministically to the parameters on the right."
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={RotateCcw}
                onClick={() => setParams(DEFAULT_FLAME_PARAMS)}
                disabled={!dirty}
              >
                Reset
              </Button>
            }
          />

          {/*
            The one route that shows the subject at full size, so it is the one route that mounts
            the WebGL engine. FlameStage keeps FlameVisual behind it as the permanent fallback, so
            this markup is identical on a server with no GPU and in a browser with Save-Data on.
          */}
          <div className="fx-grid-bg relative h-[22rem] overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface-raised/40">
            <FlameStage params={params} />
          </div>

          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: "Sphericity", value: `${Math.round(profile.sphericity * 100)}%` },
              { label: "Luminosity", value: `${Math.round(profile.luminosity * 100)}%` },
              { label: "Elongation", value: `${profile.elongation.toFixed(2)}×` },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-elevated/30 px-3 py-2">
                <dt className="fx-label">{item.label}</dt>
                <dd className="fx-numeric mt-0.5 text-base font-bold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-1.5 border-t border-line pt-3.5">
            <label htmlFor="lab-mission" className="fx-label block">
              Risk context
            </label>
            <select
              id="lab-mission"
              className="fx-input"
              value={mission}
              onChange={(event) => setMission(event.target.value)}
            >
              {missions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <RiskBreakdown risk={risk} />
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5">
            <SectionHeader
              eyebrow="Controls"
              title="Conditions"
              description="Gravity drives flame shape; airflow drives the largest behavioural differences in this dataset."
            />
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <FlameControls params={params} onChange={setParams} />
              <div className="space-y-4">
                <PresetPicker experiments={experiments} onPick={setParams} />
                <div className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
                  <p className="fx-label mb-1">What the model says</p>
                  <p className="text-[11px] leading-relaxed text-ink-muted">{trend.observedTrend}</p>
                </div>
                <p className="text-[11px] leading-relaxed text-ink-faint">
                  Looking for a record that shows this behaviour?{" "}
                  <Link href="/explore" className="text-brand hover:underline">
                    Browse the dataset
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <SectionHeader
              eyebrow="Trend model"
              title="Observed behaviour"
              description="Directional output of the demonstration trend model for the current parameters."
            />
            <div className="mt-4">
              <FlameMetrics params={params} />
            </div>
          </Panel>

          <PrototypeNotice
            label={PROTOTYPE_LABELS.illustration}
            message="This is a stylised response model built for the prototype. It is not a combustion simulation and must not be used to design or certify hardware."
          />
        </div>
      </div>
    </div>
  );
}