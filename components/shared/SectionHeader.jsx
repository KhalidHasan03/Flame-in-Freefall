export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  icon: Icon,
  as: Tag = "h2",
  id,
  className = "",
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-3 ${className}`}>
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="fx-label flex items-center gap-1.5">
            {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
            {eyebrow}
          </p>
        ) : null}
        <Tag id={id} className="text-lg font-semibold text-ink sm:text-xl">
          {title}
        </Tag>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
