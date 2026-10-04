import * as THREE from "three";

/**
 * Flame shaders.
 *
 * One quad, one draw call, no textures, no model, no postprocessing. That is the entire budget
 * for the WebGL flame, and it is enough because the shape is a fragment-shader evaluation of the
 * same envelope law the SVG fallback uses.
 *
 * The point of sharing `getFlameProfile` between the two renderers is that they cannot disagree.
 * Both derive the envelope from `halfWidth`, `sphericity`, `lateral`, `skew` and `flicker` using
 * the same `pow(max(0, 1 - y*y), fullness)` curve and the same `pow(y, 1.6)` anchor, so a slider
 * move produces the same silhouette in both. The SVG is not a lower-fidelity guess at this one.
 */

/** Normalisation constant: MAX_HALF_WIDTH in lib/flameGeometry. */
const HALF_WIDTH_MAX = 46;

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * `fullness` and `uSkew` are precomputed on the JS side to keep this shader a pure function of
 * its uniforms — no branching on data, and no per-frame CPU work beyond updating time.
 */
const FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uMotion;
uniform float uFullness;
uniform float uFlicker;
uniform float uLean;
uniform float uSkew;
uniform float uLuminosity;
uniform float uCoreRatio;
uniform float uHalfWidth;
uniform float uAspect;
uniform vec3  uOuter;
uniform vec3  uMid;
uniform vec3  uCore;
uniform vec3  uHalo;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Three octaves is the budget. A fourth is not visible at the sizes this renders, and each
// octave is four hash calls evaluated per fragment.
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    sum += noise(p) * amp;
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  float y = vUv.y;
  float x = (vUv.x - 0.5) * uAspect * 2.0;

  float t = uTime * uMotion;
  float anchor = pow(y, 1.6);

  // Convection. Two counter-drifting samples read as rising gas; a single sample reads as a
  // scrolling texture, which is the failure mode worth avoiding.
  float turb = fbm(vec2(x * 2.4, y * 1.7) * 3.0 - vec2(t * 0.35, t * 0.9)) - 0.5;

  // Same envelope law as buildLobe(): pow(max(0, 1 - y*y), fullness).
  float w = uHalfWidth * pow(max(0.0, 1.0 - y * y), uFullness);
  w *= 1.0 + turb * uFlicker * anchor;

  // Same lean as buildLobe(): lateral * pow(y, 1.6), plus the airflow skew term.
  float lean = uLean * anchor + uSkew * y * y;
  float dx = x - lean - turb * uFlicker * anchor * 0.55;

  float r = abs(dx) / max(w, 0.0001);

  // Soft edges. A hard cutoff aliases badly against the dark background at low DPR.
  float body = 1.0 - smoothstep(0.80, 1.04, r);
  float halo = exp(-max(r - 1.0, 0.0) * 2.4) * (1.0 - smoothstep(0.70, 1.05, y));

  // Fake volume: the cross-section is brightest on axis and falls off to the rim, which is what
  // separates a flame from a flat filled shape without a real 3D field.
  float depth = sqrt(max(0.0, 1.0 - r * r));

  // Striations drifting up through the body.
  float streak = fbm(vec2(x * 5.0, y * 3.0 - t * 1.6));
  float detail = mix(1.0, 0.6 + streak * 0.8, 0.6 * uFlicker);

  float core = body * smoothstep(uCoreRatio + 0.24, uCoreRatio - 0.14, r);

  vec3 color = uOuter * detail;
  color = mix(color, uMid * detail, body * smoothstep(0.78, 0.26, r));
  color = mix(color, uCore * (0.8 + depth * 0.45), core * uLuminosity);
  color += uHalo * halo * 0.5 * uLuminosity;
  color += uCore * core * core * 0.45 * uLuminosity;

  // Taper the tip so the envelope closes rather than being clipped by the quad.
  float tip = 1.0 - smoothstep(0.86, 1.0, y);

  // Additive blending: the environment behind is near-black, so summing is both physically
  // closer to emission and cheaper than sorting against a background.
  float alpha = clamp(body * 0.8 + halo * 0.45 + core * 0.55, 0.0, 1.0) * uLuminosity * tip;
  gl_FragColor = vec4(color * tip, alpha);
}
`;

/**
 * Map a flame profile onto shader uniforms.
 *
 * Everything is divided by HALF_WIDTH_MAX so the shader works in half-width units and never has
 * to know the SVG viewBox. `uMotion` is 0 when the viewer has asked for reduced motion, which
 * freezes turbulence but leaves the shape and colour intact — the flame still communicates the
 * parameter change, it just stops moving.
 */
export function createFlameUniforms(profile) {
  return {
    uTime: { value: 0 },
    uMotion: { value: 1 },
    uFullness: { value: 0.58 + profile.sphericity * 0.22 },
    uFlicker: { value: profile.flicker },
    uLean: { value: profile.lateral / HALF_WIDTH_MAX },
    uSkew: { value: profile.skew / HALF_WIDTH_MAX },
    uLuminosity: { value: profile.luminosity },
    uCoreRatio: { value: profile.coreRatio },
    uHalfWidth: { value: profile.halfWidth / HALF_WIDTH_MAX },
    uAspect: { value: 1 },
    uOuter: { value: new THREE.Color(profile.palette.outer) },
    uMid: { value: new THREE.Color(profile.palette.mid) },
    uCore: { value: new THREE.Color(profile.palette.core) },
    uHalo: { value: new THREE.Color(profile.palette.halo) },
  };
}

/** Write a fresh profile's values into an existing uniform set, preserving the time accumulator. */
export function updateFlameUniforms(uniforms, profile, motion, aspect) {
  uniforms.uMotion.value = motion;
  uniforms.uFullness.value = 0.58 + profile.sphericity * 0.22;
  uniforms.uFlicker.value = profile.flicker;
  uniforms.uLean.value = profile.lateral / HALF_WIDTH_MAX;
  uniforms.uSkew.value = profile.skew / HALF_WIDTH_MAX;
  uniforms.uLuminosity.value = profile.luminosity;
  uniforms.uCoreRatio.value = profile.coreRatio;
  uniforms.uHalfWidth.value = profile.halfWidth / HALF_WIDTH_MAX;
  uniforms.uAspect.value = aspect;
  uniforms.uOuter.value.set(profile.palette.outer);
  uniforms.uMid.value.set(profile.palette.mid);
  uniforms.uCore.value.set(profile.palette.core);
  uniforms.uHalo.value.set(profile.palette.halo);
}

/** Materials shared by every flame instance; disposing them per mount would thrash the GPU. */
export function createFlameMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: createFlameUniforms({
      sphericity: 0.5,
      flicker: 0.075,
      lateral: 4,
      skew: 6,
      luminosity: 0.7,
      coreRatio: 0.4,
      halfWidth: HALF_WIDTH_MAX,
      palette: { outer: "#c06a24", mid: "#e0913f", core: "#fdf3e3", halo: "#8a4a17" },
    }),
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}