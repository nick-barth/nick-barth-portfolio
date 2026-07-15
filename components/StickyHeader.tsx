"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyHeader() {
  const headerRef = useRef(null);
  const nameRef = useRef(null);
  const navRef = useRef(null);
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    if (!headerRef.current || !nameRef.current || !navRef.current) return;

    gsap.to(headerRef.current, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "100px top",
        onUpdate: (self) => {
          setBgOpacity(self.progress);
        },
        markers: false,
      },
    });

    // Name moves down slightly as you scroll
    gsap.to(nameRef.current, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "200px top",
        scrub: 0.5,
        markers: false,
      },
      y: 8,
    });

    // Nav moves down slightly as you scroll (faster than name)
    gsap.to(navRef.current, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "200px top",
        scrub: 0.3,
        markers: false,
      },
      y: 12,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="w-full sticky top-0 z-50"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
      }}
    >
      <div className="w-full mx-auto flex justify-between items-start px-6 sm:px-8 md:px-16 py-3 sm:py-4" style={{ maxWidth: "1200px" }}>
        <div ref={nameRef}>
          <h1
            className="font-black mb-2"
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontWeight: "500",
              lineHeight: "1.1",
              fontSize: "32px",
            }}
          >
            Nick Barth
          </h1>
        </div>

        <nav
          ref={navRef}
          className="hidden sm:flex flex-row gap-8 text-right"
          style={{
            fontFamily: '"Geist", "Geist Placeholder", sans-serif',
            fontSize: "16px",
          }}
        >
          <a href="/blog" className="hover:text-gray-600 transition-colors">
            Blog
          </a>
          <a
            href="https://www.linkedin.com/in/nicholasbarth/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/nick_barth_growth_engineer.pdf"
            download
            className="hover:text-gray-600 transition-colors"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
