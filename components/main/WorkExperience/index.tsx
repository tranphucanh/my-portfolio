"use client";
import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Image,
  Environment,
  ScrollControls,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { easing } from "maath";
import "./util";
import "./styles.scss";
import { motion } from "framer-motion";
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
];

export const WorkExperience = () => {
  const [selected, setSelected] = useState(0);
  return (
    <div
      id="work-experiences"
      style={{ display: "flex", alignItems: "center", gap: 32 }}
    >
      <div style={{ flex: 1 }}>
        <Canvas
          className="work-experience scrollbar-hidden"
          camera={{ position: [0, 0, 100], fov: 15 }}
        >
          <fog attach="fog" args={["#abbed8", 8.5, 12]} />
          <ScrollControls pages={4} infinite>
            <Rig rotation={[0, 0, 0.15]}>
              <Carousel setSelected={setSelected} selected={selected} />
            </Rig>
            <Banner position={[0, -0.15, 0]} />
          </ScrollControls>
          <Environment preset="dawn" background={false} blur={0.5} />
        </Canvas>
      </div>
      <div style={{ flex: 1, minWidth: 320 }}>
        <JobDescription job={arrImg[selected]} />
      </div>
    </div>
  );
};

function Rig(props: any) {
  const ref = useRef<any>();
  const scroll = useScroll();
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
    state.events.update?.(); // Raycasts every frame rather than on pointer-move
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta
    ); // Move camera
    state.camera.lookAt(0, 0, 0); // Look at center
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
      delta
    );
    easing.damp(
      ref.current.material,
      "radius",
      hovered || isSelected ? 0.25 : 0.1,
      0.2,
      delta
    );
    easing.damp(
      ref.current.material,
      "zoom",
      hovered || isSelected ? 1 : 1.5,
      0.2,
      delta
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
  const scroll = useScroll();
  useFrame((state, delta) => {
    ref.current.material.time.value += Math.abs(scroll.delta) * 4;
    ref.current.material.map.offset.x += delta / 2;
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[30, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function JobDescription({ job }: { job: (typeof arrImg)[0] }) {
  if (!job) return null;
  return (
    <motion.div
      key={job.company}
      initial={{ opacity: 0, scale: 0.5, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.5, x: 100 }}
      transition={{ duration: 0.6, type: "spring" }}
      style={{
        background: "#181c2b",
        color: "#fff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 2px 16px #0002",
        marginRight: 24,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <motion.h2
        style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {job.company}
      </motion.h2>
      <motion.div
        style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {job.position}
      </motion.div>
      <motion.div
        style={{ fontSize: 15, color: "#b3b3b3", marginBottom: 12 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {job.time}
      </motion.div>
      <motion.div
        style={{ fontSize: 16, lineHeight: 1.6 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        {job.description}
      </motion.div>
    </motion.div>
  );
}
