"use client";

import type { ComponentProps } from "react";

/** In-page anchor that scrolls smoothly to its target (instant when the viewer prefers reduced motion). */
export function SmoothLink({ href, onClick, ...rest }: ComponentProps<"a"> & { href: `#${string}` }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        const target = document.getElementById(href.slice(1));
        if (!target || e.defaultPrevented) return;
        e.preventDefault();
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", href);
      }}
      {...rest}
    />
  );
}
