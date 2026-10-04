export const APP_NAME = "FlareNexus";
export const TEAM_NAME = "Cosmic Nexus";
export const CHALLENGE_NAME = "NASA Space Apps Challenge 2026";
export const APP_TAGLINE = "AI-Powered Fire Safety Intelligence for Microgravity Research";

/**
 * Brand lockup.
 *
 * The identity block, the status readouts and the disclosure line, in one place. The header
 * and the console rail both render from here so the two can never drift apart — and so the
 * challenge framing is stated once, correctly, rather than re-typed at each call site.
 */
export const BRAND = {
  /** Wordmark and the line directly beneath it in the identity lockup. */
  lockup: {
    wordmark: APP_NAME,
    tagline: "Microgravity Fire-Safety Intelligence",
    challenge: CHALLENGE_NAME,
    team: TEAM_NAME,
  },

  /** Two-line attribution for the console rail footer. */
  attribution: `${CHALLENGE_NAME} · ${TEAM_NAME}`,
  disclosure:
    "Independent challenge entry. Not affiliated with or endorsed by NASA.",
  prototypeWordmark: "Prototype",

  /**
   * Mission-bar telemetry. These are fixed facts about the dataset rather than live feeds,
   * so nothing polls them — a number that drifts from the data it describes is worse than a
   * number that never moves.
   */
  status: [
    { id: "mission", label: "Mission", detail: "Microgravity research", tone: "brand" },
    { id: "data", label: "Data", detail: "Prototype", tone: "signal" },
    { id: "evidence", label: "Evidence", detail: "Linked", tone: "safe" },
  ],
};

/**
 * Every string in this file is surfaced in the UI. Keeping them together makes the
 * prototype-disclosure policy auditable in one place rather than scattered per page.
 */
export const PROTOTYPE_LABELS = {
  dataset: "Prototype dataset",
  model: "Prototype relevance model",
  trend: "Prototype trend model",
  illustration: "Illustrative trend",
  ai: "Mock AI response",
  notValidated: "Not a validated scientific prediction",
  dataPending: "Evidence-backed behaviour connects to NASA experiment data in the data integration phase.",
  metricsNote:
    "Demonstration figures describing the intended dataset scale. Only 26 sample records are loaded in this prototype.",
  riskNote:
    "Demonstration scoring model. These weights are illustrative and are not scientific risk probabilities.",
  relevanceNote:
    "Prototype scoring across similarity factors. Not a mission-readiness assessment.",
  aiNote:
    "Answers are generated from stored example responses. No language model is connected in this version.",
  sampleNote:
    "26 sample experiment records are loaded. The headline figures describe the target dataset scale, not the loaded sample.",
};

/**
 * Headline dashboard metrics. These describe the dataset FlareNexus is designed to
 * centralise; they are intentionally larger than the loaded sample and are always
 * rendered next to PROTOTYPE_LABELS.dataset.
 */
export const PROTOTYPE_METRICS = [
  { id: "experiments", label: "Experiments", value: "1,240+", icon: "flaskConical" },
  { id: "papers", label: "Research Papers", value: "380+", icon: "fileText" },
  { id: "variables", label: "Key Variables", value: "18", icon: "slidersHorizontal" },
  { id: "insights", label: "AI Insights", value: "342", icon: "sparkles" },
];

export const RESEARCH_TOPICS = [
  "Flame morphology",
  "Flame spread",
  "Flame extinction",
  "Fire suppression",
  "Material flammability",
  "Smoke & combustion products",
  "Oxygen effects",
  "Detection & observability",
];

export const EXPERIMENT_TYPES = [
  "Liquid-fuel combustion",
  "Gaseous flames",
  "Solid material combustion",
];

export const RESEARCH_PROGRAMS = [
  "Saffire",
  "FLEX",
  "BRE",
  "BASS",
  "SAME",
  "SOFIE",
  "ACME",
];

export const EVIDENCE_LEVELS = [
  {
    id: "High",
    label: "High evidence",
    description: "Multiple independent sources describe the same behaviour.",
    tone: "safe",
  },
  {
    id: "Medium",
    label: "Medium evidence",
    description: "Supported by a small number of related observations.",
    tone: "info",
  },
  {
    id: "Limited",
    label: "Limited evidence",
    description: "Single or indirect sources. Treat conclusions as provisional.",
    tone: "ember",
  },
];

export const CONFIDENCE_LEVELS = {
  High: { tone: "safe", guidance: "Multiple records agree on this behaviour." },
  Medium: { tone: "info", guidance: "Supported by a limited set of records." },
  Limited: {
    tone: "ember",
    guidance: "Limited evidence — more research required.",
  },
};

export const MISSION_IDS = ["earth", "iss", "moon", "mars"];

export const GRAVITY_PRESETS = [
  { id: "1g", label: "1g", value: 1, description: "Earth-normal reference" },
  { id: "0.5g", label: "0.5g", value: 0.5, description: "Half gravity reference" },
  { id: "0.1g", label: "0.1g", value: 0.1, description: "Low gravity reference" },
  {
    id: "microgravity",
    label: "μg",
    value: 0.000001,
    description: "Microgravity, effectively weightless",
  },
];

export const AIRFLOW_LEVELS = ["Low", "Medium", "High"];

export const FUEL_OPTIONS = [
  { id: "methane", label: "Methane", type: "Gaseous" },
  { id: "n-heptane", label: "n-Heptane", type: "Liquid" },
  { id: "solid", label: "Solid", type: "Solid" },
];

export const DEFAULT_FLAME_PARAMS = {
  gravity: "0.1g",
  oxygen: 21,
  pressure: 101.3,
  airflow: "Low",
  fuel: "n-heptane",
  temperature: 22,
};

export const FLAME_LIMITS = {
  oxygen: { min: 15, max: 25, step: 0.5, unit: "% O₂" },
  pressure: { min: 70, max: 120, step: 1, unit: "kPa" },
  temperature: { min: 10, max: 60, step: 1, unit: "°C" },
};

/** Rows rendered by the comparison table, in display order. */
export const COMPARISON_FIELDS = [
  { id: "objective", label: "Objective", type: "text" },
  { id: "program", label: "Mission", type: "text" },
  { id: "fuel", label: "Fuel", type: "text" },
  { id: "gravity", label: "Gravity", type: "number", unit: "g", tolerance: 0.05 },
  { id: "oxygen", label: "Oxygen", type: "number", unit: "%", tolerance: 0.6, decimals: 1 },
  { id: "pressure", label: "Pressure", type: "number", unit: "kPa", tolerance: 3, decimals: 1 },
  { id: "flow", label: "Flow", type: "text" },
  { id: "temperature", label: "Temperature", type: "number", unit: "°C", tolerance: 2, decimals: 0 },
  { id: "flameBehavior", label: "Flame behaviour", type: "text" },
  { id: "flameSpread", label: "Flame spread", type: "text" },
  { id: "extinction", label: "Extinction", type: "text" },
  { id: "keyConclusion", label: "Key conclusion", type: "text" },
];

export const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "recent", label: "Recent" },
  { id: "evidence", label: "Evidence strength" },
  { id: "mission", label: "Mission relevance" },
];

export const MAX_COMPARISON_SIZE = 3;
export const EXPLORE_PAGE_SIZE = 9;

export const RECENT_INSIGHT_LIMIT = 3;

/**
 * Weights applied by the demonstration scoring model per environment. These are product
 * parameters, not measurements — they exist so the prototype can show how a scoring service
 * would be consumed. `lib/calculations.js` reads them from here to stay free of data imports.
 */
export const ENVIRONMENT_MODIFIERS = {
  earth: { oxygen: 1, flow: 1, fuel: 1, pressure: 0.9, temperature: 0.95 },
  iss: { oxygen: 1.05, flow: 1, fuel: 0.9, pressure: 0.85, temperature: 0.8 },
  moon: { oxygen: 1.2, flow: 1.15, fuel: 1.1, pressure: 1.2, temperature: 1.1 },
  mars: { oxygen: 1.25, flow: 1.2, fuel: 1.05, pressure: 1.15, temperature: 1.05 },
};

export const MISSION_SCORING_FACTORS = [
  { id: "gravity", label: "Gravity similarity", weight: 0.3 },
  { id: "atmosphere", label: "Atmosphere similarity", weight: 0.28 },
  { id: "fuel", label: "Fuel similarity", weight: 0.22 },
  { id: "confidence", label: "Experimental confidence", weight: 0.2 },
];

export const RISK_FACTOR_KEYS = ["oxygen", "flow", "fuel", "pressure", "temperature"];
