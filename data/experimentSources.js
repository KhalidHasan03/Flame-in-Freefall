/**
 * Demonstration source-document records.
 *
 * Identifiers use a `src-<experiment>-<n>` placeholder scheme on purpose. Fabricating a real
 * NASA/TM or NTRS number would produce citations that look verifiable but are not, which is
 * exactly the failure mode this project exists to prevent. Identifiers are replaced when
 * real documents are connected through lib/api/experiments.js.
 */

const SOURCE_TYPES = {
  "flight-report": "Flight test report",
  "ground-report": "Ground test report",
  "analog-report": "Reduced-gravity analog report",
  article: "Journal article",
  conference: "Conference paper",
  dataset: "Processed dataset",
};

function source(id, type, program, year, title, note) {
  return { id, type, typeLabel: SOURCE_TYPES[type], program, year, title, note };
}

export const experimentSources = [
  source("src-flame-01-a", "flight-report", "Saffire", 1991, "Free-fall liquid fuel flame morphology report", "Primary morphology record."),
  source("src-flame-01-b", "article", "Saffire", 1993, "Buoyant transport and flame envelope shape in weightlessness", "Interpretation paper."),
  source("src-flame-02-a", "flight-report", "Saffire", 1991, "Soot and luminosity measurement series", "Optical diagnostics record."),
  source("src-flame-03-a", "flight-report", "Saffire", 1991, "Fabric flammability free-fall test summary", "Material record."),
  source("src-flex-04-a", "flight-report", "FLEX", 2011, "Thin flame configuration results", "Primary structure record."),
  source("src-flex-04-b", "article", "FLEX", 2013, "Reaction zone separation in thin diffusion flames", "Interpretation paper."),
  source("src-flex-05-a", "flight-report", "FLEX", 2011, "Droplet burn rate and coflow extinction series", "Primary suppression record."),
  source("src-flex-06-a", "article", "FLEX", 2012, "Attribution of apparent flame height to transport", "Analysis paper."),
  source("src-bre-07-a", "dataset", "BRE", 2009, "Long-duration droplet burning dataset", "Processed time series."),
  source("src-bre-08-a", "dataset", "BRE", 2009, "Flame envelope imaging time series", "Processed image series."),
  source("src-bass-09-a", "analog-report", "BASS", 2014, "Sealed volume oxygen depletion report", "Analog campaign."),
  source("src-bass-10-a", "analog-report", "BASS", 2015, "Suppression agent screening results", "Analog screening campaign."),
  source("src-same-11-a", "flight-report", "SAME", 2016, "Polymer aerosol release measurements", "Particulate record."),
  source("src-same-12-a", "flight-report", "SAME", 2016, "Panel propagation front tracking summary", "Spread record."),
  source("src-sofie-13-a", "flight-report", "SOFIE", 2020, "Material flammability screening campaign results", "Primary screening record."),
  source("src-sofie-13-b", "article", "SOFIE", 2021, "Classification reversals between screening environments", "Interpretation paper."),
  source("src-sofie-14-a", "flight-report", "SOFIE", 2020, "Suppression agent evaluation in volume mockup", "Primary suppression record."),
  source("src-sofie-15-a", "flight-report", "SOFIE", 2021, "Reactive material burning observations", "Material record."),
  source("src-sofie-16-a", "flight-report", "SOFIE", 2021, "Detection element response summary", "Detection record."),
  source("src-sofie-17-a", "flight-report", "SOFIE", 2022, "Ventilated and unventilated configuration comparison", "Configuration comparison."),
  source("src-acme-18-a", "analog-report", "ACME", 2018, "Intermediate gravity flame geometry campaign", "Analog campaign."),
  source("src-acme-19-a", "flight-report", "ACME", 2017, "Gaseous fuel flame stability observations", "Primary gaseous fuel record."),
  source("src-gas-20-a", "flight-report", "FLEX", 2012, "Elevated oxidiser concentration series", "Oxygen effects record."),
  source("src-gas-21-a", "flight-report", "FLEX", 2013, "Inert dilution series", "Suppression series."),
  source("src-ref-22-a", "ground-report", "ACME", 2017, "Ground reference flame geometry baseline", "Reference baseline."),
  source("src-ref-23-a", "ground-report", "ACME", 2017, "Ground reference material burn rate set", "Reference baseline."),
  source("src-ref-24-a", "ground-report", "ACME", 2017, "Ground reference smoke screening set", "Reference baseline."),
  source("src-flame-25-a", "flight-report", "Saffire", 1991, "Sequential ignition campaign summary", "Closed volume record."),
  source("src-sofie-26-a", "flight-report", "SOFIE", 2022, "Cable and connector assembly ignition report", "Hardware record."),
];

const BY_ID = new Map(experimentSources.map((entry) => [entry.id, entry]));

export function getSourceById(id) {
  return BY_ID.get(id) ?? null;
}

export function getSourcesForExperiment(experiment) {
  return (experiment?.sourceIds ?? []).map(getSourceById).filter(Boolean);
}
