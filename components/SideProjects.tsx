"use client";

import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const projects = [
  {
    name: "ROAARRR",
    website: "https://www.roaarrr.app/",
    description:
      "Simple growth analytics for startups — track your funnel from awareness to retention with clean, developer-first analytics.",
  },
  {
    name: "Very Disco",
    website: "https://www.verydisco.app/",
    description:
      "Everything ever mentioned on your favourite podcasts — search and discover the books, movies, shows, and people your favorite hosts talk about.",
  },
  {
    name: "My Queue",
    website: "https://www.myqueue.so/",
    description:
      "Turns articles from around the web into audio stories you can listen to across devices, in 48 languages.",
  },
  {
    name: "Mobile Legends Counters",
    website: "https://www.mobilelegendscounters.com/",
    description:
      "A community-driven matchup guide for Mobile Legends: Bang Bang — find counter-picks for your hardest lane matchups.",
  },
];

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const { ref, isInView } = useInViewAnimation<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={project.website}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "24px",
        textDecoration: "none",
        color: "inherit",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s ease-out, border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#7c3aed";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e0e0e0";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "'PP Pangaia', sans-serif",
            fontSize: "22px",
            fontWeight: "400",
            color: "#000",
          }}
        >
          {project.name}
        </div>
        <span style={{ fontSize: "16px", color: "#666", flexShrink: 0 }}>
          ↗
        </span>
      </div>
      <p
        style={{
          fontFamily: '"Geist", "Geist Placeholder", sans-serif',
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#666",
          margin: 0,
        }}
      >
        {project.description}
      </p>
    </a>
  );
}

export default function SideProjects() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
      }}
    >
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  );
}
