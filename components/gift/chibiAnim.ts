"use client";

import { useRef } from "react";
import * as THREE from "three";
import type { ChibiRig } from "./ChibiBody";

export type Pose =
  | "idle"
  | "walkHold"
  | "hold"
  | "offer"
  | "cheeks"
  | "receive"
  | "cheer"
  | "wave"
  | "balloon"
  | "cup";

export function useRig(): ChibiRig {
  return {
    torso: useRef<THREE.Group>(null),
    head: useRef<THREE.Group>(null),
    legL: useRef<THREE.Group>(null),
    legR: useRef<THREE.Group>(null),
    armL: useRef<THREE.Group>(null),
    armR: useRef<THREE.Group>(null),
    hand: useRef<THREE.Group>(null),
    eyesOpen: useRef<THREE.Group>(null),
    eyesHappy: useRef<THREE.Group>(null),
  };
}

/* Áp tư thế lên khung xương, nội suy mượt giữa các tư thế */
export function applyPose(rig: ChibiRig, pose: Pose, t: number, dt: number, seed: number) {
  const k = Math.min(1, dt * 10);
  const L = rig.legL.current;
  const R = rig.legR.current;
  const AL = rig.armL.current;
  const AR = rig.armR.current;
  const body = rig.torso.current;
  const head = rig.head.current;
  if (!L || !R || !AL || !AR || !body || !head) return;

  const walking = pose === "walkHold";
  const cyc = t * 9;
  const lerp = (a: number, b: number) => a + (b - a) * k;

  L.rotation.x = lerp(L.rotation.x, walking ? Math.sin(cyc) * 0.6 : 0);
  R.rotation.x = lerp(R.rotation.x, walking ? -Math.sin(cyc) * 0.6 : 0);

  const bob = walking
    ? Math.abs(Math.sin(cyc)) * 0.05
    : pose === "cheer"
      ? Math.abs(Math.sin(t * 6)) * 0.16
      : Math.sin(t * 2.2 + seed) * 0.012;
  body.position.y = lerp(body.position.y, bob);
  body.rotation.x = lerp(body.rotation.x, pose === "offer" ? 0.28 : walking ? 0.06 : 0);

  head.rotation.z = lerp(
    head.rotation.z,
    pose === "cheeks" || pose === "hold" ? Math.sin(t * 3 + seed) * 0.14 : Math.sin(t * 1.3 + seed) * 0.04,
  );
  head.rotation.x = lerp(head.rotation.x, pose === "offer" ? 0.15 : 0);

  const arms: Record<Pose, [number, number, number, number, number, number]> = {
    idle: [0, 0, -0.12, 0, 0, 0.12],
    walkHold: [-1.0, 0, 0.38, -1.0, 0, -0.38],
    hold: [-1.05, 0, 0.42, -1.05, 0, -0.42],
    offer: [-1.5, 0, 0.3, -1.5, 0, -0.3],
    receive: [-1.35, 0, 0.32, -1.35, 0, -0.32],
    cheeks: [-2.6, 0, 0.55, -2.6, 0, -0.55],
    cheer: [0, 0, -2.4 - Math.sin(t * 8) * 0.3, 0, 0, 2.4 + Math.sin(t * 8 + 1) * 0.3],
    wave: [0, 0, -0.12, 0, 0, 2.3 + Math.sin(t * 7 + seed) * 0.45],
    balloon: [0, 0, -0.12, 0, 0, 2.7],
    cup: [0, 0, -0.12, -1.2, 0, -0.3],
  };
  const a = arms[pose];
  AL.rotation.set(lerp(AL.rotation.x, a[0]), 0, lerp(AL.rotation.z, a[2]));
  AR.rotation.set(lerp(AR.rotation.x, a[3]), 0, lerp(AR.rotation.z, a[5]));

  if (rig.eyesOpen.current && rig.eyesHappy.current) {
    const happy = pose === "cheeks" || pose === "hold" || pose === "cheer" || pose === "wave";
    rig.eyesOpen.current.visible = !happy;
    rig.eyesHappy.current.visible = happy;
    rig.eyesOpen.current.scale.y = (t + seed) % 3.4 < 0.12 ? 0.1 : 1;
  }
}
