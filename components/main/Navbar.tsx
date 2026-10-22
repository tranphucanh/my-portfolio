"use client";
import { Socials } from "@/constants";
import Image from "next/image";
import React from "react";
import AnimatedLink from "../sub/AnimatedLink";


const Navbar = () => {
  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-2 lg:px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <a
          href="#about-me"
          className="h-auto w-auto flex flex-row items-center"
        >
          <Image
            src="/NavLogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin w-[40px] h-[40px] sm:w-[70px] sm:h-[70px]"
          />

          <span className="font-bold ml-[10px] hidden lg:block text-gray-300">
            Phuc Anh | Software Engineer
          </span>
        </a>

        <div className="w-[200px] sm:w-[300px] lg:w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] px-[10px] lg:px-[30px] py-[8px] sm:py-[10px] rounded-full text-gray-200 text-[9px] sm:text-xs lg:text-base">
            <AnimatedLink title="About" href="#about-me" />
            <AnimatedLink title="Skills" href="#skills" />
            <AnimatedLink title="Experience" href="#work-experiences" className="text-center" />
            <AnimatedLink title="Projects" href="#projects" />
          </div>
        </div>

        <div className="flex flex-row gap-2 sm:gap-5">
          {Socials.map((social) => (
            <a
              href={social.href}
              key={social.name}
              aria-label={social.name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(112,66,248,0.8)] transition"
            >
              <social.icon className="fill-current w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
