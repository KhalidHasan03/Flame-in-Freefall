import { experiments } from "@/data/experiments";
import { riskFactors } from "@/data/fireRisk";
import {
  airflowSpreadSeries,
  conflictingResults,
  emergingPatterns,
  highRelevanceFindings,
  missionFindings,
  modelStatements,
  oxygenFlameSeries,
  researchGaps,
} from "@/data/insights";
import { getExperimentById } from "@/data/experiments";
import { resolveGravityValue } from "@/lib/flameGeometry";
import { request } from "./client";

export async function getPatterns() {
  return request("insights/patterns", () => emergingPatterns);
}

export async function getHighRelevanceFindings() {
  return request("insights/findings", () => highRelevanceFindings);
}

export async function getConflictingResults() {
  return request("insights/conflicts", () => conflictingResults);
}

export async function getResearchGaps() {
  return request("insights/gaps", () => researchGaps);
}

export async function getMissionFindings(missionId) {
  return request(`insights/mission/${missionId}`, () => missionFindings[missionId] ?? []);
}

/** All missions at once, so a client-side mission switch needs no further reads. */
export async function getAllMissionFindings() {
  return request("insights/mission", () => missionFindings);
}

/**
 * Per-record statements from the synthesis model.
 *
 * Each statement names one experiment, so the evidence grade is joined in here rather than in the
 * view. The join lives at the API boundary for the same reason it does everywhere else in this
 * folder: the record is the authority on its own grade, and a view that read `data/experiments`
 * to recover it would be reaching past the seam.
 *
 * A statement whose experiment cannot be resolved is dropped rather than shown at a guessed
 * grade. An insight with no traceable record is not an insight.
 */
export async function getModelStatements() {
  return request("insights/statements", () =>
    modelStatements.flatMap((statement) => {
      const experiment = getExperimentById(statement.experimentId);
      if (!experiment) return [];
      return [{ ...statement, evidenceLevel: experiment.evidenceLevel }];
    }),
  );
}

/**
 * Research coverage per program, and the risk posture to read it against.
 *
 * These two are returned together on purpose. Coverage breadth on its own is ambiguous — a
 * dataset can be broad and still leave a specific question unanswerable — and the risk factors
 * are what say which questions those are. Separating them onto different routes, as they were
 * while both sat on the dashboard, is what made them read as two unrelated widgets.
 */
export async function getCoverageAndRisk() {
  return request("insights/coverage-risk", () => {
    const programs = [...new Set(experiments.map((experiment) => experiment.program))]
      .sort()
      .map((program) => ({
        program,
        count: experiments.filter((experiment) => experiment.program === program).length,
        high: experiments.filter(
          (experiment) => experiment.program === program && experiment.evidenceLevel === "High",
        ).length,
      }));

    return {
      programs,
      sampleSize: experiments.length,
      riskFactors,
    };
  });
}

export async function getOxygenFlameSeries() {
  return request("insights/series/oxygen", () => oxygenFlameSeries);
}

export async function getAirflowSpreadSeries() {
  return request("insights/series/airflow", () => airflowSpreadSeries);
}

/**
 * Gravity against flame morphology, derived from the loaded records rather than authored
 * separately so the scatter always agrees with the Explorer.
 */
export async function getGravityMorphologySeries() {
  return request("insights/series/gravity", () =>
    experiments
      .filter((experiment) => experiment.type === "Liquid-fuel combustion")
      .map((experiment) => ({
        id: experiment.id,
        program: experiment.program,
        gravity: resolveGravityValue(experiment.gravity),
        sphericity: sphericityIndex(experiment),
        evidence: experiment.evidenceScore,
      })),
  );
}

/** 0 = elongated ground flame, 100 = compact spherical microgravity flame. */
function sphericityIndex(experiment) {
  const gravity = resolveGravityValue(experiment.gravity);
  const gravityNorm = Math.min(1, Math.max(0, Math.log10(gravity + 0.01) / Math.log10(1.01)));
  const elongationScore = Math.pow(gravityNorm, 0.45) * 100;
  const airflowPenalty = { Low: 0, Medium: 12, High: 26 }[experiment.airflow] ?? 0;
  return Math.round(Math.min(100, Math.max(0, 100 - elongationScore + airflowPenalty)));
}

/** Experiment count per program and topic — the coverage matrix on the Insights page. */
export async function getCoverageMatrix() {
  return request("insights/coverage", () => {
    const programs = [...new Set(experiments.map((experiment) => experiment.program))].sort();
    const topics = [...new Set(experiments.map((experiment) => experiment.topic))].sort();
    const counts = programs.map((program) => ({
      program,
      cells: topics.map((topic) => ({
        topic,
        count: experiments.filter(
          (experiment) => experiment.program === program && experiment.topic === topic,
        ).length,
      })),
    }));
    return { programs, topics, rows: counts, total: experiments.length };
  });
}

export async function getAllInsights() {
  return request("insights", () => ({
    patterns: emergingPatterns,
    findings: highRelevanceFindings,
    conflicts: conflictingResults,
    gaps: researchGaps,
    series: { oxygen: oxygenFlameSeries, airflow: airflowSpreadSeries },
  }));
}
