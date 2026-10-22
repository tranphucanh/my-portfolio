"use client";
import React from "react";
import { motion } from "framer-motion";

const parentVariants = {
  initial: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
    },
  },
};

const childVariants = {
  initial: { y: 0 },
  hover: { y: -4, color: "white", textShadow: "0px 0px 8px rgba(112,66,248,0.8)" },
};

const AnimatedLink = ({ title, href, className }: { title: string; href: string; className?: string }) => {
  return (
    <motion.a
      href={href}
      className={`cursor-pointer flex ${className || ""}`}
      initial="initial"
      whileHover="hover"
      variants={parentVariants}
    >
      {title.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={childVariants}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.a>
  );
};

export default AnimatedLink;
