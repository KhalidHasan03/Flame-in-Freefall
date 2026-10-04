"use client";

import { useId } from "react";
import PlanetGlobe from "@/components/visual/PlanetGlobe";
import { missionAsset } from "@/lib/assets";

/**
 * Body rendered for each environment. The station is an orbital marker rather than a planet, so
 * it gets a small orbiting node instead of a globe.
 */
const BODY_FOR = { earth: "earth", moon: "moon", mars: "mars" };

function StationNode({ active }) {
  return (
    <g>
      <ellipse
        cx="50"
        cy="50"
        rx="26"
        ry="9"
        fill="none"
        stroke="var(--fx-space-orbit)"
        strokeWidth="0.6"
        transform="rotate(-22 50 50)"
      />
      <g transform={active ? "translate(0 -1)" : undefined}>
        <rect x="43" y="46" width="14" height="8" rx="1.6" fill="var(--fx-planet-station)" />
        <rect x="41" y="48" width="3" height="4" rx="1" fill="var(--fx-planet-station)" opacity="0.75" />
        <rect x="56" y="48" width="3" height="4" rx="1" fill="var(--fx-planet-station)" opacity="0.75" />
        <circle cx="50" cy="50" r="1.6" fill="var(--fx-signal)" opacity={active ? 0.95 : 0.5} />
      </g>
    </g>
  );
}

/**
 * Mission selector.
 *
 * A radio group rather than a select: each destination carries artwork and a name, so the choice
 * is spatial and visual. Implemented with real radio inputs kept visually hidden and driven by
 * styled labels, which means keyboard behaviour, focus order and screen-reader semantics come
 * from the platform instead of being reimplemented. Arrow keys move between options natively,
 * and the visible ring on the checked option follows focus-visible.
 *
 * @param {object} props
 * @param {Array<{id: string, name: string}>} props.missions Mission records from the API layer.
 * @param {string} props.value Selected mission id.
 * @param {(id: string) => void} props.onChange Called with the new mission id.
 * @param {string} [props.legend] Accessible group label.
 * @param {boolean} [props.orient] `auto` stacks on narrow screens, `horizontal` forces a row.
 */
export default function MissionSelector({
  missions,
  value,
  onChange,
  legend = "Mission environment",
  orient = "auto",
}) {
  const name = useId();

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      <div
        className={`grid grid-cols-2 gap-2 ${
          orient === "horizontal" ? "sm:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {missions.map((mission) => {
          const id = `${name}-${mission.id}`;
          const checked = mission.id === value;
          const meta = missionAsset(mission.id);

          return (
            <div key={mission.id} className="relative">
              <input
                type="radio"
                id={id}
                name={name}
                value={mission.id}
                checked={checked}
                onChange={() => onChange(mission.id)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                title={meta.alt}
                className="fx-mission-option peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--radius-panel)] border border-line bg-panel/40 px-2 py-2.5 text-center transition-colors hover:bg-panel/70 has-[:checked]:border-brand/60 has-[:checked]:bg-brand/10"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-full items-center justify-center transition-opacity ${
                    checked ? "opacity-100" : "opacity-55"
                  }`}
                >
                  <svg viewBox="0 0 100 100" className="size-full">
                    {BODY_FOR[mission.id] ? (
                      <PlanetGlobe
                        body={BODY_FOR[mission.id]}
                        cx={50}
                        cy={50}
                        r={22}
                        ring={mission.id === "earth"}
                      />
                    ) : (
                      <StationNode active={checked} />
                    )}
                  </svg>
                </span>
                <span
                  className={`truncate text-[11px] font-semibold ${
                    checked ? "text-brand" : "text-ink-muted"
                  }`}
                >
                  {mission.name}
                </span>
              </label>
              {checked ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[var(--radius-panel)] shadow-[inset_0_0_24px_-12px_var(--fx-glow-brand)]"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}