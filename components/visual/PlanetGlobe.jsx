/**
 * Destination bodies as original SVG.
 *
 * Each globe is drawn from primitives rather than a texture map: a base sphere, a radial
 * terminator for the day/night boundary, a limb highlight for the atmosphere or dust haze, and
 * per-body surface detail. Nothing here is traced from or derived from a photograph or map, and
 * the geometry is deliberately schematic rather than cartographically accurate.
 *
 * Colours come from the `--fx-planet-*` tokens so the destinations follow the active theme.
 * When real imagery replaces these, swap `kind` in lib/assets.js to "image" and render an <img>
 * instead — the component API does not change.
 */

const EARTH = {
  /** Continental masses. Schematic, not a real map projection. */
  land: [
    "M28 30c5-4 13-5 17-1 3 3 1 7-2 9-4 3-2 6-6 7-5 1-9-2-11-6-2-4-1-7 2-9z",
    "M46 20c6-3 15-2 19 2 3 4 0 8-4 9-5 2-11 1-15-2-3-3-4-7 0-9z",
    "M52 44c5-2 12 0 14 5 2 6-3 12-9 13-5 1-10-3-10-8 0-4 2-8 5-10z",
    "M26 54c4-2 9-1 11 3 2 4-1 8-5 8-4 0-7-3-7-6 0-2 0-4 1-5z",
    "M62 26c3-1 7 0 8 3 1 3-1 6-4 6-3 0-5-2-5-5 0-2 0-3 1-4z",
  ],
  /** Cloud bands, low opacity so they read as weather rather than paint. */
  clouds: [
    "M22 44c8-3 18-3 26 0s16 3 24 0",
    "M24 52c9-3 20-2 28 1s14 3 20 1",
    "M28 38c7-2 14-2 21 0",
  ],
  /*
   * Atmospheric limb colour. White, not the body's own tone: the limb highlight is the term
   * that separates a sphere from a filled circle, and in a monochrome palette it has to be the
   * brightest thing on the body or the body stops reading as lit. Earth is also the only
   * destination that gets one — the Moon and Mars carry `haze: null`, because a limb glow on a
   * body with no atmosphere would imply an atmosphere it does not have.
   */
  haze: "#ffffff",
  base: "var(--fx-planet-earth)",
};

const MOON = {
  land: [],
  craters: [
    { cx: 40, cy: 36, r: 7 },
    { cx: 58, cy: 48, r: 5 },
    { cx: 34, cy: 58, r: 4 },
    { cx: 62, cy: 30, r: 3.5 },
    { cx: 48, cy: 64, r: 3 },
    { cx: 26, cy: 46, r: 2.5 },
  ],
  haze: null,
  base: "var(--fx-planet-moon)",
};

const MARS = {
  land: [],
  /** Polar caps, plus dark albedo bands characteristic of the surface. */
  caps: [
    "M38 20a26 26 0 0 1 24 0 26 20 0 0 1-24 0z",
  ],
  bands: [
    "M26 40c8-4 18-4 26 0s16 4 22 1",
    "M28 52c9-3 19-2 27 1s13 3 19 1",
    "M32 30c7-3 15-3 22 0",
  ],
  haze: null,
  base: "var(--fx-planet-mars)",
};

const BODIES = { earth: EARTH, moon: MOON, mars: MARS };

/** Unique gradient/clip ids per body, so multiple globes on one page do not collide. */
function ids(body) {
  const sfx = body === "moon" ? "mn" : body === "mars" ? "ms" : "ea";
  return {
    shade: `planet-${sfx}-shade`,
    clip: `planet-${sfx}-clip`,
    limb: `planet-${sfx}-limb`,
  };
}

function Craters({ craters }) {
  return (
    <g>
      {craters.map((c) => (
        <g key={`${c.cx}-${c.cy}`}>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill="#000" opacity="0.16" />
          <circle cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.14" />
        </g>
      ))}
    </g>
  );
}

/**
 * @param {object} props
 * @param {"earth"|"moon"|"mars"} props.body  Which destination to draw.
 * @param {number} [props.cx=50] Centre x.
 * @param {number} [props.cy=50] Centre y.
 * @param {number} [props.r=40] Radius.
 * @param {boolean} [props.atmosphere=true] Draw the lit atmospheric limb.
 * @param {boolean} [props.ring=false] Draw an orbital ring around the body.
 */
export default function PlanetGlobe({
  body = "earth",
  cx = 50,
  cy = 50,
  r = 40,
  atmosphere = true,
  ring = false,
}) {
  const spec = BODIES[body] ?? EARTH;
  const { shade, clip, limb } = ids(body);
  const spin = Math.PI * 0.72; // light arrives from upper left

  return (
    <g>
      {ring ? (
        <ellipse
          cx={cx}
          cy={cy}
          rx={r * 1.42}
          ry={r * 0.42}
          fill="none"
          stroke="var(--fx-space-orbit)"
          strokeWidth="0.6"
          transform={`rotate(-18 ${cx} ${cy})`}
        />
      ) : null}

      <defs>
        <radialGradient id={shade} cx="0.32" cy="0.28" r="0.82">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="46%" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.72" />
        </radialGradient>
        <radialGradient id={limb} cx="0.3" cy="0.26" r="0.9">
          <stop offset="62%" stopColor={spec.haze ?? spec.base} stopOpacity="0" />
          <stop offset="93%" stopColor={spec.haze ?? spec.base} stopOpacity={atmosphere ? 0.55 : 0} />
          <stop offset="100%" stopColor={spec.haze ?? spec.base} stopOpacity="0" />
        </radialGradient>
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Base sphere */}
      <circle cx={cx} cy={cy} r={r} fill={spec.base} />

      <g clipPath={`url(#${clip})`}>
        {/* Day/night terminator */}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${shade})`} />

        {spec.land?.length ? (
          <g fill="#2f3134" opacity="0.62">
            {spec.land.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ) : null}

        {spec.bands?.length ? (
          <g fill="none" stroke="#000" strokeWidth="1.4" opacity="0.18" strokeLinecap="round">
            {spec.bands.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ) : null}

        {spec.clouds?.length ? (
          <g fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.16" strokeLinecap="round">
            {spec.clouds.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ) : null}

        {spec.caps?.length ? (
          <g fill="#d8d8d8" opacity="0.55">
            {spec.caps.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ) : null}

        {spec.craters?.length ? <Craters craters={spec.craters} /> : null}

        {/* Atmospheric limb, brightest on the lit side */}
        {atmosphere ? <circle cx={cx} cy={cy} r={r * 1.06} fill={`url(#${limb})`} /> : null}
      </g>

      {/* Specular terminator edge */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#fff"
        strokeWidth="0.45"
        opacity="0.22"
        strokeDasharray={`${r * 1.1} ${r * 6}`}
        strokeDashoffset={spin * 12}
        transform={`rotate(-28 ${cx} ${cy})`}
      />
    </g>
  );
}