/**
 * Mission / environment records.
 *
 * The environmental values below are deliberately coarse reference figures used for UI
 * context and filtering. They are NOT atmospheric models, NOT habitat specifications, and
 * NOT fire-safety limits. Every card renders `caveat` for this reason — a simplified
 * one-line atmosphere is not a substitute for an environmental control document.
 */

export const missions = [
  {
    id: "earth",
    name: "Earth",
    shortName: "1g",
    gravityLabel: "1g",
    gravityValue: 1,
    atmosphereLabel: "21% O₂",
    atmosphereShort: "Nitrogen–oxygen, ambient",
    oxygenValue: 21,
    indicator: "reference",
    context:
      "The terrestrial case every microgravity record is read against. Buoyant transport dominates flame shape, transport is strong, and most material screening is performed here.",
    combustionEnvironment:
      "Buoyancy-driven transport, continuous convective mixing, unconstrained volume.",
    primaryConcern:
      "Baseline. Gravity-driven transport shapes both flame behaviour and any suppression strategy.",
    concerns: [
      "Buoyant transport dominates flame envelope shape",
      "Extinction threshold is sharply sensitive to low flow",
      "Ground material screening does not transfer to orbit",
    ],
    caveat: "Reference environment. Values shown for context only.",
  },
  {
    id: "iss",
    name: "ISS",
    shortName: "Orbital μg",
    gravityLabel: "~1g*",
    gravityValue: 0.000001,
    atmosphereLabel: "21% O₂",
    atmosphereShort: "Pressurised, crewed volume",
    oxygenValue: 21,
    indicator: "orbital",
    context:
      "A pressurised, crewed, closed volume in continuous free fall. Most of the orbital combustion records in this dataset were flown in this class of environment.",
    combustionEnvironment:
      "No buoyant transport inside the volume. Forced ventilation is the primary transport mechanism.",
    primaryConcern:
      "Reduced buoyant assistance slows flame spread and changes what reaches detection and suppression systems.",
    concerns: [
      "Oxygen depletion without forced mixing is slow",
      "Burning material can migrate away from the ignition point",
      "Detection elements placed by buoyant logic may be in the wrong place",
    ],
    caveat:
      "Gravity shown as an effective value. Microgravity here is residual, not zero. Pressurisation, not vacuum, defines the combustion environment.",
  },
  {
    id: "moon",
    name: "Moon",
    shortName: "0.16g",
    gravityLabel: "0.16g",
    gravityValue: 0.16,
    atmosphereLabel: "Near-vacuum",
    atmosphereShort: "Near-vacuum external, pressurised interior",
    oxygenValue: 0,
    indicator: "airless",
    context:
      "An airless body with no usable external oxidiser. Combustion questions are therefore about the pressurised interior, where an atmosphere is supplied by the habitat rather than the environment.",
    combustionEnvironment:
      "External: no sustained combustion without supplied oxidiser. Interior: pressurised, closed, and entirely crew-dependent.",
    primaryConcern:
      "Life support is the oxidiser source. A fire competes directly with the crew for the same supply.",
    concerns: [
      "No atmospheric buffer — every consumable is life support consumable",
      "No natural convective mixing, so suppression depends on forced systems",
      "Materials must be verified in situ; there is no ground analogue for the interior",
    ],
    caveat:
      "Near-vacuum is an external condition. Combustion of interest occurs inside a pressurised, sealed habitat. No intermediate-gravity orbital data exists in this dataset.",
  },
  {
    id: "mars",
    name: "Mars",
    shortName: "0.38g",
    gravityLabel: "0.38g",
    gravityValue: 0.38,
    atmosphereLabel: "CO₂-rich",
    atmosphereShort: "CO₂-dominant, trace O₂",
    oxygenValue: 0,
    indicator: "inert-rich",
    context:
      "A thin, carbon-dioxide dominated atmosphere with a small oxygen fraction. At the surface the external environment is not a sustained combustion oxidiser, which again moves the question to the pressurised interior.",
    combustionEnvironment:
      "External: CO₂-diluted, not a combustion oxidiser. Interior: pressurised and closed, as for the Moon.",
    primaryConcern:
      "Same life-support competition as the Moon, with a lower-gravity interior where buoyant assistance is partially restored.",
    concerns: [
      "Partial gravity assistance changes spread behaviour relative to microgravity",
      "CO₂-diluted external environment offers no suppression assistance",
      "Zero coverage at this gravity level in the current dataset",
    ],
    caveat:
      "Atmospheric values are indicative only and describe a surface environment, not a habitat specification. No experiments in this dataset were conducted at 0.38g.",
  },
];

const BY_ID = new Map(missions.map((mission) => [mission.id, mission]));

export function getMissionById(id) {
  return BY_ID.get(id) ?? missions[0];
}

export function getDefaultMission() {
  return missions[0];
}

/** Row definitions for the Moon vs Mars comparison card. */
export const MISSION_COMPARISON_ROWS = [
  { id: "gravity", label: "Gravity", pick: (mission) => mission.gravityLabel },
  {
    id: "atmosphere",
    label: "Atmospheric context",
    pick: (mission) => mission.atmosphereShort,
  },
  {
    id: "oxygen",
    label: "Oxygen availability",
    pick: (mission) => (mission.oxygenValue > 0 ? "Pressurised supply" : "Life support supplied"),
  },
  {
    id: "combustion",
    label: "Combustion environment",
    pick: (mission) => mission.combustionEnvironment,
  },
  { id: "concern", label: "Primary fire-safety concern", pick: (mission) => mission.primaryConcern },
];
