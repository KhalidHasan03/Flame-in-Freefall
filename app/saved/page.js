import PageHeader from "@/components/shell/PageHeader";
import SavedView from "@/components/saved/SavedView";

export const metadata = {
  title: "Saved",
  description: "Your saved experiments, insights and answers.",
};

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Saved items"
        description="Experiments and insights you bookmarked. Everything stays in this browser."
      />
      <SavedView />
    </div>
  );
}