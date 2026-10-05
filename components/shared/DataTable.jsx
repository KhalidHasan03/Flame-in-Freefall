import { SearchX } from "lucide-react";
import Button from "./Button";

/**
 * Responsive table wrapper. Comparison and evidence tables keep their full column set on
 * every breakpoint and scroll horizontally rather than collapsing into an unreadable stack.
 */
export default function DataTable({ children, className = "", minWidth = "min-w-[720px]", label }) {
  return (
    <div
      className={`fx-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 ${className}`}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <div className={minWidth}>{children}</div>
    </div>
  );
}

export function TableEmpty({ title, description, actionLabel, onAction, icon: Icon = SearchX }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-full border border-line bg-elevated/60">
        <Icon className="size-5 text-ink-faint" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-ink">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actionLabel ? <Button size="sm" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
