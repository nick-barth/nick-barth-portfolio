"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function ParallaxFooter() {
  const nameRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const footerRect = footerRef.current.getBoundingClientRect();
      const footerTop = footerRect.top;
      const windowHeight = window.innerHeight;

      // Only apply parallax when footer is in view
      if (footerTop < windowHeight && footerTop > -footerRect.height) {
        const distance = windowHeight - footerTop;
        const parallaxAmount = (distance / windowHeight) * 100;

        if (nameRef.current) {
          nameRef.current.style.transform = `translateY(${parallaxAmount * 0.3}px)`;
        }

        if (linksRef.current) {
          linksRef.current.style.transform = `translateY(${parallaxAmount * 0.5}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="w-full" style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div className="px-6 sm:px-8 md:px-16 py-24 sm:py-32 flex justify-between items-start">
        <Link href="/">
          <div ref={nameRef}>
            <h2
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontSize: "72px",
                fontWeight: "400",
                lineHeight: "1",
                color: "#f6f4ec",
                margin: 0,
                cursor: "pointer",
              }}
              className="hover:text-gray-400 transition-colors"
            >
              Nick Barth
            </h2>
          </div>
        </Link>
        <div
          ref={linksRef}
          className="flex flex-col gap-3 text-right"
          style={{
            fontFamily: '"Geist", "Geist Placeholder", sans-serif',
            fontSize: "16px",
            color: "#f6f4ec",
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
