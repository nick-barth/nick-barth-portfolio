"use client";

import Link from "next/link";

export default function ParallaxFooter() {
  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#000", position: "relative", zIndex: 0 }}
    >
      <div className="w-full px-6 sm:px-8 md:px-16 py-24 sm:py-32 flex justify-between items-start">
        <Link href="/">
          <h2
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
