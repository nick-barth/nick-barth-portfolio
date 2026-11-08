"use client";

import { useEffect, useRef } from "react";

// Mobile browsers don't reliably fire real `keydown` events from the virtual
// keyboard, and a virtual keyboard only appears when a real focusable input
// has focus. This bridges the gap: tapping anywhere focuses a hidden input,
// and its `input` events (which mobile keyboards DO fire correctly) get
// re-dispatched as synthetic `keydown` events on window — so the existing
// hand-tap / shake / readout logic (all listening on window) work unchanged.
export function MobileTypingBridge() {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef("");

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarsePointer) return;

    function handleTap() {
      inputRef.current?.focus();
    }
    window.addEventListener("touchstart", handleTap, { passive: true });
    return () => window.removeEventListener("touchstart", handleTap);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const prev = prevValueRef.current;

    if (value.length < prev.length) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));
    } else if (value.length > prev.length) {
      const added = value.slice(prev.length);
      for (const ch of added) {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: ch, bubbles: true }));
      }
    }

    prevValueRef.current = value;
    if (value.length > 200) {
      e.target.value = "";
      prevValueRef.current = "";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      aria-hidden
      tabIndex={-1}
      style={{
        position: "absolute",
        opacity: 0,
        height: 1,
        width: 1,
        pointerEvents: "none",
        left: 0,
        top: 0,
      }}
    />
  );
}
