/**
 * Starfield.
 *
 * Two tiled background-image layers rather than DOM nodes or a canvas: one paint each, never in
 * the animation loop, and no layout. The far layer is denser and dimmer, the near layer sparser
 * and brighter, and the differing tile sizes mean the two never line up into a visible grid.
 *
 * This is the correct decision for the page background specifically. The hero subject is where
 * real WebGL earns its cost; a few hundred static points behind a blurred panel is not.
 *
 * @param {object} props
 * @param {"far"|"near"} [props.layer="far"]  Which shell to draw. The caller decides which
 *   depth plane each one sits at, since they straddle the orbital lattice.
 * @param {number} [props.opacity=0.7]
 * @param {number} [props.z]
 */
export default function StarField({ layer = "far", opacity = 0.7, z }) {
  const isFar = layer === "far";

  return (
    <div
      className={`absolute inset-0 ${isFar ? "fx-starfield" : "fx-starfield-near opacity-45"}`}
      style={{ opacity: isFar ? opacity : undefined, zIndex: z }}
    />
  );
}
