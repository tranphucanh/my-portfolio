"use client";

import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  // Góc nghiêng tối đa (độ)
  max?: number;
  glare?: boolean;
}

const spring = { stiffness: 150, damping: 15, mass: 0.4 };

const Tilt3D = ({ children, className, max = 12, glare = true }: Props) => {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(180,155,255,0.25), transparent 60%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        <div className="h-full" style={{ transform: "translateZ(40px)" }}>
          {children}
        </div>
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Tilt3D;
