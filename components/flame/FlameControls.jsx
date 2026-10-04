"use client";

import { AIRFLOW_LEVELS, FLAME_LIMITS, FUEL_OPTIONS, GRAVITY_PRESETS } from "@/lib/constants";
import { RangeInput, Select } from "@/components/shared/Form";

/** Segmented control used for gravity and airflow, which have few discrete options. */
function Segmented({ label, hint, value, options, onChange, name }) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="fx-label">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                active
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-line bg-elevated/40 text-ink-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              <span className="block">{option.label ?? option}</span>
              {option.description ? (
                <span className="mt-0.5 block text-[10px] font-medium text-ink-faint">
                  {option.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-[11px] leading-relaxed text-ink-faint">{hint}</p> : null}
      {name ? <span className="sr-only">{name}</span> : null}
    </fieldset>
  );
}

export default function FlameControls({ params, onChange, className = "" }) {
  const update = (key) => (value) => onChange({ ...params, [key]: value });

  return (
    <div className={`space-y-5 ${className}`}>
      <Segmented
        label="Gravity"
        hint="Gravity is the dominant control on flame shape in this dataset."
        value={params.gravity}
        options={GRAVITY_PRESETS}
        onChange={update("gravity")}
        name="gravity"
      />

      <Segmented
        label="Airflow"
        hint="Forced convection is the most controllable variable examined in the dataset."
        value={params.airflow}
        options={AIRFLOW_LEVELS.map((level) => ({ id: level, label: `${level} flow` }))}
        onChange={update("airflow")}
        name="airflow"
      />

      <RangeInput
        label="Oxygen concentration"
        hint="Reacts to the 15–25% range explored by the loaded records."
        value={params.oxygen}
        min={FLAME_LIMITS.oxygen.min}
        max={FLAME_LIMITS.oxygen.max}
        step={FLAME_LIMITS.oxygen.step}
        unit="% O₂"
        onChange={update("oxygen")}
      />

      <RangeInput
        label="Pressure"
        value={params.pressure}
        min={FLAME_LIMITS.pressure.min}
        max={FLAME_LIMITS.pressure.max}
        step={FLAME_LIMITS.pressure.step}
        unit="kPa"
        onChange={update("pressure")}
      />

      <RangeInput
        label="Initial temperature"
        value={params.temperature}
        min={FLAME_LIMITS.temperature.min}
        max={FLAME_LIMITS.temperature.max}
        step={FLAME_LIMITS.temperature.step}
        unit="°C"
        onChange={update("temperature")}
      />

      <Select
        label="Fuel"
        hint="Fuel class changes both colour and spread tendency in the illustration."
        value={params.fuel}
        onChange={(event) => update("fuel")(event.target.value)}
        options={FUEL_OPTIONS.map((option) => ({ value: option.id, label: `${option.label} (${option.type})` }))}
      />
    </div>
  );
}