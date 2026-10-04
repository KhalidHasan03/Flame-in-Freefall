"use client";

import { Check, GitCompareArrows, Plus } from "lucide-react";
import { useCompare } from "@/lib/context/CompareProvider";
import { MAX_COMPARISON_SIZE } from "@/lib/constants";
import { useState } from "react";

/**
 * Adds or removes a record from the comparison tray. Reports the "tray is full" case inline
 * rather than silently ignoring the click.
 */
export default function CompareToggle({ id, compact = false, className = "" }) {
  const { isSelected, toggle, max } = useCompare();
  const [notice, setNotice] = useState("");

  const selected = isSelected(id);
  const Icon = selected ? Check : Plus;

  const handleClick = () => {
    const outcome = toggle(id);
    if (outcome === "full") {
      setNotice(`Comparison holds up to ${MAX_COMPARISON_SIZE} experiments.`);
      return;
    }
    setNotice(outcome === "added" ? `${id} added to comparison` : `${id} removed from comparison`);
  };

  return (
    <>
      <button
        type="button"
        aria-pressed={selected}
        onClick={handleClick}
        title={selected ? `Remove ${id} from comparison` : `Add ${id} to comparison`}
        className={`fx-btn fx-btn-outline h-7 px-2 text-[11px] ${
          selected ? "border-brand bg-brand/15 text-brand" : ""
        } ${className}`}
      >
        {compact ? <Icon className="size-3.5" aria-hidden="true" /> : null}
        {compact ? null : (
          <span className="flex items-center gap-1.5">
            <GitCompareArrows className="size-3.5" aria-hidden="true" />
            {selected ? "In comparison" : "Compare"}
          </span>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {notice}
      </span>
      <span className="sr-only">
        {max} slots available.
      </span>
    </>
  );
}