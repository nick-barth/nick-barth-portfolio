"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxFooter() {
  const nameRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (!nameRef.current || !linksRef.current) return;

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
        <Link href="/">
          <h2
            ref={nameRef}
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "72px",
              fontWeight: "400",
              lineHeight: "0.9",
              color: "#a78bfa",
              margin: 0,
              padding: 0,
              cursor: "pointer",
              display: "block",
            }}
            className="hover:text-purple-300 transition-colors"
          >
            Nick Barth
          </h2>
        </Link>
        <div
          ref={linksRef}
          className="flex flex-col"
          style={{
            fontFamily: '"Geist", "Geist Placeholder", sans-serif',
            fontSize: "16px",
            color: "#f6f4ec",
            marginTop: "0",
          }}
        >
          <Link href="/blog" className="hover:text-gray-400 transition-colors">
            Blog
          </Link>
          <a
            href="https://www.linkedin.com/in/nicholasbarth/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/nick_barth_growth_engineer.pdf"
            download
            className="hover:text-gray-400 transition-colors"
          >
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
