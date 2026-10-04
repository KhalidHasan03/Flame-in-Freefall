import { getDashboardData } from "@/lib/api/dashboard";
import {
  APP_NAME,
  CHALLENGE_NAME,
  COMPARISON_FIELDS,
  DEFAULT_FLAME_PARAMS,
  TEAM_NAME,
} from "@/lib/constants";
import PageHeader from "@/components/shell/PageHeader";
import FeaturedInsight from "@/components/dashboard/FeaturedInsight";
import MetricStrip from "@/components/dashboard/MetricStrip";
import MissionOverview from "@/components/dashboard/MissionOverview";
import QuickNav from "@/components/dashboard/QuickNav";

export const metadata = {
  title: "Dashboard",
  description: "Prototype overview of the FlareNexus microgravity combustion dataset.",
};

/**
 * The dashboard.
 *
 * Five blocks, in the order a reader actually needs them:
 *
 *   1  header       what this is, and the disclosure that it is demonstration data
 *   2  overview     the active environment and the state of the evidence base against it
 *   3  lead record  one finding, in full, chosen by a stated rule
 *   4  scale        four counted figures, so the size of the base is known before it is explored
 *   5  quick nav    the four routes worth taking next
 *
 * What came off this page, and why:
 *
 *   Environment plates     →  /mission-lab, where the destination selector that drives them lives.
 *                            On the dashboard they were four static cards restating that the same
 *                            flame behaves differently at different gravity, which is a claim, not
 *                            a dataset.
 *   Moon / Mars comparison →  /mission-lab, with the per-mission detail those two rows summarise.
 *   Coverage by program     →  /insights, beside the risk posture they are meant to be read against.
 *   Risk factors           →  /insights.
 *   Recent insights list   →  replaced by the single lead record, and the rest of the list stays
 *                            on /insights.
 *   Live chamber + sliders →  /flame-lab. Moving them is the point of that route, and on the
 *                            dashboard they occupied the largest region on the page while leading
 *                            nowhere.
 *
 * No capability was removed. Every control, filter and readout that left the dashboard is still
 * reachable from the block above that redirects to it, and `/` is now short enough to be read in
 * one screen.
 */
export default async function DashboardPage() {
  const { missions, dataset, featured } = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${TEAM_NAME} • ${CHALLENGE_NAME}`}
        title={`${APP_NAME} research dashboard`}
        description="A central index of microgravity combustion research, with evidence grading, mission relevance scoring and an evidence-first assistant. Everything rendered here is demonstration data."
        telemetry={
          <>
            <div className="fx-telemetry">
              <span className="fx-telemetry-label">Records</span>
              <span className="fx-telemetry-value">{dataset.records} loaded</span>
            </div>
            <div className="fx-telemetry">
              <span className="fx-telemetry-label">Environments</span>
              <span className="fx-telemetry-value">{dataset.destinations} tracked</span>
            </div>
          </>
        }
      />

      <MissionOverview missions={missions} featured={featured} />

      <FeaturedInsight record={featured} />

      <MetricStrip dataset={dataset} />

      <QuickNav
        recordCount={dataset.records}
        variableCount={dataset.variablesPerRecord}
        /*
          Counted from the parameter object rather than written as a literal. `FlameControls`
          renders one control per key of this object, so the two cannot drift — a figure that
          hardcodes "6 controls" is a figure that starts lying the first time a condition is added.
        */
        controlCount={Object.keys(DEFAULT_FLAME_PARAMS).length}
        fieldCount={COMPARISON_FIELDS.length}
      />
    </div>
  );
}