"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { FINGERPRINT_PATH } from "./fingerprintPath";

interface Droplet {
  dx: number;
  dy: number;
  r: number;
  opacity: number;
}

interface Stain {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  droplets: Droplet[];
}

const MAX_STAINS = 30;

function generateDroplets(): Droplet[] {
  const count = 8 + Math.floor(Math.random() * 8);
  const droplets: Droplet[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 14 + Math.random() * 46;
    droplets.push({
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      r: 1 + Math.random() * 3.2,
      opacity: 0.25 + Math.random() * 0.6,
    });
  }
  return droplets;
}

export function BloodSplatterZone({ children }: { children: ReactNode }) {
  const [stains, setStains] = useState<Stain[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const stain: Stain = {
      id: nextId.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      rotation: Math.random() * 360,
      scale: 0.85 + Math.random() * 0.4,
      droplets: generateDroplets(),
    };

    setStains((prev) => [...prev.slice(-(MAX_STAINS - 1)), stain]);
  }

  function removeStain(id: number) {
    setStains((prev) => prev.filter((stain) => stain.id !== id));
  }

  return (
    <div ref={containerRef} className="relative" onPointerDown={handlePointerDown}>
      {children}
      {stains.map((stain) => (
        <BloodSplat key={stain.id} {...stain} onDone={() => removeStain(stain.id)} />
      ))}
    </div>
  );
}

// A relaxed adult fingertip print runs roughly 15-18mm across. Mobile
// browsers report CSS px at a fixed ~160/inch regardless of device pixel
// ratio, so this width holds that real-world size on any phone.
const FINGERPRINT_WIDTH = 46;
const FINGERPRINT_HEIGHT = 72;

function BloodSplat({
  x,
  y,
  rotation,
  scale,
  droplets,
  onDone,
}: Omit<Stain, "id"> & { onDone: () => void }) {
  return (
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: FINGERPRINT_WIDTH,
        height: FINGERPRINT_HEIGHT,
        zIndex: 40,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      <svg
        className="blood-splat-pop"
        width={FINGERPRINT_WIDTH}
        height={FINGERPRINT_HEIGHT}
        viewBox="0 0 1062 1655"
        xmlns="http://www.w3.org/2000/svg"
        onAnimationEnd={onDone}
      >
        <path d={FINGERPRINT_PATH} fill="#ff1414" fillOpacity="0.88" />
      </svg>
      {droplets.map((d, i) => (
        <div
          key={i}
          className="blood-droplet-pop absolute rounded-full"
          style={{
            left: `calc(50% + ${d.dx}px)`,
            top: `calc(50% + ${d.dy}px)`,
            width: d.r * 2,
            height: d.r * 2,
            backgroundColor: "#ff1414",
            ["--peak-opacity" as string]: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
