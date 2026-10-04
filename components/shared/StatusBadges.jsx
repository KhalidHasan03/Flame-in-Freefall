"use client";

import { CONFIDENCE_LEVELS, EVIDENCE_LEVELS } from "@/lib/constants";
import { useSettings } from "@/lib/context/SettingsProvider";
import { CONFIDENCE_TONE, EVIDENCE_TONE } from "@/lib/tones";
import { CircleAlert, CircleCheck, CircleHelp } from "lucide-react";
import Badge from "./Badge";

const EVIDENCE_ICON = { High: CircleCheck, Medium: CircleHelp, Limited: CircleAlert };

/**
 * `showLabel` is the compact form used in grids and tables, which is exactly what the
 * "show evidence levels by default" preference governs. The expanded form on detail pages
 * always renders, so a record's evidence is never fully hidden.
 */
export function EvidenceBadge({ level, showLabel = true, className = "" }) {
  const { settings } = useSettings();
  const detail = EVIDENCE_LEVELS.find((entry) => entry.id === level);
  const Icon = EVIDENCE_ICON[level] ?? CircleHelp;

  if (!showLabel && !settings.showEvidenceByDefault) return null;

  return (
    <Badge
      tone={EVIDENCE_TONE[level] ?? "neutral"}
      icon={Icon}
      title={detail?.description}
      className={className}
    >
      {showLabel ? `${level} evidence` : level}
    </Badge>
  );
}

export function ConfidenceBadge({ level, label = "Confidence", className = "" }) {
  return (
    <Badge
      tone={CONFIDENCE_TONE[level] ?? "neutral"}
      title={CONFIDENCE_LEVELS[level]?.guidance}
      className={className}
    >
      {label}: {level}
    </Badge>
  );
}

const RISK_TONE = { Low: "safe", Moderate: "info", Elevated: "ember", Severe: "alert" };

export function RiskBadge({ level, className = "" }) {
  return (
    <Badge tone={RISK_TONE[level] ?? "neutral"} dot className={className}>
      {level} risk
    </Badge>
  );
}