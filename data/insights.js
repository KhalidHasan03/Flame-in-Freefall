
/**
 * Research insight records.
 *
 * Every entry links back to the experiment IDs that motivated it, so a judge can click any
 * claim through to its evidence. Chart series are illustrative demonstration data and are
 * labelled as such in the UI; the scatter series is derived from the loaded experiment
 * records rather than authored separately.
 */
export const emergingPatterns = [
  {
    id: "PAT-01",
    title: "Buoyant transport accounts for most of the ground flame envelope",
    topic: "Flame morphology",
    statement: "Across the liquid fuel records, the difference between a 1g flame and its microgravity counterpart is consistently attributed to convective transport rather than to a change in the reaction chemistry.",
    supportingIds: [
      "FLAME-01",
      "FLEX-06",
      "REF-22",
      "ACME-18"
    ],
    strength: "High"
  },
  {
    id: "PAT-02",
    title: "Passive oxygen depletion is slower without convective mixing",
    topic: "Fire suppression",
    statement: "The sealed-volume record shows a more uniform and more slowly declining oxygen field when buoyant mixing is absent, which weakens passive depletion as a suppression mechanism.",
    supportingIds: [
      "BASS-09",
      "FLAME-25",
      "SOFIE-17"
    ],
    strength: "Medium"
  },
  {
    id: "PAT-03",
    title: "Forced ventilation is the dominant controllable variable",
    topic: "Fire suppression",
    statement: "Where ventilation was varied against other parameters, it produced the largest differences in flame size, stability and spread. This is the clearest actionable finding in the dataset.",
    supportingIds: [
      "SOFIE-17",
      "ACME-19",
      "BASS-10"
    ],
    strength: "High"
  },
  {
    id: "PAT-04",
    title: "Fuel chemistry drives visibility more than gravity does",
    topic: "Detection & observability",
    statement: "Gaseous and reactive solid fuels remained clearly visible in microgravity, while liquid fuel flames were dim. Brightness is a fuel property, and treating it as an environmental property leads to incorrect detection assumptions.",
    supportingIds: [
      "SOFIE-15",
      "ACME-19",
      "FLAME-01",
      "FLAME-02"
    ],
    strength: "Medium"
  },
  {
    id: "PAT-05",
    title: "What is produced is separable from where it goes",
    topic: "Smoke & combustion products",
    statement: "Particulate yield transferred between environments while its distribution did not. Detection and exposure models should treat emission and transport as separate problems.",
    supportingIds: [
      "REF-24",
      "SAME-11",
      "SOFIE-16"
    ],
    strength: "Medium"
  }
];
export const highRelevanceFindings = [
  {
    id: "FND-01",
    title: "Ground material screening does not transfer to orbit",
    statement: "A number of materials classified as self-extinguishing at 1g sustained burning under the same screening protocol in microgravity.",
    missionImpact: "High",
    supportingIds: [
      "SOFIE-13",
      "REF-23"
    ]
  },
  {
    id: "FND-02",
    title: "Suppression agent rankings reverse between environments",
    statement: "Agents that performed well terrestrially failed to achieve prompt extinction in a crewed-volume configuration.",
    missionImpact: "High",
    supportingIds: [
      "SOFIE-14",
      "BASS-10"
    ]
  },
  {
    id: "FND-03",
    title: "Reduced buoyant assistance slows but does not stop lateral spread",
    statement: "Panel propagation remained self-sustaining in microgravity at a lower rate than the matched ground case.",
    missionImpact: "High",
    supportingIds: [
      "SAME-12",
      "FLAME-03",
      "SOFIE-26"
    ]
  },
  {
    id: "FND-04",
    title: "Burning material migrates away from the ignition point",
    statement: "Ignited hardware assemblies produced sustained burning with material moving from the origin, complicating targeted suppression.",
    missionImpact: "High",
    supportingIds: [
      "SOFIE-26"
    ]
  },
  {
    id: "FND-05",
    title: "Oxidiser enrichment is a controllable hazard parameter",
    statement: "Raising oxygen concentration enlarged the reaction zone and increased visible brightness in a gaseous fuel configuration.",
    missionImpact: "Medium",
    supportingIds: [
      "GAS-20",
      "BASS-09"
    ]
  }
];
export const conflictingResults = [
  {
    id: "CNF-01",
    title: "Intermediate flow: suppressive or inert?",
    summary: "One record reports an elevated extinction threshold for a burning droplet such that intermediate flow failed to produce blowout. Another reports a sharp extinction transition at low flow in the same fuel at 1g.",
    positions: [
      {
        experimentId: "FLEX-05",
        stance: "Intermediate flow did not extinguish the droplet"
      },
      {
        experimentId: "REF-22",
        stance: "Sharp extinction transition at low flow"
      }
    ],
    status: "Unresolved",
    resolutionNote: "Most likely a real environment dependence rather than a contradiction. Not resolvable from the current dataset."
  },
  {
    id: "CNF-02",
    title: "Does dilution suppress a gaseous flame?",
    summary: "Inert dilution narrowed the reaction zone but did not extinguish the flame within the tested concentration range, leaving the suppression threshold undefined.",
    positions: [
      {
        experimentId: "GAS-21",
        stance: "No extinction achieved by dilution in the tested range"
      },
      {
        experimentId: "SOFIE-14",
        stance: "Agent-based suppression succeeded in a related configuration"
      }
    ],
    status: "Unresolved",
    resolutionNote: "The tested range was insufficient to establish a threshold. This is an open question, not a settled negative result."
  },
  {
    id: "CNF-03",
    title: "Is a microgravity flame easier or harder to see?",
    summary: "Liquid fuel flames were dim with particulate retained near the reaction zone, while gaseous and reactive solid fuels remained clearly visible. A single generalisation about visibility is not supported.",
    positions: [
      {
        experimentId: "FLAME-01",
        stance: "Dim, low volumetric brightness"
      },
      {
        experimentId: "SOFIE-15",
        stance: "Bright and clearly observable"
      }
    ],
    status: "Context dependent",
    resolutionNote: "Brightness tracks fuel chemistry. Any detection strategy must be specified per fuel class rather than per environment."
  }
];
export const researchGaps = [
  {
    id: "GAP-01",
    title: "No combustion data at partial gravity",
    detail: "Every record in this dataset sits at microgravity, at an analog facility, or at 1g. The Moon sits at 0.16g and Mars at 0.38g, and neither level has been studied for flame behaviour.",
    affectedMissions: [
      "moon",
      "mars"
    ],
    severity: "High"
  },
  {
    id: "GAP-02",
    title: "Passive suppression thresholds are undefined",
    detail: "Dilution and oxygen depletion were both shown to be weak in isolation, but neither has a measured threshold. Designing a suppression system without a threshold means designing against guesswork.",
    affectedMissions: [
      "iss",
      "moon",
      "mars"
    ],
    severity: "High"
  },
  {
    id: "GAP-03",
    title: "Detection response in reduced-gravity volumes is uncharacterised",
    detail: "Detection elements were shown to respond differently, but no response-time characterisation exists for a reduced-gravity volume, so detection latency is unknown.",
    affectedMissions: [
      "iss",
      "moon",
      "mars"
    ],
    severity: "High"
  },
  {
    id: "GAP-04",
    title: "Materials with reversible screening classifications are not systematically catalogued",
    detail: "Classifications reverse between environments, but the dataset does not establish how common reversals are across a full material catalogue.",
    affectedMissions: [
      "iss",
      "moon",
      "mars"
    ],
    severity: "Medium"
  },
  {
    id: "GAP-05",
    title: "Hardware-level burning behaviour is sparsely covered",
    detail: "Only one record addresses flight-representative hardware assemblies. Cable, connector and equipment fires are a realistic in-habitat scenario and are not characterised.",
    affectedMissions: [
      "iss",
      "moon",
      "mars"
    ],
    severity: "Medium"
  }
];
export const missionFindings = {
  earth: [
    {
      id: "EAR-01",
      title: "Reference case for every comparison",
      statement: "All orbital claims in this dataset depend on a 1g reference existing. Ground testing is the anchor, and it is the only environment with systematic material screening data.",
      supportingIds: [
        "REF-22",
        "REF-23",
        "REF-24"
      ]
    },
    {
      id: "EAR-02",
      title: "Screening performed here is routinely assumed to transfer",
      statement: "Two separate findings in this dataset contradict that assumption, which makes the assumption itself worth auditing in existing ground-based programmes.",
      supportingIds: [
        "SOFIE-13",
        "SOFIE-14"
      ]
    }
  ],
  iss: [
    {
      id: "ISS-01",
      title: "Best-covered environment in the dataset",
      statement: "Most orbital records were flown in a pressurised crewed volume, so this environment has the deepest coverage and the highest evidence strength.",
      supportingIds: [
        "FLAME-01",
        "FLEX-04",
        "SOFIE-13",
        "SOFIE-17"
      ]
    },
    {
      id: "ISS-02",
      title: "Ventilation is the main control surface",
      statement: "Ventilation produced the largest behavioural differences of any variable examined, which makes it the primary design lever for a pressurised volume.",
      supportingIds: [
        "SOFIE-17",
        "BASS-09"
      ]
    },
    {
      id: "ISS-03",
      title: "Detection logic designed around buoyancy is wrong here",
      statement: "Sensing elements that rely on smoke rising to a ceiling location respond differently without buoyant transport. Placement assumptions need re-derivation.",
      supportingIds: [
        "SOFIE-16",
        "REF-24"
      ]
    }
  ],
  moon: [
    {
      id: "MOON-01",
      title: "No data at 0.16g",
      statement: "The dataset contains nothing at the Moon's gravity level. Existing microgravity work is a poor proxy because 0.16g restores partial buoyant assistance.",
      supportingIds: [
        "ACME-18",
        "FLAME-01"
      ]
    },
    {
      id: "MOON-02",
      title: "Oxidiser is life support",
      statement: "With no atmospheric buffer, a fire consumes the same supply the crew depends on. Fire suppression and life support cannot be designed as independent systems.",
      supportingIds: [
        "BASS-09",
        "GAS-20",
        "SOFIE-17"
      ]
    },
    {
      id: "MOON-03",
      title: "Surface materials are a distinct unknown",
      statement: "External fires cannot be sustained without supplied oxidiser, which shifts the question to internal surfaces, and those are uncharacterised.",
      supportingIds: [
        "SAME-12",
        "SOFIE-13"
      ]
    }
  ],
  mars: [
    {
      id: "MARS-01",
      title: "No data at 0.38g",
      statement: "No records exist at the Martian gravity level. The closest available data is an intermediate-gravity analog campaign with short observation windows.",
      supportingIds: [
        "ACME-18"
      ]
    },
    {
      id: "MARS-02",
      title: "CO₂-diluted exterior offers no suppression",
      statement: "The external environment cannot sustain combustion and therefore cannot be relied on to displace oxygen around an external fire.",
      supportingIds: [
        "BASS-09",
        "GAS-21"
      ]
    },
    {
      id: "MARS-03",
      title: "Partial gravity changes the spread question",
      statement: "If spread is buoyant-assistance dependent, partial gravity may shift behaviour toward the ground case, but the dataset cannot test that.",
      supportingIds: [
        "SAME-12",
        "FLAME-03",
        "ACME-18"
      ]
    }
  ]
};
export const oxygenFlameSeries = {
  id: "oxygen-flame",
  title: "Oxygen concentration against observed flame behaviour",
  caption: "Illustrative demonstration series. Not measured data.",
  unit: "% O₂",
  points: [
    {
      oxygen: 16,
      relativeFlameSize: 34,
      relativeBrightness: 41,
      label: "Lean"
    },
    {
      oxygen: 18,
      relativeFlameSize: 46,
      relativeBrightness: 55,
      label: ""
    },
    {
      oxygen: 19,
      relativeFlameSize: 55,
      relativeBrightness: 63,
      label: "Reduced"
    },
    {
      oxygen: 21,
      relativeFlameSize: 68,
      relativeBrightness: 74,
      label: "Ambient"
    },
    {
      oxygen: 22,
      relativeFlameSize: 74,
      relativeBrightness: 79,
      label: ""
    },
    {
      oxygen: 24,
      relativeFlameSize: 85,
      relativeBrightness: 88,
      label: "Enriched"
    },
    {
      oxygen: 25,
      relativeFlameSize: 91,
      relativeBrightness: 93,
      label: ""
    }
  ]
};
export const airflowSpreadSeries = {
  id: "airflow-spread",
  title: "Forced airflow against lateral spread rate",
  caption: "Illustrative demonstration series. Not measured data.",
  unit: "relative spread rate",
  points: [
    {
      airflow: 0,
      lowGravity: 58,
      highGravity: 92,
      label: "None"
    },
    {
      airflow: 1,
      lowGravity: 63,
      highGravity: 88,
      label: ""
    },
    {
      airflow: 2,
      lowGravity: 41,
      highGravity: 66,
      label: "Medium"
    },
    {
      airflow: 3,
      lowGravity: 22,
      highGravity: 34,
      label: ""
    },
    {
      airflow: 4,
      lowGravity: 12,
      highGravity: 16,
      label: "High"
    }
  ]
};
export function getInsightById(id) {
  const all = [
    ...emergingPatterns,
    ...highRelevanceFindings,
    ...conflictingResults,
    ...researchGaps
  ];
  return all.find((insight)=>insight.id === id) ?? null;
}
export const INSIGHT_CATEGORIES = [
  {
    id: "patterns",
    label: "Emerging Patterns",
    icon: "activity"
  },
  {
    id: "findings",
    label: "High-Relevance Findings",
    icon: "target"
  },
  {
    id: "conflicts",
    label: "Conflicting Results",
    icon: "gitCompareArrows"
  },
  {
    id: "gaps",
    label: "Research Gaps",
    icon: "search"
  },
  {
    id: "mission",
    label: "Mission-Specific Findings",
    icon: "orbit"
  }
];

/**
 * Short statements assembled from the loaded records, each tied to one experiment.
 *
 * Distinct from `emergingPatterns` and friends, which are cross-experiment syntheses: these are
 * single-record readings with a relevance score attached. They used to live in
 * `lib/api/dashboard.js` because the dashboard was the only surface that showed them. They now
 * live here with the other authored insight data and are read through `lib/api/insights.js`,
 * because the dashboard is no longer the place a reader goes to find them.
 *
 * `summary` is named for what it is rather than `statement` to match the rest of the authored
 * records; the view layer maps it onto whatever shape the card expects.
 */
export const modelStatements = [
  {
    id: "INS-01",
    title: "Reduced Gravity Flame Study",
    topic: "Flame morphology",
    experimentId: "FLAME-01",
    summary:
      "A compact, near-spherical envelope with a dim blue-dominated reaction zone once buoyant transport is removed.",
    relevance: 94,
  },
  {
    id: "INS-02",
    title: "Oxygen Concentration Effects",
    topic: "Oxygen effects",
    experimentId: "GAS-20",
    summary:
      "Enriching the oxidiser enlarged the reaction zone and increased visible brightness in a gaseous fuel flame.",
    relevance: 76,
  },
  {
    id: "INS-03",
    title: "Polymer Combustion Behaviour",
    topic: "Material flammability",
    experimentId: "SOFIE-13",
    summary:
      "Several materials classified as self-extinguishing at 1g sustained burning under the same screening protocol in microgravity.",
    relevance: 71,
  },
  {
    id: "INS-04",
    title: "Ventilated versus Unventilated Volume",
    topic: "Fire suppression",
    experimentId: "SOFIE-17",
    summary:
      "Forced ventilation produced the largest differences in flame size, stability and spread of any variable compared.",
    relevance: 88,
  },
  {
    id: "INS-05",
    title: "Passive Suppression Thresholds",
    topic: "Fire suppression",
    experimentId: "BASS-09",
    summary:
      "Oxygen depletion without convective mixing declined more slowly than ground experience suggests.",
    relevance: 69,
  },
  {
    id: "INS-06",
    title: "Burning Material Migration",
    topic: "Flame spread",
    experimentId: "SOFIE-26",
    summary:
      "Ignited hardware assemblies burned without self-limiting, with material moving away from the ignition point.",
    relevance: 82,
  },
];
