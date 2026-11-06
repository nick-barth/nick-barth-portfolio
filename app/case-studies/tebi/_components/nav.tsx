"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { ArrowRight, Chevron } from "./ui";

type Item = { name: string; icon: string; body: string };

export const BASE = "/case-studies/tebi";
const ICONS = `${BASE}/icons`;

// Copy and icons from tebi.com's mega-menu
const menus: { label: string; cols: string; items: Item[] }[] = [
  {
    label: "Features",
    cols: "grid-cols-[repeat(4,290px)]",
    items: [
      { name: "Point of Sale", icon: "point-of-sale", body: "Taking sales with Tebi is intuitive, easy to learn, and connected to keep service flowing." },
      { name: "Reservations", icon: "reservations", body: "Fill your tables with valuable guests, and turn a busy floor into more predictable revenue." },
      { name: "Kitchen Display", icon: "kitchen-display", body: "Orders flow directly from your POS to the kitchen in real time. Fly through tickets without costly mistakes." },
      { name: "Payments", icon: "payments", body: "Restaurant payment processing that captures every bill, tip, and pre-payment." },
      { name: "QR ordering", icon: "qr-ordering", body: "From table to prep ticket to payment, serve guests faster and let the floor run itself." },
      { name: "Inventory", icon: "inventory", body: "With speedy sales and accurate stock-keeping, you can monitor your products in one view." },
      { name: "Insights", icon: "insights", body: "Understand how your daily ops drive real-time revenue, so you can grow your business confidently." },
    ],
  },
  {
    label: "Business types",
    cols: "grid-cols-[repeat(3,290px)]",
    items: [
      { name: "Restaurants", icon: "restaurants", body: "Tebi connects your front and back-of-house for smoother service and intuitive insights." },
      { name: "Bars & Clubs", icon: "bars-clubs", body: "Take orders fast, keep tabs open or closed, and get paid instantly." },
      { name: "Cafes & Bakeries", icon: "cafes-bakeries", body: "Speed through sales and get orders right every time." },
      { name: "Quick Service", icon: "quick-service", body: "One system to run your shop smoother and plan smarter." },
      { name: "Events & Venues", icon: "events-venues", body: "Run bar service, private dining, or anything in between with a system that adapts to your space." },
    ],
  },
  {
    label: "Resources",
    cols: "grid-cols-[repeat(2,290px)]",
    items: [
      { name: "Help Center", icon: "help-center", body: "Learn how to use Tebi, find answers, become a Tebi pro." },
      { name: "Blog", icon: "blog", body: "What we're building and why we build it." },
      { name: "Support", icon: "support", body: "Contact our support team." },
      { name: "Tebi Status", icon: "tebi-status", body: "Check the status of the app, back office, and payments." },
    ],
  },
];

/** Single-colour icon via CSS mask, so it follows the text colour like the original. */
function MenuIcon({ name }: { name: string }) {
  const url = `url(${ICONS}/${name}.svg)`;
  return (
    <span
      aria-hidden
      className="size-5 shrink-0 bg-current"
      style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" }}
    />
  );
}

/** `tone` is the background the nav first sits on: a dark photo hero, or a light cream page. */
export function Nav({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const pathname = usePathname();
  const onCaseStudy = pathname === `${BASE}/case-study`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpenState] = useState<number | null>(null);
  // Last opened panel stays rendered while the menu collapses
  const [panel, setPanel] = useState(0);
  const setOpen = (i: number | null) => {
    setOpenState(i);
    if (i !== null) setPanel(i);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const isOpen = open !== null;
  // Dark text only while transparent over a light page
  const light = tone === "light" && !scrolled;
  // Open: frosted cream panel with espresso text. At the top: transparent. Scrolled: smoked glass on every page, like tebi.com.
  const surface = isOpen
    ? "bg-[#faf9f6]/90 text-espresso shadow-2xl backdrop-blur-2xl"
    : scrolled
      ? "bg-espresso/55 text-cream backdrop-blur-xl"
      : light
        ? "bg-transparent text-espresso"
        : "bg-transparent text-cream";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-5" onMouseLeave={() => setOpen(null)}>
      <nav className={`rounded-2xl px-4 py-3 transition-[background-color,color,box-shadow] duration-300 md:px-5 ${surface}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href={BASE}
              className={`transition-colors duration-300 ${isOpen || light ? "text-espresso" : "text-butter"}`}
              aria-label="Tebi home"
            >
              <Logo className="h-[34px] w-auto" />
            </Link>
            <ul className="hidden items-center gap-1 text-[15px] lg:flex">
              {menus.map((m, i) => (
                <li key={m.label}>
                  <button
                    onMouseEnter={() => setOpen(i)}
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 transition-colors ${
                      open === i ? "bg-butter text-espresso" : ""
                    }`}
                  >
                    {m.label}
                    <Chevron className={`size-3 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                </li>
              ))}
              <li onMouseEnter={() => setOpen(null)}>
                <Link href={`${BASE}#pricing`} className="block px-3 py-2.5">Pricing</Link>
              </li>
              <li onMouseEnter={() => setOpen(null)}>
                <Link
                  href={`${BASE}/case-study`}
                  aria-current={onCaseStudy ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2.5 transition-colors ${onCaseStudy ? "bg-butter text-espresso" : ""}`}
                >
                  Case Study
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-4 text-[15px]" onMouseEnter={() => setOpen(null)}>
            <a href="#" className="hidden md:inline">Log in</a>
            <span className={`hidden h-4 w-px md:block ${isOpen || light ? "bg-espresso/30" : "bg-cream/40"}`} />
            <a href="#" className="hidden md:inline">Get started</a>
            <Link
              href={`${BASE}#demo`}
              className="inline-flex items-center gap-2 rounded-lg bg-butter px-4 py-2.5 font-medium text-espresso hover:bg-[#efdc3f]"
            >
              Book a demo <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Mega-menu panel: animates open with the grid-rows trick */}
        <div
          className={`hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:grid ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-3 border-t border-espresso/15 pb-10 pt-8">
              <ul key={panel} className={`grid min-h-[200px] animate-word-in gap-y-12 ${menus[panel].cols}`}>
                {menus[panel].items.map((item) => (
                  <li key={item.name}>
                    <a href="#" className="group block max-w-[250px]">
                      <span className="flex items-center gap-2 text-[14px] font-medium">
                        <MenuIcon name={item.icon} />
                        <span className="group-hover:underline">{item.name}</span>
                      </span>
                      <span className="mt-2 block text-[12.5px] leading-relaxed text-espresso/65">{item.body}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
