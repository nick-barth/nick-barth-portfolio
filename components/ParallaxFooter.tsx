"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxFooter() {
  const nameRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!nameRef.current || !linksRef.current || !buttonRef.current) return;

    // Name parallax - comes from top
    gsap.fromTo(
      nameRef.current,
      { y: -300 },
      {
        y: 0,
        scrollTrigger: {
          trigger: nameRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          markers: false,
        },
      }
    );

    // Links parallax - comes from top (slower)
    gsap.fromTo(
      linksRef.current,
      { y: -300 },
      {
        y: 0,
        scrollTrigger: {
          trigger: linksRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1.2,
          markers: false,
        },
      }
    );

    // Button fades in on scroll
    buttonRef.current.style.opacity = "0";
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: "footer",
          start: "top 80%",
          end: "top 20%",
          scrub: 0.5,
          markers: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#000", position: "relative", zIndex: 0 }}
    >
      <div className="w-full px-6 sm:px-8 md:px-16 py-24 sm:py-32 flex justify-between items-start">
        <div>
          <div ref={nameRef}>
            <h2
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontSize: "72px",
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
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "18px",
              fontWeight: "500",
              color: "#fff",
              backgroundColor: "#7c3aed",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "24px",
              padding: "14px 24px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
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
            marginTop: "0",
          }}
        >
          <Link href="/blog" className="hover:opacity-70 transition-opacity flex items-center gap-2">
            Blog <span style={{ fontSize: "16px" }}>↗</span>
          </Link>
          <a
            href="https://www.linkedin.com/in/nicholasbarth/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            LinkedIn <span style={{ fontSize: "16px" }}>↗</span>
          </a>
          <a
            href="/nick_barth_growth_engineer.pdf"
            download
            className="hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            Resume <span style={{ fontSize: "16px" }}>↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
