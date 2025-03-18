import { Socials } from "@/constants";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <a
          href="#about-me"
          className="h-auto w-auto flex flex-1 flex-row items-center"
        >
          <Image
            src="/NavLogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            Phuc Anh | Software Engineer
          </span>
        </a>

        <div className="w-[500px] h-full flex flex-1 flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] px-[30px] py-[10px] rounded-full text-gray-200">
            <a href="#about-me" className="cursor-pointer flex-1 text-left">
              About me
            </a>
            <a href="#skills" className="cursor-pointer flex-1 text-center">
              Skills
            </a>
            <a href="#projects" className="cursor-pointer flex-1 text-right">
              Work Experiences
            </a>
          </div>
        </div>

        <div className="flex flex-1 flex-row gap-5 justify-end">
          {Socials.map((social) => (
            <Image
              src={social.src}
              alt={social.name}
              key={social.name}
              width={24}
              height={24}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
