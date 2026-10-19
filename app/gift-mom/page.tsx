"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MOM_WISH, SIGNATURE } from "./wishes";
import "./gift-mom.css";

const MomScene = dynamic(() => import("@/components/gift-mom/MomScene"), {
  ssr: false,
});

/* ─── Random có seed để SSR/CSR khớp nhau ─── */
const seeded = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${seeded(i) * 100}%`,
  size: 10 + seeded(i + 40) * 12,
  delay: seeded(i + 80) * 12,
  duration: 11 + seeded(i + 120) * 8,
  sway: 30 + seeded(i + 160) * 50,
  color: ["#ffb3c6", "#ffd6a5", "#ffc8dd", "#fde2e4"][i % 4],
}));

const BOKEH = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${seeded(i + 300) * 100}%`,
  top: `${seeded(i + 340) * 100}%`,
  size: 60 + seeded(i + 380) * 140,
  delay: seeded(i + 420) * 6,
}));

/* Hoa & tim bay ra khi mở thư */
const BURST = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (seeded(i + 500) - 0.5) * 520,
  y: -120 - seeded(i + 540) * 260,
  r: (seeded(i + 580) - 0.5) * 540,
  emoji: ["🌷", "💗", "🌸", "✨", "💐", "🌼"][i % 6],
  delay: seeded(i + 620) * 0.25,
}));

/* ─── Phong bì 3D ─── */
function Envelope({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <motion.button
      className={`envelope ${open ? "is-open" : ""}`}
      onClick={onOpen}
      disabled={open}
      initial={{ y: 40, opacity: 0, rotate: -4 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 14, delay: 0.3 }}
      whileHover={open ? undefined : { scale: 1.04, rotate: -1.5 }}
      whileTap={open ? undefined : { scale: 0.97 }}
      aria-label="Mở thư gửi mẹ"
    >
      <span className="env-back" />
      <span className="env-letter">Gửi Mẹ yêu 💗</span>
      <span className="env-pocket" />
      <span className="env-flap">
        <span className="env-seal">♥</span>
      </span>
    </motion.button>
  );
}

/* ─── Hiệu ứng gõ chữ ─── */
function useTypewriter(text: string, speed = 28, delay = 0) {
  const [count, setCount] = useState(0);
  const chars = useMemo(() => Array.from(text), [text]);
  useEffect(() => {
    setCount(0);
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      id = setInterval(() => {
        setCount((c) => {
          if (c >= chars.length) {
            clearInterval(id);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [chars, speed, delay]);
  return { shown: chars.slice(0, count).join(""), done: count >= chars.length };
}

export default function GiftMomPage() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"envelope" | "opening" | "letter">(
    "envelope",
  );

  useEffect(() => setMounted(true), []);

  // chữ bắt đầu gõ sau khi con trao hoa xong
  const { shown, done } = useTypewriter(
    stage === "letter" ? MOM_WISH : "",
    26,
    4500,
  );

  const openEnvelope = () => {
    if (stage !== "envelope") return;
    setStage("opening");
    setTimeout(() => setStage("letter"), 1700);
  };

  return (
    <main className="mom-page">
      <div className="mom-bokeh" aria-hidden>
        {mounted &&
          BOKEH.map((b) => (
            <span
              key={b.id}
              style={{
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
      </div>

      <div className="mom-petals" aria-hidden>
        {mounted &&
          PETALS.map((p) => (
            <span
              key={p.id}
              className="mom-petal"
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.75,
                  background: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  "--sway": `${p.sway}px`,
                } as React.CSSProperties
              }
            />
          ))}
      </div>

      <div className="mom-content">
        <motion.header
          className="mom-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="mom-date">20/10</div>
          <h1>Gửi Mẹ – người phụ nữ con thương nhất</h1>
        </motion.header>

        <AnimatePresence mode="wait">
          {stage !== "letter" ? (
            <motion.section
              key="envelope"
              className="mom-envelope-wrap"
              exit={{
                opacity: 0,
                scale: 0.85,
                y: 30,
                transition: { duration: 0.4 },
              }}
            >
              <Envelope open={stage === "opening"} onOpen={openEnvelope} />
              {stage === "opening" &&
                BURST.map((b) => (
                  <motion.span
                    key={b.id}
                    className="mom-burst"
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
                    animate={{
                      x: b.x,
                      y: b.y,
                      opacity: [0, 1, 1, 0],
                      scale: 1.2,
                      rotate: b.r,
                    }}
                    transition={{
                      duration: 1.6,
                      delay: 0.5 + b.delay,
                      ease: "easeOut",
                    }}
                  >
                    {b.emoji}
                  </motion.span>
                ))}
              <motion.p
                className="mom-hint"
                animate={{ opacity: stage === "envelope" ? [0.6, 1, 0.6] : 0 }}
                transition={{
                  repeat: stage === "envelope" ? Infinity : 0,
                  duration: 2,
                }}
              >
                Chạm vào phong thư để mở nhé ✉️
              </motion.p>
            </motion.section>
          ) : (
            <motion.section
              key="letter"
              className="mom-letter"
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 18 }}
            >
              <div className="mom-stage">
                <MomScene />
              </div>

              <div className="letter-paper">
                <p className="letter-greet">Mẹ yêu dấu,</p>
                <p className="letter-body">
                  {shown}
                  {!done && <span className="caret" />}
                </p>
                <motion.p
                  className="letter-sign"
                  animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
                >
                  — {SIGNATURE} 💗
                </motion.p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
