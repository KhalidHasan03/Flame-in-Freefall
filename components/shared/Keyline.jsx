/**
 * Keyline.
 *
 * A single gradient hairline used to divide regions where a border would read as a box edge.
 * It fades at both ends, so it separates without enclosing. `fx-keyline` carries the gradient;
 * this component exists only so the intent is named at the call site and the element is a
 * semantic separator rather than a styled `<div>`.
 *
 * @param {object} props
 * @param {string} [props.className]
 */
export default function Keyline({ className = "" }) {
  return <hr aria-hidden="true" className={`fx-keyline ${className}`.trim()} />;
}
