import type { Metadata } from "next";
import { Footer } from "../_components/footer";
import { Nav } from "../_components/nav";
import { Button } from "../_components/ui";
import { Card } from "./blocks";
import { hero, sections, type Tone } from "./content";

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
          <h1 className="font-display text-[44px] font-medium leading-none tracking-[-0.05em] md:text-[64px]">{hero.title}</h1>
          <p className={`mt-6 max-w-[870px] ${body}`}>{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#context" variant="espresso">Read the answers</Button>
            <Button href="/case-studies/tebi" arrow>Explore the site</Button>
          </div>
        </section>

        {/* One coloured panel per challenge (colours from Tebi's brief deck, panel from their
            pricing block), with "Why operators choose Tebi"-style cards inside */}
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`scroll-mt-28 rounded-3xl p-6 text-cream md:p-[50px] ${tones[s.tone]} ${i === 0 ? "mt-[90px]" : "mt-5"}`}
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
                <Card key={p.label} className={`min-w-0 text-espresso ${p.wide ? "md:col-span-3" : ""}`}>
                  <h3 className="font-display text-[26px] font-medium leading-[1.2] tracking-[-0.05em]">{p.label}</h3>
                  <div className={`mt-3 ${body}`}>
                    {p.content ?? <p className="text-espresso/45">{p.ask}</p>}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {/* Sign-off, like "Start flowing with Tebi today." */}
        <section className="flex flex-col items-start justify-between gap-6 py-[90px] md:flex-row md:items-center">
          <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">Thanks for reading.</h2>
          <div className="flex gap-3">
            <Button href="/case-studies/tebi" arrow>Explore the site</Button>
            <Button href="https://www.linkedin.com/in/nicholasbarth/" variant="espresso">LinkedIn</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
