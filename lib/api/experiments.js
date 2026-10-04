import { experiments, getExperimentsByIds } from "@/data/experiments";
import { getSourcesForExperiment } from "@/data/experimentSources";
import { getTimelineForExperiment } from "@/data/experimentTimelines";
import { request } from "./client";

export async function getExperiments() {
  return request("experiments", () => experiments);
}

export async function getExperiment(id) {
  return request(`experiments/${id}`, () => experiments.find((experiment) => experiment.id === id) ?? null);
}

export async function getRelatedExperiments(id) {
  return request(`experiments/${id}/related`, () => {
    const experiment = experiments.find((item) => item.id === id);
    if (!experiment) return [];
    const declared = getExperimentsByIds(experiment.relatedIds);
    if (declared.length) return declared;
    return experiments
      .filter((item) => item.id !== id && (item.topic === experiment.topic || item.fuel === experiment.fuel))
      .slice(0, 3);
  });
}

export async function getExperimentSources(id) {
  return request(`experiments/${id}/sources`, () => {
    const experiment = experiments.find((item) => item.id === id);
    return getSourcesForExperiment(experiment);
  });
}

export async function getExperimentTimeline(id) {
  return request(`experiments/${id}/timeline`, () => getTimelineForExperiment(id));
}

/** Assembles a full detail record so the page makes a single call. */
export async function getExperimentDetail(id) {
  return request(`experiments/${id}/detail`, () => {
    const experiment = experiments.find((item) => item.id === id);
    if (!experiment) return null;
    return {
      experiment,
      sources: getSourcesForExperiment(experiment),
      timeline: getTimelineForExperiment(id),
      related: getExperimentsByIds(experiment.relatedIds),
    };
  });
}

export async function getExperimentIds() {
  return request("experiments/ids", () => experiments.map((experiment) => experiment.id));
}

export async function getExperimentFacets() {
  return request("experiments/facets", () => {
    const byLabel = new Map();
    experiments.forEach((experiment) => byLabel.set(experiment.fuel, experiment.fuelLabel));

    return {
      programs: [...new Set(experiments.map((experiment) => experiment.program))].sort(),
      // Filter values are fuel ids so they match `experiment.fuel`; labels are for display.
      fuels: [...byLabel.entries()].map(([value, label]) => ({ value, label })),
      topics: [...new Set(experiments.map((experiment) => experiment.topic))].sort(),
      types: [...new Set(experiments.map((experiment) => experiment.type))].sort(),
    };
  });
}

export { experiments as mockExperiments };
