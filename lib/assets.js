/**
 * Visual asset registry.
 *
 * Every illustration in FlareNexus — the astronaut, the destination bodies, the orbital paths,
 * the combustion visuals — is requested by subject id through this registry. Components never
 * reference an artwork file, an import path, or an external URL directly.
 *
 * Why this exists: the current artwork is original SVG authored for this prototype. Real
 * NASA/public-domain photography, licensed astronaut imagery, planetary texture maps, and
 * genuine flame-experiment captures will replace it later. When they do, this is the only file
 * that changes — the `kind` field becomes `"image"`, a `src` is added, and the consuming
 * component renders the image instead of the SVG. Nothing else in the application moves.
 *
 * Shape of an entry:
 *   id      stable key components ask for; never rename casually
 *   kind    "svg" today, "image" once real assets land
 *   variant selects between alternatives the component already knows how to draw
 *   src     only present for kind "image"; served from /public or a CDN
 *   alt     required for kind "image", and reused as the SVG fallback description
 *   credit  attribution string for any third-party asset
 *
 * The values below describe what the prototype draws. They are not citations to real imagery.
 */

export const ASSETS = {
  astronaut: {
    id: "astronaut",
    kind: "svg",
    variant: "suited",
    alt: "Astronaut in a pressure suit, seen from behind, watching a combustion experiment against the limb of a planet.",
    credit: null,
  },

  astronautHelmet: {
    id: "astronautHelmet",
    kind: "svg",
    variant: "reflective",
    alt: "Close view of a spacesuit helmet visor reflecting a flame against deep space.",
    credit: null,
  },

  earth: {
    id: "earth",
    kind: "svg",
    variant: "globe",
    alt: "Earth seen from orbit, with a lit atmospheric limb and a terminator crossing the surface.",
    credit: null,
  },

  moon: {
    id: "moon",
    kind: "svg",
    variant: "globe",
    alt: "The Moon, heavily cratered, lit from one side with a sharp terminator.",
    credit: null,
  },

  mars: {
    id: "mars",
    kind: "svg",
    variant: "globe",
    alt: "Mars, a rust-red planet with visible surface banding and a thin dust haze.",
    credit: null,
  },

  station: {
    id: "station",
    kind: "svg",
    variant: "orbital",
    alt: "An orbital research station tracking a path above the Earth's atmosphere.",
    credit: null,
  },

  spacecraft: {
    id: "spacecraft",
    kind: "svg",
    variant: "silhouette",
    alt: "A spacecraft silhouette against a star field.",
    credit: null,
  },

  flame: {
    id: "flame",
    kind: "svg",
    variant: "combustion",
    alt: "A combustion chamber with a flame plume rising from a burner.",
    source: "lib/flameGeometry",
    credit: null,
  },
};

/** Mission id to body id, so selectors and planets stay in one place. */
export const MISSION_ASSET = {
  earth: "earth",
  iss: "station",
  moon: "moon",
  mars: "mars",
};

export function asset(id) {
  const found = ASSETS[id];
  if (!found) throw new Error(`Unknown visual asset "${id}". Add it to lib/assets.js.`);
  return found;
}

export function missionAsset(missionId) {
  return asset(MISSION_ASSET[missionId] ?? "earth");
}