import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { WormBackground } from "@/components/WormBackground";
import { TypingReadout } from "@/components/TypingReadout";
import { ShakeOnKeystroke } from "@/components/ShakeOnKeystroke";
import { MobileTypingBridge } from "@/components/MobileTypingBridge";

export const metadata: Metadata = {
  title: "Would You Still Love Me If I Was a Worm?",
  description: "A very important question.",
  robots: {
    index: false,
    follow: false,
  },
};

const GHOST_PHRASES = [
  { text: "yes.", style: { top: "9%", left: "6%" }, delay: "0s", duration: "6.2s", size: "0.9rem", rotate: -6 },
  { text: "still?", style: { top: "13%", right: "7%" }, delay: "1.4s", duration: "7.1s", size: "0.8rem", rotate: 4 },
  { text: "worm?", style: { bottom: "17%", left: "9%" }, delay: "2.7s", duration: "5.4s", size: "0.85rem", rotate: -3 },
  { text: "please", style: { bottom: "11%", right: "11%" }, delay: "0.7s", duration: "8.3s", size: "0.75rem", rotate: 5 },
  { text: "again", style: { top: "42%", left: "3%" }, delay: "3.6s", duration: "6.6s", size: "0.7rem", rotate: -8 },
  { text: "yes—", style: { top: "47%", right: "4%" }, delay: "1.9s", duration: "7.4s", size: "0.8rem", rotate: 7 },
  { text: "it's fine", style: { bottom: "6%", left: "40%" }, delay: "4.2s", duration: "9s", size: "0.7rem", rotate: -2 },
];

const NOISE_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
  );

const MESSAGE_TEXT_STYLE: CSSProperties = {
  fontFamily: "'PP Pangaia', serif",
  fontWeight: 700,
  fontSize: "clamp(1.75rem, 6.5vw, 4.5rem)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  textAlign: "center",
};

const MESSAGE_TEXT = "YES. TELL ME. WORM?";

function WavyText({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="wavy-letter"
          style={{
            display: "inline-block",
            animationDelay: `${i * 0.06}s`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export default function WouldYouStillLoveMeIfIWasAWorm() {
  return (
    <ShakeOnKeystroke
      className="relative w-screen overflow-hidden flex items-center justify-center worm-page-height"
      style={{
        backgroundColor: "#120f1a",
      }}
    >
      <WormBackground />
      <TypingReadout />
      <MobileTypingBridge />

      {/* readability scrim so the word stays legible over the 3D scene */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(18,15,26,0) 0%, rgba(18,15,26,0.55) 100%)",
        }}
      />

      {/* intrusive flickering fragments */}
      {GHOST_PHRASES.map((g, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute select-none pointer-events-none ghost-phrase"
          style={{
            ...g.style,
            fontFamily: "'PP Pangaia', serif",
            fontSize: g.size,
            color: "rgba(246,244,236,0.4)",
            letterSpacing: "0.08em",
            transform: `rotate(${g.rotate}deg)`,
            animationDelay: g.delay,
            animationDuration: g.duration,
          }}
        >
          {g.text}
        </span>
      ))}

      {/* film grain / static overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none noise-overlay"
        style={{ backgroundImage: `url("${NOISE_SVG}")` }}
      />

      <div className="relative">
        <h1
          aria-hidden
          className="absolute inset-0 select-none glitch-red"
          style={{ ...MESSAGE_TEXT_STYLE, color: "rgba(255,45,85,0.55)", mixBlendMode: "screen" }}
        >
          {MESSAGE_TEXT}
        </h1>
        <h1
          aria-hidden
          className="absolute inset-0 select-none glitch-cyan"
          style={{ ...MESSAGE_TEXT_STYLE, color: "rgba(45,255,255,0.5)", mixBlendMode: "screen" }}
        >
          {MESSAGE_TEXT}
        </h1>
        <h1
          className="relative select-none worm-word"
          style={{
            ...MESSAGE_TEXT_STYLE,
            color: "#f6f4ec",
            textShadow: "0 0 60px rgba(0,0,0,0.6)",
          }}
        >
          <WavyText text={MESSAGE_TEXT} />
        </h1>
      </div>

      <style>{`
        .worm-page-height {
          height: 100vh;
          height: 100dvh;
        }

        @keyframes wormWord {
          0%, 100% {
            transform: scale(1) skewX(0deg);
            filter: blur(0px);
          }
          45% {
            transform: scale(1.06) skewX(-1.5deg);
            filter: blur(0.3px);
          }
          55% {
            transform: scale(0.97) skewX(1.5deg);
            filter: blur(0px);
          }
        }
        .worm-word {
          animation: wormWord 4.5s ease-in-out infinite;
        }

        @keyframes letterWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.16em); }
        }
        @keyframes letterShimmer {
          0%, 100% {
            opacity: 0.88;
            filter: brightness(1) drop-shadow(0 0 0 rgba(255, 233, 199, 0));
          }
          50% {
            opacity: 1;
            filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 233, 199, 0.8));
          }
        }
        .wavy-letter {
          animation: letterWave 2.6s ease-in-out infinite, letterShimmer 2.6s ease-in-out infinite;
        }

        @keyframes glitchRed {
          0%, 92%, 100% { transform: translate(0, 0); opacity: 0; }
          93% { transform: translate(-4px, 1px); opacity: 0.6; }
          95% { transform: translate(3px, -2px); opacity: 0.5; }
          97% { transform: translate(-2px, 2px); opacity: 0.4; }
          98% { transform: translate(0, 0); opacity: 0; }
        }
        .glitch-red {
          animation: glitchRed 3.2s steps(1) infinite;
        }

        @keyframes glitchCyan {
          0%, 91%, 100% { transform: translate(0, 0); opacity: 0; }
          92% { transform: translate(4px, -1px); opacity: 0.55; }
          94% { transform: translate(-3px, 2px); opacity: 0.45; }
          96% { transform: translate(2px, -2px); opacity: 0.4; }
          97.5% { transform: translate(0, 0); opacity: 0; }
        }
        .glitch-cyan {
          animation: glitchCyan 3.2s steps(1) infinite 0.15s;
        }

        @keyframes ghostFlicker {
          0%, 100% { opacity: 0; transform: translateY(0px); }
          6% { opacity: 0.5; transform: translateY(-2px); }
          10% { opacity: 0.1; }
          14% { opacity: 0.45; }
          20% { opacity: 0; }
        }
        .ghost-phrase {
          animation: ghostFlicker 6s ease-in-out infinite both;
        }

        @keyframes noiseShift {
          0% { background-position: 0 0; }
          10% { background-position: -40px 12px; }
          20% { background-position: 30px -20px; }
          30% { background-position: -15px -35px; }
          40% { background-position: 50px 5px; }
          50% { background-position: -30px 25px; }
          60% { background-position: 10px -10px; }
          70% { background-position: -50px 15px; }
          80% { background-position: 25px 30px; }
          90% { background-position: -10px -25px; }
          100% { background-position: 0 0; }
        }
        .noise-overlay {
          mix-blend-mode: overlay;
          opacity: 0.5;
          animation: noiseShift 1.4s steps(2) infinite;
        }
      `}</style>
    </ShakeOnKeystroke>
  );
}
