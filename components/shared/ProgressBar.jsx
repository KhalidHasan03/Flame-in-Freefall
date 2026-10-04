import { tone } from "@/lib/tones";

export default function ProgressBar({
  value,
  label,
  showValue = true,
  tone: name = "brand",
  size = "md",
  className = "",
}) {
  const palette = tone(name);
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));
  const height = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className={className}>
      {label || showValue ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label ? <span className="text-xs text-ink-muted">{label}</span> : <span />}
          {showValue ? (
            <span className={`fx-numeric text-xs font-semibold ${palette.text}`}>
              {Math.round(clamped)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className={`${height} w-full overflow-hidden rounded-full bg-elevated`}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className={`h-full rounded-full ${palette.bar} transition-[width] duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
