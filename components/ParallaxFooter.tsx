"use client";

import Link from "next/link";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export default function ParallaxFooter() {
  const { ref: nameRef, isInView: nameInView } = useInViewAnimation<HTMLDivElement>();
  const { ref: linksRef, isInView: linksInView } = useInViewAnimation<HTMLDivElement>();
  const { ref: buttonRef, isInView: buttonInView } = useInViewAnimation<HTMLAnchorElement>();

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#000", position: "relative", zIndex: 0 }}
    >
      <div className="w-full mx-auto px-6 sm:px-8 md:px-16 py-12 sm:py-24 md:py-32 flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-0" style={{ maxWidth: "1200px" }}>
        <div>
          <div
            ref={nameRef}
            style={{
              opacity: nameInView ? 1 : 0,
              transform: nameInView ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            <h2
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontSize: "clamp(36px, 10vw, 72px)",
                fontWeight: "400",
                lineHeight: "0.9",
                color: "#f6f4ec",
                margin: 0,
                padding: 0,
                display: "block",
              }}
            >
              Nick Barth
            </h2>
          </div>
          <a
            ref={buttonRef}
            href="mailto:barth.nicholas@gmail.com"
            className="hidden sm:inline-flex"
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "18px",
              fontWeight: "500",
              color: "#fff",
              backgroundColor: "#7c3aed",
              textDecoration: "none",
              alignItems: "center",
              gap: "12px",
              marginTop: "24px",
              padding: "14px 24px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
              opacity: buttonInView ? 1 : 0,
              transform: buttonInView ? "translateY(0)" : "translateY(20px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#6d28d9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
            }}
          >
            Contact →
          </a>
        </div>
        <div
          ref={linksRef}
          className="flex flex-col gap-4"
          style={{
            fontFamily: '"Geist", "Geist Placeholder", sans-serif',
            fontSize: "20px",
            color: "#f6f4ec",
            marginTop: "32px",
            opacity: linksInView ? 1 : 0,
            transform: linksInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <Link
            href="/blog"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const text = e.currentTarget.querySelector("span:first-child") as HTMLElement;
              const arrow = e.currentTarget.querySelector(".link-arrow") as HTMLElement;
              if (text) {
                text.style.textDecoration = "underline";
                text.style.textDecorationColor = "#7c3aed";
              }
              if (arrow) arrow.style.color = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              const text = e.currentTarget.querySelector("span:first-child") as HTMLElement;
              const arrow = e.currentTarget.querySelector(".link-arrow") as HTMLElement;
              if (text) {
                text.style.textDecoration = "none";
                text.style.textDecorationColor = "inherit";
              }
              if (arrow) arrow.style.color = "#f6f4ec";
            }}
          >
            <span>Blog</span>
            <span className="link-arrow" style={{ fontSize: "16px", color: "#f6f4ec", transition: "color 0.3s ease" }}>↗</span>
          </Link>
          <a
            href="https://www.linkedin.com/in/nicholasbarth/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const text = e.currentTarget.querySelector("span:first-child") as HTMLElement;
              const arrow = e.currentTarget.querySelector(".link-arrow") as HTMLElement;
              if (text) {
                text.style.textDecoration = "underline";
                text.style.textDecorationColor = "#7c3aed";
              }
              if (arrow) arrow.style.color = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              const text = e.currentTarget.querySelector("span:first-child") as HTMLElement;
              const arrow = e.currentTarget.querySelector(".link-arrow") as HTMLElement;
              if (text) {
                text.style.textDecoration = "none";
                text.style.textDecorationColor = "inherit";
              }
              if (arrow) arrow.style.color = "#f6f4ec";
            }}
          >
            <span>LinkedIn</span>
            <span className="link-arrow" style={{ fontSize: "16px", color: "#f6f4ec", transition: "color 0.3s ease" }}>↗</span>
          </a>
          <a
            href="/nick_barth_resume.pdf"
            download
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const text = e.currentTarget.querySelector("span:first-child") as HTMLElement;
              const arrow = e.currentTarget.querySelector(".link-arrow") as HTMLElement;
              if (text) {
                text.style.textDecoration = "underline";
                text.style.textDecorationColor = "#7c3aed";
              }
              if (arrow) arrow.style.color = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              const text = e.currentTarget.querySelector("span:first-child") as HTMLElement;
              const arrow = e.currentTarget.querySelector(".link-arrow") as HTMLElement;
              if (text) {
                text.style.textDecoration = "none";
                text.style.textDecorationColor = "inherit";
              }
              if (arrow) arrow.style.color = "#f6f4ec";
            }}
          >
            <span>Resume</span>
            <span className="link-arrow" style={{ fontSize: "16px", color: "#f6f4ec", transition: "color 0.3s ease" }}>↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
