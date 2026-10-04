"use client";

import { useSettings } from "@/lib/context/SettingsProvider";
import { DEPTH } from "@/components/space/depth";
import EngineCanvas from "./EngineCanvas";
import EarthGlobe from "./EarthGlobe";

/**
 * `EarthGlobe` is imported statically, and that is deliberate.
 *
 * `EngineClient` is already deferred behind EngineCanvas, and this component is itself deferred at
 * the shell — so three.js and the globe reach the browser only when the dashboard asks for them,
 * and no other route's bundle grows. Adding a second lazy boundary inside that one would not make
 * the payload meaningfully smaller; it would only insert an extra network round trip between the
 * shell chunk and the scene, which is one more way for the canvas to come up empty.
 */

/**
 * A live planet behind the dashboard.
 *
 * Fixed rather than absolutely positioned, and this is the whole trick: the shell's scroll
 * container is `main`, so an absolutely-positioned canvas would slide away with the content. A
 * fixed host is anchored to the viewport and the planet stays put for the length of the page.
 *
 * Transparent in both senses. The canvas clears to alpha zero so the CSS atmosphere and starfield
 * behind it keep showing through the empty space, and the globe itself is alpha-blended rather
 * than opaque so the same stars read through its shadowed side.
 *
 * `pointer-events-none` is not optional. This is a full-viewport layer sitting under the UI plane,
 * and an interactive canvas under a data console is an invisible way to swallow every click.
 */
export default function EarthBackdrop() {
  const { settings } = useSettings();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: DEPTH.subject }}>
      {/*
        A third star shell, in front of the planet and behind the panels.

        The environment's own far and near fields sit at `far` and `near`, both behind the globe at
        `subject` — so a planet that fills much of the frame would otherwise eclipse the sky that
        makes it read as being in space. These sit just above the globe's plane: parallax for free,
        and the brightest of them clear the limb so the two read as separated depths rather than
        as one painted background.
      */}
      <div className="fx-starfield-drift absolute inset-0" style={{ zIndex: DEPTH.subject + 1, opacity: 0.5 }} />
      <EngineCanvas scene={<EarthGlobe motion={!settings.reduceFlameMotion} />} motion={!settings.reduceFlameMotion} />
    </div>
  );
}