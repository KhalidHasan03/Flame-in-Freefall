import * as THREE from "three";

/**
 * Earth shader.
 *
 * Two materials, no textures, no model, no postprocessing — the same budget the flame works to.
 *
 * Everything is derived from the surface point itself. `vObj` is the object-space position of the
 * vertex normalised to the unit sphere, which is a fixed coordinate on the planet's surface: sample
 * noise from it and the result is painted onto the globe and travels with it as the mesh spins.
 * That is the whole trick, and it is why no image is needed.
 *
 * The palette is the application's own. Oceans sit in the `--fx-info` family, the limb glow is
 * `--fx-signal`, city lights are `--fx-ember`, so the backdrop reads as part of the console
 * rather than as a photograph pasted behind it.
 */

/**
 * Object-space position (the surface coordinate) plus world-space normal and view direction.
 *
 * Normal is taken through `modelMatrix` rather than `normalMatrix` on purpose: the view direction
 * has to be compared against the sun in the same space, and mixing the two spaces is what makes
 * a lit sphere go dark as it rotates.
 */
const VERTEX = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vView;

void main() {
  vObj = normalize(position);

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - worldPos.xyz);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

/**
 * 3D value noise. A sphere cannot be sampled with 2D noise without a seam or a projection
 * artefact, so the lattice is volumetric — eight hash lookups per octave instead of four.
 */
const NOISE = /* glsl */ `
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(mix(hash31(i + vec3(0.0, 0.0, 0.0)), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

float fbm3(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += noise3(p) * amp;
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uMotion;
uniform float uOpacity;
uniform float uCloudSpin;
uniform vec3  uSun;
uniform vec3  uDeep;
uniform vec3  uShelf;
uniform vec3  uLand;
uniform vec3  uHighland;
uniform vec3  uIce;
uniform vec3  uAtmos;
uniform vec3  uCity;

varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vView;

${NOISE}

void main() {
  vec3 p = vObj;
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vView);
  vec3 L = normalize(uSun);

  // Coastlines. One fbm reads as blobs; displacing the sample point by a second, coarser noise
  // makes the boundary wander, which is what separates a coastline from a stain.
  float warp = fbm3(p * 2.1 + vec3(5.2, 1.3, 9.7));
  float cont = fbm3(p * 1.35 + vec3(warp * 0.7));

  float land = smoothstep(0.50, 0.56, cont);
  float shelf = smoothstep(0.43, 0.50, cont);

  float lat = abs(p.y);
  float ice = smoothstep(0.74, 0.88, lat + (fbm3(p * 7.0) - 0.5) * 0.16);

  float relief = fbm3(p * 5.5 + vec3(2.4, 6.1, 1.2));

  vec3 sea = mix(uDeep, uShelf, shelf);
  vec3 ground = mix(uLand, uHighland, smoothstep(0.44, 0.80, relief));

  vec3 albedo = mix(sea, ground, land);
  albedo = mix(albedo, uIce, ice);

  // Clouds live on the surface rather than in a second shell, because a shell needs depth to
  // sort against the globe and this canvas has depth testing switched off. Rotating the sample
  // point instead gives the layer its own angular rate, so it drifts across the continents.
  float a = uCloudSpin;
  vec3 cp = vec3(p.x * cos(a) - p.z * sin(a), p.y, p.x * sin(a) + p.z * cos(a));
  float cloudField = fbm3(cp * 2.7 + vec3(0.0, 0.0, uTime * 0.006 * uMotion));
  float clouds = smoothstep(0.48, 0.80, cloudField);
  albedo = mix(albedo, uIce, clouds * 0.7);

  float ndl = dot(N, L);
  float day = smoothstep(-0.16, 0.22, ndl);

  // Ocean glint. Restricted to water, or it reads as a gloss highlight on the continents.
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 42.0) * (1.0 - land) * (1.0 - ice);

  // Cities: high-frequency noise, on land, away from the poles, and only where it is dark.
  float city = smoothstep(0.87, 0.98, noise3(p * 58.0)) * land * (1.0 - ice) * (1.0 - clouds * 0.6);
  float night = 1.0 - day;

  // Ambient is deliberately not zero. A pure black night side makes the globe read as a disc
  // with a hole in it rather than as a sphere.
  vec3 color = albedo * (0.05 + day * 1.05);
  color += uCity * city * night * 2.4;
  color += vec3(1.0) * spec * 0.85 * day;

  // Twilight band across the terminator.
  color += uAtmos * exp(-ndl * ndl * 11.0) * 0.20;

  // Limb. This is the term that makes it spherical: the atmosphere is optically thicker the
  // further the sightline runs through it, so brightness rises sharply toward the edge.
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.2);
  color += uAtmos * fres * (0.24 + day * 0.9);

  float alpha = clamp(0.9 + fres * 0.5, 0.0, 1.0) * uOpacity;
  gl_FragColor = vec4(color, alpha);
}
`;

/**
 * The halo outside the silhouette.
 *
 * A back-face shell on a slightly larger sphere, additively blended. The globe is alpha-blended
 * rather than opaque so the CSS starfield behind it still shows through, and this shell has to be
 * additive for the same reason — there is nothing to sort against.
 */
const ATMOSPHERE_FRAGMENT = /* glsl */ `
precision highp float;

uniform float uOpacity;
uniform vec3  uSun;
uniform vec3  uAtmos;

varying vec3 vNormalW;
varying vec3 vView;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vView);

  float fres = pow(1.0 - abs(dot(N, V)), 3.6);
  float sun = smoothstep(-0.45, 0.65, dot(N, normalize(uSun)));

  gl_FragColor = vec4(uAtmos * fres * (0.22 + sun * 1.0), fres * 0.55 * uOpacity);
}
`;

/**
 * Sun direction.
 *
 * Fixed in world space, off to one side and slightly behind, so the terminator sits across the
 * visible face. A light aligned with the camera would give a flat, fully-lit ball with no shape.
 */
const SUN = new THREE.Vector3(-0.55, 0.35, 0.75).normalize();

/**
 * Angular drift of the cloud layer relative to the surface, in radians.
 *
 * Kept as its own clock rather than derived from the mesh rotation so that slowing or stopping the
 * planet does not have to slow the weather with it.
 */
const CLOUD_RATE = 0.006;

/**
 * Surface and lighting palette.
 *
 * Monochrome by design. The shader's structure is unchanged — bathymetry, shelf, lowland,
 * highland, ice, city lights, plus the terminator and Fresnel limb terms — but every surface is
 * now a neutral value rather than a hue, and the ordering between them is what carries the
 * geography. That ordering is worth stating because it is doing real work: deep water is the
 * darkest, ice and specular glint the brightest, and land sits between them, so the planet is
 * still legible as a planet with no colour information at all.
 *
 * `uAtmos` is pure white on purpose. It drives the twilight band, the Fresnel limb and the
 * outer halo shell — the three terms that make the globe read as a lit sphere rather than a
 * flat disc — and in monochrome those terms are the only thing on the body producing a
 * highlight. Tinting it would tint the entire rim light, which is the one thing the
 * monochrome treatment is trying to preserve.
 *
 * `uCity` is a warm grey rather than a neutral one. Night-side settlement lights are the one
 * place where a slight warm cast still reads as artificial light against a grey surface, and it
 * keeps the night side from looking like an extension of the terminator.
 */
export function createEarthUniforms({ opacity = 0.62, time = 0, motion = 1 } = {}) {
  return {
    uTime: { value: time },
    uMotion: { value: motion },
    uOpacity: { value: opacity },
    uCloudSpin: { value: 0 },
    uSun: { value: SUN.clone() },
    uDeep: { value: new THREE.Color("#0b0c0e") },
    uShelf: { value: new THREE.Color("#17191c") },
    uLand: { value: new THREE.Color("#2b2d31") },
    uHighland: { value: new THREE.Color("#3c3e43") },
    uIce: { value: new THREE.Color("#e8e9ea") },
    uAtmos: { value: new THREE.Color("#ffffff") },
    uCity: { value: new THREE.Color("#c9bda8") },
  };
}

export function createEarthMaterial(options) {
  return new THREE.ShaderMaterial({
    uniforms: createEarthUniforms(options),
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
}

export function createAtmosphereMaterial(options) {
  return new THREE.ShaderMaterial({
    uniforms: createEarthUniforms(options),
    vertexShader: VERTEX,
    fragmentShader: ATMOSPHERE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
}

export { SUN, CLOUD_RATE };