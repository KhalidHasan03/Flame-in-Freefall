"use client";

import Link from "next/link";
import { ArrowUpRight, Flame, Gauge, Orbit, Sparkles } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { FLAME_BASE_Y, FLAME_VIEWBOX } from "@/lib/flameGeometry";
import { calculateMissionRelevance } from "@/lib/calculations";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import { useSettings } from "@/lib/context/SettingsProvider";
import ChannelLabel from "@/components/shared/ChannelLabel";
import Keyline from "@/components/shared/Keyline";
import MissionSelector from "@/components/mission/MissionSelector";
import ScoreRing from "@/components/shared/ScoreRing";
import { getEnvironmentPlate, getPlateLayers, getPlateProfile } from "./EnvironmentPlate";

/**
 * The dashboard's focal block: where the product is right now.
 *
 * This replaces `DashboardHero` on `/`. The hero mounted a live WebGL chamber, the full parameter
 * control set, the derived-behaviour chips, the risk band and the relevance ring — six interactive
 * surfaces competing with each other, and a second canvas on a route that already runs the live
 * Earth backdrop. Almost none of it was navigational, so the dashboard spent its largest region on
 * something you could only use here.
 *
 * Every one of those controls still exists, on the route built for it:
 *
 *   chamber, sliders, derived metrics, risk trend   →  /flame-lab
 *   destination selector, per-mission relevance     →  /mission-lab
 *   relevance against any single record             →  /experiments/[id]
 *
 * What stays here is what a dashboard is for: one destination, the state of the evidence base
 * against it, and the route to go deeper. The envelope is drawn as SVG from the same shared
 * `buildFlameLayers` the chamber uses, so the silhouette on this page is the model's own output
 * and not a decorative illustration — at zero WebGL cost.
 *
 * Two deliberate restraints:
 *
 * 1. The destination selector is kept. It is the one control that changes what the rest of the page
 *    is *about*, and duplicating it across two routes is cheaper than a dashboard that cannot answer
 *    "how does this look on the Moon".
 * 2. The match is scored against the featured record, which is the record the page below is about,
 *    so the number and the prose beneath it cannot drift apart.
 */
export default function MissionOverview({ missions, featured }) {
  const { settings } = useSettings();
  const [mission, setMission] = useState("iss");
  const still = settings.reduceFlameMotion;
  const uid = useId().replace(/:/g, "");
  const haloId = `overview-halo-${uid}`;
  const softId = `overview-soft-${uid}`;

  const plate = getEnvironmentPlate(mission);
  const missionRecord = missions.find((item) => item.id === mission);

  const { layers, profile } = useMemo(
    () => ({ layers: getPlateLayers(plate), profile: getPlateProfile(plate) }),
    [plate],
  );

  const relevance = useMemo(
    () => (featured ? calculateMissionRelevance({ mission, experiment: featured }) : null),
    [mission, featured],
  );

  const readouts = [
    { label: "Gravity", value: plate.gravityLabel, Icon: Gauge },
    { label: "Sphericity", value: `${Math.round(profile.sphericity * 100)}%`, Icon: Flame },
    { label: "Fuel", value: plate.fuelLabel, Icon: Sparkles },
  ];

  return (
    <section
      aria-labelledby="overview-heading"
      className="fx-veil relative overflow-hidden"
    >
      {/*
        `veil` rather than `instrument`, for the same reason the hero used it: the live planet
        behind this route is a feature, and a 46%-alpha lit panel hides it. `fx-veil-scrim` then
        darkens only the copy column, so the left half stays readable while the drawing half stays
        open to the environment.
      */}
      <div aria-hidden="true" className="fx-veil-scrim pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-panel)] ring-1 ring-inset ring-line-strong"
      />

      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="order-2 flex flex-col justify-center gap-5 p-5 sm:p-7 lg:order-1">
          <div>
            <ChannelLabel tone="text-ember">Active environment</ChannelLabel>
            <h2
              id="overview-heading"
              className="mt-2.5 font-display text-hud-sm font-semibold tracking-[-0.02em] text-ink"
            >
              {missionRecord?.name ?? plate.name}
            </h2>
            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-muted">
              {plate.strapline}. Combustion behaviour under reduced gravity, scored against the
              FlareNexus evidence base.
            </p>
          </div>

          <MissionSelector
            missions={missions}
            value={mission}
            onChange={setMission}
            legend="Active environment"
            orient="horizontal"
          />

          <Keyline />

          <dl className="grid grid-cols-3 gap-4">
            {readouts.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="fx-telemetry-label flex items-center gap-1.5">
                  <item.Icon className="size-3" aria-hidden="true" />
                  {item.label}
                </dt>
                <dd className="fx-readout text-base text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2">
            <Link href="/flame-lab" className="fx-btn fx-btn-primary">
              <Flame className="size-4" aria-hidden="true" />
              Open Flame Lab
              <ArrowUpRight className="size-3.5 opacity-70" aria-hidden="true" />
            </Link>
            <Link href="/mission-lab" className="fx-btn fx-btn-outline">
              <Orbit className="size-4" aria-hidden="true" />
              Mission Lab
            </Link>
          </div>
        </div>

        {/* Drawing plane. The envelope is the model's output for this gravity, not decoration. */}
        <div className="relative order-1 min-h-[15rem] lg:order-2 lg:min-h-[22rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(58% 52% at 50% 62%, ${plate.horizonGlow} 0%, transparent 68%)`,
            }}
          />

          <svg
            viewBox={FLAME_VIEWBOX}
            preserveAspectRatio="xMidYMax meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={`Stylised flame envelope at ${plate.gravityLabel} gravity, ${profile.elongation.toFixed(2)} times elongation. Illustration derived from the shared flame model, not a measured result.`}
          >
            <defs>
              <radialGradient id={haloId} cx="50%" cy="58%" r="52%">
                <stop offset="0%" stopColor={profile.palette.halo} stopOpacity="0.85" />
                <stop offset="100%" stopColor={profile.palette.halo} stopOpacity="0" />
              </radialGradient>
              <filter id={softId} x="-40%" y="-30%" width="180%" height="180%">
                <feGaussianBlur stdDeviation={profile.flicker * 26} />
              </filter>
            </defs>

            <g style={{ transformOrigin: `${profile.centerX}px ${FLAME_BASE_Y}px` }}>
              {layers.map((layer) => {
                const isHalo = layer.role === "halo";
                return (
                  <g
                    key={layer.id}
                    style={
                      still
                        ? undefined
                        : {
                            animation: isHalo
                              ? "fx-halo 4200ms ease-in-out infinite"
                              : "fx-plate-drift 3200ms ease-in-out infinite",
                            transformOrigin: `${profile.centerX}px ${FLAME_BASE_Y}px`,
                          }
                    }
                  >
                    <path
                      d={layer.d}
                      fill={
                        isHalo
                          ? `url(#${haloId})`
                          : layer.role === "outer"
                            ? profile.palette.outer
                            : layer.role === "mid"
                              ? profile.palette.mid
                              : profile.palette.core
                      }
                      opacity={layer.opacity}
                      filter={layer.blur ? `url(#${softId})` : undefined}
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          {/*
            Match ring, anchored to the drawing rather than to the copy column. Scored against the
            featured record so this number and the panel below it describe the same comparison.
          */}
          {relevance ? (
            <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1 rounded-[var(--radius-hud)] border border-line bg-void/60 px-3 py-2 backdrop-blur-sm">
              <ScoreRing value={relevance.score} label="Match" tone="brand" size={72} />
              <p className="fx-telemetry-label text-center">vs {featured.id}</p>
              <p className="sr-only">{PROTOTYPE_LABELS.relevanceNote}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}