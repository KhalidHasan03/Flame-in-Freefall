import { tone } from "@/lib/tones";

/**
 * Compact status pill. `dot` adds a colour marker, but callers should always pass a text
 * label alongside it so status is never communicated by colour on its own.
 */
export default function Badge({ children, tone: name = "neutral", dot = false, icon: Icon, className = "" }) {
  const palette = tone(name);
  return (
    <span
      className={`fx-chip border ${palette.border} ${palette.surface} ${palette.text} ${className}`}
    >
      {dot ? <span className={`size-1.5 rounded-full ${palette.bar}`} aria-hidden="true" /> : null}
      {Icon ? <Icon className="size-3" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
