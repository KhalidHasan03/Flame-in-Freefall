/**
 * Surface primitive.
 *
 * The depth ladder is the point. `panel` is a solid field one step above the canvas, `instrument`
 * is a lit translucent gauge, `hud` is a projected readout with no fill at all, and `frame` is
 * four corner brackets and nothing else — it claims space around a subject without drawing a
 * box around it.
 *
 *   variant="panel"      solid field, hairline border. Dense data regions.
 *   variant="instrument" translucent, lit top edge, inner glow. Telemetry-bearing surfaces.
 *   variant="hud"        no fill, lit rules top and bottom, backdrop blur. Overlays in front
 *                        of the environment.
 *   variant="frame"      no surface; corner brackets only. Grouping 3D space.
 *
 * `tone` only applies to the instrument variant and picks the glow hue: violet for identity and
 * AI, cyan for telemetry and data, ember for combustion. `neutral` emits no glow, which is the
 * right default for most panels — when everything glows, nothing does.
 *
 * `variant="panel"` is the default and renders exactly as it always has, so every existing call
 * site is unaffected.
 */
const TONE_CLASS = {
  neutral: "fx-instrument",
  brand: "fx-instrument",
  signal: "fx-instrument fx-instrument-signal",
  ember: "fx-instrument-ember",
};

const SURFACE_CLASS = {
  panel: "fx-panel",
  instrument: null, // resolved through TONE_CLASS, since it needs a tone
  hud: "fx-hud",
  frame: "fx-frame",
};

export default function Panel({
  children,
  className = "",
  interactive = false,
  variant = "panel",
  tone = "neutral",
  as: Tag = "section",
  ...props
}) {
  const surface =
    variant === "instrument"
      ? `${TONE_CLASS[tone] ?? TONE_CLASS.brand} fx-instrument-edge`
      : SURFACE_CLASS[variant] ?? SURFACE_CLASS.panel;

  return (
    <Tag
      className={`${surface} ${interactive ? "fx-panel-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
