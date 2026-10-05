"use client";

import { Flame } from "lucide-react";
import { FLAME_BASE_Y, FLAME_VIEWBOX } from "@/lib/flameGeometry";
import { useSettings } from "@/lib/context/SettingsProvider";
import { useId, useMemo } from "react";
import { getPlateLayers, getPlateProfile } from "./EnvironmentPlate";

/**
 * One environment plate.
 *
 * The envelope comes from `getPlateProfile`, which normalises against each world's real gravity
 * rather than the app's preset ladder — see the note in `EnvironmentPlate.jsx` for why. The lobe
 * paths themselves are the shared `buildFlameLayers`, so the drawn flame and the printed sphericity
 * readout are the same numbers.
 *
 * Client because the layers are memoised per plate and the halo drifts under a CSS transform that
 * respects the reduced-motion setting. Nothing here animates on a timer.
 */
export default function EnvironmentPlateCard({ plate, className = "" }) {
  const { settings } = useSettings();
  // Honour both switches. `reduceFlameMotion` is the in-app setting; the media query in globals.css
  // neutralises the animation for the OS preference, but dropping it here as well means the inline
  // style is never emitted in the first place.
  const still = settings.reduceFlameMotion;
  const uid = useId().replace(/:/g, "");
  const haloId = `plate-halo-${uid}`;
  const softId = `plate-soft-${uid}`;

  const { layers, profile } = useMemo(() => {
    const next = getPlateProfile(plate);
    return { layers: getPlateLayers(plate), profile: next };
  }, [plate]);

  return (
    <article
      className={`fx-panel fx-panel-hover group flex flex-col overflow-hidden ${className}`.trim()}
      style={
        {
          "--plate-lit": plate.lit,
          "--plate-mid": plate.mid,
          "--plate-shadow": plate.shadow,
          "--plate-limb": plate.limb,
        }
      }
    >
      <div className="relative h-36 overflow-hidden">
        {plate.openSky ? (
          <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: plate.sky }} />
        ) : (
          /* Star wash on the airless plates only, so Earth reads as the one world with a sky. */
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 18% 22%, #fff 50%, transparent 50%), radial-gradient(1px 1px at 72% 14%, #d4d4d4 50%, transparent 50%), radial-gradient(1px 1px at 44% 40%, #fff 50%, transparent 50%), radial-gradient(1px 1px at 86% 38%, #b4b4b4 50%, transparent 50%)",
              backgroundSize: "120px 120px",
            }}
          />
        )}

        {/* Horizon glow, brightest directly under the flame. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[46%]"
          style={{ backgroundImage: `linear-gradient(0deg, ${plate.horizonGlow} 0%, transparent 100%)` }}
        />

        {/* The surface the flame stands on. Present on every plate, including the airless two. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px]" style={{ backgroundColor: plate.surface }} />

        {/* Body limb, low enough that the flame clears it. */}
        <div
          aria-hidden="true"
          className="fx-plate-body pointer-events-none absolute -bottom-20 left-1/2 aspect-square w-48 -translate-x-1/2 rounded-full"
        />
        <div
          aria-hidden="true"
          className="fx-plate-limb pointer-events-none absolute -bottom-20 left-1/2 aspect-square w-48 -translate-x-1/2 rounded-full"
        />

        <svg
          viewBox={FLAME_VIEWBOX}
          preserveAspectRatio="xMidYMax meet"
          className="absolute inset-0 h-full w-full opacity-95 transition-opacity duration-300 group-hover:opacity-100"
          role="img"
          aria-label={`Stylised flame envelope at ${plate.gravityLabel} gravity, ${profile.elongation.toFixed(2)} times elongation. Illustration, not a validated prediction.`}
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
                          // Keyframe names, not the `fx-plate-*` classes: an inline `animation`
                          // shorthand would reset `animation-name` and override the class, and the
                          // shorthand is what carries the duration and easing.
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

        <span className="fx-numeric absolute right-2 top-2 rounded border border-line bg-void/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-ink backdrop-blur-sm">
          {plate.gravityLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 border-t border-line p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xs font-semibold tracking-[-0.01em] text-ink">{plate.name}</h3>
          <Flame className="size-3.5 shrink-0 text-ember/70" aria-hidden="true" />
        </div>
        <p className="text-[11px] leading-relaxed text-ink-muted">{plate.strapline}</p>

        <dl className="mt-1 grid grid-cols-3 gap-x-3 gap-y-1.5">
          <div>
            <dt className="fx-telemetry-label">Envelope</dt>
            <dd className="fx-numeric text-[11px] font-semibold text-ink">
              {profile.elongation.toFixed(2)}×
            </dd>
          </div>
          <div>
            <dt className="fx-telemetry-label">Sphericity</dt>
            <dd className="fx-numeric text-[11px] font-semibold text-ink">
              {Math.round(profile.sphericity * 100)}%
            </dd>
          </div>
          {/*
            Fuel is named rather than colour-coded. The flame palettes are amber and white for
            every fuel, so the silhouette no longer identifies the fuel — this label is what
            does, which is the point of showing it next to the drawing.
          */}
          <div>
            <dt className="fx-telemetry-label">Fuel</dt>
            <dd className="truncate text-[11px] font-semibold text-ink">{plate.fuelLabel}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
