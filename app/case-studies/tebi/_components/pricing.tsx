"use client";

import { useState } from "react";
import { Button, SectionTitle } from "./ui";

// Slider stops and formula sampled from tebi.com's live calculator:
// subscription = max(0, (revenue − €10K) × 0.2%)
const STOPS_K = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 250, 300];
const subscription = (revenueK: number) => Math.max(0, (revenueK - 10) * 2);

const included = [
  "Point of Sale", "Kitchen Display", "Inventory", "Reservations", "Dashboarding",
  "Payments", "AI Insights", "QR Ordering", "Recipe Management", "CRM",
];

export function Pricing() {
  const [step, setStep] = useState(6);
  const revenue = STOPS_K[step];
  const price = subscription(revenue);
  const pct = (step / (STOPS_K.length - 1)) * 100;

  return (
    <section id="pricing" className="px-4 md:px-5">
      <div className="flex items-end justify-between gap-6">
        <SectionTitle>Pricing that works for you.</SectionTitle>
        <Button href="#" variant="espresso" arrow className="shrink-0">View pricing</Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-olive text-cream">
        <div className="p-6 md:p-8">
          <h3 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-[40px]">
            One platform. One subscription. No contracts.
          </h3>
          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[15px]">Your monthly revenue</p>
              <div className="relative mt-14">
                <span
                  className="absolute -top-12 -translate-x-1/2 rounded-lg border border-cream/70 px-3 py-1 font-display text-xl font-medium"
                  style={{ left: `calc(${pct}% + ${12 - pct * 0.24}px)` }}
                >
                  €{revenue}K
                </span>
                <input
                  type="range"
                  min={0}
                  max={STOPS_K.length - 1}
                  step={1}
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  aria-label="Monthly revenue"
                  className="tebi-range w-full"
                />
              </div>
              <p className="mt-10 text-[15px]">Your subscription</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-7xl font-medium tracking-[-0.04em] md:text-8xl">€{price}</span>
                <span className="text-lg">/mo</span>
              </p>
            </div>

            <div className="border-cream/30 md:border-l md:pl-7">
              <p className="font-display text-xl font-medium">Calculate your subscription</p>
              <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-4">
                <span className="rounded-xl border border-cream/70 px-6 py-3 text-right font-display text-4xl font-medium md:min-w-40">
                  €{revenue}K
                </span>
                <span>monthly revenue</span>
                <span className="rounded-xl border border-cream/70 px-6 py-3 text-right font-display text-4xl font-medium md:min-w-40">
                  €{price}
                </span>
                <span>/mo subscription</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-olive-dark py-3">
          <div className="flex w-max animate-marquee gap-3">
            {[...included, ...included, ...included, ...included].map((m, i) => (
              <span key={i} className="flex items-center gap-2 rounded-lg border border-cream/30 px-3 py-1.5 text-sm">
                ✓ {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
