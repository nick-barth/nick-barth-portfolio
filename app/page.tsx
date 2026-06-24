"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [professional, setProfessional] = useState(true);
  const [hitmarkers, setHitmarkers] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const hitmarkerIdRef = useRef(0);

  const createHitmarker = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    // Fire 3 hitmarkers in quick succession
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const id = hitmarkerIdRef.current++;
        setHitmarkers((prev) => [...prev, { id, x, y }]);

        // Remove hitmarker after animation
        setTimeout(() => {
          setHitmarkers((prev) => prev.filter((h) => h.id !== id));
        }, 500);
      }, i * 80);
    }
  };

  const playAirhorns = () => {
    const airhorn = new Audio("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==");

    // Create a quick airhorn sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playAirhorn = (delay: number) => {
      setTimeout(() => {
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        // Airhorn-like frequency sweep
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
      }, delay);
    };

    // Play 10 airhorns with spacing
    for (let i = 0; i < 10; i++) {
      playAirhorn(i * 150);
    }

    setProfessional(true);
  };

  if (professional) {
    return (
      <div className="min-h-screen w-screen bg-white dark:bg-zinc-950 text-black dark:text-white p-8 md:p-16 relative">
        <div className="absolute top-6 right-6 flex gap-8 text-sm font-medium">
          <a href="https://blog.nickbarth.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            Blog
          </a>
          <a href="https://linkedin.com/in/nickbarth" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            LinkedIn
          </a>
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            Resume
          </a>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-7xl md:text-8xl mb-8" style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic", fontWeight: "400" }}>Nick Barth</h1>

          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-12 leading-relaxed">
            Growth Engineer at <a href="https://personio.com" target="_blank" className="font-medium hover:text-black dark:hover:text-white transition-colors underline">Personio</a>, based out of Utrecht — striving to solve business problems through code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-950 via-black to-blue-950 text-cyan-300 overflow-hidden flex flex-col items-center justify-center relative">
      {/* Hitmarkers */}
      {hitmarkers.map((hitmarker) => (
        <div
          key={hitmarker.id}
          style={{
            position: "fixed",
            left: hitmarker.x,
            top: hitmarker.y,
            pointerEvents: "none",
            animation: "hitmarker-pop 0.5s ease-out forwards",
            zIndex: 9999,
          }}
        >
          <img
            src="/hitmarker.png"
            alt="hitmarker"
            style={{
              width: "40px",
              height: "40px",
              transform: "translate(-50%, -50%)",
              filter: "drop-shadow(0 0 2px #00f5ff) drop-shadow(0 0 4px #ff006e)",
            }}
          />
        </div>
      ))}

      {/* Animations */}
      <style>{`
        * {
          outline: none !important;
        }
        a, button {
          outline: none !important;
          border: none !important;
        }
        @keyframes hitmarker-pop {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 10px #ff006e, 0 0 20px #00f5ff; }
          50% { text-shadow: 0 0 30px #ff006e, 0 0 60px #00f5ff, 0 0 100px #b537f2; }
        }
        @keyframes jitter {
          0%, 100% { transform: skew(0deg) rotate(0deg); }
          25% { transform: skew(2deg) rotate(1deg); }
          50% { transform: skew(-2deg) rotate(-1deg); }
          75% { transform: skew(2deg) rotate(1deg); }
        }
        @keyframes zigzag {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .marquee {
          animation: scroll-left 12s linear infinite;
          white-space: nowrap;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }
        .marquee-reverse {
          animation: scroll-right 10s linear infinite;
          white-space: nowrap;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }
        .spin {
          animation: spin 2s linear infinite;
          display: inline-block;
        }
        .spin-reverse {
          animation: spin-reverse 3s linear infinite;
          display: inline-block;
        }
        .bounce {
          animation: bounce 0.8s ease-in-out infinite;
          display: inline-block;
        }
        .glow {
          animation: pulse-glow 1s ease-in-out infinite;
        }
        .jitter {
          animation: jitter 0.1s infinite;
        }
        .zigzag {
          animation: zigzag 2s ease-in-out infinite;
        }
        .scale-pulse {
          animation: scale-pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Multiple spinning money signs - EVERYWHERE */}
      <img src="/skull.gif" alt="skull" className="absolute top-10 left-10 w-16 h-16" />
      <img src="/monster.gif" alt="monster" className="absolute top-20 right-20 w-20 h-20 object-contain" />
      <div className="absolute bottom-20 left-20 text-7xl spin" style={{ animationDelay: "1s" }}>💸</div>
      <div className="absolute bottom-10 right-10 text-9xl spin" style={{ animationDelay: "1.5s" }}>🤑</div>
      <div className="absolute top-1/2 left-1/4 text-7xl spin-reverse" style={{ animationDelay: "0.3s" }}>💴</div>
      <div className="absolute top-1/3 right-1/4 text-8xl spin" style={{ animationDelay: "1.2s" }}>💶</div>
      <div className="absolute top-1/4 left-1/3 text-6xl spin" style={{ animationDelay: "0.8s" }}>💷</div>
      <div className="absolute bottom-1/3 right-1/3 text-7xl spin-reverse" style={{ animationDelay: "2s" }}>💹</div>
      <div className="absolute top-2/3 right-1/4 text-8xl spin" style={{ animationDelay: "0.2s" }}>💲</div>
      <div className="absolute bottom-1/4 left-1/2 text-7xl spin-reverse" style={{ animationDelay: "1.8s" }}>🏆</div>

      {/* Top marquee */}
      <div className="absolute top-0 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white py-3 font-black text-xl overflow-hidden">
        <div className="marquee-reverse" style={{ textTransform: "uppercase" }}>
          👁️ AWARENESS 📝 SIGNUP ⚡ ACTIVATION 💰 CONVERSION 🔄 RETENTION 📈 EXPANSION 👁️ AWARENESS 📝 SIGNUP ⚡ ACTIVATION 💰 CONVERSION 🔄 RETENTION 📈 EXPANSION
        </div>
      </div>

      {/* MAKE IT STOP button */}
      <button
        onClick={playAirhorns}
        onMouseEnter={createHitmarker}
        className="fixed bottom-8 right-8 z-50 px-8 py-4 bg-white text-black font-black text-lg rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-110 shadow-lg"
        style={{ textTransform: "uppercase" }}
      >
        MAKE IT STOP
      </button>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl">
        <h1 className="text-9xl font-black mb-2 glow jitter" style={{ fontFamily: "var(--font-outfit)", textTransform: "uppercase", letterSpacing: "0.08em", color: "#00f5ff" }}>
          NICK BARTH
        </h1>
        <div className="text-4xl font-black mb-6 scale-pulse" style={{ textTransform: "uppercase", color: "#ff006e" }}>
          ⚡ GROWTH ENGINEER ⚡
        </div>

        <p className="text-2xl mb-12 max-w-2xl mx-auto font-black" style={{ fontWeight: "bold", color: "#00f5ff" }}>
          Growth Engineer at <a href="https://personio.com" target="_blank" className="text-pink-400 hover:text-cyan-300 transition-colors underline animate-pulse" style={{ textTransform: "uppercase" }}>PERSONIO</a> 💜<br/>
          <span className="text-lg" style={{ color: "#ff006e" }}>Software engineer by trade, GTM by passion</span>
        </p>

        {/* Chaotic bouncing contact links */}
        <div className="flex justify-center gap-16 text-3xl font-black" style={{ textTransform: "uppercase" }}>
          <a href="https://blog.nickbarth.com" target="_blank" rel="noopener noreferrer" onMouseEnter={createHitmarker} className="bounce zigzag hover:text-pink-300 transition-colors" style={{ animationDelay: "0s", color: "#00f5ff" }}>
            📝 BLOG 📝
          </a>
          <a href="https://linkedin.com/in/nickbarth" target="_blank" rel="noopener noreferrer" onMouseEnter={createHitmarker} className="bounce scale-pulse hover:text-cyan-300 transition-colors" style={{ animationDelay: "0.2s", color: "#ff006e" }}>
            💼 LINKEDIN 💼
          </a>
        </div>

        {/* Extra chaos badge */}
        <div className="mt-8 text-2xl font-black spin" style={{ color: "#00f5ff" }}>
          🏆 GROWTH MASTER 🏆
        </div>
      </div>

{/* Bottom marquee */}
      <div className="absolute bottom-0 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white py-4 font-black text-2xl overflow-hidden">
        <div className="marquee" style={{ textTransform: "uppercase" }}>
          🎯 ONBOARDING FLOWS 🧪 A/B TESTING 📊 FUNNEL OPTIMIZATION 🔗 VIRAL LOOPS 🛑 CHURN REDUCTION 🎣 ENGAGEMENT HOOKS 🎯 ONBOARDING FLOWS 🧪 A/B TESTING 📊 FUNNEL OPTIMIZATION
        </div>
      </div>
    </div>
  );
}
