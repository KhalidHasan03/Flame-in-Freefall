"use client";

import { FLAME_BASE_Y, FLAME_VIEWBOX, buildFlameLayers, getFlameProfile } from "@/lib/flameGeometry";
import { useSettings } from "@/lib/context/SettingsProvider";
import { FUEL_OPTIONS, GRAVITY_PRESETS } from "@/lib/constants";
import { useId, useMemo } from "react";

const DURATION = { halo: 4200, outer: 3200, mid: 2700, core: 2100 };

/**
 * Flame visualisation.
 *
 * Geometry is derived deterministically from `params`, so the server-rendered markup matches the
 * client exactly and the flame only changes when a control changes. Every layer animates with a
 * GPU-only transform on a bottom-centre origin, and all animation is switched off when the user
 * asks for reduced motion or the OS does.
 */
export default function FlameVisual({ params, className = "", animated = true, showBurner = true }) {
  const { settings } = useSettings();
  const still = !animated || settings.reduceFlameMotion;

  const uid = useId().replace(/:/g, "");
  const haloGradientId = `fx-halo-${uid}`;
  const softFilterId = `fx-soft-${uid}`;

  const { layers, profile } = useMemo(() => {
    const next = getFlameProfile(params);
    return { layers: buildFlameLayers(next), profile: next };
  }, [params]);

  const gravity = GRAVITY_PRESETS.find((item) => item.id === params.gravity);
  const fuel = FUEL_OPTIONS.find((item) => item.id === params.fuel);
  const description = `Stylised ${fuel?.label ?? "liquid fuel"} flame at ${gravity?.label ?? params.gravity}, ${params.oxygen}% oxygen, ${params.airflow} airflow. ${Math.round(profile.sphericity * 100)}% sphericity. Illustration, not a validated prediction.`;

  return (
    <svg
      viewBox={FLAME_VIEWBOX}
      className={className}
      role="img"
      aria-label={description}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <radialGradient id={haloGradientId} cx="50%" cy="58%" r="52%">
          <stop offset="0%" stopColor={profile.palette.halo} stopOpacity="0.85" />
          <stop offset="100%" stopColor={profile.palette.halo} stopOpacity="0" />
        </radialGradient>
        <filter id={softFilterId} x="-40%" y="-30%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={profile.flicker * 26} />
        </filter>
      </defs>

      <ellipse
        cx={profile.centerX}
        cy={FLAME_BASE_Y + 12}
        rx={profile.halfWidth * 1.35}
        ry={6}
        fill="var(--fx-elevated)"
        opacity="0.9"
      />

      <g style={{ transformOrigin: `${profile.centerX}px ${FLAME_BASE_Y}px` }}>
        {layers.map((layer) => {
          const isHalo = layer.role === "halo";
          const isCore = layer.role === "core";
          return (
            <g
              key={layer.id}
              style={
                still
                  ? undefined
                  : {
                      animation: `fx-${isHalo ? "halo" : isCore ? "flame-core" : "flame-sway"} ${DURATION[layer.id]}ms ease-in-out infinite`,
                      animationDelay: `${layer.id.length * -140}ms`,
                      transformOrigin: `${profile.centerX}px ${FLAME_BASE_Y}px`,
                    }
              }
            >
              <path
                d={layer.d}
                fill={
                  isHalo
                    ? `url(#${haloGradientId})`
                    : layer.role === "outer"
                      ? profile.palette.outer
                      : layer.role === "mid"
                        ? profile.palette.mid
                        : profile.palette.core
                }
                opacity={layer.opacity}
                filter={layer.blur ? `url(#${softFilterId})` : undefined}
              />
            </g>
          );
        })}
      </g>

      {showBurner ? (
        <g>
          <rect
            x={profile.centerX - profile.halfWidth * 0.78}
            y={FLAME_BASE_Y}
            width={profile.halfWidth * 1.56}
            height="12"
            rx="4"
            fill="var(--fx-ink-faint)"
            opacity="0.55"
          />
          <rect
            x={profile.centerX - profile.halfWidth * 0.62}
            y={FLAME_BASE_Y - 3}
            width={profile.halfWidth * 1.24}
            height="3"
            rx="1.5"
            fill="var(--fx-brand)"
            opacity="0.7"
          />
        </g>
      ) : null}
    </svg>
  );
}