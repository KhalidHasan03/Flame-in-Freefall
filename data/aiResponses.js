/**
 * Firewise AI demonstration responses.
 *
 * There is no language model behind these answers. Each entry is an authored response paired
 * with the experiment IDs a retrieval step would need to cite. `lib/api/ai.js` selects an
 * entry by keyword overlap and returns it, so replacing this file with a real RAG call is the
 * only change required to make Firewise live.
 *
 * Every entry is written to avoid asserting more than its cited records support, and to say
 * so explicitly when the evidence is thin.
 */

export const suggestedQuestions = [
  "Which experiments studied flame extinction at low oxygen?",
  "How does reduced gravity affect flame shape?",
  "Which materials show increased flame spread?",
  "What research gaps exist for lunar habitats?",
  "Compare Saffire and FLEX combustion behavior.",
];

export const mockAnswers = [
  {
    id: "ans-detection",
    keywords: ["detect", "detection", "visible", "visibility", "see", "hard to detect", "smoke", "sensor"],
    confidence: "Medium",
    answer:
      "Microgravity changes buoyancy-driven flow and alters how hot gases and combustion products move around the flame. In the absence of buoyant transport, products stay concentrated near the reaction zone instead of forming a rising plume, which changes what reaches a detector. Two further effects matter: some liquid fuel flames are dim with far lower volumetric brightness, and particles remain suspended rather than dispersing. The practical consequence is that detection logic designed around smoke rising to a ceiling location does not hold without buoyant transport. It is worth separating two questions that are often merged: what is produced, and where it goes. Yield transferred between environments in these records while distribution did not.",
    evidence: ["FLAME-01", "FLAME-02", "SOFIE-16", "REF-24"],
    caveat:
      "Brightness is a fuel property as much as an environmental one. Gaseous and reactive solid fuels stayed clearly visible in microgravity, so a general statement that microgravity fires are hard to see is not supported by this dataset.",
  },
  {
    id: "ans-extinction-oxygen",
    keywords: ["extinction", "extinguish", "blowout", "low oxygen", "lean", "diluent", "dilution", "suppress", "oxygen"],
    confidence: "High",
    answer:
      "The extinction evidence splits into three groups. Transport-driven: one record found an elevated threshold for a burning droplet, with intermediate flow failing to produce blowout, while the 1g reference for the same fuel shows a sharp extinction transition at low flow. Oxidiser-driven: passive oxygen depletion without convective mixing is slower and more uniform than ground experience suggests, which weakens it as a suppression mechanism on its own. Agent-driven: several agents that performed well terrestrially failed to achieve prompt extinction in a crewed-volume configuration, and inert dilution narrowed the reaction zone without extinguishing it within the tested range. Taken together, the practical reading is that forced ventilation is the controllable variable, and passive measures are weaker than ground screening suggests.",
    evidence: ["FLEX-05", "REF-22", "BASS-09", "SOFIE-14", "GAS-21"],
    caveat:
      "The dilution study did not define a suppression threshold, so it should be read as an open question rather than as evidence that dilution does not work.",
  },
  {
    id: "ans-gravity-shape",
    keywords: ["gravity", "shape", "morphology", "spherical", "sphericity", "elongat", "buoyan", "microgravity effect"],
    confidence: "High",
    answer:
      "Reduced gravity produces a more spherical, diffusion-dominated flame. The mechanism is the removal of buoyant transport: at 1g, hot products are carried upward, which is what produces the familiar elongated envelope. Remove that transport and the envelope contracts toward a compact, roughly spherical form, with the reaction zone limiting itself to the fuel surface. Intermediate gravity was observed once in this dataset, at 0.1g, and the flame was intermediate in shape between the two cases, which suggests the transition is progressive rather than a threshold. The design implication is that apparent flame height measured at 1g overstates the reaction zone extent for orbital conditions, so ground-derived flame height is not a safe proxy.",
    evidence: ["FLAME-01", "FLEX-06", "ACME-18", "REF-22", "FLEX-04"],
    caveat:
      "Only one record exists at intermediate gravity, and it comes from a facility with short observation windows. The transition shape is not established.",
  },
  {
    id: "ans-material-spread",
    keywords: ["material", "spread", "polymer", "fabric", "cable", "solid", "flammab", "propagat"],
    confidence: "High",
    answer:
      "Reduced buoyant assistance slows lateral propagation but does not stop it: panel samples continued to propagate self-sustainingly in microgravity, at a lower rate than the matched ground case. More significant is that ground material screening does not transfer. A number of materials classified as self-extinguishing at 1g sustained burning under the same protocol in microgravity, which reverses their screening classification. On real hardware, cable and connector assemblies burned without self-limiting, and burning material migrated away from the origin, which complicates targeted suppression. The combined reading is that habitat interiors should be designed around ventilation control and hardware-level verification, not around material classification lists produced on the ground.",
    evidence: ["SAME-12", "FLAME-03", "SOFIE-13", "REF-23", "SOFIE-26"],
    caveat: null,
  },
  {
    id: "ans-lunar-gaps",
    keywords: ["gap", "lunar", "moon", "missing", "unknown", "not studied", "research need"],
    confidence: "High",
    answer:
      "Four gaps stand out for a lunar habitat. First, there is no combustion data at 0.16g. Everything in this dataset sits at microgravity, at a short-duration analog facility, or at 1g, and microgravity is a poor proxy because 0.16g restores partial buoyant assistance. Second, passive suppression thresholds are undefined: dilution and oxygen depletion were both shown to be weak in isolation, but neither has a measured threshold, so designing a suppression system without one means designing against guesswork. Third, detection response in a reduced-gravity volume has not been characterised, leaving detection latency unknown. Fourth, hardware-level burning behaviour has a single record. The most consequential structural point is that on the Moon the oxidiser is life support consumable, so fire suppression and life support cannot be specified as independent systems.",
    evidence: ["BASS-09", "GAS-21", "SOFIE-16", "SOFIE-26", "ACME-18"],
    caveat: null,
  },
  {
    id: "ans-saffire-flex",
    keywords: ["saffire", "flex", "compare", "comparison", "difference between", "programme", "program"],
    confidence: "Medium",
    answer:
      "The two sets address different questions. Saffire records are large-scale free-fall tests focused on materials, luminosity and closed-volume behaviour, so they carry the higher evidence strength for material flammability and for what happens to a volume across sequential ignitions. FLEX records use a crewed station with thinner, more controlled liquid fuel configurations, so they carry the higher evidence strength for flame structure, burn rate and the boundary between intermediate flow and extinction. The overlap is thin: both used n-heptane, but Saffire at larger scale and FLEX at reduced geometry. Read together they are complementary rather than redundant, which is the argument for keeping programme identity attached to every record rather than collapsing the dataset.",
    evidence: ["FLAME-01", "FLAME-03", "FLAME-25", "FLEX-04", "FLEX-05", "FLEX-06"],
    caveat:
      "This is a comparison of what each set covers, not a controlled head-to-head experiment. The two sets were never run as a matched pair.",
  },
  {
    id: "ans-fuel-brightness",
    keywords: ["brightness", "bright", "luminosity", "soot", "colour", "color", "blue"],
    confidence: "Medium",
    answer:
      "Brightness in this dataset tracks fuel chemistry at least as much as it tracks environment. Liquid fuel flames in microgravity were dim and blue-dominant, with low volumetric brightness and suspended soot that inflated the optical signal relative to the compact core. Gaseous fuel flames remained clearly visible and blue, and a reactive solid material burned brightly enough to be observed remotely. Soot and luminosity measurements also showed that collected particulate mass and in-situ optical signal were not directly comparable, because residence time around the reaction zone changed. The practical implication for detection is that brightness should not be used as a proxy for reaction intensity, and detection requirements need to be specified per fuel class.",
    evidence: ["FLAME-01", "FLAME-02", "ACME-19", "SOFIE-15"],
    caveat:
      "A direct brightness comparison across fuel classes was not performed under matched conditions, so this compares separate records rather than isolating the fuel variable.",
  },
  {
    id: "ans-ventilation",
    keywords: ["ventilation", "ventilate", "airflow", "flow control", "convection", "forced air"],
    confidence: "High",
    answer:
      "Ventilation is the most controllable variable among those examined in this dataset. Where it was varied against other parameters, it produced the largest differences in flame size, stability and spread: high flow elongated the flame downstream, destabilised it, reduced visible luminosity and sharply reduced lateral spread, and was the only approach that achieved extinction in the configurations tested. The contrast with passive measures is stark. Oxygen depletion without convective mixing is slower and more uniform than ground experience suggests, and inert dilution narrowed the reaction zone without extinguishing it. For habitat design, the implication is that the ventilation system should be treated as the primary fire safety control surface, with passive measures as supporting layers.",
    evidence: ["SOFIE-17", "BASS-09", "GAS-21", "ACME-19"],
    caveat: null,
  },
  {
    id: "ans-partial-gravity",
    keywords: ["0.16g", "0.38g", "partial gravity", "mars gravity", "moon gravity", "intermediate gravity"],
    confidence: "Limited",
    answer:
      "The honest answer is that there is almost nothing. This dataset contains one intermediate-gravity record, at 0.1g, from a facility with short observation windows. That record found the flame intermediate in shape between the 1g and microgravity cases, which is suggestive of a progressive transition rather than a threshold, but a single short-duration observation cannot establish the shape of that curve. Both the Moon at 0.16g and Mars at 0.38g sit inside the unstudied range. Where extrapolation is attempted, the direction of the effect is at least consistent across records: anything that depends on buoyant assistance, including lateral spread and flame elongation, should be expected to move back toward ground behaviour as gravity increases.",
    evidence: ["ACME-18", "FLAME-01", "SAME-12", "REF-22"],
    caveat:
      "More research required. This is the weakest-evidence area in the dataset and should not be used to support a mission decision without new measurements.",
  },
];

/** Shown in the dashboard rail so the panel is never empty on first load. */
export const defaultConversation = {
  id: "conv-dashboard",
  title: "Detection in microgravity",
  messages: [
    {
      id: "msg-1",
      role: "user",
      text: "Why are some flames harder to detect in microgravity?",
    },
    {
      id: "msg-2",
      role: "assistant",
      answerId: "ans-detection",
      confidence: "Medium",
      text: "Microgravity changes buoyancy-driven flow and alters how hot gases and combustion products move around the flame. This can affect flame shape, visibility, and detection behavior.",
      evidence: ["FLAME-01", "FLAME-02", "SOFIE-16"],
      followUp: "Two effects compound: some liquid fuel flames are dim with lower volumetric brightness, and particles stay suspended near the reaction zone instead of forming a rising plume. So it helps to separate what is produced from what actually reaches a detector.",
    },
  ],
};

export const fallbackAnswer = {
  id: "ans-fallback",
  confidence: "Limited",
  answer:
    "This question is not answered by the current dataset. That is a real result rather than a gap in the interface: the records cover a specific set of configurations, and questions outside them have no supporting evidence to retrieve. Rather than generate a plausible-sounding answer, Firewise reports that it cannot support a conclusion. Re-framing the question to a covered configuration, or treating this as a stated research gap, would both be more useful than an unsupported response.",
  evidence: [],
  caveat: "Limited evidence — more research required.",
};

export const emptyEvidenceState = {
  title: "No supporting records",
  detail:
    "No experiment in the current dataset addresses this question closely enough to cite. Treat this as a research gap rather than a null result.",
};
