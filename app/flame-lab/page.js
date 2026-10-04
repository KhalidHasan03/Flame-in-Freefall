import { getExperiments } from "@/lib/api/experiments";
import { getMissions } from "@/lib/api/missions";
import PageHeader from "@/components/shell/PageHeader";
import FlameLabView from "@/components/flame-lab/FlameLabView";

export const metadata = {
  title: "Flame Lab",
  description: "Adjust combustion conditions and observe the stylised flame response.",
};

export default async function FlameLabPage() {
  const [missions, experiments] = await Promise.all([getMissions(), getExperiments()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interactive model"
        title="Flame Lab"
        description="Change gravity, oxidiser, pressure, airflow, temperature and fuel to see how a stylised flame responds, alongside the prototype risk breakdown for each target environment."
      />

      <FlameLabView missions={missions} experiments={experiments} />
    </div>
  );
}