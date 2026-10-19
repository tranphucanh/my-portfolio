"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import "./gift.css";

const GiftScene = dynamic(() => import("@/components/gift/GiftScene"), {
  ssr: false,
});

/* ─── Nội dung có thể sửa ─── */
const MESSAGE = {
  title: "Gửi em yêu 💌",
  body: "Chúc em 20/10 thật xinh đẹp, luôn rạng rỡ, bình an và hạnh phúc. Cảm ơn em vì đã luôn ở đây, làm mỗi ngày trở nên ngọt ngào hơn.",
};

const GIFTS = [
  {
    key: "cake",
    name: "Bánh Friendship",
    desc: "Một phần bánh ngọt ngào — ngọt như tình mình vậy đó 🍰",
  },
  {
    key: "case",
    name: "Ốp lưng điện thoại",
    desc: "Để em mang theo yêu thương bên mình mỗi ngày 📱",
  },
] as const;

const OPEN_DURATION = 3300;
const STORAGE_KEY = "gift-2010-opened"; // ms – khớp với animation mở hộp trong scene

/* ─── Random có seed để SSR/CSR khớp nhau ─── */
const seeded = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${seeded(i) * 100}%`,
  size: 10 + seeded(i + 50) * 14,
  delay: seeded(i + 100) * 10,
  duration: 9 + seeded(i + 150) * 8,
  sway: 30 + seeded(i + 200) * 60,
  hue: seeded(i + 250) > 0.5 ? "#ff8fab" : "#ffc2d4",
}));

/* ─── Minh hoạ: miếng bánh ─── */
function CakeArt() {
  return (
    <svg viewBox="0 0 220 180" className="gift-art">
      <defs>
        <linearGradient id="cream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff7f0" />
          <stop offset="1" stopColor="#ffe1cc" />
        </linearGradient>
        <linearGradient id="choco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a3e22" />
          <stop offset="1" stopColor="#4a2312" />
        </linearGradient>
      </defs>
      <ellipse cx="112" cy="160" rx="92" ry="12" fill="#00000030" />
      <ellipse cx="112" cy="152" rx="96" ry="18" fill="#fff" opacity="0.92" />
      {/* mặt sau cong */}
      <path
        d="M150 48 Q178 54 192 72 L192 132 Q178 114 150 108 Z"
        fill="url(#choco)"
      />
      {/* mặt cắt nhiều lớp */}
      <path d="M28 88 L192 72 L192 132 L28 148 Z" fill="#f6d9a8" />
      <path d="M28 100 L192 84 L192 94 L28 110 Z" fill="#fff4ea" />
      <path d="M28 110 L192 94 L192 106 L28 122 Z" fill="#e85d75" />
      <path d="M28 122 L192 106 L192 114 L28 130 Z" fill="#fff4ea" />
      <path d="M28 130 L192 114 L192 132 L28 148 Z" fill="url(#choco)" />
      {/* mặt trên */}
      <path d="M28 88 L150 48 Q178 54 192 72 Z" fill="url(#cream)" />
      <path d="M28 88 L192 72 L192 80 L28 96 Z" fill="#fff" opacity="0.9" />
      {/* kem & dâu */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${118 + i * 24} ${66 - i * 4})`}>
          <path d="M-11 6 Q-12 -6 0 -12 Q12 -6 11 6 Z" fill="#fff" />
          <path
            d="M-6 0 Q0 -8 6 0"
            stroke="#f3d6c2"
            strokeWidth="2"
            fill="none"
          />
        </g>
      ))}
      <g transform="translate(150 44)">
        <path
          d="M0 18 Q-16 4 -10 -6 Q0 -12 10 -6 Q16 4 0 18 Z"
          fill="#e5383b"
        />
        <path
          d="M-6 -7 L0 -14 L6 -7"
          stroke="#2d9d4f"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {[
          [-4, 0],
          [4, 2],
          [0, 8],
          [-5, 8],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.2" fill="#ffd166" />
        ))}
      </g>
      <text
        x="60"
        y="80"
        fontSize="13"
        fill="#e85d75"
        transform="rotate(-10 60 80)"
      >
        ♥
      </text>
    </svg>
  );
}

/* ─── Minh hoạ: ốp lưng ─── */
function CaseArt() {
  return (
    <svg viewBox="0 0 220 180" className="gift-art">
      <defs>
        <linearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb3cf" />
          <stop offset="1" stopColor="#ff5c93" />
        </linearGradient>
        <clipPath id="caseClip">
          <rect x="70" y="10" width="80" height="160" rx="18" />
        </clipPath>
      </defs>
      <ellipse cx="110" cy="172" rx="50" ry="6" fill="#00000030" />
      <g transform="rotate(-8 110 90)">
        <rect
          x="70"
          y="10"
          width="80"
          height="160"
          rx="18"
          fill="url(#caseGrad)"
        />
        <g clipPath="url(#caseClip)" opacity="0.55">
          {Array.from({ length: 24 }, (_, i) => (
            <text
              key={i}
              x={72 + (i % 4) * 22 + (Math.floor(i / 4) % 2) * 11}
              y={60 + Math.floor(i / 4) * 22}
              fontSize="12"
              fill="#fff"
            >
              {i % 3 === 0 ? "✿" : "♥"}
            </text>
          ))}
        </g>
        <rect
          x="78"
          y="18"
          width="34"
          height="34"
          rx="9"
          fill="#ffffff55"
          stroke="#fff"
          strokeWidth="1.5"
        />
        <circle
          cx="88"
          cy="28"
          r="6"
          fill="#2b2233"
          stroke="#cfc6d6"
          strokeWidth="2"
        />
        <circle
          cx="102"
          cy="42"
          r="6"
          fill="#2b2233"
          stroke="#cfc6d6"
          strokeWidth="2"
        />
        <circle cx="103" cy="26" r="2.2" fill="#fff6c2" />
        <text
          x="110"
          y="120"
          textAnchor="middle"
          fontSize="15"
          fill="#fff"
          className="case-text"
        >
          20 · 10
        </text>
        <rect
          x="70"
          y="10"
          width="80"
          height="160"
          rx="18"
          fill="none"
          stroke="#ffffff99"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export default function GiftPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [delivered, setDelivered] = useState(false); // nhân vật đã mang quà tới
  const [opened, setOpened] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [seenCards, setSeenCards] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [restored, setRestored] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  /* Khôi phục hộp đã mở từ lần trước */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "0" || saved === "1") {
        setSelected(Number(saved));
        setDelivered(true);
        setOpened(true);
        setSeenCards(true);
        setRestored(true);
      }
    } catch {}
    setMounted(true);
  }, []);

  const handleSelect = useCallback(
    (i: number) => {
      if (selected != null) return; // đã mở 1 hộp → chặn hộp còn lại
      setSelected(i);
    },
    [selected],
  );

  const handleDelivered = useCallback(() => setDelivered(true), []);

  // bấm vào nhân vật (hoặc hộp trên tay) → mở quà
  const handleOpen = useCallback(() => {
    if (selected == null || !delivered || opened) return;
    setOpened(true);
    try {
      localStorage.setItem(STORAGE_KEY, String(selected));
    } catch {}
  }, [selected, delivered, opened]);

  const handleLocked = useCallback(() => {
    setToast("Chỉ được mở 1 hộp thôi nha 😚");
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    if (!opened || restored) return;
    const id = setTimeout(() => {
      setShowCards(true);
      setSeenCards(true);
    }, OPEN_DURATION);
    return () => clearTimeout(id);
  }, [opened, restored]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const hint =
    selected == null
      ? "Chọn một hộp quà bất kỳ nhé 🎁"
      : !delivered
        ? "Có người đang mang quà tới cho em nè... 🏃"
        : !opened
          ? "Bấm vào bạn nhỏ để nhận quà nhé 💝"
          : seenCards
            ? `Em đã chọn hộp quà số ${selected + 1} 💝`
            : "Đang mở quà cho em nè... ✨";

  return (
    <main className="gift-page">
      <div className="gift-bg-glow" />

      <div className="petals" aria-hidden>
        {mounted &&
          PETALS.map((p) => (
            <span
              key={p.id}
              className="petal"
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.8,
                  background: p.hue,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  "--sway": `${p.sway}px`,
                } as React.CSSProperties
              }
            />
          ))}
      </div>

      <motion.header
        className="gift-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="gift-date">
          20<span>·</span>10
        </div>
        <h1>Chúc mừng ngày Phụ nữ Việt Nam</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={hint}
            className="gift-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {hint}
          </motion.p>
        </AnimatePresence>
      </motion.header>

      <div className="gift-canvas">
        {mounted && (
          <GiftScene
            selected={selected}
            opened={opened}
            onSelect={handleSelect}
            onLockedClick={handleLocked}
            onDelivered={handleDelivered}
            onOpenRequest={handleOpen}
            instant={restored}
          />
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="gift-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {seenCards && !showCards && (
          <motion.button
            key="reopen"
            className="gift-reopen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4 } }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCards(true)}
          >
            Xem lại quà 🎁
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCards && (
          <motion.div
            className="gift-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCards(false)}
          >
            <motion.div
              className="gift-sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Quà của em đây 💝
              </motion.h2>

              <div className="gift-cards">
                {GIFTS.map((g, i) => (
                  <motion.div
                    key={g.key}
                    className="gift-card"
                    initial={{ rotateY: 180, opacity: 0, y: 40 }}
                    animate={{ rotateY: 0, opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.35,
                      duration: 0.9,
                      type: "spring",
                      damping: 14,
                    }}
                  >
                    <div className="gift-card-shine" />
                    <span className="gift-card-badge">Món quà {i + 1}</span>
                    {g.key === "cake" ? <CakeArt /> : <CaseArt />}
                    <h3>{g.name}</h3>
                    <p>{g.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="gift-letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <h4>{MESSAGE.title}</h4>
                <p>{MESSAGE.body}</p>
              </motion.div>

              <button
                className="gift-close"
                onClick={() => setShowCards(false)}
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
