/**
 * Deep-space gradient, depth washes and edge vignette.
 *
 * The furthest plane. Everything in front of it — panels, the 3D subject, readouts — reads its
 * contrast against this gradient, so it is deliberately low-contrast: two neutral white washes
 * over near-black, with the destination's horizon bloom rising from one edge.
 *
 * Costs one paint. No animation here; the drift lives in the nebula veil class so a route can
 * switch it off without re-rendering this component.
 *
 * @param {object} props
 * @param {"deep"|"lift"} props.nebula  Which depth wash sits behind the others.
 * @param {"cool"|"warm"|"none"} props.horizon Where the atmospheric bloom rises from.
 * @param {boolean} [props.vignette=true]    Draw the edge falloff that focuses the centre.
 */
export default function AtmosphereVeil({
  nebula = "deep",
  horizon = "cool",
  vignette = true,
}) {
  const gradient =
    "linear-gradient(180deg, var(--fx-space-void) 0%, var(--fx-space-deep) 42%, var(--fx-depth-surface) 100%)";

  return (
    <div className="absolute inset-0" style={{ backgroundImage: gradient }}>
      {/*
        Two washes rather than one: a single large gradient reads as a coloured box, whereas
        two offset ones read as depth. Both are neutral, so the depth has to come from their
        placement and their alpha rather than from hue. Alpha stays low so this never competes
        with data.
      */}
      <div className="absolute inset-0 opacity-90">
        <div
          className={`absolute inset-0 ${nebula === "lift" ? "fx-nebula-lift" : "fx-nebula-deep"}`}
        />
        <div className="fx-nebula-lift absolute inset-0 translate-x-[18%] translate-y-[24%] opacity-70" />
      </div>

      {horizon === "warm" ? (
        <div className="fx-horizon-glow-ember absolute inset-x-0 bottom-0 h-[52vh]" />
      ) : horizon === "cool" ? (
        <div className="fx-horizon-glow absolute inset-x-0 bottom-0 h-[46vh]" />
      ) : null}

      {/*
        Edge falloff. Without this the corners sit at the same value as the centre and the
        frame reads as a flat fill; pulling the edges down is what makes the middle recede.
      */}
      {vignette ? <div className="fx-vignette absolute inset-0" /> : null}
    </div>
  );
}
