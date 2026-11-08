"use client";

// Shared, non-React mutable state so the 3D hand (inside a Canvas, driven by
// useFrame) can react to real keystrokes without going through React state /
// re-renders on every keypress.
export const typingState = {
  seq: 0,
  lastAt: 0,
};

let initialized = false;

const IGNORED_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "Tab",
  "Escape",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

export function initTypingActivity() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  window.addEventListener("keydown", (e) => {
    if (IGNORED_KEYS.has(e.key)) return;
    typingState.seq += 1;
    typingState.lastAt = performance.now() / 1000;
  });
}

// Fired when the user presses Enter, carrying whatever they'd typed so far —
// lets the 3D scene (which has no access to the readout's DOM-side React
// state) spawn something from the submitted text.
export type Submission = { text: string; id: number };

let submissionIdCounter = 0;
const submissionListeners = new Set<(s: Submission) => void>();

export function submitTypedText(text: string) {
  const submission: Submission = { text, id: ++submissionIdCounter };
  submissionListeners.forEach((listener) => listener(submission));
}

export function onSubmission(fn: (s: Submission) => void) {
  submissionListeners.add(fn);
  return () => {
    submissionListeners.delete(fn);
  };
}
