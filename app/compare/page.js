import { getExperiments } from "@/lib/api/experiments";
import { MAX_COMPARISON_SIZE } from "@/lib/constants";
import PageHeader from "@/components/shell/PageHeader";
import CompareView from "@/components/compare/CompareView";

export const metadata = {
  title: "Compare",
  description: "Compare up to three microgravity combustion experiments side by side.",
};

export default async function ComparePage() {
  const experiments = await getExperiments();

  return (
    <div className="space-y-6">
      <PageHeader
          variant="compact"
        eyebrow="Side-by-side analysis"
        title="Experiment comparison"
        description={`Select up to ${MAX_COMPARISON_SIZE} records and compare their recorded conditions, evidence strength and conclusions.`}
      />

      <CompareView experiments={experiments} />
    </div>
  );
}