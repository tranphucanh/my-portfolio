/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import * as THREE from "three";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree, ThreeElements } from "@react-three/fiber";
import { Image, useTexture, Stars, Float, Sparkles } from "@react-three/drei";
import { easing } from "maath";
import { Skill_data } from "@/constants";
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
          Software Engineer (Frontend) at Mobile World Group (MWG), one of
          Vietnam&apos;s largest retail groups. Building and maintaining web
          products across its retail chains, from customer-facing e-commerce
          sites to seller portals and internal operation systems.
        </p>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          E-commerce Websites
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>
            <strong>bachhoaxanh.com:</strong> Bách Hoá Xanh grocery chain.
          </li>
          <li>
            <strong>nhathuocankhang.com:</strong> An Khang pharmacy chain.
          </li>
          <li>
            <strong>avakid.com:</strong> AVAKids mother &amp; baby store.
          </li>
          <li>
            <strong>mwg.vn:</strong> MWG corporate website.
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Seller Center
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>
            <strong>sc.bachhoaxanh.com</strong> and{" "}
            <strong>sc.dienmayxanh.com:</strong> seller portals for Bách Hoá
            Xanh and Điện Máy Xanh.
          </li>
          <li>
            <strong>MWG Seller Center:</strong> seller portal for the group.
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Internal Systems
        </h3>
        <ul style={{ marginBottom: 8 }}>
          <li>
            <strong>CMS Bách Hoá Xanh:</strong> declaring and managing store
            data and content.
          </li>
          <li>
            <strong>OMS Bách Hoá Xanh:</strong> order management and customer
            information management.
          </li>
        </ul>

        <h3 style={{ margin: "16px 0 8px", color: "#ffd700" }}>
          Community
        </h3>
        <ul>
          <li>
            <strong>bachhoaxanh.com/kinh-nghiem-hay:</strong> Bách Hoá
            Xanh&apos;s social network for sharing tips and experiences.
          </li>
        </ul>
      </section>
    ),
  },
];

const STEP = (Math.PI * 2) / arrImg.length;
// Kéo quá ngưỡng này (px) thì coi là drag, không mở modal
const DRAG_THRESHOLD = 6;

type RigState = {
  target: number;
  dragging: boolean;
  moved: number;
  lastX: number;
  velocity: number;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;
const frontIndex = (rotation: number) =>
  mod(Math.round(-rotation / STEP), arrImg.length);

export const WorkExperience = () => {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const rig = useRef<RigState>({
    target: 0,
    dragging: false,
    moved: 0,
    lastX: 0,
    velocity: 0,
  });

  const rotateTo = (index: number) => {
    // Chọn góc gần nhất để card quay ra phía trước theo đường ngắn nhất
    const desired = -index * STEP;
    const current = rig.current.target;
    rig.current.target =
      current + mod(desired - current + Math.PI, Math.PI * 2) - Math.PI;
    setSelected(index);
  };

  const openCard = (index: number) => {
    rotateTo(index);
    setIsOpen(true);
  };

  const handleCardClick = (index: number) => {
    if (rig.current.moved > DRAG_THRESHOLD) return;
    // Card chưa ở phía trước thì chỉ xoay tới, click lần nữa mới mở chi tiết
    if (index !== frontIndex(rig.current.target)) return rotateTo(index);
    openCard(index);
  };

  const step = (dir: 1 | -1) =>
    rotateTo(mod(frontIndex(rig.current.target) + dir, arrImg.length));

  return (
    <div
      id="work-experiences"
      className="relative w-full flex flex-col items-center justify-center py-10 overflow-hidden"
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

      <div className="relative w-full h-[400px] lg:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <Canvas
          className="work-experience scrollbar-hidden"
          camera={{ position: [0, 0, 100], fov: 15 }}
          dpr={[1, 2]}
        >
          <fog attach="fog" args={["#030014", 8.5, 12]} />
          <Rig rig={rig} onSnap={setSelected} rotation={[0, 0, 0.15]}>
            <Carousel setSelected={handleCardClick} selected={selected} />
          </Rig>
          <HoloRing position={[0, -0.15, 0]} />
          <Sparkles
            count={80}
            scale={[4.5, 2, 4.5]}
            size={2.5}
            speed={0.3}
            opacity={0.6}
            color="#b49bff"
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
        </Canvas>

        {/* z-[100] bằng canvas nhưng đứng sau trong DOM nên nằm trên canvas, dưới modal */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous experience"
            onClick={() => step(-1)}
            className="button-primary rounded-full border border-[#7042f88b] w-10 h-10 flex items-center justify-center text-xl text-white backdrop-blur-md"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => openCard(selected)}
            className="button-primary rounded-full border border-[#7042f88b] px-5 h-10 flex items-center text-sm whitespace-nowrap backdrop-blur-md"
          >
            <span className="Welcome-text">
              {arrImg[selected].company} · {arrImg[selected].time}
            </span>
          </button>
          <button
            type="button"
            aria-label="Next experience"
            onClick={() => step(1)}
            className="button-primary rounded-full border border-[#7042f88b] w-10 h-10 flex items-center justify-center text-xl text-white backdrop-blur-md"
          >
            ›
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <JobModal job={arrImg[selected]} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

function Rig({
  rig,
  onSnap,
  ...props
}: {
  rig: React.RefObject<RigState>;
  onSnap: (index: number) => void;
} & ThreeElements["group"]) {
  const ref = useRef<THREE.Group>(null);
  const el = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const r = rig.current;
    const handlePointerDown = (e: PointerEvent) => {
      r.dragging = true;
      r.moved = 0;
      r.velocity = 0;
      r.lastX = e.clientX;
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!r.dragging) return;
      const deltaX = e.clientX - r.lastX;
      r.moved += Math.abs(deltaX);
      r.velocity = deltaX * 0.005;
      r.target += r.velocity;
      r.lastX = e.clientX;
    };
    const handlePointerUp = () => {
      if (!r.dragging) return;
      r.dragging = false;
      // Quán tính rồi snap về card gần nhất
      const projected = r.target + r.velocity * 8;
      r.target = Math.round(projected / STEP) * STEP;
      onSnap(frontIndex(r.target));
    };

    // Chỉ bắt đầu kéo trên canvas, nhưng theo dõi move/up trên window để kéo ra ngoài vẫn mượt
    el.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [el, rig, onSnap]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const isMobile = state.size.width < 768;
    const targetZ = isMobile ? 16 : 10;

    easing.damp(ref.current.rotation, "y", rig.current.target, 0.3, delta);
    state.events.update?.();
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y * 2 + 1.5, targetZ],
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
  const ref = useRef<any>(null);
  const [hovered, hover] = useState(false);
  const el = useThree((state) => state.gl.domElement);
  const pointerOver = (e: any) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);

  useEffect(() => {
    el.style.cursor = hovered ? "pointer" : "";
  }, [el, hovered]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    easing.damp3(
      ref.current.scale,
      hovered || isSelected ? 1.15 : 1,
      0.1,
      delta,
    );
    // Card không được chọn sẽ hơi xám để tạo chiều sâu
    easing.damp(
      ref.current.material,
      "grayscale",
      hovered || isSelected ? 0 : 0.7,
      0.25,
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
      // Chặn click lan sang card phía sau mà tia raycast cũng xuyên qua
      onClick={(e: any) => (e.stopPropagation(), onClick())}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

function Banner(props: any) {
  const ref = useRef<any>(null);
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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <mesh ref={ref} scale={isMobile ? [1.5, 1.5, 1.5] : [1, 1, 1]} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 64, 1, true]} />
      <meshStandardMaterial
        color="#00c2ff"
        emissive="#7042f8"
        emissiveIntensity={isMobile ? 4 : 2}
        wireframe={true}
        transparent={true}
        opacity={isMobile ? 0.8 : 0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ModalBackground3D() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]}>
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

        <Sparkles
          count={400}
          scale={20}
          size={2}
          speed={0.8}
          opacity={0.6}
          color="#00c2ff"
        />
        <Sparkles
          count={300}
          scale={20}
          size={3}
          speed={0.6}
          opacity={0.4}
          color="#7042f8"
        />
        <AnimatedGeometries />
      </Canvas>
    </div>
  );
}

function AnimatedGeometries() {
  const groupRef = useRef<THREE.Group>(null);
  // Random 1 lần, tránh icon đổi kích thước mỗi lần re-render
  const scales = useMemo(() => Skill_data.map(() => 1.2 + Math.random()), []);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.05;
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {Skill_data.map((skill, i) => (
        <Float
          key={skill.skill_name}
          speed={2 + (i % 3)}
          rotationIntensity={2}
          floatIntensity={3}
        >
          <Image
            url={skill.Image}
            transparent
            position={[
              Math.sin(i) * 8,
              Math.cos(i * 1.5) * 6,
              Math.sin(i * 2) * 5 - 3,
            ]}
            scale={scales[i]}
            side={THREE.DoubleSide}
          />
        </Float>
      ))}
    </group>
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
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

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
