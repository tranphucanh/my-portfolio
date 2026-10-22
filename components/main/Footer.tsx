import React from "react";
import Image from "next/image";
import { Socials } from "@/constants";

const sections = [
  { title: "About", href: "#about-me" },
  { title: "Skills", href: "#skills" },
  { title: "Experience", href: "#work-experiences" },
  { title: "Projects", href: "#projects" },
];

const Footer = () => {
  return (
    <footer id="footer" className="relative z-[30] w-full text-gray-300 px-5 lg:px-20 pt-12 pb-6">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7042f88b] to-transparent" />

      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 py-10">
        <div className="col-span-2 flex flex-col items-center text-center lg:items-start lg:text-start gap-3">
          <a href="#about-me" className="flex items-center gap-3">
            <Image src="/NavLogo.png" alt="logo" width={40} height={40} />
            <span className="font-bold text-white">Phuc Anh</span>
          </a>
          <p className="text-sm text-gray-400 max-w-xs">
            Frontend Engineer building e-commerce, seller portals and CMS/OMS
            for retail.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-3">
          <div className="Welcome-text text-xs uppercase tracking-widest font-semibold">
            Explore
          </div>
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-sm hover:text-white transition-colors"
            >
              {section.title}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center lg:items-start gap-3">
          <div className="Welcome-text text-xs uppercase tracking-widest font-semibold">
            Connect
          </div>
          {Socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-white transition-colors"
            >
              <social.icon className="fill-current" />
              {social.name}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-[#7042f833] pt-6 text-xs text-gray-500 text-center">
        &copy; 2026 Phuc Anh. All rights reserved.
        <p className="mt-2 text-[10px] text-gray-600">
          Astronaut 3D model:{" "}
          <a
            href="https://3d.si.edu/object/3d/neil-armstrong-spacesuit:d8c63ba6-4ebc-11ea-b77f-2e728ce88125"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-400"
          >
            Neil Armstrong Spacesuit
          </a>{" "}
          by Smithsonian Digitization Programs Office &amp; National Air and
          Space Museum.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
