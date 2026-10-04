import { tone } from "@/lib/tones";
import { HelpCircle, Info } from "lucide-react";
import { useId } from "react";

export default function PrototypeBadge({ label = "Prototype", tooltip, tone: name = "info", className = "" }) {
  const palette = tone(name);
  const id = useId();
  return (
    <span
      aria-describedby={tooltip ? id : undefined}
      title={tooltip}
      className={`fx-chip border ${palette.border} ${palette.surface} ${palette.text} ${className}`}
    >
      <Info className="size-3" aria-hidden="true" />
      <span>{label}</span>
      {tooltip ? (
        <>
          <HelpCircle className="size-3 opacity-70" aria-hidden="true" />
          <span id={id} className="sr-only">
            {tooltip}
          </span>
        </>
      ) : null}
    </span>
  );
}
