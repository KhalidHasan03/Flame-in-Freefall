import {
  getAllInsights,
  getAllMissionFindings,
  getCoverageAndRisk,
  getGravityMorphologySeries,
  getModelStatements,
} from "@/lib/api/insights";
import PageHeader from "@/components/shell/PageHeader";
import InsightsView from "@/components/insights/InsightsView";

export const metadata = {
  title: "Insights",
  description: "Cross-experiment patterns, findings, conflicts and research gaps.",
};

export default async function InsightsPage() {
  const [insights, missionFindings, gravity, statements, coverage] = await Promise.all([
    getAllInsights(),
    getAllMissionFindings(),
    getGravityMorphologySeries(),
    getModelStatements(),
    getCoverageAndRisk(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
          variant="compact"
        eyebrow="Cross-experiment synthesis"
        title="Insights"
        description="Patterns, high-relevance findings, genuine conflicts in the evidence, and the gaps that limit what the dataset can currently support."
      />

      <InsightsView
        patterns={insights.patterns}
        findings={insights.findings}
        statements={statements}
        conflicts={insights.conflicts}
        gaps={insights.gaps}
        missionFindings={missionFindings}
        series={insights.series}
        gravity={gravity}
        coverage={coverage}
        riskFactors={coverage.riskFactors}
      />
    </div>
  );
}