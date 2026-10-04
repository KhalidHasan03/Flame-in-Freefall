import { AIRFLOW_LEVELS, GRAVITY_PRESETS } from "@/lib/constants";

/**
 * Deterministic flame geometry.
 *
 * Every value below is a *stylised* response to the user-selected parameters. It exists to
 * make the visualisation feel connected to its controls, not to reproduce a validated
 * combustion model. All randomness is seeded from the parameter signature so the same
 * inputs always produce byte-identical paths — that keeps server and client renders in
 * sync and stops the flame jittering between React renders.
 */

const VIEW_WIDTH = 220;
const VIEW_HEIGHT = 280;
const BASE_Y = 252;
const MAX_HALF_WIDTH = 46;
const POINTS_PER_SIDE = 34;

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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

/*
 * Fuel palettes. Amber and white only.
 *
 * These four values are the outward, middle, core and halo terms of the flame silhouette, and
 * they used to double as the fuel-type cue — methane was rendered sky-blue, solids amber,
 * n-heptane orange. With the interface monochrome that cue is gone, so fuel identity has to
 * come from the labelled controls and readouts that already name it (`FlameControls`, the fuel
 * field in `FlameMetrics`, the experiment record), and the palettes here vary only in
 * temperature.
 *
 * The three fuels are therefore distinguished by how pale the core runs rather than by hue:
 * a gaseous flame is the coolest and dimmest, a solid panel the hottest and most opaque. That
 * is a weaker cue than a colour was, which is the cost of the monochrome direction, and it is
 * the reason the fuel label stays on screen wherever the flame appears.
 */
const FUEL_PALETTES = {
  methane: { outer: "#b4661f", mid: "#d9974a", core: "#f7e6cf", halo: "#7a4413" },
  "n-heptane": { outer: "#c06a24", mid: "#e0913f", core: "#fdf3e3", halo: "#8a4a17" },
  solid: { outer: "#c07a2c", mid: "#e8a94e", core: "#fff8e8", halo: "#8f561b" },
};

/**
 * Reduced-gravity bias.
 *
 * The literature describes low-gravity flames as dimmer and less elongated, and the previous
 * version expressed that by shifting the whole palette toward blue. The physical claim is kept
 * — but it is expressed as *luminance* now, not hue: the bias drains the palette rather than
 * tinting it, so a microgravity flame reads as a dimmer, smokier version of its own fuel
 * instead of as a differently-coloured one.
 */
const MICROGRAVITY_BIAS = {
  outer: "#4a4038",
  mid: "#6b5c4d",
  core: "#b8ada2",
  halo: "#2e2823",
};

const AIRFLOW_PROFILE = {
  Low: { skew: 0, flicker: 0.035, stretch: 1, lateral: 0 },
  Medium: { skew: 6, flicker: 0.075, stretch: 1.06, lateral: 4 },
  High: { skew: 13, flicker: 0.115, stretch: 1.12, lateral: 9 },
};

export function resolveGravityValue(gravityId) {
  const preset = GRAVITY_PRESETS.find((item) => item.id === gravityId);
  return preset ? preset.value : 0.1;
}

export function getFlameProfile(params) {
  const gravity = resolveGravityValue(params.gravity);
  const gravityNorm = clamp(Math.log10(gravity + 0.01) / Math.log10(1.01), 0, 1);
  const oxygenNorm = clamp(((params.oxygen ?? 21) - 15) / 10, 0, 1);
  const pressureNorm = clamp(((params.pressure ?? 101.3) - 70) / 50, 0, 1);
  const temperatureNorm = clamp(((params.temperature ?? 22) - 10) / 50, 0, 1);
  const airflow = AIRFLOW_LEVELS.includes(params.airflow) ? params.airflow : "Low";
  const flow = AIRFLOW_PROFILE[airflow];
  const fuel = FUEL_PALETTES[params.fuel] ? params.fuel : "n-heptane";

  const elongation = (1.05 + 1.62 * Math.pow(gravityNorm, 0.45)) * flow.stretch;
  const halfWidth = MAX_HALF_WIDTH * (0.6 + 0.4 * oxygenNorm) * (1 + (1 - gravityNorm) * 0.16);
  const height = halfWidth * elongation;
  const sphericity = clamp(1 - (elongation - 1) / 2.6, 0, 1);

  const base = FUEL_PALETTES[fuel];
  const blend = (1 - gravityNorm) * 0.55;

  return {
    signature: `${params.gravity}|${params.oxygen}|${params.pressure}|${airflow}|${fuel}|${params.temperature}`,
    fuel,
    airflow,
    gravity,
    gravityNorm,
    sphericity,
    elongation,
    halfWidth,
    height,
    centerX: VIEW_WIDTH / 2,
    baseY: BASE_Y,
    skew: flow.skew,
    lateral: flow.lateral,
    flicker: flow.flicker,
    coreRatio: 0.3 + 0.2 * oxygenNorm,
    luminosity: clamp(
      0.4 + 0.4 * oxygenNorm + 0.12 * temperatureNorm + 0.18 * (1 - gravityNorm) - 0.1 * pressureNorm,
      0.18,
      1,
    ),
    haloRadius: halfWidth * (1.7 + 0.5 * (1 - gravityNorm)),
    palette: {
      outer: mixHex(base.outer, MICROGRAVITY_BIAS.outer, blend),
      mid: mixHex(base.mid, MICROGRAVITY_BIAS.mid, blend),
      core: mixHex(base.core, MICROGRAVITY_BIAS.core, blend),
      halo: mixHex(base.halo, MICROGRAVITY_BIAS.halo, blend),
    },
  };
}

/**
 * Sample the per-lobe noise field along a lobe.
 *
 * The field is a fixed-length table of uniform values, but a lobe needs a value at every point,
 * not only at the integers. Indexing the table directly with a fractional coordinate returns
 * `undefined` for every non-integer coordinate — which is every coordinate except the first —
 * and that propagates to `NaN` coordinates and a path the browser refuses to render.
 *
 * So interpolate, and wrap, which keeps the field seamless between its last and first entries.
 */
function sampleNoise(noise, x) {
  const size = noise.length;
  const index = Math.floor(x);
  const fraction = x - index;
  const from = noise[index % size];
  const to = noise[(index + 1) % size];
  return from + (to - from) * fraction;
}

function buildLobe(profile, { scale, noise, wobbleScale, heightScale, yOffset }) {
  const halfWidth = profile.halfWidth * scale;
  const height = profile.height * heightScale;
  const baseY = profile.baseY + yOffset;
  const lean = profile.lateral * heightScale;
  const fullness = 0.58 + profile.sphericity * 0.22;
  const points = [];

  const addPoint = (v, side) => {
    const halfWidthAtHeight = halfWidth * Math.pow(Math.max(0, 1 - v * v), fullness);
    const anchor = Math.pow(v, 1.6);
    const jitter = (sampleNoise(noise, v * 7.3) - 0.5) * profile.flicker * anchor * wobbleScale;
    const px = profile.centerX + side * halfWidthAtHeight * (1 + jitter) + lean * anchor;
    const py = baseY - v * height - jitter * halfWidth * 1.6;
    points.push([px, py]);
  };

  for (let i = 0; i <= POINTS_PER_SIDE; i += 1) addPoint(i / POINTS_PER_SIDE, 1);
  for (let i = POINTS_PER_SIDE; i >= 0; i -= 1) addPoint(i / POINTS_PER_SIDE, -1);

  return `M ${points
    .map(([x, y], index) => `${index === 0 ? "" : "L "}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")} Z`;
}

export function buildFlameLayers(profile) {
  const layers = [
    { id: "halo", role: "halo", opacity: 0.45 * profile.luminosity + 0.12 },
    { id: "outer", role: "outer", opacity: 0.9 },
    { id: "mid", role: "mid", opacity: 0.95 },
    { id: "core", role: "core", opacity: 1 },
  ];

  const configs = {
    halo: { scale: 1.16, wobbleScale: 1.5, heightScale: 0.72, yOffset: -8 },
    outer: { scale: 1, wobbleScale: 1, heightScale: 1, yOffset: 0 },
    mid: { scale: 0.7, wobbleScale: 0.7, heightScale: 0.9, yOffset: -2 },
    core: { scale: 0.34, wobbleScale: 0.45, heightScale: 0.72, yOffset: -1 },
  };

  return layers.map((layer) => {
    const config = configs[layer.role];
    const random = mulberry32(hashString(`${profile.signature}|${layer.id}`));
    const noise = Array.from({ length: 48 }, () => random());
    return {
      ...layer,
      d: buildLobe(profile, { ...config, noise }),
      blur: layer.role === "halo" ? 26 : layer.role === "outer" ? 6 : layer.role === "mid" ? 3 : 0,
    };
  });
}

export const FLAME_VIEWBOX = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
export const FLAME_BASE_Y = BASE_Y;
