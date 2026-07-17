"use client";

import Link from "next/link";
import Image from "next/image";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const jobs = [
  {
    company: "Personio",
    image: "/images/personio-logo.png",
    website: "https://www.personio.com",
    firmographics: [
      "B2B",
      "Cross-sells",
      "Product-qualified leads",
      "Activation",
      "Expansion",
      "Sales automation",
    ],
    description: [
      "Identified and systematized product-qualified leads, architected cross-sell motions and targeted sales automation, and built operational bridges to sales for consistent pipeline generation and compounding expansion revenue.",
      "Drove cost optimization for product analytics while leveraging vendor expertise to establish the data-driven foundation, accelerate new product launch timing, and compress time-to-first-revenue.",
      "Identified and removed activation bottlenecks through onboarding optimization and guided product experiences, improving user progression and establishing stronger product foundations.",
    ],
  },
  {
    company: "Deepnote",
    image: "/images/deepnote-logo.svg",
    website: "https://www.deepnote.com",
    firmographics: [
      "PLG",
      "Outbound",
      "Enrichment",
      "Signal & intent scoring",
      "Customer messaging",
      "Content marketing",
      "Performance marketing",
      "Activation",
    ],
    description: [
      "Drove 5x PLG revenue growth by identifying and optimizing the freemium-to-paid conversion loop and expanding land-and-expand motions.",
      "Architected integrated growth infrastructure (experimentation, attribution modeling, feature flagging, customer messaging, billing, and onboarding) that became the foundation for sustainable, compounding growth.",
      "Built targeted sales automation for high-intent users, multiplying revenue impact through personalized outreach and feedback loops.",
      "Developed content and performance marketing programs that accelerated user acquisition and expanded reach through high-impact campaigns and targeted distribution channels.",
    ],
  },
  {
    company: "Hireproof",
    image: "/images/hireproof-logo.svg",
    website: "https://www.hireproof.io",
    firmographics: [
      "Founder",
      "Awareness",
      "Acquisition",
      "Activation",
      "Retention",
      "Expansion",
      "Monetization",
    ],
    description: [
      "Founded Hireproof and raised capital to build a hiring platform that solved a critical gap in the market, establishing the vision and strategy for three core products.",
      "Drove awareness and acquisition through product-market fit validation, community building, and Twitch-powered public engagement that established trusted brand presence.",
      "Built activation and retention by architecting onboarding systems and product experiences that converted free users into engaged customers.",
      "Scaled expansion and monetization by personally driving early revenue through direct sales and establishing multiple revenue streams across three core products.",
      "Successfully exited in 2022 by pioneering transparent community engagement and establishing Hireproof as a trusted voice in hiring technology.",
    ],
  },
];

function JobCard({ job }: { job: (typeof jobs)[0] }) {
  const { ref, isInView } = useInViewAnimation();

  return (
    <div
      ref={ref}
      style={{
        paddingBottom: "48px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {job.image && (
          <a
            href={job.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLElement;
              if (img) img.style.transform = "scale(1.15)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLElement;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <Image
              src={job.image}
              alt={`${job.company} logo`}
              width={40}
              height={40}
              style={{
                objectFit: "contain",
                transition: "transform 0.2s ease",
              }}
            />
          </a>
        )}
        <div
          className={isInView ? "animate-fade-in" : ""}
          style={{
            fontFamily: "'PP Pangaia', sans-serif",
            fontSize: "36px",
            fontWeight: "400",
            color: "#000",
            opacity: isInView ? 1 : 0,
          }}
        >
          {job.company}
        </div>
      </div>
      {job.firmographics && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {job.firmographics.map((tag, tagIndex) => (
            <span
              key={tag}
              style={{
                fontFamily: '"Geist", "Geist Placeholder", sans-serif',
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "4px 12px",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateX(0)" : "translateX(-16px)",
                transition: `all 0.6s ease-out ${tagIndex * 0.08}s`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div
        style={{
          fontFamily: '"Geist", "Geist Placeholder", sans-serif',
          fontSize: "18px",
          lineHeight: "1.8",
          color: "#666",
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease-out 0.4s",
        }}
      >
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {job.description.map((point, idx) => (
            <li
              key={idx}
              style={{
                marginBottom:
                  idx < job.description.length - 1 ? "12px" : undefined,
              }}
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WorkExperience() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {jobs.map((job) => (
        <JobCard key={job.company} job={job} />
      ))}
    </div>
  );
}
