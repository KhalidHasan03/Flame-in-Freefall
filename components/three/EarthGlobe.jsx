"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CLOUD_RATE, createAtmosphereMaterial, createEarthMaterial } from "./earthShader";

/**
 * The planet.
 *
 * Three meshes and no lights. Every shading term is evaluated in the fragment shader from the
 * surface coordinate, which is what lets this sit on a canvas with `depth: false` and no shadow
 * pass — there is no depth-sorted geometry here to get wrong.
 *
 *   Surface     the planet itself, alpha-blended so the CSS starfield behind still shows through
 *   Halo        a larger back-face shell, additively blended, for the limb glow
 *   Graticule   a faint wireframe meridian cage, the same "engineering reference" cue the flame's
 *               chamber uses — it reads as an instrument rather than as a stock space photo
 */

/** Axial tilt, in radians. Real, and the reason the meridians are not vertical. */
const TILT = (23.4 * Math.PI) / 180;

/** Surface angular velocity. A full turn takes a little over two minutes. */
const SPIN = 0.05;

function Graticule({ radius, color }) {
  const geometry = useMemo(() => new THREE.SphereGeometry(radius * 1.015, 24, 16), [radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Advances the cloud layer's own clock.
 *
 * Same accessor shape as TimeDriver, for the same reason: the uniforms belong to a three.js
 * material, which is imperative GPU state and not React state, but holding the material directly
 * makes React treat it as immutable. Reading it through a function keeps the ownership explicit.
 */
function CloudDriver({ read, running = true }) {
  useFrame((state, delta) => {
    const uniforms = read();
    if (!uniforms) return;
    uniforms.uCloudSpin.value += Math.min(delta, 1 / 20) * SPIN * CLOUD_RATE * 160;
  }, running ? 0 : -1);

  return null;
}

/**
 * @param {object} props
 * @param {boolean} [props.motion=true]  When false the planet renders one frame and holds its
 *   position: the preference should change movement, never remove the subject.
 * @param {number}  [props.radius=0.34]  World units. The shared camera sits at z=2 with a 42°
 *   field of view, which puts the visible height at ~0.77 — so 0.34 fills most of the frame.
 * @param {number}  [props.opacity=0.62]
 */
export default function EarthGlobe({ motion = true, radius = 0.34, opacity = 0.62 }) {
  const globe = useRef(null);
  const dbg = useRef(0);

  const surface = useMemo(() => createEarthMaterial({ opacity }), [opacity]);
  const halo = useMemo(() => createAtmosphereMaterial({ opacity }), [opacity]);

  useEffect(
    () => () => {
      surface.dispose();
      halo.dispose();
    },
    [surface, halo],
  );

  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 96, 64), [radius]);
  const haloGeometry = useMemo(() => new THREE.SphereGeometry(radius * 1.14, 64, 48), [radius]);

  useEffect(
    () => () => {
      surfaceGeometry.dispose();
      haloGeometry.dispose();
    },
    [surfaceGeometry, haloGeometry],
  );

  /*
   * Composition, not styling.
   *
   * A full-bleed planet centred dead in the viewport would put its brightest region directly
   * behind the dashboard's headline figures. Offsetting it down and to one side keeps the upper
   * band of the frame clear for text while still reading as a planet rather than as a backdrop
   * graphic, and it matches the half-cropped planet the mission selector already uses.
   *
   * On a portrait viewport there is no horizontal room for that offset — the globe would be
   * cropped on both sides — so it recentres and shrinks instead.
   */
  const width = useThree((state) => state.viewport.width);
  const narrow = width < 0.8;

  useFrame((state, delta) => {
    if (!motion || !globe.current) return;

    // Clamped like TimeDriver: a tab returning to the foreground must not jump the planet ahead
    // by the entire time it spent away.
    globe.current.rotation.y += Math.min(delta, 1 / 20) * SPIN;
  }, motion ? 0 : -1);

  return (
    <group position={narrow ? [0, -0.1, 0] : [0.14, -0.14, 0]} scale={narrow ? 0.68 : 1}>
      <group rotation={[0, 0, TILT]}>
        <group ref={globe}>
          <mesh geometry={surfaceGeometry} material={surface} />
          <Graticule radius={radius} color="#ffffff" />
          {/* The halo shares the planet's rotation so the two stay concentric while it spins. */}
          <mesh geometry={haloGeometry} material={halo} />
        </group>
      </group>
      <CloudDriver read={() => surface.uniforms} running={motion} />
    </group>
  );
}