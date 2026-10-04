"use client";

import AtmosphereVeil from "./AtmosphereVeil";
import DustMotes from "./DustMotes";
import OrbitalLattice from "./OrbitalLattice";
import StarField from "./StarField";
import { DEPTH, atmosphere, density } from "./depth";
import { useSettings } from "@/lib/context/SettingsProvider";

/**
 * The space environment behind the whole application.
 *
 * Mounted once inside AppShell rather than per page, so the atmosphere is painted a single time
 * and every route sits in the same environment. The layers, back to front, are declared in
 * components/space/depth.js:
 *
 *   deep     gradient, nebula washes, destination horizon bloom, edge vignette
 *   far      distant starfield
 *   lattice  slow-rotating orbital arcs
 *   near     near starfield and drifting motes
 *
 * The 3D mission object mounts at `subject`, in front of everything here and behind the UI, so
 * translucency always has real content behind it to reveal. That is the whole reason the panels
 * read as instruments rather than as tinted cards.
 *
 * @param {object} props
 * @param {"cinematic"|"standard"|"quiet"|"still"} [props.density="standard"]
 *   Scales every decorative layer at once, so a data route can go quiet and a cinematic route
 *   can go dense without any per-page breakpoint branching.
 * @param {"earth"|"iss"|"moon"|"mars"} [props.mission="iss"]
 *   Re-tints the atmosphere, so a destination change is felt in the whole frame.
 * @param {boolean} [props.vignette=true]
 */
export default function SpaceEnvironment({
  density: densityName = "standard",
  mission = "iss",
  vignette = true,
}) {
  const { settings } = useSettings();

  /*
   * Two independent sources of reduced motion, and they mean the same thing here: the in-app
   * preference and the OS setting. The OS setting is handled in CSS; this covers the in-app one,
   * which CSS cannot see.
   */
  const still = settings.reduceFlameMotion;
  const layers = density(densityName);
  const air = atmosphere(mission);
  const animate = !still && layers.drift;

  return (
    /*
     * `fixed` and painted from the DEPTH contract, but note this is a *background plane*, not an
     * overlay: everything in the shell must sit above it. A positioned element with a positive
     * z-index paints above in-flow content in the same stacking context, so AppShell gives the
     * rail and the main column `DEPTH.ui` explicitly. Without that, this veil covers the entire
     * application — the build succeeds, the DOM hydrates, and the product is invisible.
     */
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: DEPTH.deep }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ zIndex: DEPTH.deep }}>
        <AtmosphereVeil nebula={air.nebula} horizon={air.horizon} vignette={vignette} />
      </div>

      <StarField layer="far" opacity={0.7 * air.starOpacity} z={DEPTH.far} />

      {layers.lattice > 0 ? <OrbitalLattice rings={layers.lattice} animate={animate} /> : null}

      <div className="absolute inset-0" style={{ zIndex: DEPTH.near }}>
        {layers.nearStars ? <StarField layer="near" z={DEPTH.near} /> : null}
        <DustMotes
          count={still ? 0 : layers.motes}
          tint={
            air.moteTint === "ember"
              ? "var(--fx-ember)"
              : air.moteTint === "ink"
                ? "var(--fx-ink)"
                : "var(--fx-signal)"
          }
          animate={animate}
          z={DEPTH.near}
        />
      </div>
    </div>
  );
}
