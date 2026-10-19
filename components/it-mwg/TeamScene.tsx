"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import ChibiBody, { type ChibiLook } from "@/components/gift/ChibiBody";
import { applyPose, useRig, type Pose } from "@/components/gift/chibiAnim";
import { Balloon3D, Bouquet3D, Cup3D, Laptop3D } from "@/components/gift/ChibiProps";

type PropKind = "bouquet" | "laptop" | "cup" | "balloon" | "none";

type Member = {
  look: ChibiLook;
  prop: PropKind;
  wish: string;
  desktop: [number, number]; // [x, z]
  mobile: [number, number, number?]; // [x, z, độ cao bục đứng]
};

const POSE_OF: Record<PropKind, Pose> = {
  bouquet: "hold",
  laptop: "hold",
  cup: "cup",
  balloon: "balloon",
  none: "wave",
};

/* Hiệu ứng nhảy vui khi được chọn */
const CHEER_TIME = 1.6;

function MemberChibi({
  member,
  index,
  active,
  narrow,
  onPick,
}: {
  member: Member;
  index: number;
  active: boolean;
  narrow: boolean;
  onPick: (i: number) => void;
}) {
  const rig = useRig();
  const root = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const cheerFrom = useRef<number | null>(null);
  const pending = useRef(false);

  useEffect(() => {
    if (active) pending.current = true;
  }, [active]);

  const ringTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 20, 64, 64, 64);
    g.addColorStop(0, "rgba(255,121,170,0)");
    g.addColorStop(0.6, "rgba(255,121,170,0.75)");
    g.addColorStop(1, "rgba(255,121,170,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(({ clock }, delta) => {
    const g = root.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 1 / 30);
    if (pending.current) {
      pending.current = false;
      cheerFrom.current = t;
    }

    const [x, z] = narrow ? member.mobile : member.desktop;
    const base = narrow ? (member.mobile[2] ?? 0) : 0;
    const k = Math.min(1, dt * 4);
    g.position.x += (x - g.position.x) * k;
    g.position.z += (z - g.position.z) * k;
    g.rotation.y += (-x * 0.08 - g.rotation.y) * k;

    const cheering = cheerFrom.current != null && t - cheerFrom.current < CHEER_TIME;
    const jump = cheering ? Math.abs(Math.sin((t - cheerFrom.current!) * 7)) * 0.22 : 0;
    g.position.y = base + jump;

    const pose: Pose = cheering && member.prop === "none" ? "cheer" : POSE_OF[member.prop];
    applyPose(rig, pose, t, dt, index * 1.3);
    if (active && rig.eyesOpen.current && rig.eyesHappy.current) {
      rig.eyesOpen.current.visible = false;
      rig.eyesHappy.current.visible = true;
    }

    if (ring.current) {
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity += ((active ? 1 : 0) - mat.opacity) * k;
      ring.current.scale.setScalar(1.3 + Math.sin(t * 3) * 0.08);
    }
  });

  return (
    <group
      ref={root}
      position={[member.desktop[0], 0, member.desktop[1]]}
      onClick={(e) => {
        e.stopPropagation();
        onPick(index);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={ringTex} transparent opacity={0} depthWrite={false} />
      </mesh>

      <ChibiBody rig={rig} look={member.look} />

      {member.prop === "bouquet" && (
        <group position={[0, 0.6, 0.42]} rotation={[0.12, 0, 0]}>
          <Bouquet3D />
        </group>
      )}
      {member.prop === "laptop" && (
        <group position={[0, 0.5, 0.42]}>
          <Laptop3D />
        </group>
      )}
      {member.prop === "cup" && (
        <group position={[0.2, 0.58, 0.32]}>
          <Cup3D />
        </group>
      )}
      {member.prop === "balloon" && (
        <group position={[0.39, 1.05, 0.05]}>
          <Balloon3D seed={index} color={index % 2 ? "#ff4d6d" : "#ff8fab"} />
        </group>
      )}

      {active && (
        <Html center position={[0, member.prop === "balloon" ? 2.55 : 2.15, 0]} style={{ pointerEvents: "none" }}>
          <div className="tm-tag">{member.wish}</div>
        </Html>
      )}
    </group>
  );
}

/* ─── Cánh hoa 3D rơi ─── */
const PETALS = 70;
function Petals() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(
    () =>
      Array.from({ length: PETALS }, () => ({
        x: (Math.random() - 0.5) * 9,
        y: Math.random() * 5,
        z: (Math.random() - 0.5) * 4 - 0.5,
        speed: 0.25 + Math.random() * 0.35,
        spin: Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.quadraticCurveTo(0.5, -0.1, 0, 0.5);
    s.quadraticCurveTo(-0.5, -0.1, 0, -0.5);
    return new THREE.ShapeGeometry(s, 8);
  }, []);
  const colors = useMemo(() => {
    const palette = ["#ffb3c6", "#ff8fab", "#ffc8dd", "#ffffff", "#cdb4db"].map((c) => new THREE.Color(c));
    return Array.from({ length: PETALS }, (_, i) => palette[i % palette.length]);
  }, []);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    colors.forEach((c, i) => mesh.current?.setColorAt(i, c));
    if (mesh.current?.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [colors]);

  useFrame(({ clock }, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    data.forEach((p, i) => {
      p.y -= p.speed * Math.min(delta, 1 / 30);
      if (p.y < -0.2) p.y = 5;
      tmp.position.set(p.x + Math.sin(t * 0.8 + p.phase) * 0.3, p.y, p.z);
      tmp.rotation.set(t * p.spin, t * p.spin * 0.7, p.phase);
      tmp.scale.setScalar(0.07);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, PETALS]}>
      <meshBasicMaterial side={THREE.DoubleSide} transparent opacity={0.9} />
    </instancedMesh>
  );
}

function Floor() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.6, "rgba(243,232,255,0.7)");
    g.addColorStop(1, "rgba(243,232,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -0.2]} scale={[8, 4, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Stage({ members }: { members: Member[] }) {
  const { camera, size } = useThree();
  const narrow = size.width / size.height < 1.2;
  const [active, setActive] = useState(0);
  const pausedUntil = useRef(0);

  useEffect(() => {
    camera.position.set(0, narrow ? 3.4 : 1.7, narrow ? 9.0 : 7.4);
    camera.lookAt(0, narrow ? 1.45 : 1.0, 0);
  }, [camera, narrow]);

  // tự xoay vòng lời chúc khi người xem chưa chạm
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setActive((a) => (a + 1) % members.length);
    }, 3200);
    return () => clearInterval(id);
  }, [members.length]);

  const pick = (i: number) => {
    pausedUntil.current = Date.now() + 9000;
    setActive(i);
  };

  return (
    <>
      {/* bục cho hàng sau trên màn hình hẹp */}
      {narrow && (
        <RoundedBox args={[2.5, 0.9, 1.1]} radius={0.14} smoothness={4} position={[0, 0.45, -1.65]}>
          <meshStandardMaterial color="#ffd6ea" roughness={0.6} />
        </RoundedBox>
      )}
      {members.map((m, i) => (
        <MemberChibi key={i} member={m} index={i} active={active === i} narrow={narrow} onPick={pick} />
      ))}
    </>
  );
}

export default function TeamScene({ members }: { members: Member[] }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1.7, 7.4], fov: 34 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#e9d5ff" />
      <Floor />
      <Stage members={members} />
      <Petals />
      <Sparkles count={50} scale={[8, 3.5, 3]} position={[0, 1.6, 0]} size={3} speed={0.3} color="#f0abfc" />
    </Canvas>
  );
}

export type { Member };
