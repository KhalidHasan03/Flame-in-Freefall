"use client";

import { lazy } from "react";
import EngineCanvas from "./EngineCanvas";
import SceneReadout from "./SceneReadout";
import FlameVisual from "@/components/flame/FlameVisual";
import { useSettings } from "@/lib/context/SettingsProvider";

/**
 * Flame subject, with the SVG always available underneath.
 *
 * `FlameVisual` is not a "loading state" here — it is the permanent fallback and it is always in
 * the tree. When the engine runs, it is hidden; when the engine declines for any reason it is
 * simply the visible thing. Nothing needs to know which happened.
 *
 * The scene itself is lazy on top of that, so the 3D chunk is not pulled in by routes that render
 * a flame at thumbnail size — only by the ones that actually mount this stage.
 */
const MicroGravityFlame = lazy(() => import("./MicroGravityFlame"));

/**
 * @param {object} props
 * @param {object} props.params   Passed to both renderers. They consume the same
 *   `getFlameProfile` output, so the two cannot disagree about the shape.
 * @param {boolean} [props.showBurner=true]  SVG only.
 * @param {boolean} [props.animated=true]    SVG only; the engine has its own motion policy.
 * @param {string} [props.channel]
 * @param {string} [props.className=""]   Extra classes only. Positioning is not set here — the
 *   host is always `absolute inset-0` within a parent you control, and that parent needs a
 *   definite height or the canvas will not be sized.
 */
export default function FlameStage({
  params,
  showBurner = true,
  animated = true,
  channel = "COMB-01",
  className = "",
}) {
  const { settings } = useSettings();
  const still = !animated || settings.reduceFlameMotion;

  const scene = (
    <MicroGravityFlame params={params} motion={!still} aspect={0.86} radius={1} />
  );

  return (
    /*
     * Always fills its parent, for the same reason EngineCanvas does: emitting `relative` here
     * alongside a caller's `absolute` leaves the winner up to CSS source order, and when
     * `relative` won the canvas had no definite height and R3F never sized it. Positioning is the
     * caller's job — give FlameStage a parent with a height.
     */
    <div className={`absolute inset-0 ${className}`.trim()}>
      {/*
        Fallback first, so it paints behind. `absolute inset-0` with a `hidden`-on-ready swap
        would leave the engine compositing over it; letting the engine canvas sit on top and stay
        transparent is both cheaper and correct.
      */}
      <div className="absolute inset-0">
        <FlameVisual
          params={params}
          className="h-full w-full"
          animated={animated}
          showBurner={showBurner}
        />
      </div>

      <EngineCanvas
        scene={scene}
        motion={!still}
        overlay={<SceneReadout params={params} channel={channel} />}
      />
    </div>
  );
}