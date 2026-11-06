"use client";

import { useRef, type ReactNode } from "react";
import { Chevron } from "./ui";

type Props = {
  heading: ReactNode;
  children: ReactNode;
  dark?: boolean;
};

/** Horizontal snap carousel with prev/next arrows aligned to the heading row. */
export function Carousel({ heading, children, dark = false }: Props) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const arrow = dark
    ? "bg-cream/15 text-cream hover:bg-cream/25"
    : "bg-espresso/10 text-espresso hover:bg-espresso/20";

  return (
    <div>
      <div className="flex items-end justify-between gap-6 px-4 md:px-5">
        {heading}
        <div className="hidden shrink-0 gap-2 md:flex">
          <button onClick={() => scroll(-1)} aria-label="Previous" className={`grid size-9 place-items-center rounded-full ${arrow}`}>
            <Chevron className="size-3 rotate-90" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Next" className={`grid size-9 place-items-center rounded-full ${arrow}`}>
            <Chevron className="size-3 -rotate-90" />
          </button>
        </div>
      </div>
      <div ref={track} className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 md:scroll-px-5 md:px-5">
        {children}
      </div>
    </div>
  );
}
