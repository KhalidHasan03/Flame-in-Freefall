import { DEPTH } from "./depth";

/**
 * Orbital lattice.
 *
 * Slow-rotating ellipses on the same 100x100 coordinate space as components/visual/PlanetGlobe,
 * so a body drawn in that space can be dropped onto a path without recalculating anything.
 *
 * Two rings with different inclinations and periods, rotating at 48s and 96s — slow enough to
 * read as orbital mechanics rather than as an animation, and transform-only so it stays on the
 * compositor.
 *
 * @param {object} props
 * @param {number} [props.rings=1] How many arcs to draw.
 * @param {boolean} [props.animate=true] Drift the rings. False under reduced motion.
 * @param {string} [props.tint] Any CSS colour; defaults to the orbit token.
 */
export default function OrbitalLattice({ rings = 1, animate = true, tint }) {
  const stroke = tint ?? "var(--fx-space-orbit)";
  const sizes = ["h-[64vh] w-[64vh]", "h-[88vh] w-[88vh]"];

  return (
    <div
      className="pointer-events-none absolute -right-[16vw] -top-[22vh]"
      style={{ zIndex: DEPTH.lattice }}
      aria-hidden="true"
    >
      {Array.from({ length: rings }, (_, index) => (
        <div
          key={sizes[index]}
          className={`absolute rounded-full ${sizes[index]}`}
          style={{
            right: `${index * 8}%`,
            top: `${index * 14}%`,
            transform: `rotate(${index === 0 ? -18 : -32}deg)`,
          }}
        >
          <div
            className={`absolute inset-0 rounded-full border ${animate ? "fx-rotate-slower" : ""}`.trim()}
            style={{ borderColor: stroke, opacity: 0.85 - index * 0.3 }}
          />
          <div
            className={`absolute inset-[14%] rounded-full border ${animate ? "fx-rotate-slow" : ""}`.trim()}
            style={{ borderColor: stroke, opacity: 0.5 - index * 0.2 }}
          />
        </div>
      ))}
    </div>
  );
}
