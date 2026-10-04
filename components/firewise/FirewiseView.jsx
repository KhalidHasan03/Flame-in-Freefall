"use client";

import { Compass, Lightbulb, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { useFirewise } from "@/lib/context/FirewiseProvider";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import FirewisePanel from "@/components/firewise/FirewisePanel";
import { SuggestedQuestions } from "@/components/firewise/MessageInput";

/** How Firewise works, stated plainly so the demo is never mistaken for a live model. */
const PRINCIPLES = [
  {
    Icon: ShieldQuestion,
    title: "It says when it does not know",
    body: "A question the dataset does not cover returns an explicit 'no supporting records' answer. That is treated as a research gap, not a failure to be papered over with a plausible-sounding response.",
  },
  {
    Icon: Compass,
    title: "Every claim is traceable",
    body: "Answers cite experiment IDs that link to the underlying record, so any statement can be checked against its evidence — including checking the evidence itself.",
  },
  {
    Icon: Lightbulb,
    title: "Evidence grades are visible",
    body: "Confidence reflects how strongly the cited records support the conclusion. Thin evidence is stated as thin rather than presented with the same weight as well-supported findings.",
  },
];

export default function FirewiseView({ suggested }) {
  const { ask } = useFirewise();
  const [asked, setAsked] = useState(0);

  const handlePick = (question) => {
    setAsked((count) => count + 1);
    ask(question);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="space-y-4">
        <Panel className="flex flex-col gap-4 p-5">
          <SectionHeader
            eyebrow="About this assistant"
            title="Firewise"
            description="An evidence-first research assistant over the prototype dataset."
          />
          <ul className="space-y-3">
            {PRINCIPLES.map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-2.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-brand/12">
                  <Icon className="size-3.5 text-brand" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <PrototypeNotice label={PROTOTYPE_LABELS.ai} message={PROTOTYPE_LABELS.aiNote} />
        </Panel>

        <Panel className="flex flex-col gap-3.5 p-5">
          <SectionHeader eyebrow="Getting started" title="Suggested questions" />
          <SuggestedQuestions onPick={handlePick} />
          {asked > 0 ? (
            <p className="text-[11px] text-ink-faint" aria-live="polite">
              Sent to the assistant.
            </p>
          ) : null}
          <p className="text-[11px] leading-relaxed text-ink-faint">
            {suggested.length} starting points are drawn from the questions the loaded records can
            actually support.
          </p>
        </Panel>
      </div>

      <Panel className="flex min-h-[36rem] flex-col overflow-hidden">
        <FirewisePanel />
      </Panel>
    </div>
  );
}