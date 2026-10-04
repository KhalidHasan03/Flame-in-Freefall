"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ENGINE_GL_ATTRIBUTES, clampDpr } from "./engineSupport";

/**
 * Keeps the renderer informed of how much device pixel ratio it may spend.
 *
 * Re-reads on resize and on DPR change because both move without a reload — dragging a window
 * across a retina and non-retina display changes it, and a canvas sized for the old value is
 * either soft or wasteful until the next full reload.
 */
function DprGuard() {
  const setDpr = useThree((state) => state.setDpr);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const sync = () => setDpr(clampDpr(window.devicePixelRatio));
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [setDpr]);

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return null;
}

/**
 * Accumulates elapsed time for the shader.
 *
 * Takes a `read` accessor rather than the uniform object directly. The uniforms belong to a
 * three.js material, which is imperative GPU state and not React state — mutating it inside
 * `useFrame` is correct, but holding the object in a prop invites React to treat it as
 * immutable. Going through a function keeps the ownership explicit and keeps the accessor free
 * of stale closures, since it re-reads the current material every frame.
 *
 * `uTime` is clamped: a backgrounded tab returning to the foreground must not jump the flame
 * forward by the entire time it spent away.
 */
export function TimeDriver({ read, running = true }) {
  useFrame((_, delta) => {
    const uniforms = read();
    if (!uniforms) return;
    uniforms.uTime.value += Math.min(delta, 1 / 20);
  }, running ? 0 : -1);

  return null;
}

/**
 * The canvas itself, with no environment assumptions.
 *
 * EngineCanvas decides *whether* this exists; this only decides how it behaves once it does.
 */
export default function EngineClient({ dpr, children, onCreated, onContextLost, frameloop }) {
  const wrapper = useRef(null);

  useEffect(() => {
    const canvas = wrapper.current?.querySelector("canvas");
    if (!canvas) return undefined;

    /**
     * Context loss is not an edge case on mobile — it happens on backgrounding and on memory
     * pressure, and by the time the driver has restored it the frame is mid-render. React to it
     * by surfacing the fallback rather than leaving a frozen image on screen pretending to be
     * live.
     */
    const handleLost = (event) => {
      event.preventDefault();
      onContextLost?.();
    };

    canvas.addEventListener("webglcontextlost", handleLost, false);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [onContextLost]);

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={dpr}
        // Shared with the capability probe in engineSupport, so detection asks for exactly what
        // the renderer will ask for. See the note there — a divergence here meant the probe could
        // report WebGL as available on a machine where this call then throws.
        gl={ENGINE_GL_ATTRIBUTES}
        camera={{ position: [0, 0, 2], fov: 42, near: 0.1, far: 12 }}
        onCreated={onCreated}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <DprGuard />
        {/*
          An explicit boundary for lazy scene chunks. R3F happens to provide one internally, but
          depending on that is how a scene ends up silently absent on a slow first load — the
          chunk resolves, nothing suspends visibly, and the canvas is created before it has
          anything to size itself against.
        */}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}