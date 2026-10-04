import { tone } from "@/lib/tones";

const SIZE = 116;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRing({ value, label, caption, tone: name = "brand", size = SIZE }) {
  const palette = tone(name);
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  const scale = size / SIZE;

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative shrink-0 ${palette.text}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${label ?? "Score"}: ${Math.round(clamped)} out of 100`}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90" aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--fx-elevated)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`fx-numeric font-bold leading-none ${palette.text}`}
            style={{ fontSize: 28 * scale }}
          >
            {Math.round(clamped)}%
          </span>
          {label ? (
            <span
              className="fx-label mt-1 text-center leading-tight"
              style={{ fontSize: 9 * scale, letterSpacing: "0.08em" }}
            >
              {label}
            </span>
          ) : null}
        </div>
      </div>
      {caption ? <p className="text-xs leading-relaxed text-ink-muted">{caption}</p> : null}
    </div>
  );
}
