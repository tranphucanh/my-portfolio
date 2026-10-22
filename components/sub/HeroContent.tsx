"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/utils/motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Tilt3D from "./Tilt3D";
import { Socials } from "@/constants";

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative flex flex-col lg:flex-row items-center justify-center px-5 lg:px-20 mt-20 lg:mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-center lg:text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] self-center lg:self-start"
        >
          {/* <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" /> */}
          <h1 className="Welcome-text text-[13px] px-3">
            E-commerce · Seller Center · CMS / OMS
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-4xl lg:text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            Hi, I&apos;m Phuc Anh &mdash;
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              Frontend
            </span>{" "}
            Engineer
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px] mx-auto lg:mx-0"
        >
          Building with React, Next.js, TypeScript and React Native since 2022
          &mdash; from HR platforms at Tanca and data-heavy dashboards at
          AlgoLabs to e-commerce sites, seller portals and CMS/OMS for MWG&apos;s
          retail chains.
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-wrap gap-4 justify-center lg:justify-start"
        >
          <a
            href="#work-experiences"
            className="py-2 px-6 button-primary text-center text-white rounded-lg"
          >
            View my experience
          </a>
          <a
            href={Socials[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-6 text-center text-gray-200 rounded-lg border border-[#7042f88b] hover:bg-[#7042f81f] transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="hidden lg:flex w-full h-full justify-center items-center"
      >
        <Tilt3D max={10} glare={false}>
          <Image
            src="/mainIconsdark.svg"
            alt="work icons"
            height={650}
            width={650}
            priority
          />
        </Tilt3D>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
