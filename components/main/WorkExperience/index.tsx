/* eslint-disable @next/next/no-img-element */
"use client";
import * as THREE from "three";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image, useTexture, Stars, Float } from "@react-three/drei";
import { easing } from "maath";
import "./util";
import "./styles.scss";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const arrImg = [
  {
    url: "/algolabs.jpg",
    company: "AlgoLabs",
    position: "Frontend Developer",
    time: "2022 - 2023",
    description: (
      <section style={{ fontSize: 15, lineHeight: 1.7 }}>
        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Job Description
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>
            Developed and maintained web applications using ReactJS, NextJS,
            TypeScript, and Redux Saga, ensuring compatibility and high
            performance across browsers.
          </li>
          <li>
            Optimized website performance, particularly for applications with
            large datasets, by using AG-Grid to improve rendering and enhance
            the user experience.
          </li>
          <li>
            Used Ant Design, Styled Components, and SASS for building visually
            appealing and responsive user interfaces.
          </li>
          <li>
            Mentored and optimized the work of new team members while
            collaborating with backend and UI/UX teams to ensure all features
            met requirements and performed effectively.
          </li>
          <li>
            Assisted Backend teams by implementing basic CRUD operations and
            managing database interactions using MySQL, Prisma, TypeORM, and
            others.
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Technologies Used
        </h3>
        <ul style={{ columns: 2, marginBottom: 8 }}>
          <li>ReactJS</li>
          <li>NextJS</li>
          <li>TypeScript</li>
          <li>Redux Saga</li>
          <li>Ant Design</li>
          <li>SASS</li>
          <li>Styled Components</li>
          <li>AG Grid</li>
          <li>Socket.IO</li>
          <li>MySQL</li>
          <li>Prisma</li>
          <li>TypeORM</li>
          <li>Git</li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Key Responsibilities
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>
            Developed and optimized web applications ensuring cross-device
            consistency.
          </li>
          <li>
            Integrated AG-Grid to display and manage large datasets (10,000+
            records) with high performance, implementing virtual scrolling for
            better user experience.
          </li>
          <li>
            Optimized page load speed by using lazy loading, CDN caching, and
            custom filtering to reduce memory overhead.
          </li>
          <li>
            Implemented code splitting (NextJS dynamic imports) to reduce bundle
            size.
          </li>
          <li>Managed code with React-Saga to handle asynchronous tasks.</li>
          <li>
            Collaborated with backend teams on RESTful API design and
            integrations.
          </li>
          <li>
            Assisted in the management of real-time data processing systems and
            optimized latency for streaming data (e.g., dashboards,
            notifications).
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Notable Projects
        </h3>
        <ul>
          <li>
            <strong>Enhanced Page Load Speed:</strong> Reduced page loading time
            by 30% compared to legacy design.
          </li>
          <li>
            <strong>Real-Time Data Processing:</strong> Integrated Socket.IO for
            live updates (e.g., dashboards, notifications).
          </li>
          <li>
            <strong>Cross-Device Compatibility:</strong> Built responsive UI
            using Ant Design and Styled Components.
          </li>
          <li>
            <strong>API Integration:</strong> Managed complex state with Redux
            Saga for API calls and collaborated on backend API design.
          </li>
        </ul>
      </section>
    ),
  },
  {
    url: "/mindx.png",
    company: "MindX",
    position: "Web Instructor",
    time: "2022 - 2023",
    description:
      "Giảng dạy lập trình web cho học viên, xây dựng giáo trình, hỗ trợ học viên thực hành dự án thực tế, tổ chức các buổi workshop về công nghệ mới.",
  },
  {
    url: "/tanca.jpg",
    company: "Tanca.io",
    position: "Fullstack Developer",
    time: "2022 - 2023",
    description: (
      <section style={{ fontSize: 15, lineHeight: 1.7 }}>
        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Job Description
        </h3>
        <p>
          Participated in the development of Tanca&apos;s HR management system,
          including both mobile app (React Native) and website (ReactJS).
          Researched and integrated new technologies to optimize the system.
        </p>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Technologies Used
        </h3>
        <ul style={{ columns: 2, marginBottom: 8 }}>
          <li>ReactJS</li>
          <li>React Native</li>
          <li>Redux</li>
          <li>TypeScript</li>
          <li>Ant Design</li>
          <li>Socket.IO</li>
          <li>SASS</li>
          <li>Bootstrap</li>
          <li>Git</li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Key Responsibilities
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>Developed and enhanced web and mobile app UI/UX.</li>
          <li>Created new features and maintained legacy features.</li>
          <li>Researched new libraries and optimized system performance.</li>
          <li>
            Participated in brainstorming sessions and provided ideas to improve
            the product.
          </li>
          <li>
            Supported team leader in mentoring new members and ensuring code
            quality.
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Notable Features
        </h3>
        <ul>
          <li>
            <strong>Request Layout:</strong> Managed employee requests with
            approval/rejection functionality.
          </li>
          <li>
            <strong>Export/Import Excel:</strong> Created and updated employee
            information from Excel files.
          </li>
          <li>
            <strong>Organization Diagram:</strong> Used the ReactFlow library to
            visualize organizational charts.
          </li>
          <li>
            <strong>Digital Signature:</strong> Integrated with third-party
            services (Viettel, VNPT) for applying digital signatures on
            contracts and documents.
          </li>
          <li>
            <strong>Hiring:</strong> Managed a list of applicants and filtered
            CVs from recruitment websites.
          </li>
          <li>
            <strong>Task Timesheet:</strong> Created a feature to divide tasks
            based on work shifts and time frames, making it easier to manage
            daily tasks.
          </li>
        </ul>
      </section>
    ),
  },
  {
    url: "/mwg.webp",
    company: "MWG",
    position: "Software Engineer",
    time: "07/2025 - Present",
    description: (
      <section style={{ fontSize: 15, lineHeight: 1.7 }}>
        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Job Description
        </h3>
        <p>
          Participated in the development of Tanca&apos;s HR management system,
          including both mobile app (React Native) and website (ReactJS).
          Researched and integrated new technologies to optimize the system.
        </p>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Technologies Used
        </h3>
        <ul style={{ columns: 2, marginBottom: 8 }}>
          <li>ReactJS</li>
          <li>React Native</li>
          <li>Redux</li>
          <li>TypeScript</li>
          <li>Ant Design</li>
          <li>Socket.IO</li>
          <li>SASS</li>
          <li>Bootstrap</li>
          <li>Git</li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Key Responsibilities
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>Developed and enhanced web and mobile app UI/UX.</li>
          <li>Created new features and maintained legacy features.</li>
          <li>Researched new libraries and optimized system performance.</li>
          <li>
            Participated in brainstorming sessions and provided ideas to improve
            the product.
          </li>
          <li>
            Supported team leader in mentoring new members and ensuring code
            quality.
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Notable Features
        </h3>
        <ul>
          <li>
            <strong>Request Layout:</strong> Managed employee requests with
            approval/rejection functionality.
          </li>
          <li>
            <strong>Export/Import Excel:</strong> Created and updated employee
            information from Excel files.
          </li>
          <li>
            <strong>Organization Diagram:</strong> Used the ReactFlow library to
            visualize organizational charts.
          </li>
          <li>
            <strong>Digital Signature:</strong> Integrated with third-party
            services (Viettel, VNPT) for applying digital signatures on
            contracts and documents.
          </li>
          <li>
            <strong>Hiring:</strong> Managed a list of applicants and filtered
            CVs from recruitment websites.
          </li>
          <li>
            <strong>Task Timesheet:</strong> Created a feature to divide tasks
            based on work shifts and time frames, making it easier to manage
            daily tasks.
          </li>
        </ul>
      </section>
    ),
  },
];

export const WorkExperience = () => {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = (index: number) => {
    setSelected(index);
    setIsOpen(true);
  };

  return (
    <div
      id="work-experiences"
      className="relative w-full flex flex-col items-center justify-center py-20 overflow-hidden"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10"
      >
        Work Experience
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-2 mt-5"
      >
        <p className="text-gray-400 text-sm italic">
          Drag or swipe to rotate the carousel
        </p>
        <div className="flex gap-2 text-purple-500/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
      </motion.div>

      <div className="w-full h-[400px] lg:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <Canvas
          className="work-experience scrollbar-hidden"
          camera={{ position: [0, 0, 100], fov: 15 }}
        >
          <fog attach="fog" args={["#030014", 8.5, 12]} />
          <Rig rotation={[0, 0, 0.15]}>
            <Carousel setSelected={handleCardClick} selected={selected} />
          </Rig>
          <HoloRing position={[0, -0.15, 0]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
        </Canvas>
      </div>

      <AnimatePresence>
        {isOpen && (
          <JobModal job={arrImg[selected]} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

function Rig(props: any) {
  const ref = useRef<any>();
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      setIsDragging(true);
      setLastX(e.clientX);
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX;
      setRotation((prev) => prev + deltaX * 0.005);
      setLastX(e.clientX);
    };
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, lastX]);

  useFrame((state, delta) => {
    easing.damp(ref.current.rotation, "y", rotation, 0.3, delta);
    state.events.update?.();
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y * 2 + 1.5, 10],
      0.3,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={ref} {...props} />;
}

function Carousel({
  radius = 1.4,
  count = arrImg.length,
  setSelected,
  selected,
}: {
  radius?: number;
  count?: number;
  setSelected: (i: number) => void;
  selected: number;
}) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={arrImg[i].url}
      url={`${arrImg[i].url}`}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
      onClick={() => setSelected(i)}
      isSelected={selected === i}
    />
  ));
}

function Card({ url, onClick, isSelected, ...props }: any) {
  const ref = useRef<any>();
  const [hovered, hover] = useState(false);
  const pointerOver = (e: any) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    easing.damp3(
      ref.current.scale,
      hovered || isSelected ? 1.15 : 1,
      0.1,
      delta,
    );
    easing.damp(
      ref.current.material,
      "radius",
      hovered || isSelected ? 0.25 : 0.1,
      0.2,
      delta,
    );
    easing.damp(
      ref.current.material,
      "zoom",
      hovered || isSelected ? 1 : 1.5,
      0.2,
      delta,
    );
  });
  return (
    <Image
      ref={ref}
      url={url}
      alt=""
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      onClick={onClick}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

function Banner(props: any) {
  const ref = useRef<any>();
  const texture = useTexture("/LockMain.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 64, 1, true]} />
      <meshStandardMaterial
        color="#00c2ff"
        emissive="#7042f8"
        emissiveIntensity={2}
        wireframe={true}
        transparent={true}
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
function HoloRing(props: any) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 64, 1, true]} />
      <meshStandardMaterial
        color="#00c2ff"
        emissive="#7042f8"
        emissiveIntensity={2}
        wireframe={true}
        transparent={true}
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ModalBackground3D() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#7042f8" />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#00c2ff"
        />
        <MovingLight />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={2}
        />

        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <group>
            <mesh position={[3, 2, -2]}>
              <icosahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial
                color="#7042f8"
                wireframe
                transparent
                opacity={0.4}
              />
            </mesh>
            <mesh position={[-3, -2, -3]}>
              <dodecahedronGeometry args={[0.4, 0]} />
              <meshStandardMaterial
                color="#00c2ff"
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>
            <mesh position={[2, -3, -1]}>
              <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />
              <meshStandardMaterial
                color="#b49bff"
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>
            <mesh position={[-4, 1, -2]}>
              <tetrahedronGeometry args={[0.6, 0]} />
              <meshStandardMaterial
                color="#8042f8"
                wireframe
                transparent
                opacity={0.2}
              />
            </mesh>
          </group>
        </Float>
      </Canvas>
    </div>
  );
}

function MovingLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(t * 0.7) * 3;
    lightRef.current.position.y = Math.cos(t * 0.5) * 3;
  });
  return (
    <pointLight ref={lightRef} intensity={1} color="#7042f8" distance={10} />
  );
}

function JobModal({
  job,
  onClose,
}: {
  job: (typeof arrImg)[0];
  onClose: () => void;
}) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!job) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <ModalBackground3D />

      <motion.div
        layoutId={job.company}
        initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{ perspective: "1000px" }}
        className="relative w-full max-w-2xl bg-[#0300145e] border border-[#7042f861] backdrop-blur-xl rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#181c2b] border border-[#7042f88b] flex items-center justify-center overflow-hidden">
              <img
                src={job.url}
                alt={job.company}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                {job.company}
              </h2>
              <p className="text-lg font-medium text-gray-300">
                {job.position}
              </p>
              <p className="text-sm text-gray-400">{job.time}</p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#7042f861] to-transparent" />

          <div className="max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="text-gray-200 leading-relaxed">
              {job.description}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
