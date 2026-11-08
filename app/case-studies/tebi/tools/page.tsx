import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../_components/footer";
import { Nav } from "../_components/nav";
import { tools } from "./tools";

export const metadata: Metadata = {
  title: "Gratis horeca tools — Tebi case study · Nick Barth",
  description: "Three free calculators for horeca owners: seasonal subscription, card fees and cost per dish.",
};

export default function Tools() {
  return (
    <>
      <Nav tone="light" />
      <main className="px-3 pb-24 md:px-5">
        <section className="pt-[150px] md:pt-[200px]">
          <h1 className="font-display text-[44px] font-medium leading-none tracking-[-0.05em] md:text-[64px]">Gratis horeca tools</h1>
          <p className="mt-6 max-w-[760px] text-base font-medium leading-6 tracking-[-0.02em]">
            Three calculators owners look for before they switch POS. Comparison sites have them but leave Tebi out, and
            Lightspeed only has a food cost calculator. Each one runs on Tebi&apos;s real pricing and ends at a demo.
          </p>
        </section>
        <div className="mt-[60px] grid gap-3 md:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.slug} href={`/case-studies/tebi/tools/${t.slug}`} className={`flex min-h-[260px] flex-col justify-between rounded-[28px] p-6 text-cream md:p-[30px] ${t.tone}`}>
              <p className="text-sm text-cream/70">{t.label}</p>
              <div>
                <p className="font-display text-[32px] font-medium leading-none tracking-[-0.04em]">{t.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-cream/80">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
