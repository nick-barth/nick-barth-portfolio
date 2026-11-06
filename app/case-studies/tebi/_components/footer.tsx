import Image from "next/image";
import { Logo } from "./logo";
import { Button } from "./ui";

const columns = [
  { title: "Business types", links: ["Restaurants", "Bars & Clubs", "Cafes & Bakeries", "Quick Service", "Events & Venues"] },
  { title: "Features", links: ["Point of Sale", "Reservations", "Inbox", "Kitchen Display", "Payments", "QR ordering", "Inventory", "Insights", "Hardware"] },
  { title: "Company", links: ["About", "Pricing", "Blog", "Careers", "Refer a friend"] },
  { title: "Resources", links: ["Privacy Policy", "Changelog", "Terms of Use", "Help Center", "Support", "Tebi Status", "Allergen matrix"] },
];

export function Cta() {
  return (
    <section id="demo" className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-6 px-4 pb-24 md:flex-row md:items-center">
      <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">Start flowing with Tebi today.</h2>
      <div className="flex gap-3">
        <Button href="#" arrow>Book a demo</Button>
        <Button href="#" variant="espresso">Get started</Button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="px-3 pb-3 md:px-5 md:pb-5">
      <div className="relative overflow-hidden rounded-3xl bg-espresso p-8 text-cream md:p-14">
        <Image src="/case-studies/tebi/img/footer-flow.png" alt="" fill sizes="100vw" className="object-cover object-right" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="flex flex-col justify-between gap-10">
            <Logo className="h-20 w-auto self-start text-butter" />
            <p className="text-sm text-cream/70">English</p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="font-display text-lg font-medium text-butter">{c.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-butter">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="relative mt-14 text-xs text-cream/60">© 2026 Tebi B.V.</p>
      </div>
    </footer>
  );
}
