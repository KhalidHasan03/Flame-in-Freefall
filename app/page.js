import { getDashboardData } from "@/lib/api/dashboard";
import { APP_NAME, COMPARISON_FIELDS, DEFAULT_FLAME_PARAMS, TEAM_NAME } from "@/lib/constants";
import PageHeader from "@/components/shell/PageHeader";
import MetricStrip from "@/components/dashboard/MetricStrip";
import QuickNav from "@/components/dashboard/QuickNav";

export const metadata = {
  title: "Dashboard",
  description: "Prototype overview of the FlareNexus microgravity combustion dataset.",
};

/**
 * The dashboard.
 *
 * Three blocks: what this is, what the dataset contains, and where to go next. Roughly three
 * hundred pixels of scroll, all of it above the fold on a laptop.
 *
 * It was seven blocks and about two thousand pixels. What came off it, and why:
 *
 *   Research prompt       →  /firewise, which is in the primary nav. It was the largest element
 *                            on the page, above the fold, for one input field.
 *   Environment overview  →  /mission-lab. The mission selector renders there too, and since
 *     + flame envelope       neither this block nor /mission-lab persists a mission id — there is
 *     + readouts             no mission key in `STORAGE_KEYS` and no mission provider — the
 *                            overview was holding local state that went nowhere when the reader
 *                            followed a link.
 *   Lead record           →  /explore, which ranks the same records for a reader who is
 *   + "also worth reading"     actually choosing between them. On a summary page it was the
 *                            single largest finding rendered at full length, above the count of
 *                            how many findings exist.
 *
 * Nothing was lost that is not better placed. Every route removed from `/` remains in the primary
 * navigation, and the counts that used to sit at the bottom of the page are now the page.
 *
 * This is deliberately a count summary and not an overview. A count is cheap to verify and cheap
 * to maintain — every figure comes from `lib/api/dashboard.js`, which derives it from the loaded
 * records — whereas prose about the data is a claim that needs re-checking whenever the data
 * changes. For a prototype whose dataset is about to be replaced by a real API response, the
 * first of those two is the better thing to have on the front page.
 */
export default async function DashboardPage() {
  const { dataset } = await getDashboardData();

  return (
    <div className="space-y-5">
      <PageHeader
        variant="compact"
        eyebrow={`${TEAM_NAME} • ${APP_NAME}`}
        title="Dashboard"
        description="Microgravity fire-safety research index. Every figure is counted from the records loaded in this build — demonstration data, not a verified archive."
      />

      <MetricStrip dataset={dataset} />

      <QuickNav
        recordCount={dataset.records}
        variableCount={dataset.variablesPerRecord}
        problemCount={dataset.problems}
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