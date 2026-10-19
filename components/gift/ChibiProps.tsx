"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Chất liệu toon dùng chung cho đạo cụ */
function useToon() {
  return useMemo(() => {
    const grad = new THREE.DataTexture(new Uint8Array([120, 200, 255]), 3, 1, THREE.RedFormat);
    grad.minFilter = grad.magFilter = THREE.NearestFilter;
    grad.needsUpdate = true;
    return (color: string, side: THREE.Side = THREE.FrontSide) =>
      new THREE.MeshToonMaterial({ color, gradientMap: grad, side });
  }, []);
}

function useHeartGeometry(depth = 0.2) {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(-0.15, -0.3, -0.5, -0.1, -0.5, 0.2);
    s.bezierCurveTo(-0.5, 0.45, -0.25, 0.55, 0, 0.3);
    s.bezierCurveTo(0.25, 0.55, 0.5, 0.45, 0.5, 0.2);
    s.bezierCurveTo(0.5, -0.1, 0.15, -0.3, 0, -0.5);
    const geo = new THREE.ExtrudeGeometry(s, {
      depth,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 3,
    });
    geo.center();
    return geo;
  }, [depth]);
}

/* ─── Bó hoa 3D ─── */
export function Bouquet3D() {
  const { mats, tulip } = useMemo(() => {
    const grad = new THREE.DataTexture(new Uint8Array([120, 200, 255]), 3, 1, THREE.RedFormat);
    grad.minFilter = grad.magFilter = THREE.NearestFilter;
    grad.needsUpdate = true;
    const toon = (color: string, side: THREE.Side = THREE.FrontSide) =>
      new THREE.MeshToonMaterial({ color, gradientMap: grad, side });
    const tulip = new THREE.LatheGeometry(
      [
        [0, 0],
        [0.035, 0.005],
        [0.055, 0.03],
        [0.058, 0.07],
        [0.045, 0.1],
        [0.03, 0.11],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
      16,
    );
    return {
      tulip,
      mats: {
        wrap: toon("#ffd1dc", THREE.DoubleSide),
        wrapIn: toon("#ffffff", THREE.DoubleSide),
        stem: toon("#4f9a52"),
        leaf: toon("#6cbf68"),
        ribbon: toon("#e05780"),
        white: toon("#ffffff"),
        flowers: ["#ff6b8b", "#ffb703", "#ffc8dd", "#ff4d6d", "#ffffff", "#ff8fab", "#f4a261"].map((c) =>
          toon(c, THREE.DoubleSide),
        ),
      },
    };
  }, []);

  const flowers = [
    [0, 0.36, 0, 0],
    [0.07, 0.32, 0.03, 1],
    [-0.07, 0.32, 0.03, 2],
    [0.04, 0.3, -0.06, 3],
    [-0.05, 0.3, -0.06, 4],
    [0.1, 0.27, -0.02, 5],
    [-0.1, 0.27, -0.01, 6],
  ] as const;

  return (
    <group>
      {/* giấy gói hình nón */}
      <mesh material={mats.wrap} position={[0, 0.07, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.15, 0.32, 24, 1, true]} />
      </mesh>
      <mesh material={mats.wrapIn} position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]} scale={0.92}>
        <coneGeometry args={[0.15, 0.32, 24, 1, true]} />
      </mesh>
      {/* lá */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.leaf} position={[s * 0.09, 0.25, -0.02]} rotation={[0, 0, s * -0.5]} scale={[0.03, 0.11, 0.015]}>
          <sphereGeometry args={[1, 12, 10]} />
        </mesh>
      ))}
      {/* hoa tulip */}
      {flowers.map(([x, y, z, c], i) => (
        <group key={i} position={[x, y, z]} rotation={[z * 2, 0, -x * 2.5]}>
          <mesh material={mats.stem} position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} />
          </mesh>
          <mesh geometry={tulip} material={mats.flowers[c]} />
        </group>
      ))}
      {/* hoa baby */}
      {[
        [0.13, 0.24, 0.04],
        [-0.13, 0.25, 0.05],
        [0.02, 0.29, 0.09],
        [-0.03, 0.39, -0.05],
        [0.11, 0.33, -0.07],
      ].map((p, i) => (
        <mesh key={i} material={mats.white} position={p as [number, number, number]} scale={0.018}>
          <sphereGeometry args={[1, 8, 8]} />
        </mesh>
      ))}
      {/* nơ */}
      <group position={[0, 0.02, 0.1]}>
        {[-1, 1].map((s) => (
          <mesh key={s} material={mats.ribbon} position={[s * 0.035, 0, 0]} rotation={[0, 0, s * 0.4]} scale={[0.035, 0.022, 0.012]}>
            <sphereGeometry args={[1, 12, 10]} />
          </mesh>
        ))}
        <mesh material={mats.ribbon} scale={0.015}>
          <sphereGeometry args={[1, 8, 8]} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Laptop có tim trên màn hình ─── */
export function Laptop3D() {
  const toon = useToon();
  const heart = useHeartGeometry(0.1);
  const m = useMemo(
    () => ({ body: toon("#c9d3e6"), screen: toon("#2b2d42"), heart: toon("#ff6b9a") }),
    [toon],
  );
  return (
    <group rotation={[0.15, 0, 0]}>
      <mesh material={m.body} position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.025, 0.27]} />
      </mesh>
      <group position={[0, 0.0, -0.13]} rotation={[-0.25, 0, 0]}>
        <mesh material={m.body} position={[0, 0.14, 0]}>
          <boxGeometry args={[0.4, 0.27, 0.02]} />
        </mesh>
        <mesh material={m.screen} position={[0, 0.14, 0.011]}>
          <planeGeometry args={[0.36, 0.23]} />
        </mesh>
        <mesh geometry={heart} material={m.heart} position={[0, 0.14, 0.02]} scale={0.12} />
      </group>
    </group>
  );
}

/* ─── Cốc cà phê ─── */
export function Cup3D() {
  const toon = useToon();
  const m = useMemo(() => ({ cup: toon("#ffffff"), coffee: toon("#8a5a3b"), sleeve: toon("#ff8fab") }), [toon]);
  return (
    <group>
      <mesh material={m.cup} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.055, 0.045, 0.13, 20]} />
      </mesh>
      <mesh material={m.sleeve} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.057, 0.05, 0.05, 20]} />
      </mesh>
      <mesh material={m.coffee} position={[0, 0.126, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.05, 20]} />
      </mesh>
      <mesh material={m.cup} position={[0.06, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.008, 8, 16, Math.PI]} />
      </mesh>
    </group>
  );
}

/* ─── Bóng bay trái tim (gốc ở tay cầm, bóng lơ lửng phía trên) ─── */
export function Balloon3D({ color = "#ff4d6d", seed = 0 }: { color?: string; seed?: number }) {
  const toon = useToon();
  const heart = useHeartGeometry(0.25);
  const balloon = useRef<THREE.Group>(null);
  const m = useMemo(() => ({ b: toon(color), string: new THREE.LineBasicMaterial({ color: "#ffffff" }) }), [toon, color]);
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.9, 0)]);
    return new THREE.Line(g, m.string);
  }, [m]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed;
    if (balloon.current) {
      balloon.current.position.set(Math.sin(t * 1.3) * 0.05, 1.05 + Math.sin(t * 1.8) * 0.04, 0);
      balloon.current.rotation.z = Math.sin(t * 1.1) * 0.15;
    }
    const pos = line.geometry.attributes.position as THREE.BufferAttribute;
    if (balloon.current) {
      pos.setXYZ(1, balloon.current.position.x, balloon.current.position.y - 0.17, 0);
      pos.needsUpdate = true;
    }
  });
  return (
    <group>
      <primitive object={line} />
      <group ref={balloon}>
        <mesh geometry={heart} material={m.b} scale={0.42} />
      </group>
    </group>
  );
}
