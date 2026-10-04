import { getExperiments, getExperimentFacets } from "@/lib/api/experiments";
import { getMissions } from "@/lib/api/missions";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import PageHeader from "@/components/shell/PageHeader";
import ExplorerView from "@/components/explore/ExplorerView";

export const metadata = {
  title: "Explore",
  description: "Search and filter the prototype microgravity combustion dataset.",
};

export default async function ExplorePage() {
  const [experiments, facets, missions] = await Promise.all([
    getExperiments(),
    getExperimentFacets(),
    getMissions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dataset explorer"
        title="Explore the dataset"
        description={`Filter ${experiments.length} synthetic experiment records by programme, fuel, gravity, airflow and evidence level. Relevance ranking uses the prototype scoring model.`}
      >
        <p className="mt-2 text-xs text-ink-faint">{PROTOTYPE_LABELS.sampleNote}</p>
      </PageHeader>

      <ExplorerView experiments={experiments} facets={facets} missions={missions} />
    </div>
  );
}