"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  RoundedBox,
  Sparkles,
  Html,
  Environment,
  Lightformer,
} from "@react-three/drei";
import * as THREE from "three";
import Courier, { type Carry, type SceneLayout } from "./Courier";

export type BoxState = "idle" | "carried" | "opening" | "locked";

/* ─── Kích thước hộp ─── */
const W = 1.3; // cạnh đáy
const H = 1.05; // chiều cao thân
const T = 0.06; // độ dày vách
const RIBBON = 0.2; // bề rộng ruy băng
const LID_H = 0.2;

const SHAKE_TIME = 0.9; // giây rung lắc trước khi bật nắp

const GREY = new THREE.Color("#5b5262");

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/* ─── Texture tròn mềm cho particle & glow ─── */
function useRadialTexture(inner: string, outer: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [inner, outer]);
}

/* ─── Hình trái tim 3D ─── */
function useHeartGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.25, 0.25);
    s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    s.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
    s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 24,
    });
    geo.center();
    geo.rotateZ(Math.PI);
    return geo;
  }, []);
}

/* ─── Vụ nổ trái tim lấp lánh khi mở hộp ─── */
const BURST_COUNT = 260;
const BURST_COLORS = ["#ff4d8d", "#ffd166", "#ff8fab", "#ffffff", "#f72585"];

function Burst({ trigger }: { trigger: number | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const tex = useRadialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)");
  const velocities = useMemo(() => new Float32Array(BURST_COUNT * 3), []);
  const startRef = useRef<number | null>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(BURST_COUNT * 3);
    const col = new Float32Array(BURST_COUNT * 3);
    const c = new THREE.Color();
    for (let i = 0; i < BURST_COUNT; i++) {
      c.set(BURST_COLORS[i % BURST_COLORS.length]);
      col.set([c.r, c.g, c.b], i * 3);
    }
    return [pos, col];
  }, []);

  useEffect(() => {
    if (trigger == null) return;
    for (let i = 0; i < BURST_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const up = 2.5 + Math.random() * 3.5;
      const out = 0.8 + Math.random() * 2.2;
      positions.set([0, H, 0], i * 3);
      velocities.set([Math.cos(theta) * out, up, Math.sin(theta) * out], i * 3);
    }
    startRef.current = null;
    if (pointsRef.current) pointsRef.current.visible = true;
  }, [trigger, positions, velocities]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts || trigger == null || !pts.visible) return;
    if (startRef.current == null) startRef.current = state.clock.elapsedTime;
    const age = state.clock.elapsedTime - startRef.current;
    const dt = Math.min(delta, 1 / 30);
    for (let i = 0; i < BURST_COUNT; i++) {
      const k = i * 3;
      velocities[k + 1] -= 4.2 * dt;
      velocities[k] *= 0.985;
      velocities[k + 2] *= 0.985;
      positions[k] += velocities[k] * dt;
      positions[k + 1] += velocities[k + 1] * dt;
      positions[k + 2] += velocities[k + 2] * dt;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    if (matRef.current) matRef.current.opacity = clamp01(1 - age / 2.8);
    if (age > 2.8) pts.visible = false;
  });

  return (
    <points ref={pointsRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.13}
        map={tex}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Họa tiết giấy gói (vẽ bằng canvas) ─── */
function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(
    x,
    y + s * 0.8,
    x + s * 0.5,
    y + s * 0.6,
    x + s * 0.5,
    y + s * 0.3,
  );
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
  ctx.fill();
}

function usePatternTexture(variant: number) {
  return useMemo(() => {
    const S = 512;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d")!;

    if (variant === 0) {
      // Đỏ thắm: chấm bi vàng xen tim hồng
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, "#e01650");
      g.addColorStop(1, "#a80a37");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const x = col * 64 + (row % 2) * 32 + 16;
          const y = row * 64 + 32;
          if ((row + col) % 2 === 0) {
            ctx.fillStyle = "#f7c95c";
            ctx.beginPath();
            ctx.arc(x, y, 7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = "#ff8fb0";
            drawHeart(ctx, x, y - 11, 22);
          }
        }
      }
    } else {
      // Hồng phấn: sọc chéo + tim trắng
      ctx.fillStyle = "#f6a3c3";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 16;
      for (let i = -S; i < S * 2; i += 56) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + S, S);
        ctx.stroke();
      }
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          const x = col * 85 + (row % 2) * 42 + 20;
          const y = row * 85 + 20;
          ctx.fillStyle = (row + col) % 3 === 0 ? "#c2187a" : "#ffffff";
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(((row + col) % 2 ? 1 : -1) * 0.25);
          drawHeart(ctx, 0, -13, 26);
          ctx.restore();
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(x + 42, y + 42, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    // bản trắng đen dùng khi hộp bị khoá
    const gc = document.createElement("canvas");
    gc.width = gc.height = S;
    const gctx = gc.getContext("2d")!;
    gctx.filter = "grayscale(1) brightness(1.1)";
    gctx.drawImage(c, 0, 0);
    const grey = new THREE.CanvasTexture(gc);
    grey.colorSpace = THREE.SRGBColorSpace;
    grey.anisotropy = 8;

    return { tex, grey };
  }, [variant]);
}

/* ─── Thẻ quà treo trên nơ ─── */
function useTagTexture(accent: string) {
  return useMemo(() => {
    const Wc = 256;
    const Hc = 384;
    const c = document.createElement("canvas");
    c.width = Wc;
    c.height = Hc;
    const ctx = c.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;

    const paint = () => {
      ctx.clearRect(0, 0, Wc, Hc);
      // dáng thẻ: vát 2 góc trên
      ctx.beginPath();
      ctx.moveTo(60, 8);
      ctx.lineTo(196, 8);
      ctx.lineTo(248, 70);
      ctx.lineTo(248, 356);
      ctx.quadraticCurveTo(248, 376, 228, 376);
      ctx.lineTo(28, 376);
      ctx.quadraticCurveTo(8, 376, 8, 356);
      ctx.lineTo(8, 70);
      ctx.closePath();
      ctx.fillStyle = "#fff8f0";
      ctx.fill();
      ctx.setLineDash([10, 8]);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#e0b04a";
      ctx.stroke();
      ctx.setLineDash([]);
      // lỗ xỏ dây
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(128, 48, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#e0b04a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(128, 48, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = accent;
      ctx.font = '700 84px "Dancing Script", cursive';
      ctx.fillText("20/10", 128, 190);
      ctx.font = '600 44px "Dancing Script", cursive';
      ctx.fillText("for you", 128, 262);
      drawHeart(ctx, 128, 290, 44);
      tex.needsUpdate = true;
    };

    paint();
    document.fonts
      ?.load('700 84px "Dancing Script"')
      .then(paint)
      .catch(() => {});
    return tex;
  }, [accent]);
}

/* ─── Nơ: các vòng ruy băng dẹt + đuôi cắt chữ V ─── */
function useBowGeometries() {
  return useMemo(() => {
    // Dải ruy băng dựng tay: đường cong nằm trong mặt XY, bề rộng theo trục Z
    const loop = (scale: number, width = 0.15) => {
      const curve = new THREE.CatmullRomCurve3(
        [
          [0, 0],
          [0.14, 0.13],
          [0.32, 0.2],
          [0.44, 0.12],
          [0.42, 0.0],
          [0.28, -0.04],
          [0.12, -0.03],
        ].map(([x, y]) => new THREE.Vector3(x * scale, y * scale, 0)),
        true,
        "catmullrom",
        0.5,
      );
      const pts = curve.getSpacedPoints(80);
      const pos: number[] = [];
      const idx: number[] = [];
      pts.forEach((p, i) => {
        // hơi phồng ở giữa vòng cho mềm mại
        const w = (width / 2) * (1 - 0.25 * Math.cos((i / 80) * Math.PI * 2));
        pos.push(p.x, p.y, -w, p.x, p.y, w);
        if (i < pts.length - 1) {
          const a = i * 2;
          idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    };

    const tailShape = new THREE.Shape();
    tailShape.moveTo(-0.08, 0);
    tailShape.lineTo(0.08, 0);
    tailShape.lineTo(0.09, 0.52);
    tailShape.lineTo(0, 0.44);
    tailShape.lineTo(-0.09, 0.52);
    tailShape.closePath();
    const tail = new THREE.ExtrudeGeometry(tailShape, {
      depth: 0.02,
      bevelEnabled: false,
    });

    return { big: loop(1.35, 0.17), small: loop(0.95, 0.14), tail };
  }, []);
}

function Bow({ material }: { material: THREE.Material }) {
  const { big, small, tail } = useBowGeometries();
  return (
    <group position={[0, LID_H + 0.02, 0]}>
      {/* 2 vòng lớn trái/phải */}
      {[0, Math.PI].map((ry) => (
        <mesh
          key={`b${ry}`}
          geometry={big}
          material={material}
          rotation={[0, ry, 0.25]}
          castShadow
        />
      ))}
      {/* 2 vòng nhỏ chéo trước/sau cho nơ đầy đặn */}
      {[0.9, Math.PI + 0.9, -0.9, Math.PI - 0.9].map((ry) => (
        <mesh
          key={`s${ry}`}
          geometry={small}
          material={material}
          rotation={[0, ry, 0.55]}
          castShadow
        />
      ))}
      {/* đuôi nơ */}
      {[0.5, -0.6].map((ry, i) => (
        <mesh
          key={`t${i}`}
          geometry={tail}
          material={material}
          position={[0, 0.01, 0]}
          rotation={[Math.PI / 2, 0, ry + Math.PI]}
        />
      ))}
      {/* nút thắt */}
      <RoundedBox
        args={[0.18, 0.14, 0.2]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.05, 0]}
        material={material}
      />
    </group>
  );
}

function GiftTag({
  accent,
  stringMat,
}: {
  accent: string;
  stringMat: THREE.Material;
}) {
  const tex = useTagTexture(accent);
  const pivot = useRef<THREE.Group>(null);
  const string = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.04, LID_H + 0.08, 0.06),
          new THREE.Vector3(0.28, LID_H + 0.01, 0.45),
          new THREE.Vector3(0.42, LID_H - 0.02, (W + 0.1) / 2 + 0.01),
          new THREE.Vector3(0.42, 0.02, (W + 0.1) / 2 + 0.02),
        ]),
        40,
        0.007,
        6,
      ),
    [],
  );

  useFrame(({ clock }) => {
    if (pivot.current)
      pivot.current.rotation.z = 0.18 + Math.sin(clock.elapsedTime * 1.8) * 0.1;
  });

  return (
    <>
      <mesh geometry={string} material={stringMat} />
      <group ref={pivot} position={[0.42, 0.04, (W + 0.1) / 2 + 0.025]}>
        <mesh position={[0, -0.17, 0]}>
          <planeGeometry args={[0.26, 0.39]} />
          <meshStandardMaterial
            map={tex}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
      </group>
    </>
  );
}

/* ─── Hộp quà ─── */
type GiftBoxProps = {
  index: number;
  state: BoxState;
  target: [number, number, number];
  baseScale: number;
  pattern: number;
  ribbonColor: string;
  ribbonMetal: number;
  tagColor: string;
  heartColor: string;
  label: string;
  onOpen: () => void;
  onLockedClick: () => void;
  instant?: boolean;
  carry?: React.MutableRefObject<Carry>;
};

function GiftBox({
  index,
  state,
  target,
  baseScale,
  pattern,
  ribbonColor,
  ribbonMetal,
  tagColor,
  heartColor,
  label,
  onOpen,
  onLockedClick,
  instant = false,
  carry,
}: GiftBoxProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const walls = useRef<(THREE.Group | null)[]>([]);
  const openStart = useRef<number | null>(null);
  const nopeStart = useRef<number | null>(null);
  const nopePending = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState<number | null>(null);
  const burstFired = useRef(false);

  const heartGeo = useHeartGeometry();
  const glowTex = useRadialTexture(
    "rgba(255,120,170,0.9)",
    "rgba(255,120,170,0)",
  );

  const patternTex = usePatternTexture(pattern);
  const locked = state === "locked";
  // màu gốc trắng để giữ nguyên màu họa tiết; lerp sang xám khi bị khoá
  const baseColor = useMemo(() => new THREE.Color("#ffffff"), []);
  const baseRibbon = useMemo(() => new THREE.Color(ribbonColor), [ribbonColor]);
  const boxMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: patternTex.tex,
        roughness: 0.45,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25,
      }),
    [patternTex],
  );

  useEffect(() => {
    boxMat.map = locked ? patternTex.grey : patternTex.tex;
  }, [locked, boxMat, patternTex]);
  // ruy băng satin: sheen + clearcoat
  const ribbonMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ribbonColor,
        roughness: 0.3,
        metalness: ribbonMetal,
        sheen: 1,
        sheenRoughness: 0.35,
        sheenColor: new THREE.Color(ribbonColor).lerp(
          new THREE.Color("#ffffff"),
          0.5,
        ),
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
      }),
    [ribbonColor, ribbonMetal],
  );
  const innerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff1f5",
        emissive: new THREE.Color("#ff8fb8"),
        emissiveIntensity: 0,
      }),
    [],
  );

  useEffect(() => {
    if (state !== "idle") {
      setHovered(false);
      document.body.style.cursor = "auto";
    }
  }, [state]);

  useFrame((s, delta) => {
    const g = root.current;
    if (!g || !body.current || !lid.current || !heart.current) return;
    const t = s.clock.elapsedTime;
    const k = 1 - Math.exp(-delta * 3.5);

    /* Di chuyển về vị trí đích & scale */
    const scaleTarget =
      baseScale *
      (state === "locked"
        ? 0.55
        : state === "opening"
          ? 1.12
          : hovered
            ? 1.08
            : 1);
    const carried = state === "carried" && !!carry?.current.active;
    if (carried) {
      // bám theo tay nhân vật
      const c = carry!.current;
      g.position.lerp(c.pos, 1 - Math.exp(-delta * 12));
      g.rotation.y = c.rotY;
      g.scale.setScalar(g.scale.x + (c.scale - g.scale.x) * Math.min(1, k * 2.5));
    } else {
      g.position.x += (target[0] - g.position.x) * k;
      g.position.z += (target[2] - g.position.z) * k;
      const bob = state === "idle" ? Math.sin(t * 1.6 + index * 1.7) * 0.1 : 0;
      g.position.y += (target[1] + bob + (hovered ? 0.12 : 0) - g.position.y) * k;
      g.scale.setScalar(g.scale.x + (scaleTarget - g.scale.x) * k);
      g.rotation.y += (0 - g.rotation.y) * k;
    }

    /* Xám dần khi bị khoá */
    const greyMix = locked ? 0.6 : 0;
    boxMat.color.lerp(baseColor.clone().lerp(GREY, greyMix), k);
    ribbonMat.color.lerp(baseRibbon.clone().lerp(GREY, greyMix), k);

    /* Glow dưới chân hộp */
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      const want =
        state === "locked" || carried
          ? 0.05
          : state === "opening"
            ? 1
            : hovered
              ? 0.85
              : 0.45;
      m.opacity += (want - m.opacity) * k;
      glow.current.scale.setScalar(2.6 + Math.sin(t * 2 + index) * 0.15);
    }

    /* Xoay nhẹ khi idle / lắc đầu khi bấm hộp đã khoá */
    let rotY = state === "idle" ? Math.sin(t * 0.6 + index * 2) * 0.45 : 0;
    if (state === "locked") rotY = -0.35 * (index === 0 ? 1 : -1);
    if (nopePending.current) {
      nopePending.current = false;
      nopeStart.current = t;
    }
    if (nopeStart.current != null) {
      const e = t - nopeStart.current;
      if (e > 0.7) nopeStart.current = null;
      else rotY += Math.sin(e * 30) * 0.35 * (1 - e / 0.7);
    }
    body.current.rotation.y +=
      (rotY - body.current.rotation.y) * Math.min(1, k * 2.5);

    /* Mở hộp */
    if (state !== "opening") {
      body.current.rotation.z = 0;
      return;
    }
    // instant: hộp đã mở từ lần trước → nhảy thẳng tới trạng thái cuối
    if (openStart.current == null) openStart.current = instant ? t - 10 : t;
    const e = t - openStart.current;

    if (e < SHAKE_TIME) {
      const p = e / SHAKE_TIME;
      body.current.rotation.z = Math.sin(e * 45) * 0.09 * p;
      const squash = 1 - Math.sin(p * Math.PI) * 0.06;
      body.current.scale.set(1 / squash, squash, 1 / squash);
      innerMat.emissiveIntensity = 0;
      return;
    }

    body.current.rotation.z = 0;
    body.current.scale.set(1, 1, 1);
    const p = e - SHAKE_TIME;

    if (!burstFired.current) {
      burstFired.current = true;
      if (!instant) setBurst(t);
    }

    /* Nắp bay lên, xoay vòng rồi biến mất */
    const lp = clamp01(p / 1.3);
    lid.current.position.y = H + easeOutCubic(lp) * 2.6;
    lid.current.position.x = easeOutCubic(lp) * 1.1;
    lid.current.rotation.z = -easeOutCubic(lp) * Math.PI * 1.4;
    lid.current.rotation.x = easeOutCubic(lp) * 0.6;
    lid.current.scale.setScalar(Math.max(0.0001, 1 - clamp01((p - 0.6) / 0.7)));

    /* 4 vách hộp bung ra như cánh hoa */
    const wp = clamp01((p - 0.15) / 0.9);
    const angle = easeOutBack(wp) * 1.85;
    walls.current.forEach((w) => {
      if (w) w.rotation.x = angle;
    });
    innerMat.emissiveIntensity = wp * 0.9;

    /* Trái tim phát sáng bay lên */
    const hp = clamp01((p - 0.35) / 1.2);
    heart.current.visible = hp > 0;
    heart.current.position.y =
      0.3 + easeOutCubic(hp) * 1.25 + Math.sin(t * 2) * 0.05 * hp;
    heart.current.scale.setScalar(0.0001 + easeOutBack(hp) * 0.8);
    heart.current.rotation.y = t * 1.4;
  });

  const interactive = state !== "opening";

  return (
    <group ref={root} position={target}>
      {/* Glow nền */}
      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group
        ref={body}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          if (state === "locked") {
            nopePending.current = true;
            onLockedClick();
          } else onOpen();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (state === "idle") setHovered(true);
          document.body.style.cursor =
            state === "locked" ? "not-allowed" : "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Đáy */}
        <mesh material={innerMat} position={[0, T / 2, 0]} receiveShadow>
          <boxGeometry args={[W, T, W]} />
        </mesh>

        {/* 4 vách – mỗi vách xoay quanh mép đáy */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <group
              position={[0, 0, W / 2]}
              ref={(el) => {
                walls.current[i] = el;
              }}
            >
              <mesh material={boxMat} position={[0, H / 2, -T / 2]} castShadow>
                <boxGeometry args={[W, H, T]} />
              </mesh>
              <mesh material={innerMat} position={[0, H / 2, -T - 0.001]}>
                <planeGeometry args={[W - 0.02, H - 0.02]} />
              </mesh>
              <mesh material={ribbonMat} position={[0, H / 2, -T / 2 + 0.008]}>
                <boxGeometry args={[RIBBON, H, T]} />
              </mesh>
            </group>
          </group>
        ))}

        {/* Nắp */}
        <group ref={lid} position={[0, H, 0]}>
          <RoundedBox
            args={[W + 0.1, LID_H, W + 0.1]}
            radius={0.04}
            smoothness={4}
            position={[0, LID_H / 2, 0]}
            material={boxMat}
            castShadow
          />
          <mesh material={ribbonMat} position={[0, LID_H / 2, 0]}>
            <boxGeometry args={[RIBBON, LID_H + 0.02, W + 0.12]} />
          </mesh>
          <mesh material={ribbonMat} position={[0, LID_H / 2, 0]}>
            <boxGeometry args={[W + 0.12, LID_H + 0.02, RIBBON]} />
          </mesh>
          <Bow material={ribbonMat} />
          <GiftTag accent={tagColor} stringMat={ribbonMat} />
        </group>

        {/* Trái tim bên trong */}
        <mesh ref={heart} geometry={heartGeo} visible={false} scale={0.0001}>
          <meshPhysicalMaterial
            color={heartColor}
            emissive={heartColor}
            emissiveIntensity={0.6}
            roughness={0.15}
            clearcoat={1}
          />
        </mesh>
        {state === "opening" && (
          <pointLight
            position={[0, H + 0.6, 0]}
            color="#ff9ec4"
            intensity={6}
            distance={5}
          />
        )}

        <Burst trigger={burst} />
      </group>

      {(state === "idle" || state === "locked") && (
        <Html center position={[0, -0.45, 0]} style={{ pointerEvents: "none" }}>
          <div
            className={`gift-label ${state === "locked" ? "is-locked" : ""}`}
          >
            {state === "locked" ? "Mún mở thêm k?" : label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Bố cục cảnh theo kích thước màn hình ─── */
function useSceneLayout(): SceneLayout {
  const { size } = useThree();
  const portrait = size.width < size.height * 0.9;
  return useMemo(
    () =>
      portrait
        ? { portrait, ground: -0.9, spread: 0.78, boxScale: 0.5, openScale: 0.62, charScale: 0.55, offerZ: 1.1 }
        : { portrait, ground: -1.3, spread: 1.8, boxScale: 1, openScale: 1, charScale: 1, offerZ: 1.7 },
    [portrait],
  );
}

const BOXES = [
  {
    pattern: 0,
    ribbonColor: "#f7c948",
    ribbonMetal: 0.45,
    tagColor: "#c8103f",
    heartColor: "#ff4d8d",
    label: "Hộp quà số 1",
  },
  {
    pattern: 1,
    ribbonColor: "#a3127f",
    ribbonMetal: 0.15,
    tagColor: "#a3127f",
    heartColor: "#ff2e74",
    label: "Hộp quà số 2",
  },
];

type SceneProps = {
  selected: number | null;
  opened: boolean;
  onSelect: (i: number) => void;
  onLockedClick: () => void;
  onDelivered: () => void;
  onOpenRequest: () => void;
  instant?: boolean;
};

function Stage({
  selected,
  opened,
  onSelect,
  onLockedClick,
  onDelivered,
  onOpenRequest,
  instant = false,
}: SceneProps) {
  const layout = useSceneLayout();
  const carry = useRef<Carry>({
    active: false,
    pos: new THREE.Vector3(),
    rotY: 0,
    scale: 0.42,
  });

  const place = (
    i: number,
  ): { target: [number, number, number]; scale: number } => {
    const sign = i === 0 ? -1 : 1;
    const { ground, spread, boxScale, openScale, portrait } = layout;
    if (selected == null || (selected === i && !opened)) {
      return { target: [sign * spread, ground, 0], scale: boxScale };
    }
    if (selected === i) {
      // hộp được đặt xuống trước mặt rồi mở
      return { target: [portrait ? 0 : -sign * 0.4, ground, 0.3], scale: openScale };
    }
    return portrait
      ? { target: [sign * 1.05, 0.5, -1], scale: 0.8 }
      : { target: [sign * 3.4, ground - 0.4, -1.5], scale: 1 };
  };

  return (
    <>
      {BOXES.map((b, i) => {
        const { target, scale } = place(i);
        const state: BoxState =
          selected == null
            ? "idle"
            : selected === i
              ? opened
                ? "opening"
                : "carried"
              : "locked";
        return (
          <GiftBox
            key={i}
            index={i}
            state={state}
            target={target}
            baseScale={scale}
            {...b}
            onOpen={() => (state === "idle" ? onSelect(i) : onOpenRequest())}
            onLockedClick={onLockedClick}
            instant={instant}
            carry={carry}
          />
        );
      })}
      <Courier
        selected={selected}
        opened={opened}
        instant={instant}
        layout={layout}
        carry={carry}
        onDelivered={onDelivered}
        onOpenRequest={onOpenRequest}
      />
    </>
  );
}

export default function GiftScene(props: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 7.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, -0.4, 0)}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, 3]} color="#ff6fa8" intensity={18} />
      <pointLight position={[4, 1, -2]} color="#ffd27a" intensity={20} />
      <hemisphereLight args={["#ffd6e8", "#2a0b2e", 0.6]} />

      {/* Môi trường phản chiếu tự tạo (không tải HDR) */}
      <Environment resolution={256} environmentIntensity={0.7}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffe3ef"
          position={[0, 5, -2]}
          scale={[10, 3, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2.5}
          color="#ff8fb8"
          position={[-5, 1, 3]}
          scale={3}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffe2a8"
          position={[5, 2, 3]}
          scale={[3, 6, 1]}
        />
      </Environment>

      <Stage {...props} />

      <Sparkles
        count={90}
        scale={[12, 7, 6]}
        size={3}
        speed={0.35}
        color="#ffc2dc"
      />
      <Sparkles
        count={40}
        scale={[10, 6, 4]}
        size={5}
        speed={0.2}
        color="#ffd166"
      />
    </Canvas>
  );
}
