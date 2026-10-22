"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { easing } from "maath";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

type StarLayerProps = {
  count: number;
  radius: number;
  size: number;
  color: string;
  speed: number;
};

// Tốc độ cuộn trang hiện tại (px/frame), dùng để "warp" sao khi cuộn nhanh
const scroll = { last: 0, velocity: 0 };

// Dùng ref (luôn truthy) thay vì document.body trực tiếp để server và client
// render cùng style pointerEvents, tránh lỗi hydration. Chỉ đọc .current trên client.
const bodyRef = {
  get current() {
    return document.body;
  },
} as React.RefObject<HTMLElement>;

const StarLayer = ({ count, radius, size, color, speed }: StarLayerProps) => {
  const ref = useRef<THREE.Points>(null);
  // count * 3 để mỗi điểm có đủ x, y, z
  const [positions] = useState(() =>
    random.inSphere(new Float32Array(count * 3), { radius })
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    const boost = 1 + Math.min(Math.abs(scroll.velocity) * 0.15, 6);
    ref.current.rotation.x -= (delta / 10) * speed * boost;
    ref.current.rotation.y -= (delta / 15) * speed * boost;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const Parallax = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    easing.damp3(
      ref.current.position,
      [state.pointer.x * 0.04, state.pointer.y * 0.04, 0],
      0.6,
      delta
    );
    scroll.velocity = THREE.MathUtils.damp(scroll.velocity, 0, 4, delta);
  });

  return <group ref={ref}>{children}</group>;
};

const StarsCanvas = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    scroll.last = window.scrollY;
    const onScroll = () => {
      scroll.velocity = window.scrollY - scroll.last;
      scroll.last = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="w-full h-auto fixed inset-0 z-[20] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        frameloop={reducedMotion ? "demand" : "always"}
        // Canvas không nhận sự kiện (pointer-events-none) nên lấy vị trí chuột từ body
        eventSource={bodyRef}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <group rotation={[0, 0, Math.PI / 4]}>
            <Parallax>
              <StarLayer count={2500} radius={1.2} size={0.002} color="#ffffff" speed={1} />
              <StarLayer count={600} radius={1.2} size={0.003} color="#b49bff" speed={0.7} />
              <StarLayer count={400} radius={1.2} size={0.003} color="#7dd3fc" speed={1.3} />
            </Parallax>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
