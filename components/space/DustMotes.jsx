/**
 * Drifting motes.
 *
 * The near plane. A handful of out-of-focus particles that move slowly enough to read as depth
 * in the frame rather than as an effect. Hard-capped: the count comes from the density preset
 * and the ceiling here is 40, because the point of this layer is a parallax cue, not a particle
 * system.
 *
 * Positions are derived from the golden-angle sequence rather than a random number generator.
 * That keeps the field deterministic, which matters for two reasons: server and client render
 * the same motes, so there is no hydration mismatch; and the distribution is even by
 * construction, with no clumping and no chance of two motes overlapping into a blob.
 *
 * Every mote animates transform only, so the whole layer is composited and never triggers
 * layout.
 *
 * @param {object} props
 * @param {number} [props.count=0]   Motes to draw. Zero renders nothing.
 * @param {string} [props.tint="var(--fx-signal)"] Base mote colour.
 * @param {boolean} [props.animate=true]
 * @param {number} [props.z]
 */
const GOLDEN_ANGLE = 137.508;

/** Six phases, so motes rise out of step without needing a per-mote delay value. */
const PHASE_COUNT = 6;
const CYCLE_SECONDS = 26;

export default function DustMotes({
  count = 0,
  tint = "var(--fx-signal)",
  animate = true,
  z,
}) {
  if (count <= 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: z }} aria-hidden="true">
      {Array.from({ length: Math.min(count, 40) }, (_, index) => {
        // Golden-angle spiral: even coverage, deterministic, no clustering.
        const angle = index * GOLDEN_ANGLE;
        const radius = Math.sqrt((index + 0.5) / count) * 46;
        const left = 50 + Math.cos((angle * Math.PI) / 180) * radius;
        const top = 50 + Math.sin((angle * Math.PI) / 180) * radius * 0.72;
        const size = 1.5 + ((index % 3) + 1) * 0.75;
        const phase = index % PHASE_COUNT;

        return (
          <span
            key={index}
            className="absolute rounded-full"
            style={{
              /*
               * Every value here is a pre-formatted string, not a number. A bare `opacity={0.16}`
               * serialises to `opacity:0.16` in the server HTML, which the browser reads back as
               * the string "0.16" — and a number prop will never equal a string during hydration.
               * React reports that as a whole-style attribute mismatch. Formatting here keeps the
               * server attribute and the client prop textually identical.
               */
              left: `${left.toFixed(4)}%`,
              top: `${top.toFixed(4)}%`,
              width: `${size.toFixed(2)}px`,
              height: `${size.toFixed(2)}px`,
              backgroundColor: tint,
              opacity: (0.16 + (index % 4) * 0.07).toFixed(2),
              boxShadow: `0 0 ${(size * 3).toFixed(2)}px ${tint}`,
              animation: animate
                ? `fx-mote-drift ${CYCLE_SECONDS + phase * 3}s ease-in-out infinite`
                : undefined,
              animationDelay: animate ? `${phase * -4}s` : undefined,
              // Each mote travels a different distance so the field never reads as one sheet.
              "--mote-travel": `${(10 + (index % 5) * 7).toFixed(0)}px`,
            }}
          />
        );
      })}
    </div>
  );
}
