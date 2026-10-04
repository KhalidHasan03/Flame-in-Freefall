/**
 * Instrument readout.
 *
 * A single channel presented at instrument scale: label above, large tabular value below, unit
 * set apart from the number. This is the treatment the interface previously lacked — every
 * numeric value in the app used to be the same size as body text, which is why nothing read as
 * telemetry.
 *
 * The value is a text node, not an ARIA role, so a screen reader announces exactly what a
 * sighted user sees. Colour is applied to the value only as a secondary cue; the tone is never
 * the only way the state is communicated.
 *
 * @param {object} props
 * @param {string} props.label          Channel name.
 * @param {React.ReactNode} props.value The reading.
 * @param {string} [props.unit]         Trailing unit, rendered small and muted.
 * @param {string} [props.tone]         Tailwind text colour for the value.
 * @param {boolean} [props.large=true]  Use the display scale for hero readouts.
 * @param {string} [props.className]
 */
export default function Readout({
  label,
  value,
  unit,
  tone = "text-ink",
  large = true,
  className = "",
}) {
  return (
    <div className={`min-w-0 ${className}`.trim()}>
      <p className="fx-telemetry-label">{label}</p>
      <p className={`fx-readout ${large ? "text-hud-sm" : "text-base"} ${tone}`.trim()}>
        {value}
        {unit ? <span className="fx-readout-unit">{unit}</span> : null}
      </p>
    </div>
  );
}
