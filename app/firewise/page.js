import { Suspense } from "react";
import { getSuggestedQuestions } from "@/lib/api/ai";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import PageHeader from "@/components/shell/PageHeader";
import FirewiseView from "@/components/firewise/FirewiseView";
import FirewisePanelSkeleton from "@/components/firewise/FirewisePanelSkeleton";

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

      {/*
        A Suspense boundary around the view, and it is load-bearing rather than defensive.

        `FirewiseView` reads `?ask=` through `useSearchParams`, and Next refuses to prerender a
        route that touches search params without a boundary — opting the page into client-side
        rendering. The build fails outright with `missing-suspense-with-csr-bailout` if it is
        missing, which is the correct outcome: a deep link that silently rendered an empty panel
        would be worse than one that renders late.

        The fallback is the panel's own frame rather than a spinner, so the route's layout does not
        shift when the boundary resolves. The suggested questions are already resolved above and
        are passed through, so nothing is fetched twice.
      */}
      <Suspense fallback={<FirewisePanelSkeleton />}>
        <FirewiseView suggested={suggested} />
      </Suspense>
    </div>
  );
}