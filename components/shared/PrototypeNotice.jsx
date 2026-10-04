"use client";

import { PROTOTYPE_LABELS } from "@/lib/constants";
import { useSettings } from "@/lib/context/SettingsProvider";
import { TriangleAlert } from "lucide-react";

/**
 * Disclosure block for demonstration data. Rendered next to every generated figure so the
 * distinction between a measured result and a prototype value is always visible. Hidden only
 * when the user explicitly turns prototype labels off in Settings.
 */
export default function PrototypeNotice({ message, label = "Demonstration data", compact = false, className = "" }) {
  const { settings } = useSettings();
  if (!settings.showPrototypeLabels) return null;

  return (
    <div
      className={`flex gap-2.5 rounded-lg border border-ember/25 bg-ember/[0.07] ${compact ? "px-2.5 py-2" : "px-3.5 py-3"} ${className}`}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden="true" />
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-semibold text-ember">{label}</p>
        <p className="text-xs leading-relaxed text-ink-muted">{message ?? PROTOTYPE_LABELS.notValidated}</p>
      </div>
    </div>
  );
}
