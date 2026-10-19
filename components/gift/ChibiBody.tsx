"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

/* Các khớp để Courier điều khiển animation */
export type ChibiRig = {
  torso: React.RefObject<THREE.Group>;
  head: React.RefObject<THREE.Group>;
  legL: React.RefObject<THREE.Group>;
  legR: React.RefObject<THREE.Group>;
  armL: React.RefObject<THREE.Group>;
  armR: React.RefObject<THREE.Group>;
  hand: React.RefObject<THREE.Group>;
  eyesOpen: React.RefObject<THREE.Group>;
  eyesHappy: React.RefObject<THREE.Group>;
};

const DEFAULT_COLORS = {
  skin: "#ffd8c2",
  skinShade: "#f5b9a3",
  hair: "#4a2a1d",
  hoodie: "#ff6b9a", // màu áo chính (hoodie / vest / áo dài)
  hoodieTrim: "#fff1f6", // cổ, viền tay, sơ mi
  accent: "#d62839", // nơ cổ, hoa cài tóc
  gold: "#e9b949",
  pants: "#3b4a7a",
  shoe: "#ffffff",
  sole: "#ff4d8d",
  eye: "#2a1320",
  iris: "#8a4a36",
  mouth: "#8c1d3a",
  tongue: "#ff8fa3",
  outline: "#3a1626",
};

export type ChibiColors = typeof DEFAULT_COLORS;

export type ChibiLook = {
  outfit?: "hoodie" | "suit" | "aodai";
  hair?: "short" | "neat" | "bun" | "long";
  colors?: Partial<ChibiColors>;
};

const HEAD_R = 0.44;

/* Toon shading 3 bậc */
function useToonMaterials(colors: Partial<ChibiColors> = {}) {
  const key = JSON.stringify(colors);
  return useMemo(() => {
    const COLORS = { ...DEFAULT_COLORS, ...(JSON.parse(key) as Partial<ChibiColors>) };
    const grad = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
    grad.minFilter = THREE.NearestFilter;
    grad.magFilter = THREE.NearestFilter;
    grad.needsUpdate = true;
    const toon = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: grad });
    const flat = (color: string) => new THREE.MeshBasicMaterial({ color });

    const blushCanvas = document.createElement("canvas");
    blushCanvas.width = blushCanvas.height = 64;
    const ctx = blushCanvas.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,120,150,0.85)");
    g.addColorStop(1, "rgba(255,120,150,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const blushTex = new THREE.CanvasTexture(blushCanvas);
    blushTex.colorSpace = THREE.SRGBColorSpace;

    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 64;
    const sctx = shadowCanvas.getContext("2d")!;
    const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, "rgba(20,0,15,0.55)");
    sg.addColorStop(1, "rgba(20,0,15,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 64, 64);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    return {
      skin: toon(COLORS.skin),
      skinShade: toon(COLORS.skinShade),
      hair: toon(COLORS.hair),
      hoodie: toon(COLORS.hoodie),
      trim: toon(COLORS.hoodieTrim),
      accent: toon(COLORS.accent),
      gold: toon(COLORS.gold),
      pants: toon(COLORS.pants),
      shoe: toon(COLORS.shoe),
      sole: toon(COLORS.sole),
      eye: flat(COLORS.eye),
      iris: flat(COLORS.iris),
      white: flat("#ffffff"),
      mouth: flat(COLORS.mouth),
      tongue: flat(COLORS.tongue),
      outline: new THREE.MeshBasicMaterial({ color: COLORS.outline, side: THREE.BackSide }),
      blush: new THREE.MeshBasicMaterial({ map: blushTex, transparent: true, depthWrite: false }),
      shadow: new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    };
  }, [key]);
}

function useGeometries() {
  return useMemo(() => {
    const heart = new THREE.Shape();
    heart.moveTo(0, -0.5);
    heart.bezierCurveTo(-0.15, -0.3, -0.5, -0.1, -0.5, 0.2);
    heart.bezierCurveTo(-0.5, 0.45, -0.25, 0.55, 0, 0.3);
    heart.bezierCurveTo(0.25, 0.55, 0.5, 0.45, 0.5, 0.2);
    heart.bezierCurveTo(0.5, -0.1, 0.15, -0.3, 0, -0.5);

    return {
      sphere: new THREE.SphereGeometry(1, 40, 32),
      hairCap: new THREE.SphereGeometry(HEAD_R + 0.035, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.56),
      // thân áo dáng chuông
      hoodie: new THREE.LatheGeometry(
        [
          [0, 0],
          [0.27, 0],
          [0.3, 0.04],
          [0.29, 0.2],
          [0.24, 0.38],
          [0.15, 0.5],
          [0, 0.52],
        ].map(([x, y]) => new THREE.Vector2(x, y)),
        40,
      ),
      // áo dài: thân dài xoè tới gần mặt đất
      dress: new THREE.LatheGeometry(
        [
          [0, 0],
          [0.37, 0],
          [0.38, 0.03],
          [0.32, 0.3],
          [0.27, 0.55],
          [0.25, 0.68],
          [0.22, 0.78],
          [0.14, 0.84],
          [0, 0.85],
        ].map(([x, y]) => new THREE.Vector2(x, y)),
        40,
      ),
      vNeck: new THREE.ShapeGeometry(
        new THREE.Shape([new THREE.Vector2(-0.1, 0.12), new THREE.Vector2(0.1, 0.12), new THREE.Vector2(0, -0.14)]),
      ),
      lapel: new THREE.ShapeGeometry(
        new THREE.Shape([new THREE.Vector2(0, 0.13), new THREE.Vector2(0.07, 0.1), new THREE.Vector2(0.02, -0.16)]),
      ),
      sleeve: new THREE.CapsuleGeometry(0.08, 0.16, 8, 16),
      leg: new THREE.CapsuleGeometry(0.085, 0.14, 8, 16),
      collar: new THREE.TorusGeometry(0.14, 0.04, 12, 32),
      heart: new THREE.ShapeGeometry(heart, 16),
      smile: new THREE.CircleGeometry(0.05, 24, Math.PI, Math.PI),
      happyEye: new THREE.TorusGeometry(0.05, 0.014, 8, 20, Math.PI),
      brow: new THREE.CapsuleGeometry(0.012, 0.06, 4, 8),
      curl: new THREE.TorusGeometry(0.075, 0.024, 10, 24, Math.PI * 1.3),
      plane: new THREE.PlaneGeometry(1, 1),
    };
  }, []);
}

/* Mesh + viền đen (inverted hull) */
function Outlined({
  geometry,
  material,
  outline,
  width = 0.035,
  ...props
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  outline: THREE.Material;
  width?: number;
} & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh geometry={geometry} material={material} castShadow />
      <mesh geometry={geometry} material={outline} scale={1 + width} />
    </group>
  );
}

/* Đặt chi tiết dán lên mặt cầu của đầu, quay theo pháp tuyến */
function onFace(x: number, y: number, lift = 0) {
  const r = HEAD_R + lift;
  const z = Math.sqrt(Math.max(0, r * r - x * x - y * y));
  const n = new THREE.Vector3(x, y, z).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  return {
    position: [x, y, z] as [number, number, number],
    quaternion: q,
  };
}

export default function ChibiBody({ rig, look = {} }: { rig: ChibiRig; look?: ChibiLook }) {
  const { outfit = "hoodie", hair = "short" } = look;
  const m = useToonMaterials(look.colors);
  const g = useGeometries();

  return (
    <>
      {/* bóng dưới chân */}
      <mesh geometry={g.plane} material={m.shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} scale={[0.9, 0.7, 1]} />

      <group ref={rig.torso}>
        {/* Chân */}
        {([
          [rig.legL, -0.12],
          [rig.legR, 0.12],
        ] as const).map(([ref, x], i) => (
          <group key={i} ref={ref} position={[x, 0.42, 0]}>
            <Outlined geometry={g.leg} material={m.pants} outline={m.outline} position={[0, -0.15, 0]} />
            <group position={[0, -0.33, 0.05]}>
              <Outlined geometry={g.sphere} material={m.shoe} outline={m.outline} scale={[0.12, 0.08, 0.16]} width={0.25} />
              <mesh geometry={g.sphere} material={m.sole} position={[0, -0.035, 0]} scale={[0.122, 0.04, 0.162]} />
            </group>
          </group>
        ))}

        {outfit === "hoodie" && (
          <>
            {/* Áo hoodie */}
            <Outlined geometry={g.hoodie} material={m.hoodie} outline={m.outline} position={[0, 0.34, 0]} width={0.06} />
            <mesh geometry={g.collar} material={m.trim} position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]} />
            {/* tim in trên ngực */}
            <mesh geometry={g.heart} material={m.trim} position={[0, 0.6, 0.29]} rotation={[-0.3, 0, 0]} scale={0.17} />
          </>
        )}

        {outfit === "suit" && (
          <>
            {/* Vest: sơ mi cổ V, ve áo, nơ cổ, cúc, khăn cài túi */}
            <Outlined geometry={g.hoodie} material={m.hoodie} outline={m.outline} position={[0, 0.34, 0]} width={0.06} />
            <group position={[0, 0.7, 0.236]} rotation={[-0.42, 0, 0]}>
              <mesh geometry={g.vNeck} material={m.trim} position={[0, 0, 0.004]} />
              <mesh geometry={g.lapel} material={m.pants} position={[0.03, 0, 0.008]} />
              <mesh geometry={g.lapel} material={m.pants} position={[-0.03, 0, 0.008]} scale={[-1, 1, 1]} />
            </group>
            <group position={[0, 0.79, 0.19]} rotation={[-0.5, 0, 0]}>
              {[-1, 1].map((sx) => (
                <mesh key={sx} geometry={g.sphere} material={m.accent} position={[sx * 0.045, 0, 0]} rotation={[0, 0, sx * 0.3]} scale={[0.05, 0.034, 0.025]} />
              ))}
              <mesh geometry={g.sphere} material={m.accent} scale={0.022} position={[0, 0, 0.012]} />
            </group>
            {[0.5, 0.41].map((y) => (
              <mesh key={y} geometry={g.sphere} material={m.gold} position={[0, y, 0.285 + (0.5 - y) * 0.12]} scale={0.018} />
            ))}
            <mesh geometry={g.vNeck} material={m.trim} position={[-0.15, 0.62, 0.255]} rotation={[-0.3, -0.45, Math.PI]} scale={0.32} />
          </>
        )}

        {outfit === "aodai" && (
          <>
            {/* Áo dài: thân dài, cổ cao viền vàng, hoa văn */}
            <Outlined geometry={g.dress} material={m.hoodie} outline={m.outline} position={[0, 0.02, 0]} width={0.05} />
            <mesh geometry={g.collar} material={m.gold} position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.85, 0.85, 1.6]} />
            {[
              [0.08, 0.66, 0.24],
              [-0.12, 0.5, 0.27],
              [0.14, 0.34, 0.31],
              [-0.06, 0.22, 0.33],
            ].map(([x, y, z], i) => (
              <group key={i} position={[x, y, z]}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <mesh
                    key={k}
                    geometry={g.sphere}
                    material={m.gold}
                    position={[Math.cos((k / 5) * Math.PI * 2) * 0.022, Math.sin((k / 5) * Math.PI * 2) * 0.022, 0]}
                    scale={0.016}
                  />
                ))}
                <mesh geometry={g.sphere} material={m.trim} scale={0.012} />
              </group>
            ))}
          </>
        )}

        {/* Tay */}
        {([
          [rig.armL, -0.25],
          [rig.armR, 0.25],
        ] as const).map(([ref, x], i) => (
          <group key={i} ref={ref} position={[x, 0.78, 0]}>
            <Outlined geometry={g.sleeve} material={m.hoodie} outline={m.outline} position={[0, -0.13, 0]} />
            {outfit !== "aodai" && (
              <mesh geometry={g.sphere} material={m.trim} position={[0, -0.26, 0]} scale={[0.088, 0.035, 0.088]} />
            )}
            <Outlined geometry={g.sphere} material={m.skin} outline={m.outline} position={[0, -0.32, 0]} scale={0.075} width={0.25} />
          </group>
        ))}

        {/* Điểm đặt đáy hộp khi ôm */}
        <group ref={rig.hand} position={[0, 0.36, 0.42]} />

        {/* Đầu */}
        <group ref={rig.head} position={[0, 1.27, 0]}>
          <Outlined geometry={g.sphere} material={m.skin} outline={m.outline} scale={[HEAD_R, HEAD_R * 0.94, HEAD_R * 0.96]} width={0.06} />
          {[-1, 1].map((sx) => (
            <Outlined key={`ear${sx}`} geometry={g.sphere} material={m.skin} outline={m.outline} position={[sx * 0.42, -0.04, -0.02]} scale={[0.06, 0.08, 0.05]} width={0.3} />
          ))}

          {/* Tóc */}
          <group rotation={[-0.62, 0, 0]} position={[0, 0.02, -0.03]}>
            <Outlined geometry={g.hairCap} material={m.hair} outline={m.outline} width={0.05} />
          </group>
          {hair === "short" && (
            <>
          {[-0.95, -0.5, -0.05, 0.4, 0.85].map((a, i) => (
            <Outlined
              key={`bang${i}`}
              geometry={g.sphere}
              material={m.hair}
              outline={m.outline}
              position={[Math.sin(a) * 0.34, 0.2 - Math.abs(a) * 0.05, Math.cos(a) * 0.34]}
              rotation={[0.35, a * 0.9, -a * 0.45 + (i % 2 ? 0.2 : -0.15)]}
              scale={[0.13, 0.2, 0.09]}
              width={0.18}
            />
          ))}
          {[-1, 1].map((sx) => (
            <Outlined
              key={`side${sx}`}
              geometry={g.sphere}
              material={m.hair}
              outline={m.outline}
              position={[sx * 0.4, 0.06, 0.08]}
              rotation={[0.2, 0, sx * 0.15]}
              scale={[0.08, 0.2, 0.11]}
              width={0.15}
            />
          ))}
          <mesh geometry={g.curl} material={m.hair} position={[0.02, 0.49, -0.03]} rotation={[0, 0.3, 0.9]} />

            </>
          )}

          {hair === "neat" && (
            <>
              {/* tóc chải lệch gọn gàng */}
              {[-0.8, -0.35, 0.1, 0.55].map((a, i) => (
                <Outlined
                  key={`neat${i}`}
                  geometry={g.sphere}
                  material={m.hair}
                  outline={m.outline}
                  position={[Math.sin(a) * 0.33, 0.27 - i * 0.012, Math.cos(a) * 0.3]}
                  rotation={[0.25, a * 0.8, 1.15]}
                  scale={[0.1, 0.21, 0.09]}
                  width={0.16}
                />
              ))}
              {[-1, 1].map((sx) => (
                <Outlined
                  key={`nside${sx}`}
                  geometry={g.sphere}
                  material={m.hair}
                  outline={m.outline}
                  position={[sx * 0.405, 0.08, 0.02]}
                  scale={[0.07, 0.15, 0.12]}
                  width={0.15}
                />
              ))}
            </>
          )}

          {(hair === "bun" || hair === "long") && (
            <>
              {/* mái rẽ ngôi giữa + tóc dài hai bên (+ búi tóc) + hoa cài */}
              {[-1, 1].map((sx) => (
                <React.Fragment key={`bun${sx}`}>
                  <Outlined
                    geometry={g.sphere}
                    material={m.hair}
                    outline={m.outline}
                    position={[sx * 0.2, 0.25, 0.27]}
                    rotation={[0.5, sx * 0.5, sx * 0.9]}
                    scale={[0.12, 0.24, 0.09]}
                    width={0.14}
                  />
                  <Outlined
                    geometry={g.sphere}
                    material={m.hair}
                    outline={m.outline}
                    position={[sx * 0.4, -0.12, 0.02]}
                    rotation={[0.1, 0, sx * 0.08]}
                    scale={[0.1, 0.32, 0.15]}
                    width={0.12}
                  />
                </React.Fragment>
              ))}
              <Outlined geometry={g.sphere} material={m.hair} outline={m.outline} position={[0, -0.04, -0.17]} scale={[0.43, 0.42, 0.32]} width={0.04} />
              {hair === "bun" ? (
                <Outlined geometry={g.sphere} material={m.hair} outline={m.outline} position={[0, 0.3, -0.36]} scale={0.17} width={0.12} />
              ) : (
                /* tóc dài xõa phía sau */
                <Outlined geometry={g.sphere} material={m.hair} outline={m.outline} position={[0, -0.28, -0.2]} scale={[0.4, 0.42, 0.24]} width={0.05} />
              )}
              <group position={hair === "bun" ? [0.15, 0.36, -0.27] : [0.3, 0.3, 0.12]} rotation={[0, 0.6, 0]}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <mesh
                    key={k}
                    geometry={g.sphere}
                    material={m.accent}
                    position={[Math.cos((k / 5) * Math.PI * 2) * 0.045, Math.sin((k / 5) * Math.PI * 2) * 0.045, 0]}
                    scale={[0.04, 0.04, 0.02]}
                  />
                ))}
                <mesh geometry={g.sphere} material={m.gold} scale={0.025} position={[0, 0, 0.01]} />
              </group>
              {/* lông mi */}
              {[-1, 1].map((sx) => {
                const f = onFace(sx * 0.2, 0.02, 0.005);
                return (
                  <group key={`lash${sx}`} position={f.position} quaternion={f.quaternion}>
                    <mesh geometry={g.brow} material={m.eye} rotation={[0, 0, Math.PI / 2 - sx * 0.6]} scale={[1, 0.6, 1]} />
                  </group>
                );
              })}
            </>
          )}

          {/* Lông mày */}
          {[-1, 1].map((sx) => {
            const f = onFace(sx * 0.15, 0.1, 0.005);
            return (
              <group key={`brow${sx}`} position={f.position} quaternion={f.quaternion}>
                <mesh geometry={g.brow} material={m.eye} rotation={[0, 0, Math.PI / 2 + sx * 0.15]} />
              </group>
            );
          })}

          {/* Mắt mở (có chớp) */}
          <group ref={rig.eyesOpen}>
            {[-1, 1].map((sx) => {
              const f = onFace(sx * 0.15, -0.03, -0.02);
              return (
                <group key={`eye${sx}`} position={f.position} quaternion={f.quaternion}>
                  <mesh geometry={g.sphere} material={m.eye} scale={[0.058, 0.078, 0.03]} />
                  <mesh geometry={g.sphere} material={m.iris} position={[0, -0.025, 0.012]} scale={[0.042, 0.035, 0.022]} />
                  <mesh geometry={g.sphere} material={m.white} position={[sx * -0.016, 0.028, 0.026]} scale={0.02} />
                  <mesh geometry={g.sphere} material={m.white} position={[sx * 0.02, -0.03, 0.026]} scale={0.01} />
                </group>
              );
            })}
          </group>

          {/* Mắt cười ^^ khi ăn mừng */}
          <group ref={rig.eyesHappy} visible={false}>
            {[-1, 1].map((sx) => {
              const f = onFace(sx * 0.15, -0.03, 0.005);
              return (
                <group key={`happy${sx}`} position={f.position} quaternion={f.quaternion}>
                  <mesh geometry={g.happyEye} material={m.eye} />
                </group>
              );
            })}
          </group>

          {/* Má hồng */}
          {[-1, 1].map((sx) => {
            const f = onFace(sx * 0.25, -0.12, 0.004);
            return (
              <group key={`blush${sx}`} position={f.position} quaternion={f.quaternion}>
                <mesh geometry={g.plane} material={m.blush} scale={[0.15, 0.1, 1]} />
              </group>
            );
          })}

          {/* Mũi + miệng cười */}
          {(() => {
            const nose = onFace(0, -0.08, -0.005);
            const mouth = onFace(0, -0.155, 0.003);
            return (
              <>
                <mesh geometry={g.sphere} material={m.skinShade} position={nose.position} scale={0.016} />
                <group position={mouth.position} quaternion={mouth.quaternion}>
                  <mesh geometry={g.smile} material={m.mouth} />
                  <mesh geometry={g.smile} material={m.tongue} position={[0, -0.022, 0.001]} scale={0.5} />
                </group>
              </>
            );
          })()}
        </group>
      </group>
    </>
  );
}
