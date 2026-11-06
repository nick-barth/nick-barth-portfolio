"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui";

const words = ["venue", "bakery", "café", "bar", "restaurant"];

export function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="p-3 md:p-5">
      <div className="relative h-[calc(100svh-24px)] min-h-[620px] overflow-hidden rounded-3xl md:h-[calc(100svh-40px)]">
        <Image src="/case-studies/tebi/img/hero.webp" alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-transparent" />
        <div className="relative flex flex-col items-center px-6 pt-36 text-center text-cream md:pt-40">
          <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-[-0.035em] md:text-7xl">
            Tech that gives your
            <br />
            <span key={i} className="inline-block animate-word-in">
              {words[i]} flow.
            </span>
          </h1>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-cream/90 md:text-lg">
            Tebi intelligently connects your daily operations to your back-office admin so you can run smoother
            service and plan with confidence.
          </p>
          <div className="mt-7 flex gap-3">
            <Button href="#demo" arrow>Book a demo</Button>
            <Button href="#" variant="ghost">Get started</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
