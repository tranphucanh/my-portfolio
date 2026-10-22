import Image from "next/image";
import React from "react";
import Tilt3D from "./Tilt3D";

interface Props {
  src: string;
  title: string;
  company: string;
  description: string;
  highlights: string[];
  tags: string[];
}

const ProjectCard = ({
  src,
  title,
  company,
  description,
  highlights,
  tags,
}: Props) => {
  return (
    <Tilt3D className="flex-1" max={6}>
      <div className="relative h-full overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] bg-[#03001480] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(112,66,248,0.35)]">
        <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-[#2A0E61] via-[#030014] to-[#0b3b4d]">
          <Image
            src={src}
            alt={company}
            width={96}
            height={96}
            className="rounded-2xl border border-[#7042f88b] shadow-[0_0_30px_rgba(112,66,248,0.5)]"
          />
        </div>

        <div className="relative p-6 flex flex-col gap-4">
          <div>
            <p className="Welcome-text text-xs uppercase tracking-widest">
              {company}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
          </div>
          <p className="text-gray-300">{description}</p>

          <ul className="flex flex-col gap-2 text-sm text-gray-300">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-cyan-400">▹</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs text-gray-200 rounded-full border border-[#7042f861] bg-[#7042f81a]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Tilt3D>
  );
};

export default ProjectCard;
