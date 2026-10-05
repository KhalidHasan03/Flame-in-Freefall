import Link from "next/link";
import { FileSearch } from "lucide-react";
import Badge from "@/components/shared/Badge";

/** Insight record with its supporting experiment IDs rendered as navigable chips. */
export default function InsightCard({ insight, accent = "brand", meta }) {
  return (
    <li className="rounded-[var(--radius-panel)] border border-line bg-elevated/25 px-4 py-3.5 transition-colors hover:border-line-strong">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="fx-numeric text-[10px] font-bold text-brand">{insight.id}</span>
        {insight.topic ? <Badge tone="neutral">{insight.topic}</Badge> : null}
        {insight.strength ? <Badge tone={insight.strength === "High" ? "safe" : insight.strength === "Medium" ? "info" : "ember"}>{insight.strength} strength</Badge> : null}
        {insight.severity ? <Badge tone="ember">{insight.severity} severity</Badge> : null}
        {meta ? <span className="fx-label ml-auto">{meta}</span> : null}
      </div>

      <h3 className="mt-2 text-xs font-semibold leading-snug text-ink">{insight.title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{insight.statement ?? insight.detail}</p>

      {insight.supportingIds?.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-2.5">
          <span className="fx-label flex items-center gap-1">
            <FileSearch className="size-3" aria-hidden="true" />
            Evidence
          </span>
          {insight.supportingIds.map((id) => (
            <Link
              key={id}
              href={`/experiments/${id}`}
              className={`fx-numeric rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                accent === "ember"
                  ? "border-ember/35 text-ember hover:bg-ember/12"
                  : "border-line-strong text-ink-muted hover:border-brand hover:text-brand"
              }`}
            >
              {id}
            </Link>
          ))}
        </div>
      ) : null}
    </li>
  );
}