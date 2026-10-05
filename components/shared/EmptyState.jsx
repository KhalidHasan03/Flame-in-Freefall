export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-[var(--radius-panel)] border border-dashed border-line-strong bg-elevated/25 px-6 py-12 text-center ${className}`}
    >
      {Icon ? (
        <span className="flex size-11 items-center justify-center rounded-full border border-line bg-panel">
          <Icon className="size-5 text-ink-faint" aria-hidden="true" />
        </span>
      ) : null}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-ink">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
