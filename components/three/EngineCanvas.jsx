"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import { ENGINE_FALLBACK, clampDpr, useEngineSupport } from "./engineSupport";
import { DEPTH } from "@/components/space/depth";

/**
 * Client-only, so three.js is never in the server bundle and never evaluated during SSR.
 *
 * This is the boundary that makes it safe to import R3F at all in the App Router: `ssr: false`
 * on a Client Component is what stops `window` from being touched at build time.
 */
const EngineClient = dynamic(() => import("./EngineClient"), { ssr: false });

/**
 * Containment for a scene that fails *after* detection said yes.
 *
 * Capability detection can only test what it can see. The context it probes with can still fail to
 * be created by the time the canvas mounts — the driver resets, another tab took the last context,
 * the GPU process was killed and has not come back. Three.js throws in all of those cases, the
 * throw happens inside a component that has no error boundary above it, and React unmounts the
 * whole tree: on this app that took the dashboard, the shell and the navigation with it.
 *
 * A decorative background planet is not worth a blank page. This catches the failure, reports it
 * upward so the reason is never a mystery, and renders the caller's static fallback instead.
 *
 * A class component because React has no hook equivalent — error boundaries are caught during
 * render and during lifecycle methods, neither of which a function component can intercept.
 */
class EngineBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    /*
      Reported rather than swallowed. The fallback is a design decision and is correct; losing the
      * reason would make a field report of "the globe is missing on my machine" impossible to act
      * on. `onError` is the hook — EngineCanvas passes the same callback it uses for `onFallback`.
    */
    this.props.onError?.(error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/**
 * The guarded engine host.
 *
 * Every route that wants a real-time scene goes through here, and this component is the only
 * thing that knows the scene might not exist. It answers four questions, in order:
 *
 *   1. Has this resolved yet?  While checking, render the fallback — never an empty box.
 *   2. Is there a reason not to run? Save-data, reduced motion, no WebGL, context loss.
 *   3. Is it on screen?  An off-screen canvas is paused, which is most of the time a scene
 *      behind a fold or another tab, and rendering an invisible animation is pure waste.
 *   4. How many pixels?  DPR is clamped.
 *
 * The answer to 2 for reduced motion is "still", not "no": the scene renders one frame and stops.
 * A preference should change motion, never remove information.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.scene     Rendered inside the canvas. Not rendered at
 *   all when the engine is unavailable, so it must not own any state the fallback needs.
 * @param {import("react").ReactNode} [props.fallback] What to show instead. Defaults to null so
 *   a caller with nothing better to offer gets a clean absence rather than a broken frame.
 * @param {import("react").ReactNode} [props.overlay]  DOM content anchored over the canvas, at
 *   the `data` depth plane — readouts and labels that belong to the scene but should stay
 *   selectable, screen-readable and crisp at any DPR.
 * @param {boolean} [props.enabled=true]
 * @param {boolean} [props.motion=true]  Caller's reduced-motion decision.
 * @param {boolean} [props.pauseWhenHidden=true]
 * @param {string}  [props.className=""]   Extra classes. Positioning is not yours to set here —
 *   the host is always `absolute inset-0` within a parent you control.
 * @param {(reason: string, error?: Error) => void} [props.onFallback]
 */
export default function EngineCanvas({
  scene,
  fallback = null,
  overlay = null,
  enabled = true,
  motion = true,
  pauseWhenHidden = true,
  className = "",
  onFallback,
}) {
  const status = useEngineSupport({ enabled, motion });
  const [onScreen, setOnScreen] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const host = useRef(null);

  const lost = contextLost || status === ENGINE_FALLBACK.lost;

  useEffect(() => {
    if (!onFallback) return;
    if (status === "ready" || status === "still") return;
    onFallback(status);
  }, [status, onFallback]);

  /**
   * Off-screen and hidden are separate questions and both matter. Off-screen is the common case
   * on a scroll-heavy console layout; hidden is the common case on mobile, where a backgrounded
   * tab still reports as on-screen and would otherwise animate until the OS kills it.
   */
  useEffect(() => {
    const node = host.current;
    if (!node || !pauseWhenHidden) return undefined;

    let observer;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => setOnScreen(entry.isIntersecting),
        // rootMargin keeps the scene running slightly past the fold, because a subject you are
        // about to scroll to should already be assembled.
        { threshold: 0, rootMargin: "120px" },
      );
      observer.observe(node);
    }

    const onVisibility = () => setOnScreen(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pauseWhenHidden]);

  const handleContextLost = useCallback(() => setContextLost(true), []);

  const unavailable = lost || status === ENGINE_FALLBACK.unsupported || status === ENGINE_FALLBACK.disabled;

  if (status === ENGINE_FALLBACK.checking || unavailable) {
    return (
      <>
        {fallback}
        {/* Announced, not just shown: a screen-reader user should know the scene is absent. */}
        {lost ? (
          <span role="status" className="sr-only">
            The real-time view is unavailable. A static illustration is shown instead.
          </span>
        ) : null}
      </>
    );
  }

  const still = status === "still";
  const running = still ? false : onScreen;
  const dpr = clampDpr(typeof window === "undefined" ? 1 : window.devicePixelRatio);

return (
    /*
     * The host always fills its parent. It is a scene, not a layout box: positioning belongs to
     * whoever places it, and emitting both `relative` and a caller-supplied `absolute` would leave
     * the winner up to CSS source order rather than anything I can reason about.
    */
    <div ref={host} className={`absolute inset-0 ${className}`.trim()}>
      {/* Subject depth. In front of the environment, behind everything the DOM draws. */}
      <div className="absolute inset-0" style={{ zIndex: DEPTH.subject }}>
        {/*
          The boundary wraps the canvas only, never the overlay. Readouts and labels live in the
          DOM on purpose, and losing them to a GPU failure would remove information that has no
          canvas dependency at all.
        */}
        <EngineBoundary
          fallback={
            <span role="status" className="sr-only">
              The real-time view could not start. A static illustration is shown instead.
            </span>
          }
          onError={(error) => onFallback?.(ENGINE_FALLBACK.failed, error)}
        >
          <EngineClient
            frameloop={running ? "always" : "demand"}
            dpr={dpr}
            onContextLost={handleContextLost}
          >
            {scene}
          </EngineClient>
        </EngineBoundary>
      </div>

      {/* Data depth. Readouts over the subject, never inside the canvas. */}
      {overlay ? (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: DEPTH.data }}>
          {overlay}
        </div>
      ) : null}
    </div>
  );
}