"use client";

import { useSyncExternalStore } from "react";

/**
 * Context attributes, in one place.
 *
 * `EngineClient` used to declare these inline, and `detectWebGL` probed with no attributes at all.
 * That mismatch was a real bug and not a theoretical one: in production the renderer requests
 * `failIfMajorPerformanceCaveat: true`, which makes context creation *throw* rather than return
 * null on a software renderer or a blocklisted GPU — every VM, every machine with a driver the
 * browser distrusts, every laptop where Chrome has fallen back to SwiftShader. The probe said
 * "WebGL available", the renderer threw, and the exception escaped the canvas and took the whole
 * route down with it. On those machines the dashboard rendered nothing at all.
 *
 * One definition fixes the disagreement: the probe now asks for exactly what the renderer will ask
 * for, so a machine that cannot support the real scene is detected as unsupported before the
 * canvas is mounted, and the static fallback is shown instead of a blank page.
 */
export const ENGINE_GL_ATTRIBUTES = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  powerPreference: "high-performance",
  // Off in development, where a software renderer reports itself as a slow device and would
  // otherwise suppress the scene you are trying to look at. On in production, where suppressing
  // it is the correct answer and the fallback is the point.
  failIfMajorPerformanceCaveat: process.env.NODE_ENV === "production",
};

/**
 * Whether this browser can actually run the scene.
 *
 * Feature detection rather than a user-agent check, and deliberately narrow: we only need enough
 * to compile the one shader in components/three/flameShader.js, so a context is enough and no
 * extension reporting is required. `webgl2` is preferred because it is what three.js wants, but
 * `webgl` is accepted — the shader is written to GLSL 1.0 and runs on both.
 *
 * The probe context is released before returning. Browsers cap how many live WebGL contexts a page
 * may hold, and an unreleased probe on every route mount is a slow way to exhaust them — after
 * which the *real* context fails, which is the failure this function exists to prevent.
 */
export function detectWebGL() {
  if (typeof window === "undefined") return false;
  let canvas;
  let context;
  try {
    canvas = document.createElement("canvas");
    context =
      canvas.getContext("webgl2", ENGINE_GL_ATTRIBUTES) ||
      canvas.getContext("webgl", ENGINE_GL_ATTRIBUTES) ||
      canvas.getContext("experimental-webgl", ENGINE_GL_ATTRIBUTES);
    return Boolean(context);
  } catch {
    // Some hardened browsers throw on getContext rather than returning null — and so does a
    // driver that refuses `failIfMajorPerformanceCaveat`.
    return false;
  } finally {
    // Only the extension that actually exists can release the context, and calling it wrongly
    // throws, so this is guarded twice over.
    try {
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      /* Nothing useful to do, and this must never mask the detection result. */
    }
    canvas = null;
  }
}

/** The OS-level reduced-motion preference, which CSS cannot observe on our behalf. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

/**
 * Save-Data. A data-constrained visitor has told the browser they would rather not spend
 * megabytes on a decorative real-time scene, so this outranks everything else.
 */
export function prefersReducedData() {
  if (typeof navigator === "undefined") return false;
  return Boolean(navigator.connection?.saveData);
}

/** Why the engine is not running. Surfaced to the fallback so the reason is never a mystery. */
export const ENGINE_FALLBACK = {
  checking: "checking",
  unsupported: "unsupported",
  reducedData: "reduced-data",
  reducedMotion: "reduced-motion",
  disabled: "disabled",
  lost: "context-lost",
  /** Detection passed, then the renderer threw. Contained by the boundary in EngineCanvas. */
  failed: "context-failed",
};

/**
 * Nothing ever changes, so this subscription never fires.
 *
 * Paired with a server snapshot of `false` and a client snapshot of `true`, this is how React
 * models "a value that is knowable only in the browser". The first client render uses the server
 * snapshot, so hydration matches exactly, and React re-renders with the real value immediately
 * afterwards. No effect, no cascading render, no flash of a wrongly-resolved state.
 */
const subscribeNever = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useHydrated() {
  return useSyncExternalStore(subscribeNever, getClientSnapshot, getServerSnapshot);
}

/**
 * Resolve engine availability.
 *
 * Computed during render rather than in an effect. Every input to this decision — Save-Data, the
 * OS motion preference, WebGL support — is browser-only state that the server does not have, so
 * this is exactly the shape `useSyncExternalStore` exists for: one code path, no effect, and no
 * possibility of the server and client disagreeing.
 *
 * @param {object} props
 * @param {boolean} [props.enabled=true] Lets a route opt out without unmounting.
 * @param {boolean} [props.motion=true]   Caller's own reduced-motion decision, from settings.
 * @returns {string} One of ENGINE_FALLBACK, or "ready" / "still".
 */
export function useEngineSupport({ enabled = true, motion = true } = {}) {
  const hydrated = useHydrated();
  if (!hydrated) return ENGINE_FALLBACK.checking;
  if (!enabled) return ENGINE_FALLBACK.disabled;
  if (prefersReducedData()) return ENGINE_FALLBACK.reducedData;
  // Reduced motion still renders — once, statically. That is the difference between a
  // preference and a capability, and it would be wrong to drop the scene entirely.
  if (!motion || prefersReducedMotion()) return "still";
  return detectWebGL() ? "ready" : ENGINE_FALLBACK.unsupported;
}

/**
 * Device pixel ratio, clamped.
 *
 * Unclamped, a 3x phone rendering a full-bleed shader fragment per pixel is the single easiest
 * way to make this site feel broken. 1.75 is the ceiling: above it the visual difference on a
 * soft, additive, gradient-heavy subject is not worth the fill rate, and it is the difference
 * between a smooth scroll and a dropped one.
 */
export function clampDpr(value) {
  return Math.min(Math.max(value || 1, 1), 1.75);
}