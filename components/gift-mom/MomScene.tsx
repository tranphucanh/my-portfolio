"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import ChibiBody, { type ChibiLook, type ChibiRig } from "@/components/gift/ChibiBody";

/* ─── Ngoại hình ─── */
const SON: ChibiLook = {
  outfit: "suit",
  hair: "neat",
  colors: {
    hair: "#2b1a12",
    hoodie: "#2c3e66",
    hoodieTrim: "#ffffff",
    pants: "#1f2a44",
    shoe: "#4a2e22",
    sole: "#2a1a14",
    accent: "#d62839",
  },
};

const MOM: ChibiLook = {
  outfit: "aodai",
  hair: "bun",
  colors: {
    hair: "#24140e",
    hoodie: "#d1345b",
    hoodieTrim: "#fff4e0",
    pants: "#ffffff",
    shoe: "#f2c14e",
    sole: "#c08a1e",
    accent: "#ff8fab",
  },
};

const MOM_X = 0.75;
const MOM_ROT = -0.55;
const SON_START = -3.4;
const SON_STOP = -0.55;
const SON_ROT = 0.55;

type Phase = "walk" | "turn" | "offer" | "give" | "happy";
type Pose = "idle" | "walkHold" | "hold" | "offer" | "cheeks" | "receive" | "cheer";

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function useRig(): ChibiRig {
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
function applyPose(rig: ChibiRig, pose: Pose, t: number, dt: number, seed: number) {
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
  };
  const a = arms[pose];
  AL.rotation.set(lerp(AL.rotation.x, a[0]), 0, lerp(AL.rotation.z, a[2]));
  AR.rotation.set(lerp(AR.rotation.x, a[3]), 0, lerp(AR.rotation.z, a[5]));

  if (rig.eyesOpen.current && rig.eyesHappy.current) {
    const happy = pose === "cheeks" || pose === "hold" || pose === "cheer";
    rig.eyesOpen.current.visible = !happy;
    rig.eyesHappy.current.visible = happy;
    rig.eyesOpen.current.scale.y = (t + seed) % 3.4 < 0.12 ? 0.1 : 1;
  }
}

/* ─── Bó hoa 3D ─── */
function Bouquet3D() {
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

/* ─── Tim bay lên ─── */
const HEART_COUNT = 10;
function FloatingHearts({ active, origin }: { active: React.MutableRefObject<number | null>; origin: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(-0.15, -0.3, -0.5, -0.1, -0.5, 0.2);
    s.bezierCurveTo(-0.5, 0.45, -0.25, 0.55, 0, 0.3);
    s.bezierCurveTo(0.25, 0.55, 0.5, 0.45, 0.5, 0.2);
    s.bezierCurveTo(0.5, -0.1, 0.15, -0.3, 0, -0.5);
    return new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3 });
  }, []);
  const colors = ["#ff4d6d", "#ff8fab", "#ffb3c6", "#e05780"];

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const start = active.current;
    g.visible = start != null;
    if (start == null) return;
    const e = clock.elapsedTime - start;
    g.children.forEach((child, i) => {
      const p = (e * 0.32 + i / HEART_COUNT) % 1;
      const m = child as THREE.Mesh;
      m.position.set(
        origin[0] + Math.sin(i * 2.3 + p * 6) * 0.35,
        origin[1] + p * 1.4,
        origin[2] + Math.cos(i * 1.7) * 0.2,
      );
      m.scale.setScalar(0.07 * (0.6 + p * 0.6));
      m.rotation.y = Math.sin(e * 2 + i) * 0.5;
      (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI);
    });
  });

  return (
    <group ref={group} visible={false}>
      {Array.from({ length: HEART_COUNT }, (_, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial color={colors[i % colors.length]} transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Đạo diễn cảnh ─── */
function Story({ replay }: { replay: number }) {
  const sonRig = useRig();
  const momRig = useRig();
  const son = useRef<THREE.Group>(null);
  const mom = useRef<THREE.Group>(null);
  const sonAnchor = useRef<THREE.Group>(null);
  const momAnchor = useRef<THREE.Group>(null);
  const bouquet = useRef<THREE.Group>(null);

  const phase = useRef<Phase>("walk");
  const phaseStart = useRef(0);
  const heartsStart = useRef<number | null>(null);
  const lastReplay = useRef(-1);
  const [bubble, setBubble] = useState<"son" | "mom" | null>(null);

  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 1 / 30);
    const S = son.current;
    const M = mom.current;
    if (!S || !M || !bouquet.current || !sonAnchor.current || !momAnchor.current) return;

    // bắt đầu / phát lại
    if (lastReplay.current !== replay) {
      lastReplay.current = replay;
      phase.current = "walk";
      phaseStart.current = t;
      heartsStart.current = null;
      S.position.set(SON_START, 0, 0.15);
      S.rotation.y = Math.PI / 2;
      setBubble(null);
    }

    const e = t - phaseStart.current;
    const go = (p: Phase) => {
      phase.current = p;
      phaseStart.current = t;
    };

    let sonPose: Pose = "hold";
    let momPose: Pose = "idle";
    let give = 0; // 0: hoa ở tay con → 1: hoa ở tay mẹ

    switch (phase.current) {
      case "walk": {
        S.position.x = Math.min(SON_STOP, S.position.x + dt * 1.25);
        sonPose = "walkHold";
        if (S.position.x >= SON_STOP) go("turn");
        break;
      }
      case "turn":
        S.rotation.y += (SON_ROT - S.rotation.y) * Math.min(1, dt * 8);
        if (e > 0.45) {
          go("offer");
          setBubble("son");
        }
        break;
      case "offer":
        sonPose = "offer";
        momPose = e > 0.5 ? "cheeks" : "idle";
        if (e > 2.2) go("give");
        break;
      case "give":
        sonPose = "offer";
        momPose = "receive";
        give = easeInOut(clamp01(e / 0.9));
        if (e > 1) {
          go("happy");
          heartsStart.current = t;
          setBubble("mom");
        }
        break;
      case "happy":
        sonPose = e > 0.4 ? "cheer" : "idle";
        momPose = "hold";
        give = 1;
        break;
    }

    // mẹ hơi xoay theo con khi con đi tới
    const momLook = phase.current === "walk" ? MOM_ROT - 0.25 : MOM_ROT;
    M.rotation.y += (momLook - M.rotation.y) * Math.min(1, dt * 3);
    M.position.y = phase.current === "happy" ? Math.abs(Math.sin(t * 2.5)) * 0.03 : 0;

    applyPose(sonRig, sonPose, t, dt, 0);
    applyPose(momRig, momPose, t, dt, 1.7);

    // vị trí cầm hoa theo tư thế
    sonAnchor.current.position.set(0, sonPose === "offer" ? 0.68 : 0.6, sonPose === "offer" ? 0.58 : 0.42);
    momAnchor.current.position.set(0, momPose === "receive" ? 0.66 : 0.6, momPose === "receive" ? 0.5 : 0.4);
    sonAnchor.current.getWorldPosition(tmpA);
    momAnchor.current.getWorldPosition(tmpB);
    bouquet.current.position.lerpVectors(tmpA, tmpB, give);
    bouquet.current.rotation.y = THREE.MathUtils.lerp(S.rotation.y, M.rotation.y, give);
    bouquet.current.rotation.x = sonPose === "offer" && give < 1 ? 0.35 : 0.12;
    bouquet.current.rotation.z = give === 1 ? Math.sin(t * 2) * 0.08 : 0;
  });

  return (
    <>
      <group ref={son} position={[SON_START, 0, 0.15]} rotation={[0, Math.PI / 2, 0]}>
        <ChibiBody rig={sonRig} look={SON} />
        <group ref={sonAnchor} />
        {bubble === "son" && (
          <Html center position={[0.1, 2.0, 0]} style={{ pointerEvents: "none" }}>
            <div className="mom-bubble">Con tặng mẹ ạ 💐</div>
          </Html>
        )}
      </group>

      <group ref={mom} position={[MOM_X, 0, 0]} rotation={[0, MOM_ROT, 0]} scale={1.06}>
        <ChibiBody rig={momRig} look={MOM} />
        <group ref={momAnchor} />
        {bubble === "mom" && (
          <Html center position={[-0.25, 2.1, 0]} style={{ pointerEvents: "none" }}>
            <div className="mom-bubble">Mẹ cảm ơn con, thương con lắm! 🥰</div>
          </Html>
        )}
      </group>

      <group ref={bouquet}>
        <Bouquet3D />
      </group>

      <FloatingHearts active={heartsStart} origin={[MOM_X, 1.7, 0.1]} />
    </>
  );
}

/* Sàn tròn mềm */
function Floor() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.6, "rgba(255,228,236,0.7)");
    g.addColorStop(1, "rgba(255,228,236,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} scale={[5.5, 3.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

/* Màn hình hẹp → lùi camera để đủ chỗ cho 2 nhân vật */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const narrow = size.width / size.height < 1.2;
    camera.position.set(0, narrow ? 1.5 : 1.35, narrow ? 6.6 : 5.4);
    camera.lookAt(0, 0.85, 0);
  }, [camera, size]);
  return null;
}

export default function MomScene() {
  const [replay, setReplay] = useState(0);
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.35, 5.4], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0.85, 0)}
      onClick={() => setReplay((r) => r + 1)}
      style={{ cursor: "pointer" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#ffd1dc" />
      <ResponsiveCamera />
      <Floor />
      <Story replay={replay} />
      <Sparkles count={40} scale={[6, 3, 3]} position={[0, 1.4, 0]} size={3} speed={0.3} color="#ffb3c6" />
    </Canvas>
  );
}
