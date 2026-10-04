import { getSuggestedQuestions } from "@/lib/api/ai";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import PageHeader from "@/components/shell/PageHeader";
import FirewiseView from "@/components/firewise/FirewiseView";

export const metadata = {
  title: "Firewise AI",
  description: "Evidence-first research assistant over the prototype combustion dataset.",
};

export default async function FirewisePage() {
  const suggested = await getSuggestedQuestions();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Evidence-first assistant"
        title="Firewise"
        description="Ask about flame behaviour, materials, missions or gaps. Answers cite the records they rest on and state when the dataset cannot support a conclusion."
      >
        <p className="mt-2 text-xs text-ink-faint">{PROTOTYPE_LABELS.aiNote}</p>
      </PageHeader>

      <FirewiseView suggested={suggested} />
    </div>
  );
}