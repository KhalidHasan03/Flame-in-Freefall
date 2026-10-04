import { experiments } from "@/data/experiments";
import { experimentSources } from "@/data/experimentSources";
import { emergingPatterns, highRelevanceFindings } from "@/data/insights";
import { missions } from "@/data/missions";
import { request } from "./client";

/**
 * The shape of the dataset, counted rather than asserted.
 *
 * Every figure here is derived from the records that are actually loaded. The previous strip of
 * headline numbers came from `PROTOTYPE_METRICS` in `lib/constants` — "1,240+ experiments",
 * "380+ papers", "342 AI insights" — which described a dataset that does not exist in this
 * repository. Labelling those as prototype figures was honest but still misleading: a visitor
 * reads a dashboard's headline numbers as facts about what it holds, and those numbers were
 * about neither this build nor any real archive.
 *
 * Counting instead has a second benefit. When the demonstration records are replaced by a real
 * API response, these four figures update on their own and cannot go stale, because there is
 * nothing left to update them *from*.
 *
 * `variablesPerRecord` is the count of keys on the first record's `variables` object, not the
 * sum across records. It answers "how much is recorded per experiment", which is the question a
 * reader of that figure is asking; a total across 26 records would be a different and much less
 * useful quantity.
 */
function countDataset() {
  const perRecord = experiments[0] ? Object.keys(experiments[0].variables ?? {}).length : 0;

  const evidence = experiments.reduce(
    (tally, experiment) => {
      tally[experiment.evidenceLevel] = (tally[experiment.evidenceLevel] ?? 0) + 1;
      return tally;
    },
    { High: 0, Medium: 0, Limited: 0 },
  );

  return {
    records: experiments.length,
    sources: experimentSources.length,
    programs: new Set(experiments.map((experiment) => experiment.program)).size,
    /** Destinations the product models, not just those the sample happens to cover. */
    destinations: missions.length,
    variablesPerRecord: perRecord,
    evidence,
  };
}

/**
 * The one record the dashboard leads with.
 *
 * A dashboard that opens with a wall of equally-weighted panels makes the reader do the triage.
 * This picks a single record so the first thing on the page is already the thing worth reading.
 *
 * The rule is fixed and stated rather than editorial, because a selection that could be tuned to
 * taste is a selection the reader cannot trust:
 *
 *   1. must carry at least one source, so anything shown is traceable
 *   2. must be graded High evidence, so the headline is not resting on the weakest material
 *   3. must be an orbital record, since that is where the dataset's density is
 *   4. highest `evidenceScore` wins; the record id breaks any tie, so the result is deterministic
 *
 * With the current demonstration set that resolves to FLEX-04 at a score of 90. If no record
 * satisfies the first three conditions the selection degrades to the highest-scoring record with
 * a source rather than rendering nothing — an empty lead panel would be worse than a weaker one.
 */
function selectFeaturedInsight() {
  const traceable = experiments.filter((experiment) => (experiment.sourceIds ?? []).length > 0);

  const byScore = (a, b) => b.evidenceScore - a.evidenceScore || a.id.localeCompare(b.id);

  const pool = traceable.filter(
    (experiment) => experiment.evidenceLevel === "High" && experiment.mission === "iss",
  );

  return pool.length ? pool.sort(byScore)[0] : traceable.sort(byScore)[0] ?? null;
}

export async function getDashboardData() {
  return request("dashboard", () => {
    const programs = [...new Set(experiments.map((experiment) => experiment.program))]
      .sort()
      .map((program) => ({
        program,
        count: experiments.filter((experiment) => experiment.program === program).length,
      }));

    const featured = selectFeaturedInsight();

    return {
      missions,
      sampleSize: experiments.length,
      /*
        Only what `/` renders. The coverage breakdown, the risk factors, the Moon/Mars rows and the
        authored insight statements all used to be assembled here because the dashboard was the
        only page that showed them; each now lives with the route that owns it —
        `lib/api/insights.js` for coverage and statements, `lib/api/missions.js` for the
        Moon/Mars rows. Keeping them here would mean two entry points for the same fact.
      */
      programs,
      dataset: countDataset(),
      /** Returned whole rather than trimmed — the panel reads a handful of fields, not a projection. */
      featured,
      patternCount: emergingPatterns.length,
      findingCount: highRelevanceFindings.length,
    };
  });
}
