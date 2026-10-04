import {
  AIRFLOW_LEVELS,
  COMPARISON_FIELDS,
  ENVIRONMENT_MODIFIERS,
  FLAME_LIMITS,
  MISSION_SCORING_FACTORS,
  RISK_FACTOR_KEYS,
} from "@/lib/constants";
import { formatGravity, formatOxygen } from "@/lib/formatters";
import { resolveGravityValue } from "@/lib/flameGeometry";

/*
 * ---------------------------------------------------------------------------
 * PROTOTYPE SCORING MODEL — v0
 * ---------------------------------------------------------------------------
 * Every function in this file produces a *demonstration* value.
 *
 * The numbers are deterministic heuristics assembled from publicly described qualitative
 * trends in microgravity combustion research. They are NOT measurements, NOT a combustion
 * simulation, and NOT a validated risk prediction. They exist so the interface can show how
 * a real ML/RAG scoring service will be consumed once NASA datasets are connected.
 *
 * Replacement plan: each function maps 1:1 onto a future endpoint in lib/api/. The UI reads
 * the same field names either way, so swapping the implementation is a one-file change.
 * ---------------------------------------------------------------------------
 */

const SCALE_STEPS = [
  { ceiling: 25, label: "Low", tone: "safe" },
  { ceiling: 50, label: "Moderate", tone: "info" },
  { ceiling: 75, label: "Elevated", tone: "ember" },
  { ceiling: 100, label: "High", tone: "alert" },
];

const DOWNFILL_STEPS = [
  { ceiling: 25, label: "Minimal", tone: "safe" },
  { ceiling: 50, label: "Moderate", tone: "info" },
  { ceiling: 75, label: "Considerable", tone: "ember" },
  { ceiling: 100, label: "Strong", tone: "alert" },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalise(value, { min, max }) {
  return clamp((value - min) / (max - min), 0, 1);
}

function toStep(value, steps = SCALE_STEPS) {
  return steps.find((step) => value <= step.ceiling) ?? steps[steps.length - 1];
}

function round(value) {
  return Math.round(value);
}

/* -------------------------------------------------------------------------- */
/* Flame Lab — observed behaviour                                              */
/* -------------------------------------------------------------------------- */

export function calculatePrototypeTrend(params) {
  const gravityNorm = normalise(Math.log10(resolveGravityValue(params.gravity) + 0.01) / Math.log10(1.01), {
    min: 0,
    max: 1,
  });
  const oxygenNorm = normalise(params.oxygen, FLAME_LIMITS.oxygen);
  const pressureNorm = normalise(params.pressure, FLAME_LIMITS.pressure);
  const temperatureNorm = normalise(params.temperature, FLAME_LIMITS.temperature);
  const airflowIndex = Math.max(0, AIRFLOW_LEVELS.indexOf(params.airflow));
  const flowNorm = airflowIndex / (AIRFLOW_LEVELS.length - 1);

  const flameSize = round(
    clamp(28 + 46 * oxygenNorm + 14 * pressureNorm + 8 * temperatureNorm - 20 * (1 - gravityNorm), 5, 100),
  );

  const elongation = 1.05 + 1.62 * Math.pow(gravityNorm, 0.45);
  const flameShape = round(clamp(((elongation - 1.05) / 1.62) * 100, 0, 100));
  const shapeStep = toStep(flameShape);

  const fuelSpreadWeight = { solid: 1, methane: 0.55, "n-heptane": 0.45 }[params.fuel] ?? 0.5;
  const spreadTendency = round(
    clamp(18 + 34 * flowNorm + 26 * fuelSpreadWeight + 16 * oxygenNorm + 14 * (1 - gravityNorm), 0, 100),
  );

  const extinctionTendency = round(
    clamp(
      22 + 30 * flowNorm + 22 * (1 - oxygenNorm) + 18 * (1 - gravityNorm) - 10 * temperatureNorm,
      0,
      100,
    ),
  );

  const detectionDifficulty = round(
    clamp(24 + 46 * (1 - gravityNorm) + 20 * (1 - oxygenNorm) + 12 * flowNorm - 8 * temperatureNorm, 0, 100),
  );

  return {
    model: "prototype-trend-v0",
    flameSize: { value: flameSize, ...toStep(flameSize) },
    flameShape: { value: flameShape, label: shapeStep.label, tone: shapeStep.tone },
    spreadTendency: { value: spreadTendency, ...toStep(spreadTendency, DOWNFILL_STEPS) },
    extinctionTendency: { value: extinctionTendency, ...toStep(extinctionTendency, DOWNFILL_STEPS) },
    detectionDifficulty: { value: detectionDifficulty, ...toStep(detectionDifficulty, DOWNFILL_STEPS) },
    observedTrend: describeObservedTrend({
      gravityNorm,
      oxygenNorm,
      flowNorm,
      fuelSpreadWeight,
      params,
    }),
  };
}

function describeObservedTrend({ gravityNorm, oxygenNorm, flowNorm, fuelSpreadWeight, params }) {
  if (gravityNorm < 0.25) {
    return "Lower gravity tends to produce a more spherical diffusion-dominated flame, with weaker buoyant removal of combustion products.";
  }
  if (flowNorm > 0.6 && fuelSpreadWeight > 0.7) {
    return "Forced convection combined with a solid fuel favours downstream flame spread over localised burning.";
  }
  if (flowNorm > 0.6) {
    return "Elevated airflow dominates over buoyant transport, tilting the flame and shortening its visible length.";
  }
  if (oxygenNorm < 0.4) {
    return "Leaner oxidiser availability limits the reaction zone, producing a smaller, cooler and dimmer flame.";
  }
  if (gravityNorm > 0.7) {
    return "Nominally normal gravity sustains the familiar elongated, buoyantly shaped flame profile.";
  }
  return `At ${formatOxygen(params.oxygen)} and ${formatGravity(resolveGravityValue(params.gravity))} the selected conditions sit in the transition zone between buoyancy-driven and diffusion-limited behaviour.`;
}

/* -------------------------------------------------------------------------- */
/* Fire risk factors — demonstration scoring model                             */
/* -------------------------------------------------------------------------- */

const FUEL_WEIGHTS = { methane: 58, "n-heptane": 64, solid: 86 };

export function calculateRiskFactors({ mission = "earth", params }) {
  const modifier = ENVIRONMENT_MODIFIERS[mission] ?? ENVIRONMENT_MODIFIERS.earth;
  const oxygenNorm = normalise(params.oxygen ?? 21, FLAME_LIMITS.oxygen);
  const pressureNorm = normalise(params.pressure ?? 101.3, FLAME_LIMITS.pressure);
  const temperatureNorm = normalise(params.temperature ?? 22, FLAME_LIMITS.temperature);
  const flowNorm = Math.max(0, AIRFLOW_LEVELS.indexOf(params.airflow)) / (AIRFLOW_LEVELS.length - 1);

  const raw = {
    oxygen: round(clamp(30 + Math.abs(oxygenNorm - 0.6) * 90, 5, 100)),
    flow: round(clamp(18 + flowNorm * 72, 5, 100)),
    fuel: FUEL_WEIGHTS[params.fuel] ?? 60,
    pressure: round(clamp(24 + pressureNorm * 68, 5, 100)),
    temperature: round(clamp(20 + temperatureNorm * 70, 5, 100)),
  };

  const factors = RISK_FACTOR_KEYS.map((key) => {
    const value = round(clamp(raw[key] * (modifier[key] ?? 1), 4, 100));
    return { key, value, ...toStep(value) };
  });

  const overall = round(factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length);

  return {
    model: "prototype-risk-v0",
    factors,
    overall: { value: overall, ...toStep(overall) },
  };
}

/* -------------------------------------------------------------------------- */
/* Mission relevance — prototype scoring                                       */
/* -------------------------------------------------------------------------- */

const MISSION_REFERENCE = {
  earth: { gravity: 1, oxygen: 21, fuels: ["methane", "n-heptane"] },
  iss: { gravity: 0.000001, oxygen: 21, fuels: ["methane", "n-heptane"] },
  moon: { gravity: 0.16, oxygen: 0, fuels: ["solid"] },
  mars: { gravity: 0.38, oxygen: 0, fuels: ["solid"] },
};

export function calculateMissionRelevance({ mission = "earth", experiment }) {
  const reference = MISSION_REFERENCE[mission] ?? MISSION_REFERENCE.earth;
  const experimentGravity = resolveGravityValue(experiment?.gravity ?? experiment?.gravityId ?? "0.1g");
  const gravityGap = Math.abs(Math.log10(experimentGravity + 0.01) - Math.log10(reference.gravity + 0.01));
  const oxygenGap = Math.min(1, Math.abs((experiment?.oxygen ?? 21) - reference.oxygen) / 21);
  const fuelMatch = reference.fuels.includes(experiment?.fuel) ? 1 : 0.35;
  const confidence = (experiment?.evidenceScore ?? 60) / 100;

  const raw = {
    gravity: round(clamp(100 - gravityGap * 46, 5, 100)),
    atmosphere: round(clamp(100 - oxygenGap * 62, 5, 100)),
    fuel: round(fuelMatch * 100),
    confidence: round(clamp(confidence * 100, 5, 100)),
  };

  const factors = MISSION_SCORING_FACTORS.map((factor) => ({ ...factor, value: raw[factor.id] }));
  const score = round(factors.reduce((sum, factor) => sum + factor.value * factor.weight, 0));

  return { model: "prototype-relevance-v0", score, factors };
}

/* -------------------------------------------------------------------------- */
/* Explorer ranking                                                            */
/* -------------------------------------------------------------------------- */

export function scoreExperiment({ experiment, query = "", mission = null }) {
  let score = experiment.evidenceScore ?? 50;

  if (mission) {
    score = score * 0.55 + calculateMissionRelevance({ mission, experiment }).score * 0.45;
  }

  const needle = query.trim().toLowerCase();
  if (needle) {
    const haystack = [
      experiment.id,
      experiment.title,
      experiment.program,
      experiment.fuel,
      experiment.topic,
      experiment.type,
      experiment.keyFinding,
      ...(experiment.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const terms = needle.split(/\s+/).filter(Boolean);
    const hits = terms.filter((term) => haystack.includes(term)).length;
    score += terms.length ? (hits / terms.length) * 40 : 0;
  }

  return score;
}

export function filterExperiments(experiments, { query = "", filters = {}, mission = null } = {}) {
  return experiments.filter((experiment) => {
    if (mission && experiment.mission !== mission) return false;

    if (filters.program && filters.program !== "all" && experiment.program !== filters.program) return false;
    if (filters.fuel && filters.fuel !== "all" && experiment.fuel !== filters.fuel) return false;
    if (filters.topic && filters.topic !== "all" && experiment.topic !== filters.topic) return false;
    if (filters.type && filters.type !== "all" && experiment.type !== filters.type) return false;
    if (filters.evidence && filters.evidence !== "all" && experiment.evidenceLevel !== filters.evidence) return false;

    if (filters.gravity && filters.gravity !== "all") {
      const bands = {
        microgravity: (g) => g < 0.001,
        low: (g) => g >= 0.001 && g < 0.5,
        partial: (g) => g >= 0.5 && g < 1,
        ground: (g) => g >= 1,
      };
      if (!bands[filters.gravity]?.(resolveGravityValue(experiment.gravity))) return false;
    }

    if (filters.airflow && filters.airflow !== "all" && experiment.airflow !== filters.airflow) return false;

    if (filters.oxygenMax && Number(experiment.oxygen) > Number(filters.oxygenMax)) return false;
    if (filters.oxygenMin && Number(experiment.oxygen) < Number(filters.oxygenMin)) return false;
    if (filters.pressureMax && Number(experiment.pressure) > Number(filters.pressureMax)) return false;
    if (filters.pressureMin && Number(experiment.pressure) < Number(filters.pressureMin)) return false;

    return true;
  });
}

export function sortExperiments(experiments, sortKey, mission = null) {
  const sorted = [...experiments];
  switch (sortKey) {
    case "recent":
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "evidence":
      return sorted.sort((a, b) => b.evidenceScore - a.evidenceScore);
    case "mission":
      return sorted.sort(
        (a, b) => calculateMissionRelevance({ mission: mission ?? a.mission, experiment: b }).score -
          calculateMissionRelevance({ mission: mission ?? a.mission, experiment: a }).score,
      );
    case "relevance":
    default:
      return sorted.sort(
        (a, b) => scoreExperiment({ experiment: b, mission }) - scoreExperiment({ experiment: a, mission }),
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Comparison                                                                  */
/* -------------------------------------------------------------------------- */

function readField(experiment, field) {
  const source = field.id === "program" ? "program" : field.id === "flow" ? "airflow" : field.id;
  return experiment[source] ?? experiment.variables?.[source] ?? "Not recorded";
}

function diffFor(field, values) {
  if (field.type === "number") {
    const numbers = values.map(Number).filter((value) => !Number.isNaN(value));
    if (numbers.length < 2) return null;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    if (max - min <= (field.tolerance ?? 0)) return null;
    return {
      kind: "range",
      text: `${field.label} differs by ${(max - min).toFixed(field.decimals ?? 1)} ${field.unit} across the selection.`,
      values: values.map((value) => Number(value)),
    };
  }

  const unique = [...new Set(values.map((value) => String(value).toLowerCase()))];
  if (unique.length < 2) return null;
  return { kind: "categorical", text: `${field.label} is not matched across the selection.`, values };
}

export function buildComparisonRows(experiments) {
  if (experiments.length < 2) return [];
  return COMPARISON_FIELDS.map((field) => {
    const values = experiments.map((experiment) => readField(experiment, field));
    return { field, values, difference: diffFor(field, values) };
  });
}

export function buildDifferenceSummary(experiments) {
  if (experiments.length < 2) return null;
  const rows = buildComparisonRows(experiments).filter((row) => row.difference);
  const numeric = rows.filter((row) => row.field.type === "number").slice(0, 2);
  const categorical = rows.filter((row) => row.field.type === "text").slice(0, 2);

  const parts = [];
  if (numeric.length) {
    parts.push(
      `The dominant controlled differences are ${numeric
        .map((row) => row.field.label.toLowerCase())
        .join(" and ")}.`,
    );
  }
  if (categorical.length) {
    parts.push(
      `These studies also differ in ${categorical
        .map((row) => row.field.label.toLowerCase())
        .join(" and ")}, so behavioural differences cannot be attributed to a single variable.`,
    );
  }
  if (!parts.length) {
    return "The selected records share the same recorded conditions. Their differing conclusions most likely reflect measurement method or reporting scope rather than experimental setup.";
  }
  return parts.join(" ");
}

export function getOxygenDifference(experiments) {
  const numbers = experiments.map((experiment) => Number(experiment.oxygen)).filter((n) => !Number.isNaN(n));
  if (numbers.length < 2) return null;
  return Math.max(...numbers) - Math.min(...numbers);
}
