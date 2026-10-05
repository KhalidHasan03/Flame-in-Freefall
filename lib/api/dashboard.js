import { experiments } from "@/data/experiments";
import { experimentSources } from "@/data/experimentSources";
import { researchGaps } from "@/data/insights";
import { missions } from "@/data/missions";
import { request } from "./client";

/**
 * The shape of the dataset, counted rather than asserted.
 *
 * This is the entire substance of `/`. The dashboard used to render seven blocks — a research
 * prompt, an environment overview, a lead record, three more records, a metric strip and a
 * navigation grid — for roughly two thousand pixels of scrolling. It now renders the numbers and
 * links to where the reading happens. Every figure below is therefore load-bearing: it is the page.
 *
 * Every figure is derived from the records that are actually loaded. The previous strip of
 * headline numbers came from `PROTOTYPE_METRICS` in `lib/constants` — "1,240+ experiments",
 * "380+ papers", "342 AI insights" — which described a dataset that does not exist in this
 * repository. Labelling those as prototype figures was honest but still misleading: a visitor
 * reads a dashboard's headline numbers as facts about what it holds, and those numbers were
 * about neither this build nor any real archive.
 *
 * Counting has a second benefit. When the demonstration records are replaced by a real API
 * response, these figures update on their own and cannot go stale, because there is nothing left
 * to update them *from*.
 *
 * Two counts are deliberately not totals, and the comments say which question each one answers:
 *
 *   `variablesPerRecord` is the key count of the first record's `variables`, not the sum across
 *   records. "How much is recorded per experiment" is what a reader of that figure is asking;
 *   9 × 26 = 234 would be a different and much less useful quantity.
 *
 *   `findings` *is* a sum, because "how many distinct things did these records observe" is
 *   exactly the question, and 53 findings across 26 records is the honest answer to it. It is
 *   counted as a sum rather than a set because the strings are authored per record and are not
 *   deduplicated — a set would imply a precision the data does not have.
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

  /*
    Distinct missions that actually have at least one record. Counted from the records rather than
    assumed equal to `destinations`, because the difference between those two numbers is the
    single most useful thing this page can say: `missions` is 4 while `missionsWithRecords` is 2,
    since nothing in the dataset sits at lunar or Martian gravity. That gap is GAP-01 — "No
    combustion data at partial gravity" — and it is why the tile reads "2 without records"
    instead of just showing 4.
  */
  const missionsWithRecords = new Set(experiments.map((experiment) => experiment.mission)).size;

  return {
    records: experiments.length,
    sources: experimentSources.length,

    /** Distinct authored findings across every record — the breadth of what was observed. */
    findings: experiments.reduce((total, experiment) => total + (experiment.findings?.length ?? 0), 0),

    /*
      The problems. `researchGaps` is the app's canonical open-question collection — it already
      backs the "Research Gaps" tab on /insights, the "Unknowns" section on /mission-lab and the
      example question on the Firewise input, so this reuses that concept rather than inventing a
      parallel one. `problemsHigh` is separated rather than folded into a single number because
      severity is the actionable part: three of the five gaps are High, and a flat "5" would hide
      that.
    */
    problems: researchGaps.length,
    problemsHigh: researchGaps.filter((gap) => gap.severity === "High").length,

    /** Destinations the product models, not just those the sample happens to cover. */
    missions: missions.length,
    missionsWithRecords,

    variablesPerRecord: perRecord,
    evidence,
  };
}

/**
 * `/` reads nothing but `dataset`.
 *
 * Previously this also returned `missions`, `featured` and `featuredMore`, feeding a ranked
 * lead record and a three-row "also worth reading" list. Both are gone from the dashboard — the
 * ranking stays alive in `getExperiments` and renders on /explore, where a reader is actually
 * choosing between records — so the selection helpers that produced them were deleted rather
 * than left unreachable. Nothing is computed here that the page does not display.
 */
export async function getDashboardData() {
  return request("dashboard", () => ({ dataset: countDataset() }));
}