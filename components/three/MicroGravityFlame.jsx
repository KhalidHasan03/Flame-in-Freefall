"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getFlameProfile } from "@/lib/flameGeometry";
import { createFlameMaterial, updateFlameUniforms } from "./flameShader";
import { TimeDriver } from "./EngineClient";

/**
 * Microgravity flame in a transparent combustion chamber.
 *
 * The approved subject for this phase. Two pieces, both of them cheap:
 *
 *   Flame      one quad, one fragment shader, additive. See components/three/flameShader.js for
 *              why the envelope is shared with the SVG fallback.
 *   Chamber    an icosahedron wireframe plus a faint back-face shell. This reads as containment
 *              without a transmissive material — a real transmission pass needs a render target
 *              and would cost more than the flame it is meant to show off.
 *
 * No textures, no models, no shadows, no postprocessing. The chamber is wireframe *and* additive,
 * so it contributes nothing to the depth buffer and needs no lighting at all.
 */

/** Burner ring at the flame base. A single ring, because at this scale it is a hint, not a model. */
function Burner({ radius, color }) {
  const geometry = useMemo(() => new THREE.RingGeometry(radius, radius * 1.06, 48), [radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.98, 0]}>
      <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/**
 * Containment vessel.
 *
 * Icosahedron rather than a UV sphere because its wireframe reads as an engineering reference
 * grid rather than as a beach ball, and because 20 faces is enough to convey curvature without
 * the facet count of a sphere.
 */
function Chamber({ radius, color }) {
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(radius, 2), [radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Back faces only. A front-facing shell would wash the flame out; the far side of the
          sphere is what actually reads as an enclosing volume. */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * @param {object} props
 * @param {object} props.params   The same params Flame Lab controls; passed straight to
 *   `getFlameProfile` so the WebGL and SVG renderers cannot diverge.
 * @param {boolean} [props.motion=true]
 * @param {number} [props.radius=1]  Chamber radius in world units.
 * @param {number} [props.aspect=0.8] Quad aspect, so the envelope is not stretched by the
 *   container's proportions.
 */
export default function MicroGravityFlame({ params, motion = true, radius = 1, aspect = 0.8 }) {
  const material = useMemo(() => createFlameMaterial(), []);

  useEffect(() => () => material.dispose(), [material]);

  // Recomputed only when a control moves. `profile.signature` is the full parameter set, so this
  // is exactly as expensive as it needs to be and no more.
  const profile = useMemo(() => getFlameProfile(params), [params]);

  useEffect(() => {
    updateFlameUniforms(material.uniforms, profile, motion ? 1 : 0, aspect);
  }, [material, profile, motion, aspect]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(aspect, 1.5), [aspect]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  /*
   * A slow, barely-there sway. The flame is buoyant in a fluid, so the envelope should not sit
   * perfectly still — but this is the difference between "alive" and "animating", and the
   * turbulence inside the shader already does most of the work.
   */
  const sway = useRef(null);
  useFrame((state) => {
    if (!motion || !sway.current) return;
    const t = state.clock.elapsedTime;
    sway.current.rotation.z = Math.sin(t * 0.31) * 0.035 + Math.sin(t * 0.17) * 0.02;
    sway.current.position.x = Math.sin(t * 0.23) * 0.018;
  });

  return (
    <group>
      <group ref={sway} position={[0, -0.12, 0]}>
        <mesh geometry={geometry} material={material} />
      </group>
      <Burner radius={radius * 0.42} color={profile.palette.halo} />
      <Chamber radius={radius} color={profile.palette.mid} />
      <TimeDriver read={() => material.uniforms} running={motion} />
    </group>
  );
}