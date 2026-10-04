/**
 * Channel label.
 *
 * The label half of an instrument channel: an uppercase, tracked name with an optional hairline
 * running out to the trailing edge. The rule is what makes a label read as a fixed panel header
 * rather than as a line of body text, and it costs no extra layout work because the line is a
 * flex sibling, not a background image.
 *
 * Reach for this where a surface needs a stable identity — a telemetry group, a data column, a
 * section of a mission report. For a plain inline label, `fx-label` is enough.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children  The label text.
 * @param {boolean} [props.rule=true]       Run a hairline from the label to the trailing edge.
 * @param {string} [props.tone]             Tailwind text colour for the label.
 * @param {string} [props.className]
 */
export default function ChannelLabel({
  children,
  rule = true,
  tone = "",
  className = "",
}) {
  return (
    <p className={`fx-label flex items-center gap-3 ${tone} ${className}`.trim()}>
      <span className="shrink-0 whitespace-nowrap">{children}</span>
      {rule ? (
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent"
        />
      ) : null}
    </p>
  );
}
