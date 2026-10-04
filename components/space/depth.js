/**
 * Depth contract for the space environment.
 *
 * The single source of truth for how far back each plane sits. Every layer in
 * components/space/* and the 3D canvas declare their position from this object rather than
 * inventing a z-index, because the whole point of the redesign is that the interface reads as
 * a stack of planes rather than a stack of cards. When a plane needs to sit in front of
 * another, this file is where that relationship is written down.
 *
 *   void      the canvas itself — body background
 *   deep      atmosphere gradients and nebula, furthest visible plane
 *   far       distant starfield
 *   lattice   orbital arcs
 *   near      near starfield and drifting motes
 *   subject   the 3D mission object
 *   data      canvas-anchored readouts
 *   ui        instrument panels
 *   overlay   drawers, popovers, focus
 *
 * `subject` and `data` are declared here so the 3D layer and the DOM overlay layer can be
 * reasoned about together; only the canvas mounts at `subject`.
 */
export const DEPTH = {
  void: 0,
  deep: 10,
  far: 20,
  lattice: 30,
  near: 40,
  subject: 50,
  data: 60,
  ui: 70,
  overlay: 80,
};

/**
 * Environment density.
 *
 * One knob, set per route, that scales every decorative layer at once. This is what lets a data
 * route go quiet and a cinematic route go dense without any per-page breakpoint branching —
 * the shell picks a preset and the layers read from it.
 *
 *   cinematic  every layer at full strength. Dashboard hero, Mission Lab.
 *   standard   full starfield, reduced motes, lattice on. Most pages.
 *   quiet      minimal atmosphere, no motes, no lattice. Dense data routes.
 *   still      one static frame: no motes, no rotation. Reduced-motion and save-data.
 */
export const DENSITY = {
  cinematic: { motes: 40, lattice: 2, nearStars: true, vignette: true, drift: true },
  standard: { motes: 22, lattice: 1, nearStars: true, vignette: true, drift: true },
  quiet: { motes: 0, lattice: 0, nearStars: false, vignette: true, drift: false },
  still: { motes: 0, lattice: 0, nearStars: false, vignette: true, drift: false },
};

/**
 * Per-destination atmosphere.
 *
 * Selecting a mission re-tints the environment, so a destination change is felt in the whole
 * frame rather than only in the panel that reports it. Values are deliberate rather than
 * physical: Mars thins the stars, the Moon drops the horizon entirely because there is no
 * atmosphere to scatter light.
 *
 * The atmosphere is monochrome, so these keys no longer select a *hue*. `nebula` picks which of
 * the two neutral depth washes sits behind the others, and `horizon` picks how bright the
 * bloom from the lower edge is. What is left of the destination response is value and
 * placement — which is exactly the part that still reads in a greyscale interface.
 *
 * Deliberately not imported from data/ — components must not reach into the dataset, and an
 * atmosphere tint is a design decision rather than a measurement.
 */
export const ATMOSPHERE = {
  earth: { nebula: "deep", horizon: "cool", starOpacity: 1, moteTint: "ink" },
  iss: { nebula: "deep", horizon: "cool", starOpacity: 1.05, moteTint: "signal" },
  moon: { nebula: "lift", horizon: "none", starOpacity: 1.2, moteTint: "ink" },
  mars: { nebula: "lift", horizon: "warm", starOpacity: 0.85, moteTint: "ember" },
};

export const DEFAULT_ATMOSPHERE = ATMOSPHERE.iss;

/** Resolve a density preset, defaulting to `standard` for an unknown key. */
export function density(name) {
  return DENSITY[name] ?? DENSITY.standard;
}

/** Resolve a destination's atmosphere, defaulting to the station. */
export function atmosphere(missionId) {
  return ATMOSPHERE[missionId] ?? DEFAULT_ATMOSPHERE;
}
