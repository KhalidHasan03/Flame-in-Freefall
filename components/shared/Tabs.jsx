"use client";

import { useId } from "react";

/**
 * Underlined tab strip. Uses roving `aria-selected` tabs with arrow-key support so it behaves
 * as a real tablist rather than a row of buttons.
 */
export default function Tabs({ tabs, activeId, onChange, className = "", label = "Sections" }) {
  const baseId = useId();
  const enabled = tabs.some((tab) => tab.id === activeId);

  const handleKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.id === activeId);
    if (index < 0) return;

    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const next = tabs[nextIndex];
    onChange(next.id);
    document.getElementById(`${baseId}-${next.id}`)?.focus();
  };

  return (
    <div className={`fx-scrollbar overflow-x-auto ${className}`}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex min-w-max items-center gap-1 border-b border-line"
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeId || (!enabled && tab.id === tabs[0].id);
          return (
            <button
              key={tab.id}
              id={`${baseId}-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={`relative -mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                selected
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {tab.icon ? <tab.icon className="size-3.5" aria-hidden="true" /> : null}
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={`fx-numeric rounded-full px-1.5 py-px text-[10px] ${
                    selected ? "bg-brand/15 text-brand" : "bg-elevated text-ink-faint"
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}