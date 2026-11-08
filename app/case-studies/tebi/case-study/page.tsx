import type { Metadata } from "next";
import { Footer } from "../_components/footer";
import { Nav } from "../_components/nav";
import { Card } from "./blocks";
import { hero, sections, type Tone } from "./content";
import { SmoothLink } from "./smooth-link";

export const metadata: Metadata = {
  title: "Case study — Tebi Growth Marketer · Nick Barth",
  description: "Nick Barth's answers to Tebi's Growth Marketer case study.",
};

// Type scale measured from tebi.com/compare pages
const h2 = "font-display text-[36px] font-medium leading-none tracking-[-0.02em] md:text-[48px]";
const body = "text-base font-medium leading-6 tracking-[-0.02em]";

const tones: Record<Tone, string> = {
  espresso: "bg-espresso",
  slate: "bg-slate",
  wine: "bg-wine",
  olive: "bg-olive",
};

export default function CaseStudyPage() {
  return (
    <>
      <Nav tone="light" />
      <main className="px-3 md:px-5">
        {/* Hero */}
        <section className="pt-[150px] md:pt-[200px]">
          <p className="text-sm text-espresso/60">Nick Barth · 💹 Growth 💹 · November 2026</p>
          <h1 className="mt-4 max-w-[1100px] font-display text-[48px] font-medium leading-[0.95] tracking-[-0.05em] md:text-[88px]">
            {hero.title}
          </h1>
          {/* The three challenges, in their panel colours */}
          <nav aria-label="Challenges" className="mt-12 grid gap-3 md:grid-cols-3">
            {sections
              .filter((s) => s.num)
              .map((s) => (
                <SmoothLink
                  key={s.id}
                  href={`#${s.id}`}
                  className={`group flex min-h-[132px] flex-col justify-between rounded-[18px] p-5 text-cream transition-transform hover:-translate-y-0.5 ${tones[s.tone]}`}
                >
                  <span className="text-sm text-cream/70">{s.num}</span>
                  <span className="flex items-end justify-between gap-3 font-display text-2xl font-medium leading-tight tracking-[-0.03em]">
                    {s.title}
                    <span aria-hidden className="text-cream/60 transition-transform group-hover:translate-y-0.5">↓</span>
                  </span>
                </SmoothLink>
              ))}
          </nav>
        </section>

        {/* One coloured panel per challenge (colours from Tebi's brief deck, panel from their
            pricing block), with "Why operators choose Tebi"-style cards inside */}
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`scroll-mt-28 rounded-3xl p-6 text-cream md:p-[50px] ${tones[s.tone]} ${i === 0 ? "mt-[90px]" : "mt-5"} ${i === sections.length - 1 ? "mb-[90px]" : ""}`}
          >
            <div className="flex items-start gap-4">
              {s.num && (
                <span className="mt-1 grid h-9 shrink-0 place-items-center rounded-lg border border-cream/60 px-2.5 text-sm md:mt-2">
                  {s.num}
                </span>
              )}
              <h2 className={h2}>{s.title}</h2>
            </div>
            {s.intro && <p className={`mt-4 max-w-[870px] ${body} text-cream/80`}>{s.intro}</p>}
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {s.parts.map((p) => (
                <Card key={p.label} className={`min-w-0 text-espresso ${p.wide ? "md:col-span-3" : p.double ? "md:col-span-2" : ""}`}>
                  <h3 className="font-display text-[26px] font-medium leading-[1.2] tracking-[-0.05em]">{p.label}</h3>
                  <div className={`mt-3 ${body}`}>
                    {p.content ?? <p className="text-espresso/45">{p.ask}</p>}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}

      </main>
      <Footer />
    </>
  );
}
