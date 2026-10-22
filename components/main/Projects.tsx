import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        My Projects
      </h1>
      <div className="h-full w-full max-w-7xl flex flex-col lg:flex-row gap-10 px-10">
        <ProjectCard
          src="/mwg.webp"
          company="MWG"
          title="MWG Retail Web Platforms"
          description="Frontend for e-commerce sites, seller portals and internal operation systems across MWG's retail chains."
          highlights={[
            "E-commerce: bachhoaxanh.com, nhathuocankhang.com, avakid.com, mwg.vn",
            "Seller Center: sc.bachhoaxanh.com, sc.dienmayxanh.com, MWG Seller Center",
            "CMS & OMS Bách Hoá Xanh: data declaration, order and customer management",
            "Kinh Nghiệm Hay: Bách Hoá Xanh's community social network",
          ]}
          tags={["E-commerce", "Seller Center", "CMS", "OMS", "Social Network"]}
        />
        <ProjectCard
          src="/tanca.jpg"
          company="Tanca.io"
          title="Tanca HR Management Platform"
          description="All-in-one HR system for businesses, shipped as a ReactJS web app and a React Native mobile app."
          highlights={[
            "Digital signatures on contracts via Viettel & VNPT integrations",
            "Organization chart built with ReactFlow",
            "Request approval flow, Excel import/export and hiring pipeline",
            "Task timesheet split by work shifts and time frames",
          ]}
          tags={["ReactJS", "React Native", "Redux", "TypeScript", "Ant Design", "Socket.IO"]}
        />
        <ProjectCard
          src="/algolabs.jpg"
          company="AlgoLabs"
          title="Real-time Data Dashboards"
          description="High-performance web applications for data-heavy workflows with live updates."
          highlights={[
            "AG-Grid with virtual scrolling for 10,000+ records",
            "30% faster page loads with lazy loading, CDN caching and code splitting",
            "Real-time dashboards and notifications over Socket.IO",
            "Complex async state managed with Redux Saga",
          ]}
          tags={["NextJS", "TypeScript", "Redux Saga", "AG Grid", "Socket.IO", "Prisma"]}
        />
      </div>
    </div>
  );
};

export default Projects;
