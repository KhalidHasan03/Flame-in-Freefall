/**
 * Environment plate data and envelope.
 *
 * A scene per destination: the body's limb, a horizon, and a flame whose silhouette responds to that
 * world's gravity and oxygen. Drawn as SVG and CSS rather than a bitmap or a second WebGL context,
 * because the dashboard already runs a live canvas and four more would compete with it.
 *
 * Monochrome throughout. The four destinations are separated by *value* rather than by hue — Earth
 * sits mid-grey, the Moon brightest, Mars darkest — which is what keeps four small circles
 * readable as four different places now that none of them is a different colour.
 *
 * Three deliberate choices worth stating:
 *
 * 1. No open sky on the Moon and Mars plates. Their atmospheres are not combustion oxidisers, so
 *    combustion of interest happens inside a pressurised closed volume. Drawing a flame under an
 *    open black sky would imply the surface sustains combustion, which is wrong. Those plates get a
 *    hard surface line and a star wash instead; only Earth gets a sky.
 *
 * 2. The envelope is normalised here rather than through `getFlameProfile`. That function maps
 *    gravity with `log10(g + 0.01) / log10(1.01)`, whose divisor makes the expression return 1 only
 *    at exactly 1g — every value below 1g produces a negative log that clamps to 0, so all
 *    sub-1g profiles collapse to one identical flame. That is a pre-existing defect across the whole
 *    app, not something introduced here. Fixing it in `lib/flameGeometry.js` would change every
 *    route, which was explicitly out of scope, so the plates normalise against the real mission
 *    gravity themselves and reuse the shared lobe geometry and palettes.
 *
 * 3. Plate palettes mirror `lib/flameGeometry.js`. Both are amber-and-white for the same reason, and
 *    both express reduced gravity as reduced luminance rather than as a hue shift.
 */

import { buildFlameLayers } from "@/lib/flameGeometry";

/** Lowest gravity the preset ladder models — the free-fall floor. */
const GRAVITY_FLOOR = 0.000001;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Effective gravity for each world, from the mission records rather than the preset ladder. */
export const ENVIRONMENT_PLATES = [
  {
    id: "earth",
    name: "Earth",
    gravityLabel: "1g",
    gravity: 1,
    strapline: "Buoyant reference",
    // Warm and tall: buoyancy is strongest here, so this is the only plate with visible sky.
    fuel: "n-heptane",
    fuelLabel: "n-Heptane",
    openSky: true,
    lit: "#8e8e8e",
    mid: "#3a3a3a",
    shadow: "#0c0c0c",
    limb: "#f4f4f4",
    sky: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 46%, transparent 68%)",
    surface: "rgba(14,14,14,0.9)",
    horizonGlow: "rgba(255,255,255,0.14)",
  },
  {
    id: "iss",
    name: "ISS",
    gravityLabel: "μg",
    gravity: 0.000001,
    strapline: "Free fall, closed volume",
    // Near-spherical and mid-dark: with no buoyancy the envelope stops tapering.
    fuel: "methane",
    fuelLabel: "Methane",
    openSky: false,
    lit: "#5e5e5e",
    mid: "#242424",
    shadow: "#060606",
    limb: "#dcdcdc",
    sky: "none",
    surface: "rgba(9,9,9,0.94)",
    horizonGlow: "rgba(255,255,255,0.10)",
  },
  {
    id: "moon",
    name: "Moon",
    gravityLabel: "0.16g",
    gravity: 0.16,
    strapline: "Pressurised interior",
    fuel: "n-heptane",
    fuelLabel: "n-Heptane",
    openSky: false,
    lit: "#c4c4c4",
    mid: "#585858",
    shadow: "#0a0a0a",
    limb: "#ffffff",
    sky: "none",
    surface: "rgba(12,12,12,0.96)",
    horizonGlow: "rgba(255,255,255,0.16)",
  },
  {
    id: "mars",
    name: "Mars",
    gravityLabel: "0.38g",
    gravity: 0.38,
    strapline: "Pressurised interior",
    fuel: "n-heptane",
    fuelLabel: "n-Heptane",
    openSky: false,
    lit: "#6b6058",
    mid: "#2c2622",
    shadow: "#080706",
    limb: "#e8e0d8",
    sky: "none",
    surface: "rgba(18,15,13,0.96)",
    horizonGlow: "rgba(240,232,224,0.12)",
  },
];

export function getEnvironmentPlate(id) {
  return ENVIRONMENT_PLATES.find((plate) => plate.id === id) ?? ENVIRONMENT_PLATES[0];
}

/** Mirrors FUEL_PALETTES and MICROGRAVITY_BIAS in lib/flameGeometry.js. */
const FUEL_PALETTES = {
  "n-heptane": { outer: "#c06a24", mid: "#e0913f", core: "#fdf3e3", halo: "#8a4a17" },
  methane: { outer: "#b4661f", mid: "#d9974a", core: "#f7e6cf", halo: "#7a4413" },
};
const MICROGRAVITY_BIAS = {
  outer: "#4a4038",
  mid: "#6b5c4d",
  core: "#b8ada2",
  halo: "#2e2823",
};

function mixHex(from, to, amount) {
  const parse = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const blend = (a, b) => Math.round(a + (b - a) * amount);
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(blend(r1, r2))}${toHex(blend(g1, g2))}${toHex(blend(b1, b2))}`;
}

/**
 * Envelope for a plate.
 *
 * Gravity is mapped linearly over [floor, 1g] rather than logarithmically, because the physical
 * driver is buoyant acceleration, which scales with g itself. That keeps 0.16g and 0.38g visibly
 * distinct from each other and from both 1g and free fall, which is the entire point of the plate
 * row. Everything downstream — the lobe path, the blur, the sphericity readout — is the shared
 * geometry reading this profile, so the art and the number cannot disagree.
 */
export function getPlateProfile(plate) {
  const gravityNorm = clamp((plate.gravity - GRAVITY_FLOOR) / (1 - GRAVITY_FLOOR), 0, 1);
  const elongation = 1.05 + 1.62 * Math.pow(gravityNorm, 0.45);
  const halfWidth = 46 * (0.78 - 0.18 * gravityNorm) * (1 + (1 - gravityNorm) * 0.16);
  const height = halfWidth * elongation;
  const base = FUEL_PALETTES[plate.fuel] ?? FUEL_PALETTES["n-heptane"];
  const blend = (1 - gravityNorm) * 0.55;

  return {
    signature: `plate|${plate.id}|${plate.fuel}|${plate.gravity}`,
    gravity: plate.gravity,
    gravityNorm,
    elongation,
    halfWidth,
    height,
    centerX: 110,
    baseY: 252,
    skew: 0,
    lateral: 0,
    flicker: 0.035,
    sphericity: clamp(1 - (elongation - 1) / 2.6, 0, 1),
    coreRatio: 0.4,
    luminosity: clamp(0.4 + 0.4 * 0.6 + 0.18 * (1 - gravityNorm), 0.18, 1),
    haloRadius: halfWidth * (1.7 + 0.5 * (1 - gravityNorm)),
    palette: {
      outer: mixHex(base.outer, MICROGRAVITY_BIAS.outer, blend),
      mid: mixHex(base.mid, MICROGRAVITY_BIAS.mid, blend),
      core: mixHex(base.core, MICROGRAVITY_BIAS.core, blend),
      halo: mixHex(base.halo, MICROGRAVITY_BIAS.halo, blend),
    },
  };
}

/** Layer paths for a plate, from the shared lobe builder. */
export function getPlateLayers(plate) {
  return buildFlameLayers(getPlateProfile(plate));
}
