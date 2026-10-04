import { experiments } from "@/data/experiments";
import { MISSION_COMPARISON_ROWS, getMissionById, missions } from "@/data/missions";
import { missionFindings, researchGaps } from "@/data/insights";
import { request } from "./client";

export async function getMissions() {
  return request("missions", () => missions);
}

export async function getMission(id) {
  return request(`missions/${id}`, () => getMissionById(id));
}

export async function getMissionExperiments(id) {
  return request(`missions/${id}/experiments`, () => experiments.filter((experiment) => experiment.mission === id));
}

export async function getMissionFindings(id) {
  return request(`missions/${id}/findings`, () => missionFindings[id] ?? []);
}

export async function getMissionGaps(id) {
  return request(`missions/${id}/gaps`, () => researchGaps.filter((gap) => gap.affectedMissions.includes(id)));
}

/**
 * Research coverage per mission, split by evidence strength so the UI can show where the
 * dataset is thin rather than only where it is large.
 */
export async function getMissionCoverage(id) {
  return request(`missions/${id}/coverage`, () => {
    const relevant = experiments.filter((experiment) => experiment.mission === id);
    const byEvidence = { High: 0, Medium: 0, Limited: 0 };
    relevant.forEach((experiment) => {
      byEvidence[experiment.evidenceLevel] = (byEvidence[experiment.evidenceLevel] ?? 0) + 1;
    });
    return {
      missionId: id,
      total: relevant.length,
      byEvidence,
      averageEvidence: relevant.length
        ? Math.round(relevant.reduce((sum, experiment) => sum + experiment.evidenceScore, 0) / relevant.length)
        : 0,
      topicCount: new Set(relevant.map((experiment) => experiment.topic)).size,
    };
  });
}

export async function getMissionComparison(leftId, rightId) {
  return request("missions/compare", () => ({
    left: getMissionById(leftId),
    right: getMissionById(rightId),
    rows: MISSION_COMPARISON_ROWS.map((row) => ({
      id: row.id,
      label: row.label,
      left: row.pick(getMissionById(leftId)),
      right: row.pick(getMissionById(rightId)),
    })),
  }));
}

/**
 * The Moon/Mars rows on their own.
 *
 * A dedicated read rather than a parameterisation of `getMissionComparison`, because the pairing
 * is fixed by the question rather than chosen by the reader: these are the two destinations with
 * partial gravity and no atmosphere to speak of, so they are the only pair whose fire-safety
 * problem is genuinely different rather than merely scaled. Everything else Mission Lab does
 * already goes through the general comparison.
 */
export async function getMoonMarsComparison() {
  return request("missions/moon-mars", () => {
    const moon = getMissionById("moon");
    const mars = getMissionById("mars");

    return {
      moon,
      mars,
      rows: MISSION_COMPARISON_ROWS.map((row) => ({
        id: row.id,
        label: row.label,
        left: row.pick(moon),
        right: row.pick(mars),
      })),
    };
  });
}
