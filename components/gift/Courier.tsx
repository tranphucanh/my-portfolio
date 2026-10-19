"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import ChibiBody, { type ChibiRig } from "./ChibiBody";

/* Vị trí đặt hộp trên tay nhân vật – GiftBox đọc mỗi frame */
export type Carry = {
  active: boolean;
  pos: THREE.Vector3;
  rotY: number;
  scale: number;
};

export type SceneLayout = {
  portrait: boolean;
  ground: number;
  spread: number;
  boxScale: number;
  openScale: number;
  charScale: number;
  offerZ: number;
};

type Phase = "hidden" | "toBox" | "pickup" | "toFront" | "offer" | "aside" | "cheer";

/* Xoay góc theo đường ngắn nhất */
const lerpAngle = (a: number, b: number, t: number) => {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};

export default function Courier({
  selected,
  opened,
  instant,
  layout,
  carry,
  onDelivered,
  onOpenRequest,
}: {
  selected: number | null;
  opened: boolean;
  instant: boolean;
  layout: SceneLayout;
  carry: React.MutableRefObject<Carry>;
  onDelivered: () => void;
  onOpenRequest: () => void;
}) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const hand = useRef<THREE.Group>(null);
  const eyesOpen = useRef<THREE.Group>(null);
  const eyesHappy = useRef<THREE.Group>(null);
  const rig: ChibiRig = { torso, head, legL, legR, armL, armR, hand, eyesOpen, eyesHappy };

  const phase = useRef<Phase>("hidden");
  const phaseStart = useRef(0);
  const heading = useRef(0);
  const [bubble, setBubble] = useState(false);

  const sign = selected === 0 ? -1 : 1;
  const cs = layout.charScale;

  // Các điểm đến trong kịch bản
  const spots = useMemo(() => {
    const boxX = sign * layout.spread;
    return {
      start: new THREE.Vector3(sign * (layout.portrait ? 3.2 : 7), layout.ground, 0.3),
      pickup: new THREE.Vector3(
        boxX + sign * (0.65 * layout.boxScale + 0.38 * cs),
        layout.ground,
        0,
      ),
      front: new THREE.Vector3(0, layout.ground, layout.offerZ),
      aside: new THREE.Vector3(
        sign * (layout.portrait ? 0.8 : 1.9),
        layout.ground,
        layout.offerZ * 0.6,
      ),
    };
  }, [sign, layout, cs]);

  /* Khởi động kịch bản khi chọn hộp */
  useEffect(() => {
    const g = root.current;
    if (!g || selected == null) return;
    if (instant && opened) {
      g.position.copy(spots.aside);
      heading.current = 0;
      phase.current = "cheer";
      return;
    }
    if (phase.current === "hidden") {
      g.position.copy(spots.start);
      heading.current = -sign * Math.PI / 2;
      phase.current = "toBox";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  /* Bấm nhân vật → đặt hộp xuống, bước sang bên */
  useEffect(() => {
    if (!opened || phase.current === "cheer") return;
    phase.current = "aside";
    carry.current.active = false;
    setBubble(false);
  }, [opened, carry]);

  useFrame((s, delta) => {
    const g = root.current;
    if (!g) return;
    g.visible = phase.current !== "hidden";
    if (!g.visible) return;

    const t = s.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 30);
    const speed = 3.2 * cs;

    const moveTo = (target: THREE.Vector3) => {
      const d = target.clone().sub(g.position);
      d.y = 0;
      const dist = d.length();
      if (dist < 0.03) return true;
      g.position.addScaledVector(d.normalize(), Math.min(dist, speed * dt));
      heading.current = lerpAngle(heading.current, Math.atan2(d.x, d.z), Math.min(1, dt * 10));
      return false;
    };
    const faceTo = (angle: number) => {
      heading.current = lerpAngle(heading.current, angle, Math.min(1, dt * 6));
    };
    const enter = (p: Phase) => {
      phase.current = p;
      phaseStart.current = t;
    };

    let pose: "run" | "carryRun" | "pickup" | "offer" | "cheer" = "run";

    switch (phase.current) {
      case "toBox":
        if (moveTo(spots.pickup)) enter("pickup");
        pose = "run";
        break;
      case "pickup": {
        const e = t - phaseStart.current;
        faceTo(-sign * Math.PI / 2);
        if (e > 0.3) carry.current.active = true;
        if (e > 0.8) enter("toFront");
        pose = "pickup";
        break;
      }
      case "toFront":
        if (moveTo(spots.front)) {
          enter("offer");
          setBubble(true);
          onDelivered();
        }
        pose = "carryRun";
        break;
      case "offer":
        faceTo(0);
        pose = "offer";
        break;
      case "aside":
        if (moveTo(spots.aside)) enter("cheer");
        pose = "run";
        break;
      case "cheer":
        faceTo(-sign * 0.35);
        pose = "cheer";
        break;
    }

    g.rotation.y = heading.current;
    g.scale.setScalar(cs);

    /* Tư thế */
    const L = legL.current!;
    const R = legR.current!;
    const AL = armL.current!;
    const AR = armR.current!;
    const body = torso.current!;
    const hd = head.current!;
    const run = pose === "run" || pose === "carryRun";
    const cyc = t * 13;

    L.rotation.x = run ? Math.sin(cyc) * 0.8 : 0;
    R.rotation.x = run ? -Math.sin(cyc) * 0.8 : 0;
    body.position.y = run ? Math.abs(Math.sin(cyc)) * 0.07 : pose === "cheer" ? Math.abs(Math.sin(t * 6)) * 0.28 : Math.sin(t * 2.5) * 0.015;
    body.rotation.x = run ? 0.12 : pose === "pickup" ? 0.35 : 0;
    hd.rotation.z = pose === "offer" ? Math.sin(t * 2) * 0.12 : 0;
    hd.rotation.x = pose === "pickup" ? 0.25 : 0;

    if (pose === "run") {
      AL.rotation.set(-Math.sin(cyc) * 0.9, 0, -0.12);
      AR.rotation.set(Math.sin(cyc) * 0.9, 0, 0.12);
    } else if (pose === "cheer") {
      AL.rotation.set(0, 0, -2.5 - Math.sin(t * 9) * 0.35);
      AR.rotation.set(0, 0, 2.5 + Math.sin(t * 9 + 1) * 0.35);
      L.rotation.x = Math.sin(t * 6) * 0.15;
      R.rotation.x = -Math.sin(t * 6) * 0.15;
    } else {
      // ôm hộp phía trước
      const reach = pose === "offer" ? -1.35 + Math.sin(t * 2.5) * 0.05 : -1.15;
      AL.rotation.set(reach, 0, 0.32);
      AR.rotation.set(reach, 0, -0.32);
    }

    /* Biểu cảm: chớp mắt, mắt cười khi ăn mừng */
    const happy = pose === "cheer";
    if (eyesOpen.current && eyesHappy.current) {
      eyesOpen.current.visible = !happy;
      eyesHappy.current.visible = happy;
      const blink = t % 3.6 < 0.12;
      eyesOpen.current.scale.y = blink ? 0.1 : 1;
    }

    /* Cập nhật điểm cầm hộp */
    if (hand.current) {
      hand.current.getWorldPosition(carry.current.pos);
      carry.current.rotY = heading.current;
      carry.current.scale = cs * 0.42;
    }
  });

  const clickable = (fn: () => void) => ({
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (phase.current === "offer") fn();
    },
    onPointerOver: () => {
      if (phase.current === "offer") document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "auto";
    },
  });

  return (
    <group ref={root} visible={false} {...clickable(onOpenRequest)}>
      <ChibiBody rig={rig} />

      {bubble && (
        <Html center position={[0, 2.25, 0]} style={{ pointerEvents: "none" }}>
          <div className="courier-bubble">Chạm vào mình nhé 💝</div>
        </Html>
      )}
    </group>
  );
}
