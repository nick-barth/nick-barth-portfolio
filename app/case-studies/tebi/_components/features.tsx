"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui";

const steps = [
  {
    title: "Run smoother shifts from first booking to final bill.",
    body: "Tebi connects reservations, POS, kitchen display, payments, inventory and more. No more switching apps, just seamless service.",
    video: "/case-studies/tebi/video/feature-1.mp4",
    poster: "/case-studies/tebi/img/feature-1.jpg",
  },
  {
    title: "Know what’s driving success and act with confidence.",
    body: "Track how your daily operations impact your revenue and profit to see what’s working and what needs work. Smart insights help you see blindspots in seconds.",
    video: "/case-studies/tebi/video/feature-2.mp4",
    poster: "/case-studies/tebi/img/feature-2.jpg",
  },
  {
    title: "Tech that gets out of the way for happier staff and guests.",
    body: "Intuitive to learn and easy to master, Tebi helps your team do more with less to deliver better guest experiences and earn more tips.",
    video: "/case-studies/tebi/video/feature-3.mp4",
    poster: "/case-studies/tebi/img/feature-3.jpg",
  },
];

const STEP_MS = 6000;

export function Features() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section id="features" className="mx-auto grid max-w-[1160px] gap-5 px-4 py-6 md:grid-cols-2">
      <div className="relative aspect-[570/630] overflow-hidden rounded-3xl bg-espresso">
        {steps.map((s, i) => (
          <video
            key={s.video}
            src={s.video}
            poster={s.poster}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-x-6 top-6 flex gap-2">
          {steps.map((s, i) => (
            <div key={s.title} className="h-1 flex-1 overflow-hidden rounded-full bg-white/40">
              <div
                key={active}
                className="h-full bg-white"
                style={{
                  width: i < active ? "100%" : "0%",
                  animation: i === active ? `tebi-grow ${STEP_MS}ms linear forwards` : undefined,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-3xl bg-wine p-8 text-cream md:p-10">
        <ol className="space-y-8">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button onClick={() => setActive(i)} className="flex gap-5 text-left">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl border text-lg transition-colors ${
                    i === active ? "border-white bg-white text-wine" : "border-cream/40 text-cream/60"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`transition-opacity ${i === active ? "opacity-100" : "opacity-50"}`}>
                  <span className="block font-display text-2xl font-medium leading-tight tracking-[-0.02em]">
                    {s.title}
                  </span>
                  <span className="mt-3 block text-[15px] leading-relaxed">{s.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-end">
          <Button href="#demo" arrow>Book a demo</Button>
        </div>
      </div>
      <style>{`@keyframes tebi-grow { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}
