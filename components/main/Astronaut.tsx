"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Html,
  Lightformer,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { easing } from "maath";

// Neil Armstrong Spacesuit – Smithsonian Digitization Programs Office & NASM
const MODEL = "/models/astronaut.glb";
// Chiều cao model gốc (m), chân nằm ở y = 0
const MODEL_HEIGHT = 1.91;

// Vị trí theo từng section, tính theo tỉ lệ nửa viewport: [-1, 1]
const WAYPOINTS: Record<
  string,
  { desktop: [number, number]; mobile: [number, number] }
> = {
  "about-me": { desktop: [0.74, -0.5], mobile: [0.62, -0.7] },
  skills: { desktop: [-0.8, 0.05], mobile: [-0.66, 0.55] },
  "work-experiences": { desktop: [0.8, 0.45], mobile: [0.66, 0.55] },
  projects: { desktop: [-0.6, 0.62], mobile: [-0.78, 0.6] },
  // Khoảng trống giữa khối giới thiệu và các cột link của footer
  footer: { desktop: [-0.15, -0.5], mobile: [0.66, -0.2] },
};

const MESSAGES = [
  "Houston, the portfolio has landed 🚀",
  "Scroll on, I'll guide the tour ✨",
  "Zero bugs in orbit… mostly 🐛",
  "Rendered live with React Three Fiber 🪐",
  "Ground control to recruiters: let's talk 📡",
];

const ORDER = Object.keys(WAYPOINTS);

// Tiến độ tour theo cuộn trang: đang bay từ `from` tới `to`, đi được `t` ∈ [0, 1]
// Cập nhật trong scroll listener, đọc trong useFrame (không re-render)
const tour = { from: ORDER[0], to: ORDER[0], t: 0, velocity: 0 };

const getScrollTop = () =>
  window.scrollY ||
  document.documentElement.scrollTop ||
  document.body.scrollTop;

function useScrollTour() {
  useEffect(() => {
    let last = getScrollTop();
    const update = () => {
      const top = getScrollTop();
      tour.velocity = top - last;
      last = top;

      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      // Mốc cuộn tại đó từng section nằm giữa màn hình
      const stops: { id: string; at: number }[] = [];
      ORDER.forEach((id, i) => {
        if (i === 0) return stops.push({ id, at: 0 });
        if (id === "footer") return stops.push({ id, at: max });
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (!rect) return;
        const at = rect.top + top + rect.height / 2 - window.innerHeight / 2;
        stops.push({ id, at: THREE.MathUtils.clamp(at, 0, max) });
      });

      let i = 0;
      while (i < stops.length - 2 && top > stops[i + 1].at) i++;
      const a = stops[i];
      const b = stops[Math.min(i + 1, stops.length - 1)];
      tour.from = a.id;
      tour.to = b.id;
      tour.t =
        b.at > a.at ? THREE.MathUtils.clamp((top - a.at) / (b.at - a.at), 0, 1) : 0;
    };
    update();
    // capture: bắt cả trường hợp body/phần tử khác là vùng cuộn thay vì window
    document.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, []);
}

function Astronaut({
  portal,
}: {
  portal: React.RefObject<HTMLDivElement>;
}) {
  const { scene } = useGLTF(MODEL);
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const flip = useRef<THREE.Group>(null);
  const flipTarget = useRef(0);
  const prev = useMemo(() => new THREE.Vector3(), []);
  const velocity = useMemo(() => new THREE.Vector3(), []);
  const [hovered, setHovered] = useState(false);
  const [message, setMessage] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bubble = useRef<HTMLDivElement>(null);

  // Chỉ raycast vào hitbox đơn giản, không raycast vào ~40k tam giác của model
  useMemo(() => {
    scene.traverse((o) => {
      o.raycast = () => null;
      if ((o as THREE.Mesh).isMesh) o.castShadow = false;
    });
  }, [scene]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const poke = () => {
    // Lộn một vòng trong không trọng lực + nói một câu
    flipTarget.current += Math.PI * 2;
    setMessage((m) => ((m ?? -1) + 1) % MESSAGES.length);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 3500);
  };

  useFrame((state, delta) => {
    if (!root.current || !body.current || !flip.current) return;
    const { viewport, size, pointer, clock } = state;
    const t = clock.elapsedTime;
    const mobile = size.width < 768;
    const from = WAYPOINTS[tour.from][mobile ? "mobile" : "desktop"];
    const to = WAYPOINTS[tour.to][mobile ? "mobile" : "desktop"];

    // Dừng lại một chút ở mỗi section, bay ở quãng giữa hai section
    const e = THREE.MathUtils.smoothstep(tour.t, 0.15, 0.85);
    // Bay theo đường vòng cung chứ không phải đường thẳng
    const arc = Math.sin(e * Math.PI) * 0.35;
    const fx = THREE.MathUtils.lerp(from[0], to[0], e);
    // Giới hạn trên để không bay vào vùng navbar
    const fy = Math.min(THREE.MathUtils.lerp(from[1], to[1], e) + arc, 0.62);

    // Quán tính khi cuộn: trôi ngược chiều cuộn rồi từ từ trở lại
    tour.velocity = THREE.MathUtils.damp(tour.velocity, 0, 3, delta);
    const drift = THREE.MathUtils.clamp(tour.velocity * 0.012, -0.5, 0.5);

    easing.damp3(
      root.current.position,
      [
        (fx * viewport.width) / 2 + Math.sin(t * 0.6) * 0.05,
        (fy * viewport.height) / 2 + Math.sin(t * 0.9) * 0.07 + drift,
        0,
      ],
      0.6,
      delta,
    );
    // Đẩy bong bóng thoại vào phía trong màn hình
    if (bubble.current) {
      bubble.current.style.transform = `translateX(${
        root.current.position.x > 0 ? -40 : 40
      }%)`;
    }
    velocity
      .copy(root.current.position)
      .sub(prev)
      .divideScalar(Math.max(delta, 1e-3));
    prev.copy(root.current.position);

    // Giữ chiều cao cố định theo pixel trên mọi kích thước màn hình
    const px = (mobile ? 120 : 190) * (hovered ? 1.08 : 1);
    const scale = ((px / size.height) * viewport.height) / MODEL_HEIGHT;
    easing.damp3(root.current.scale, [scale, scale, scale], 0.2, delta);

    // Nghiêng theo hướng bay, quay nhẹ về phía con trỏ, xoay chậm tự do
    const lean = THREE.MathUtils.clamp(velocity.x * 0.12, -0.7, 0.7);
    const climb = THREE.MathUtils.clamp(velocity.y * 0.08, -0.5, 0.5);
    easing.dampE(
      body.current.rotation,
      [
        -pointer.y * 0.2 - climb + Math.sin(t * 0.5) * 0.08,
        pointer.x * 0.5 + Math.sin(t * 0.3) * 0.25 - 0.3,
        -lean + Math.sin(t * 0.4) * 0.12 - drift * 0.6,
      ],
      0.4,
      delta,
    );
    easing.damp(flip.current.rotation, "x", flipTarget.current, 0.35, delta);
  });

  return (
    <group ref={root} position={[6, 4, 0]}>
      <group ref={body}>
        <group ref={flip}>
          {/* Model có chân ở y = 0, dời xuống để tâm xoay nằm giữa người */}
          <primitive object={scene} position={[0, -MODEL_HEIGHT / 2, 0]} />
          <mesh
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => (e.stopPropagation(), poke())}
          >
            <capsuleGeometry args={[0.32, 1.2, 4, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>

      {/* Khí đẩy lấp lánh quanh chân */}
      <Sparkles
        position={[0, -0.75, -0.1]}
        count={24}
        scale={[0.6, 0.6, 0.6]}
        size={6}
        speed={0.6}
        opacity={0.8}
        color="#b49bff"
      />
      <Sparkles
        position={[0, -0.85, -0.1]}
        count={12}
        scale={[0.4, 0.5, 0.4]}
        size={4}
        speed={0.9}
        color="#7dd3fc"
      />

      {/* portal: gắn vào lớp canvas cố định thay vì document.body */}
      <Html position={[0, 1.25, 0]} center portal={portal} zIndexRange={[40, 30]}>
        <div ref={bubble} className="transition-transform duration-500">
          <div
            className={`pointer-events-none w-max max-w-[220px] text-center rounded-2xl border border-[#7042f88b] bg-[#030014cc] px-4 py-2 text-xs text-gray-100 shadow-[0_0_20px_rgba(112,66,248,0.45)] backdrop-blur-md transition-all duration-300 ${
              message === null ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          >
            {message !== null && MESSAGES[message]}
          </div>
        </div>
      </Html>
    </group>
  );
}

const AstronautCanvas = () => {
  const [ready, setReady] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useScrollTour();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Tải model 2MB sau khi trang đã load xong để không tranh băng thông
    const start = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => setReady(true))
        : setTimeout(() => setReady(true), 300);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  if (!ready) return null;

  return (
    // overflow-hidden: không gì trong lớp này được làm trang giãn ra
    <div
      ref={container}
      className="fixed inset-0 z-[25] pointer-events-none overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 3, 4]} intensity={2.2} />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={2} position={[0, 3, 4]} scale={[6, 2, 1]} />
            <Lightformer
              intensity={4}
              color="#7042f8"
              position={[-5, 0, -1]}
              rotation-y={Math.PI / 2}
              scale={[4, 8, 1]}
            />
            <Lightformer
              intensity={3}
              color="#00c2ff"
              position={[5, -1, -1]}
              rotation-y={-Math.PI / 2}
              scale={[4, 8, 1]}
            />
          </Environment>
          <Astronaut portal={container as React.RefObject<HTMLDivElement>} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AstronautCanvas;
