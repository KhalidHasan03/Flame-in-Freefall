"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Lightbulb, ShieldQuestion } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const consumed = useRef(false);

  /*
    `useCallback` rather than an inline handler so the effect below can depend on it truthfully.
    Without the memo the linter is right to complain: the effect closes over a function that is
    a new value on every render, so listing it as a dependency would be noise and omitting it
    would be an undeclared capture. Memoised on `ask` alone — `setAsked` is a stable setter and
    does not belong in the list.
  */
  const handlePick = useCallback(
    (question) => {
      setAsked((count) => count + 1);
      ask(question);
    },
    [ask],
  );

  /*
    A question handed over by the dashboard's research prompt, arriving as `?ask=`.

    `ask` is called rather than seeded, so the question goes through the same path as one typed
    into the panel — same conversation, same title-from-question behaviour, same in-flight guard.
    Nothing here reaches into provider state.

    The URL is then replaced rather than pushed, which is the whole point of doing it this way:
    the question becomes part of the conversation instead of a query string that would re-fire on
    every refresh and share a link to a question already asked. `replace` also keeps this out of
    browser history, so Back returns to the dashboard rather than to a stale copy of this route.

    The ref guards the double invocation that React 19 StrictMode causes in development, where
    effects mount, unmount and remount. Without it the question is asked twice on every dev
    reload; with it, once per navigation. The check is on `consumed` rather than on the parameter
    because the parameter is still present during the first of those two mounts.
  */
  useEffect(() => {
    const incoming = searchParams.get("ask")?.trim();
    if (!incoming || consumed.current) return;

    consumed.current = true;
    handlePick(incoming);
    router.replace("/firewise", { scroll: false });
  }, [searchParams, router, handlePick]);

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