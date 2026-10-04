"use client";

import Link from "next/link";
import { ExternalLink, Sparkles, User } from "lucide-react";
import { ConfidenceBadge } from "@/components/shared/StatusBadges";
import PrototypeBadge from "@/components/shared/PrototypeBadge";
import { PROTOTYPE_LABELS } from "@/lib/constants";

/**
 * Evidence chips. Every chip links to a real record so a citation can never be a dead end,
 * and each is labelled with its ID rather than relying on position or colour.
 */
export function EvidenceChips({ ids, className = "" }) {
  if (!ids?.length) {
    return (
      <p className="rounded-lg border border-ember/25 bg-ember/[0.07] px-2.5 py-1.5 text-[11px] leading-relaxed text-ember">
        No supporting records — treat this as a research gap rather than a null result.
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className="fx-label">Evidence</span>
      {ids.map((id) => (
        <Link
          key={id}
          href={`/experiments/${id}`}
          className="fx-numeric inline-flex items-center gap-1 rounded-full border border-line-strong bg-elevated/70 px-2 py-0.5 text-[10px] font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand"
        >
          {id}
          <ExternalLink className="size-2.5" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-elevated">
          <User className="size-3 text-ink-faint" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 rounded-[var(--radius-panel)] rounded-tl-sm border border-line bg-elevated/50 px-3 py-2">
          <p className="text-xs leading-relaxed text-ink">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15">
        <Sparkles className="size-3 text-brand" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 space-y-2.5 rounded-[var(--radius-panel)] rounded-tl-sm border border-brand/20 bg-brand/[0.06] px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <PrototypeBadge label={PROTOTYPE_LABELS.ai} />
          {message.confidence ? <ConfidenceBadge level={message.confidence} /> : null}
        </div>
        <p className="text-xs leading-relaxed text-ink">{message.text}</p>
        {message.followUp ? (
          <p className="border-l-2 border-brand/40 pl-2.5 text-xs leading-relaxed text-ink-muted">
            {message.followUp}
          </p>
        ) : null}
        {message.caveat ? (
          <p className="rounded-lg border border-ember/25 bg-ember/[0.07] px-2.5 py-1.5 text-[11px] leading-relaxed text-ember">
            {message.caveat}
          </p>
        ) : null}
        <EvidenceChips ids={message.evidence} />
      </div>
    </div>
  );
}