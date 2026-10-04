import { getExperiments } from "@/lib/api/experiments";
import { getMissions, getMoonMarsComparison } from "@/lib/api/missions";
import { getAllMissionFindings, getResearchGaps } from "@/lib/api/insights";
import PageHeader from "@/components/shell/PageHeader";
import MissionLabView from "@/components/mission-lab/MissionLabView";

export const metadata = {
  title: "Mission Lab",
  description: "Assess research relevance of the dataset against target mission environments.",
};

export default async function MissionLabPage() {
  /*
    One `Promise.all` rather than two. Every one of these reads is synchronous in mock mode, so the
    grouping is cosmetic — but it is here because the moment `USE_MOCKS` goes false these become
    five network round trips, and the number of `await`s in this function is the number the page
    pays for.
  */
  const [missions, experiments, findingsByMission, gaps, moonMars] = await Promise.all([
    getMissions(),
    getExperiments(),
    getAllMissionFindings(),
    getResearchGaps(),
    getMoonMarsComparison(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mission applicability"
        title="Mission Lab"
        description="Compare target environments, rank the dataset against each one, and read the findings and gaps that matter for crewed missions where the oxidiser is life-support consumable."
      />

      <MissionLabView
        missions={missions}
        experiments={experiments}
        findingsByMission={findingsByMission}
        gaps={gaps}
        moonMars={moonMars}
      />
    </div>
  );
}