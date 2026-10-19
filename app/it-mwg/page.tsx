"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MEMBERS, MESSAGE, WISHES } from "./content";
import "./it-mwg.css";

const TeamScene = dynamic(() => import("@/components/it-mwg/TeamScene"), {
  ssr: false,
  loading: () => <div className="tm-loading">Đang chuẩn bị sân khấu... 🌸</div>,
});

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ItMwgPage() {
  return (
    <main className="tm-page">
      <div className="tm-blob a" aria-hidden />
      <div className="tm-blob b" aria-hidden />

      <div className="tm-content">
        <motion.header
          className="tm-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="tm-badge">Team IT MWG · 20/10</span>
          <div className="tm-date">20/10</div>
          <h1>Chúc mừng ngày Phụ nữ Việt Nam</h1>
          <p>Gửi những bông hoa xinh đẹp nhất của Team IT 💐</p>
        </motion.header>

        <motion.section
          className="tm-stage"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TeamScene members={MEMBERS} />
        </motion.section>
        <p className="tm-hint">Chạm vào từng chị em để nhận lời chúc 💌</p>

        <motion.section
          className="tm-letter"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="tm-letter-flower" aria-hidden>
            💐
          </div>
          <h2>Gửi các chị em yêu quý,</h2>
          <p>{MESSAGE}</p>
        </motion.section>

        <motion.div
          className="tm-cards"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {WISHES.map((w) => (
            <motion.article
              key={w.title}
              className="tm-card"
              variants={fadeUp}
              whileHover={{ y: -6 }}
            >
              <span className="tm-card-icon">{w.icon}</span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
