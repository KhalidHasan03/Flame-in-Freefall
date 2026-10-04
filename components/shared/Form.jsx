"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";

/** Labelled control wrapper. Every field in the app goes through this so labels stay bound. */
export function Field({ label, hint, htmlFor, children, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label ? (
        <label htmlFor={htmlFor} className="fx-label block">
          {label}
        </label>
      ) : null}
      {children}
      {hint ? <p className="text-[11px] leading-relaxed text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ label, hint, id, className = "", ...props }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <Field label={label} hint={hint} htmlFor={inputId} className={className}>
      <input id={inputId} className="fx-input" {...props} />
    </Field>
  );
}

export function Select({ label, hint, id, options, className = "", children, ...props }) {
  const generated = useId();
  const selectId = id ?? generated;
  return (
    <Field label={label} hint={hint} htmlFor={selectId} className={className}>
      <div className="relative">
        <select id={selectId} className="fx-input appearance-none pr-8" {...props}>
          {options
            ? options.map((option) => (
                <option key={option.value ?? option} value={option.value ?? option}>
                  {option.label ?? option}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}

export function RangeInput({
  label,
  hint,
  id,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  className = "",
  ...props
}) {
  const generated = useId();
  const inputId = id ?? generated;
  const fill = max === min ? 0 : ((Number(value) - min) / (max - min)) * 100;
  return (
    <Field label={label} hint={hint} htmlFor={inputId} className={className}>
      <div className="flex items-center gap-3">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="fx-range flex-1 cursor-pointer appearance-none"
          style={{ "--range-fill": `${Math.min(100, Math.max(0, fill))}%` }}
          {...props}
        />
        <span className="fx-numeric w-[4.5rem] shrink-0 text-right text-xs font-semibold text-ink">
          {value}
          {unit ? <span className="ml-0.5 text-ink-faint">{unit}</span> : null}
        </span>
      </div>
    </Field>
  );
}

export function Toggle({ checked, onChange, label, description, id, className = "" }) {
  const generated = useId();
  const toggleId = id ?? generated;
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <label htmlFor={toggleId} className="block text-sm font-medium text-ink">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-[22px] w-[38px] shrink-0 rounded-full border transition-colors ${
          // The knob is white in both states, so the checked track has to be the light one and
          // the knob has to invert to near-black. A white track under a white knob renders as
          // a blank pill with no visible control in it.
          checked ? "border-ink bg-ink" : "border-line-strong bg-elevated"
        }`}
      >
        <span
          className={`absolute top-[2px] size-4 rounded-full shadow transition-transform ${
            checked ? "translate-x-[18px] bg-void" : "translate-x-[2px] bg-ink"
          }`}
        />
      </button>
    </div>
  );
}