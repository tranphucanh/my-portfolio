"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

/* ─── Floating rose-gold particles ─── */
const RoseParticles = () => {
  const ref = useRef<any>(null);
  const [positions] = useMemo(
    () => [random.inSphere(new Float32Array(3000), { radius: 1.8 })],
    []
  );

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#f9a8d4"
          size={0.003}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

/* ─── Golden sparkle particles ─── */
const GoldenSparkles = () => {
  const ref = useRef<any>(null);
  const [positions] = useMemo(
    () => [random.inSphere(new Float32Array(800), { radius: 1.2 })],
    []
  );

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.05;
    ref.current.rotation.z += delta * 0.02;
  });

  return (
    <group rotation={[Math.PI / 5, 0, 0]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#fbbf24"
          size={0.004}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

/* ─── 3D Floating Hearts ─── */
const FloatingHeart = ({
  position,
  scale,
  speed,
  color,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;
    shape.moveTo(x, y + 0.28);
    shape.bezierCurveTo(x, y + 0.3, x - 0.05, y + 0.35, x - 0.25, y + 0.35);
    shape.bezierCurveTo(x - 0.55, y + 0.35, x - 0.55, y + 0.115, x - 0.55, y + 0.115);
    shape.bezierCurveTo(x - 0.55, y - 0.05, x - 0.35, y - 0.222, x, y - 0.4);
    shape.bezierCurveTo(x + 0.35, y - 0.222, x + 0.55, y - 0.05, x + 0.55, y + 0.115);
    shape.bezierCurveTo(x + 0.55, y + 0.115, x + 0.55, y + 0.35, x + 0.25, y + 0.35);
    shape.bezierCurveTo(x + 0.1, y + 0.35, x, y + 0.3, x, y + 0.28);
    return shape;
  }, []);

  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      }),
    [heartShape]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.position.y = initialY + Math.sin(t) * 0.3;
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};

/* ─── Heart instances ─── */
const Hearts = () => {
  const hearts = useMemo(
    () => [
      { pos: [-1.5, 0.8, -1] as [number, number, number], scale: 0.08, speed: 0.6, color: "#f472b6" },
      { pos: [1.8, -0.5, -1.5] as [number, number, number], scale: 0.06, speed: 0.8, color: "#fb7185" },
      { pos: [-0.8, -1.2, -0.8] as [number, number, number], scale: 0.05, speed: 0.7, color: "#f9a8d4" },
      { pos: [1.2, 1.3, -2] as [number, number, number], scale: 0.1, speed: 0.5, color: "#ec4899" },
      { pos: [-1.8, -0.3, -2.5] as [number, number, number], scale: 0.07, speed: 0.9, color: "#fda4af" },
      { pos: [0.5, 1.6, -1.2] as [number, number, number], scale: 0.04, speed: 1.0, color: "#f9a8d4" },
      { pos: [-0.3, -1.5, -1.8] as [number, number, number], scale: 0.065, speed: 0.65, color: "#fb7185" },
      { pos: [2.0, 0.2, -2.2] as [number, number, number], scale: 0.055, speed: 0.75, color: "#f472b6" },
    ],
    []
  );

  return (
    <>
      {hearts.map((h, i) => (
        <FloatingHeart key={i} position={h.pos} scale={h.scale} speed={h.speed} color={h.color} />
      ))}
    </>
  );
};

/* ─── Main Scene ─── */
const BirthdayScene = () => {
  return (
    <div className="hbd-canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 1], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={0.6} color="#f9a8d4" />
        <pointLight position={[-2, -1, 1]} intensity={0.4} color="#fbbf24" />
        <RoseParticles />
        <GoldenSparkles />
        <Hearts />
      </Canvas>
    </div>
  );
};

export default BirthdayScene;
