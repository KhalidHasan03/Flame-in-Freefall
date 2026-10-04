/**
 * Evidence timelines. Each entry represents a stage in how a result became available —
 * the point of the panel is to show *how strongly* a conclusion is grounded, not just that a
 * document exists. Stage weights feed the evidence strength shown across the app.
 */

const STAGES = {
  "ground-reference": { label: "Ground reference", order: 1, weight: 0.8, icon: "globe" },
  analog: { label: "Reduced-gravity analog", order: 2, weight: 0.5, icon: "waves" },
  flight: { label: "Microgravity flight", order: 3, weight: 0.9, icon: "rocket" },
  "in-flight-analysis": { label: "In-flight analysis", order: 4, weight: 0.85, icon: "activity" },
  publication: { label: "Published interpretation", order: 5, weight: 0.7, icon: "book" },
};

function entry(experimentId, stage, date, label, detail) {
  return { experimentId, stage, stageLabel: STAGES[stage].label, weight: STAGES[stage].weight, icon: STAGES[stage].icon, date, label, detail };
}

export const experimentTimelines = {
  "FLAME-01": [
    entry("FLAME-01", "ground-reference", "1991-02-10", "Reference geometry established", "Matched terrestrial case characterised for the same fuel and oxidiser conditions."),
    entry("FLAME-01", "flight", "1991-06-14", "Free-fall campaign executed", "Envelopes imaged across the burn at matched oxidiser conditions."),
    entry("FLAME-01", "publication", "1993-04-02", "Morphology interpretation published", "Buoyant transport attributed as the driver of the envelope difference."),
  ],
  "FLAME-02": [
    entry("FLAME-02", "flight", "1991-08-02", "Soot measurement series completed", "Optical extinction sampled alongside particulate collection."),
    entry("FLAME-02", "in-flight-analysis", "1991-11-18", "Yield comparison reviewed", "Residence time identified as a confounder in the optical comparison."),
  ],
  "FLAME-03": [
    entry("FLAME-03", "ground-reference", "1991-05-09", "Fabric baseline established", "Propagation front rate measured terrestrially."),
    entry("FLAME-03", "flight", "1991-09-27", "Free-fall fabric burn completed", "Ignition and sustained burning confirmed at reduced oxygen."),
  ],
  "FLEX-04": [
    entry("FLEX-04", "ground-reference", "2010-11-04", "Thin flame configuration validated", "Configuration shown to isolate transport from fuel geometry."),
    entry("FLEX-04", "flight", "2011-04-19", "Orbital thin flame observation", "Detached reaction zone resolved by imaging."),
    entry("FLEX-04", "publication", "2013-02-20", "Diffusion interpretation published", "Reaction zone separation attributed to fuel-depleted region."),
  ],
  "FLEX-05": [
    entry("FLEX-05", "flight", "2011-09-06", "Droplet coflow series completed", "Mass loss tracked across imposed flow levels."),
    entry("FLEX-05", "in-flight-analysis", "2012-01-17", "Extinction threshold identified", "Intermediate flow found not to produce blowout."),
  ],
  "FLEX-06": [
    entry("FLEX-06", "ground-reference", "2011-03-02", "1g height series compiled", "Apparent flame heights recorded for the same configuration."),
    entry("FLEX-06", "publication", "2012-02-21", "Transport attribution published", "Majority of the height difference assigned to convective transport."),
  ],
  "BRE-07": [
    entry("BRE-07", "flight", "2009-07-13", "Long-duration droplet campaign", "Burning sustained well past terrestrial reference duration."),
    entry("BRE-07", "in-flight-analysis", "2009-10-05", "Extinction mechanism identified", "Termination attributed to fuel depletion rather than transport."),
  ],
  "BRE-08": [
    entry("BRE-08", "flight", "2009-11-30", "Imaging time series captured", "Full-burn envelope diameter recorded without gaps."),
    entry("BRE-08", "in-flight-analysis", "2010-03-11", "Extraction pipeline validated", "Automated diameter extraction reproduced manual measurement."),
  ],
  "BASS-09": [
    entry("BASS-09", "analog", "2014-03-11", "Aircraft campaign flown", "Sealed volume oxygen trajectory tracked under reduced gravity."),
    entry("BASS-09", "in-flight-analysis", "2014-08-19", "Depletion model reviewed", "More uniform depletion field attributed to absent mixing."),
  ],
  "BASS-10": [
    entry("BASS-10", "analog", "2015-06-08", "Agent screening executed", "Candidates ranked under matched analog conditions."),
    entry("BASS-10", "in-flight-analysis", "2015-10-22", "Ranking compared to ground data", "Rank order found not to transfer to analog conditions."),
  ],
  "SAME-11": [
    entry("SAME-11", "flight", "2016-02-24", "Aerosol sampling completed", "Particulate field sampled around burning polymer samples."),
    entry("SAME-11", "in-flight-analysis", "2016-07-08", "Uncertainty assessed", "Small sample sizes noted as the dominant limitation."),
  ],
  "SAME-12": [
    entry("SAME-12", "ground-reference", "2016-01-19", "Panel protocol defined", "Edge ignition and front tracking procedure established."),
    entry("SAME-12", "flight", "2016-08-03", "Propagation observed", "Self-sustaining front recorded at reduced rate."),
  ],
  "SOFIE-13": [
    entry("SOFIE-13", "ground-reference", "2020-01-27", "Candidate material set baselined", "Terrestrial screening completed for the same batch."),
    entry("SOFIE-13", "flight", "2020-04-15", "Orbital screening campaign", "Batch screened under identical protocol."),
    entry("SOFIE-13", "publication", "2021-04-12", "Classification reversals published", "Several self-extinguishing classifications found not to hold."),
  ],
  "SOFIE-14": [
    entry("SOFIE-14", "ground-reference", "2020-08-13", "Ground agent performance recorded", "Candidates tested terrestrially for comparison."),
    entry("SOFIE-14", "flight", "2020-11-05", "Agent evaluation in volume mockup", "Some agents failed to achieve prompt extinction."),
  ],
  "SOFIE-15": [
    entry("SOFIE-15", "flight", "2021-05-18", "Reactive material ignited", "Vigorous burning with visible luminous zone recorded."),
    entry("SOFIE-15", "in-flight-analysis", "2021-09-30", "Visibility assessed", "Fuel chemistry identified as the dominant brightness factor."),
  ],
  "SOFIE-16": [
    entry("SOFIE-16", "flight", "2021-09-22", "Detection elements exposed", "Optical and particle sensing elements monitored through development."),
    entry("SOFIE-16", "in-flight-analysis", "2022-02-15", "Response characterised", "Transport-dependent placement identified as a limitation."),
  ],
  "SOFIE-17": [
    entry("SOFIE-17", "ground-reference", "2022-01-11", "Scenario design validated", "Ventilated and unventilated cases matched for all other variables."),
    entry("SOFIE-17", "flight", "2022-03-09", "Configuration comparison flown", "Ventilation found to dominate observed differences."),
  ],
  "ACME-18": [
    entry("ACME-18", "analog", "2018-07-30", "Intermediate gravity campaign run", "Flame geometry observed at a reduced non-zero gravity level."),
    entry("ACME-18", "in-flight-analysis", "2019-01-24", "Observability limits assessed", "Short facility windows flagged as the primary limitation."),
  ],
  "ACME-19": [
    entry("ACME-19", "flight", "2017-10-11", "Gaseous flame sustained", "Reaction zone responded to flow without extinction."),
    entry("ACME-19", "in-flight-analysis", "2018-02-06", "Stability margin reviewed", "Gaseous configuration found less flow-sensitive than liquid."),
  ],
  "GAS-20": [
    entry("GAS-20", "ground-reference", "2012-06-14", "Ambient case recorded", "Baseline gaseous flame at ambient oxidiser."),
    entry("GAS-20", "flight", "2012-11-14", "Enriched oxidiser series", "Reaction zone enlargement and brightness increase observed."),
  ],
  "GAS-21": [
    entry("GAS-21", "flight", "2013-04-03", "Dilution series completed", "Reaction zone narrowed across the tested concentration range."),
    entry("GAS-21", "in-flight-analysis", "2013-09-27", "Threshold search closed", "Tested range found insufficient to establish a dilution threshold."),
  ],
  "REF-22": [
    entry("REF-22", "ground-reference", "2017-01-19", "Baseline geometry established", "Ground reference recorded under matched oxidiser conditions."),
    entry("REF-22", "in-flight-analysis", "2017-05-04", "Reference validated for reuse", "Confirmed as the comparison baseline for orbital liquid fuel records."),
  ],
  "REF-23": [
    entry("REF-23", "ground-reference", "2017-03-08", "Burn rate set measured", "Terrestrial rates established for the orbital screening batch."),
    entry("REF-23", "in-flight-analysis", "2017-08-16", "Transferability assessed", "Burn rate found necessary but not sufficient for orbital selection."),
  ],
  "REF-24": [
    entry("REF-24", "ground-reference", "2017-06-14", "Smoke baseline measured", "Yield and composition recorded for the same material set."),
    entry("REF-24", "in-flight-analysis", "2017-11-02", "Distribution compared", "Yield found to transfer while distribution did not."),
  ],
  "FLAME-25": [
    entry("FLAME-25", "flight", "1991-11-06", "Sequential ignitions executed", "Multiple events run within a single closed volume."),
    entry("FLAME-25", "in-flight-analysis", "1992-02-20", "Independence assessed", "Drifting environment found to make events non-independent."),
  ],
  "SOFIE-26": [
    entry("SOFIE-26", "ground-reference", "2022-05-10", "Hardware samples characterised", "Cable and connector assemblies documented before testing."),
    entry("SOFIE-26", "flight", "2022-09-27", "Assembly ignition observed", "Sustained burning and material migration recorded."),
  ],
};

export function getTimelineForExperiment(id) {
  return experimentTimelines[id] ?? [];
}

export const TIMELINE_STAGES = STAGES;
