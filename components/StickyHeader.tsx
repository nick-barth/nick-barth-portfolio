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
  const hamburgerRef = useRef(null);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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

    // Hamburger button moves down with nav
    if (hamburgerRef.current) {
      gsap.to(hamburgerRef.current, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "200px top",
          scrub: 0.3,
          markers: false,
        },
        y: 12,
      });
    }

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
      <div className="flex justify-between items-start px-6 sm:px-8 md:px-16 py-3 sm:py-4">
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

        {/* Desktop nav */}
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

        {/* Mobile menu button */}
        <button
          ref={hamburgerRef}
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            fontFamily: '"Geist", "Geist Placeholder", sans-serif',
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#000",
            padding: 0,
            transition: "transform 0.3s ease",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu drawer */}
      <div
        className="sm:hidden"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderTop: "1px solid #e0e0e0",
          maxHeight: menuOpen ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          fontFamily: '"Geist", "Geist Placeholder", sans-serif',
          fontSize: "16px",
        }}
      >
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <a
            href="/blog"
            className="hover:text-gray-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </a>
          <a
            href="https://www.linkedin.com/in/nicholasbarth/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            LinkedIn
          </a>
          <a
            href="/nick_barth_growth_engineer.pdf"
            download
            className="hover:text-gray-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}
