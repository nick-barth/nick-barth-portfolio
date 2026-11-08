"use client";

import { useEffect, useState } from "react";
import { submitTypedText } from "./typingActivity";

// Restricted to the core Combining Diacritical Marks block (U+0300-U+0338),
// which has near-universal font coverage. The extended/rare marks further
// out (U+034A+, U+0350+, U+0360+) are missing from most system fonts and
// render as tofu boxes instead of stacking on the letter.
const ZALGO_UP = [
  "̀",
  "́",
  "̂",
  "̃",
  "̄",
  "̅",
  "̆",
  "̇",
  "̈",
  "̉",
  "̊",
  "̋",
  "̌",
  "̍",
  "̎",
  "̑",
];

const ZALGO_DOWN = [
  "̖",
  "̗",
  "̘",
  "̙",
  "̞",
  "̟",
  "̠",
  "̤",
  "̥",
  "̦",
  "̮",
  "̯",
  "̰",
  "̱",
  "̲",
  "̳",
];

const ZALGO_MID = ["̴", "̵", "̶", "̷", "̸"];

function randomFrom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function zalgify(input: string, intensity: number): string {
  let out = "";
  for (const ch of input) {
    out += ch;
    if (ch === "\n" || ch === " ") continue;
    const upCount = Math.floor(Math.random() * intensity);
    const downCount = Math.floor(Math.random() * intensity);
    const midCount = Math.random() < 0.15 ? 1 : 0;
    for (let i = 0; i < upCount; i++) out += randomFrom(ZALGO_UP);
    for (let i = 0; i < downCount; i++) out += randomFrom(ZALGO_DOWN);
    for (let i = 0; i < midCount; i++) out += randomFrom(ZALGO_MID);
  }
  return out;
}

const LINE_CHAR_LIMIT = 30;

export function TypingReadout() {
  const [text, setText] = useState("");

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      setText((prev) => {
        if (e.key === "Backspace") return prev.slice(0, -1);
        if (e.key === "Enter") {
          const submitted = prev.split("\n").pop() ?? "";
          if (submitted.trim().length > 0) submitTypedText(submitted);
          return (prev + "\n").slice(-160);
        }
        if (e.key === " " || e.key.length === 1) {
          const currentLine = prev.split("\n").pop() ?? "";
          if (currentLine.length >= LINE_CHAR_LIMIT) return prev;
          return (prev + e.key).slice(-160);
        }
        return prev;
      });
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // the more you type, the more cursed it gets (kept subtle)
  const intensity = 0.15 + Math.min(text.length / 80, 0.45);
  const displayText = zalgify(text, intensity);

  return (
    <div
      aria-hidden
      className="absolute select-none pointer-events-none"
      style={{
        bottom: "13%",
        right: "6%",
        maxWidth: "min(72vw, 380px)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "0.85rem",
        color: "rgba(246,244,236,0.5)",
        letterSpacing: "0.03em",
        textShadow: "0 0 14px rgba(0,0,0,0.75)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        lineHeight: 1.7,
        textAlign: "right",
      }}
    >
      {displayText}
      <span
        style={{
          display: "inline-block",
          animation: "typingCursorBlink 1s steps(1) infinite",
        }}
      >
        _
      </span>
      <style>{`
        @keyframes typingCursorBlink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
