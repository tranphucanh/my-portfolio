"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./happy-birthday.css";

import dynamic from "next/dynamic";

const BirthdayScene = dynamic(
  () => import("@/components/happy-birthday/BirthdayScene"),
  { ssr: false },
);

/* ─────── PETAL DATA ─────── */
const PETALS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 8 + Math.random() * 12,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 6,
  rotate: Math.random() * 360,
}));

/* ─────── SPARKLE DATA ─────── */
const SPARKLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  top: `${10 + Math.random() * 80}%`,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 3,
  size: 3 + Math.random() * 4,
}));

/* ─────── FLOATING HEARTS DATA ─────── */
const CSS_HEARTS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 10,
  duration: 10 + Math.random() * 8,
  size: 12 + Math.random() * 16,
  opacity: 0.2 + Math.random() * 0.4,
}));

/* ─────── CONFETTI COLORS ─────── */
const CONFETTI_COLORS = [
  "#f472b6",
  "#fb7185",
  "#fda4af",
  "#fbbf24",
  "#f9a8d4",
  "#a78bfa",
  "#c084fc",
  "#fde68a",
  "#fbcfe8",
  "#e879f9",
];

/* ─────── OVERLAY HEARTS ─────── */
const OVERLAY_HEARTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 14 + Math.random() * 18,
  delay: Math.random() * 6,
  duration: 7 + Math.random() * 5,
  color: ["#f472b6", "#fb7185", "#fda4af", "#ec4899", "#f9a8d4"][
    Math.floor(Math.random() * 5)
  ],
}));

/* ─────── OVERLAY SPARKLE STARS ─────── */
const OVERLAY_STARS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  top: `${5 + Math.random() * 90}%`,
  size: 4 + Math.random() * 8,
  delay: Math.random() * 4,
  duration: 1.5 + Math.random() * 2.5,
}));

/* ─────── OVERLAY PETALS ─────── */
const OVERLAY_PETALS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 10 + Math.random() * 10,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
}));

/* ═══════ HEART SVG ═══════ */
const HeartSVG = ({ size = 48, color = "#ec4899" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

/* ═══════ 3D RUNNING TEXT ═══════ */
const RunningText3D = () => {
  const text = "Happy Birthday Bảo Na • ✨ • ";
  const repeatedText = Array(4).fill(text).join("");

  return (
    <div className="w-full overflow-hidden py-8 perspective-[1000px] pointer-events-none">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <span className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400 uppercase drop-shadow-[0_0_15px_rgba(244,114,182,0.5)] italic">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
};

/* ═══════ MAIN PAGE ═══════ */
export default function HappyBirthdayPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [confetti, setConfetti] = useState<
    { id: number; left: string; color: string; delay: number; size: number }[]
  >([]);

  /* Loading screen */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  /* Open envelope handler */
  const handleOpen = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);

    /* Trigger confetti */
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${30 + Math.random() * 40}%`,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1.5,
      size: 5 + Math.random() * 8,
    }));
    setConfetti(pieces);

    /* Show letter content after animation */
    setTimeout(() => {
      setShowLetter(true);
    }, 1200);

    /* Clear confetti */
    setTimeout(() => setConfetti([]), 4000);
  }, [isOpened]);

  /* Close letter */
  const handleClose = useCallback(() => {
    setShowLetter(false);
    setTimeout(() => {
      setIsOpened(false);
    }, 600);
  }, []);

  return (
    <div className="hbd-page">
      {/* ── Loading Screen ── */}
      <div className={`loading-screen ${!isLoading ? "hidden" : ""}`}>
        <div className="flex flex-col items-center">
          <motion.div
            className="loading-heart mb-8"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            💖
          </motion.div>
          <div className="flex overflow-hidden text-2xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-serif">
            {"Happy birthday Bảo Na".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2,
                }}
                style={{
                  display: "inline-block",
                  whiteSpace: char === " " ? "pre" : "normal",
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mt-4"
          />
        </div>
      </div>

      {/* ── 3D Background ── */}
      <Suspense fallback={null}>
        <BirthdayScene />
      </Suspense>

      {/* ── Golden Glow ── */}
      <div className="golden-glow" />

      {/* ── CSS Floating Petals ── */}
      <div className="petals-container">
        {PETALS.map((p) => (
          <div
            key={p.id}
            className="petal"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--rotate": `${p.rotate}deg`,
              } as any
            }
          />
        ))}
      </div>

      {/* ── CSS Sparkles ── */}
      <div className="sparkles-container">
        {SPARKLES.map((s) => (
          <div
            key={s.id}
            className="sparkle"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── CSS Floating Hearts ── */}
      <div className="floating-hearts-container">
        {CSS_HEARTS.map((h) => (
          <div
            key={h.id}
            className="floating-heart"
            style={{
              left: h.left,
              fontSize: h.size,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="hbd-content">
        {!isOpened && <RunningText3D />}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 0.8 : 1,
            y: isLoading ? 40 : 0,
          }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Magical Envelope */}
          <div
            className={`envelope-wrapper ${isOpened ? "opened" : ""}`}
            onClick={handleOpen}
          >
            <div className="envelope shadow-2xl">
              {/* Letter inside */}
              <div className="letter-container">
                <div className="letter">
                  <div className="letter-line" />
                  <div className="letter-line" />
                  <div className="letter-line" />
                  <div className="letter-line" />
                </div>
              </div>

              {/* Envelope body */}
              <div className="envelope-body">
                <div className="envelope-pattern" />
              </div>

              {/* Heart seal with pulse */}
              <div className="envelope-seal">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <HeartSVG size={48} color="#ec4899" />
                </motion.div>
              </div>

              {/* Flap */}
              <div className="envelope-flap" />
            </div>
          </div>

          {/* CTA with magical text */}
          {!isOpened && (
            <motion.div
              className="cta-text mt-12 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-pink-100/80 shadow-lg shadow-pink-500/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              ✨ Chạm để nhận điều kỳ diệu ✨
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Confetti ── */}
      <div className="confetti-container">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              top: "40%",
              width: c.size,
              height: c.size * 1.5,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Letter Overlay ── */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            className={`letter-overlay ${showLetter ? "visible" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="letter-overlay-bg" onClick={handleClose} />

            {/* ── Glow ring behind card ── */}
            <div className="letter-glow-ring" />

            {/* ── Overlay floating hearts ── */}
            <div className="overlay-hearts">
              {OVERLAY_HEARTS.map((h) => (
                <div
                  key={h.id}
                  className="overlay-heart"
                  style={{
                    left: h.left,
                    animationDelay: `${h.delay}s`,
                    animationDuration: `${h.duration}s`,
                  }}
                >
                  <HeartSVG size={h.size} color={h.color} />
                </div>
              ))}
            </div>

            {/* ── Overlay sparkle stars ── */}
            {OVERLAY_STARS.map((s) => (
              <div
                key={s.id}
                className="overlay-sparkle-star"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}

            {/* ── Overlay petal rain ── */}
            <div className="overlay-petals">
              {OVERLAY_PETALS.map((p) => (
                <div
                  key={p.id}
                  className="overlay-petal"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                  }}
                />
              ))}
            </div>

            <motion.div
              className="letter-card"
              initial={{ y: 60, scale: 0.9, rotateX: 10 }}
              animate={{ y: 0, scale: 1, rotateX: 0 }}
              exit={{ y: 40, scale: 0.95, opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* Close button */}
              <button className="letter-close-btn" onClick={handleClose}>
                ✕
              </button>

              {/* Corner decorations */}
              <div className="letter-corner letter-corner--tl" />
              <div className="letter-corner letter-corner--tr" />
              <div className="letter-corner letter-corner--bl" />
              <div className="letter-corner letter-corner--br" />

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="letter-title">Happy Birthday!</h1>
                <p className="letter-subtitle">
                  🎂 Wishing you all the best 🎂
                </p>
                <div className="letter-divider" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <p className="letter-body">
                  Chúc em có 1 sinh nhật thật vui và hạnh phúc nhé!
                  <br />
                  <br />
                  Chúc em tuổi mới thật <em>rực rỡ</em> và <em>hạnh phúc</em>.
                  Mong rằng mỗi ngày trôi qua đều mang đến cho em thật nhiều
                  niềm vui, tiếng cười và những điều tuyệt vời nhất.
                  <br />
                  <br />
                  Chúc em luôn <em>xinh đẹp</em>, <em>rạng rỡ</em> và mãi mãi
                  toả sáng như ngôi sao sáng nhất! ⭐
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <p className="letter-signature">With love 💕</p>
                <p className="letter-date">
                  {new Date().toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
