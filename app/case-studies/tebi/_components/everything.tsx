"use client";

import { useState } from "react";
import { ArrowRight, SectionTitle } from "./ui";

type Card = { name: string; body: string; cta: string };

// The first group is Tebi's live copy; the rest are filled from their published feature list (llms.txt).
const groups: { title: string; cards: Card[] }[] = [
  {
    title: "Manage orders and payments with fewer taps.",
    cards: [
      { name: "Point of Sale", body: "Run efficient service with an intuitive system, flexible to how your business runs.", cta: "Discover Tebi’s POS" },
      { name: "Kitchen Display", body: "Fly through tickets with spot-on accuracy. Get every order right, with less in your way.", cta: "Discover Tebi’s KDS" },
      { name: "Payments", body: "Quick, secure, and embedded in your flow. Secure reservations, split bills, send invoices.", cta: "Discover Tebi’s Payments" },
      { name: "QR Ordering", body: "More covers, less wait for guests. Take more orders and payments with fewer staff.", cta: "Discover Tebi’s QR Ordering" },
    ],
  },
  {
    title: "Welcome guests and regulars, and make everyone feel recognized.",
    cards: [
      { name: "Reservations", body: "A full reservation system built by Tebi, with no commission per cover.", cta: "Discover Reservations" },
      { name: "Inbox", body: "Every guest message in one place, with AI-drafted replies and one-click booking changes.", cta: "Discover Inbox" },
      { name: "Reserve with Google", body: "Take bookings straight from Google Maps and Search.", cta: "Discover Reservations" },
      { name: "Gift Cards", body: "Sell and redeem gift cards, included in your subscription.", cta: "Discover Payments" },
    ],
  },
  {
    title: "Real-time visibility for more control and fewer errors.",
    cards: [
      { name: "Inventory", body: "Real-time stock tracking that updates with every sale.", cta: "Discover Inventory" },
      { name: "Kitchen Display", body: "Automatic order routing so every station sees what it needs.", cta: "Discover Tebi’s KDS" },
    ],
  },
  {
    title: "One single source of data to keep you flowing.",
    cards: [
      { name: "Insights", body: "AI-powered dashboarding across sales, service and staff.", cta: "Discover Insights" },
      { name: "Bookkeeping", body: "Connects to your accounting tools, so the numbers are already there.", cta: "Discover Insights" },
    ],
  },
  {
    title: "Grow your margins on every sale.",
    cards: [
      { name: "Recipe Management", body: "Know the cost of every dish and price it with confidence.", cta: "Discover Inventory" },
      { name: "Interchange++ pricing", body: "Transparent payment fees, typically reserved for large companies.", cta: "View pricing" },
    ],
  },
];

export function Everything() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-4 py-20 md:px-5">
      <SectionTitle>
        Everything you need
        <br />
        in one connected system.
      </SectionTitle>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <ul className="divide-y divide-espresso/15 border-b border-espresso/15">
          {groups.map((g, i) => (
            <li key={g.title}>
              <button
                onClick={() => setActive(i)}
                className={`w-full max-w-[300px] py-5 text-left font-display text-[22px] font-medium leading-tight tracking-[-0.02em] transition-colors ${
                  i === active ? "text-slate" : "hover:text-slate"
                }`}
              >
                {g.title}
              </button>
            </li>
          ))}
        </ul>
        <div key={active} className="grid animate-word-in content-start gap-4 sm:grid-cols-2">
          {groups[active].cards.map((c) => (
            <div key={c.name} className="rounded-2xl bg-stone p-6">
              <h3 className="text-xl font-medium">{c.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed">{c.body}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1.5 border-b border-espresso pb-0.5 text-[15px]">
                {c.cta} <ArrowRight className="size-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
