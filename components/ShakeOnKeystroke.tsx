"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function ShakeOnKeystroke({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeydown() {
      const el = ref.current;
      if (!el) return;
      el.classList.remove("keystroke-shake");
      void el.offsetWidth; // force reflow so the animation retriggers on rapid keys
      el.classList.add("keystroke-shake");
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
      <style>{`
        @keyframes keystrokeShake {
          0% { transform: translate(0, 0) scale(1); }
          6% { transform: translate(1px, 14px) scale(0.985, 1.02); }
          14% { transform: translate(-2px, -5px) scale(1.01, 0.99); }
          26% { transform: translate(1px, 2px) scale(1); }
          40% { transform: translate(-1px, -1px) scale(1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .keystroke-shake {
          animation: keystrokeShake 0.32s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
      `}</style>
    </div>
  );
}
