import { FileText } from "lucide-react";
import Badge from "@/components/shared/Badge";

/**
 * Source list. The identifiers are `src-*` placeholders rather than real document
 * numbers — fabricating a plausible NASA/TM number would produce citations that look
 * verifiable but are not.
 */
export default function SourcesPanel({ sources }) {
  if (!sources?.length) {
    return (
      <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-ink-faint">
        No source documents are linked to this record yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {sources.map((source) => (
        <li key={source.id} className="rounded-lg border border-line bg-elevated/30 px-3 py-2.5">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-info/12">
              <FileText className="size-3.5 text-info" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="fx-numeric text-[10px] font-bold text-info">{source.id}</span>
                <Badge tone="neutral">{source.typeLabel}</Badge>
                <Badge tone="neutral">{source.year}</Badge>
              </div>
              <p className="mt-1 text-xs font-medium leading-snug text-ink">{source.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-ink-faint">{source.note}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}