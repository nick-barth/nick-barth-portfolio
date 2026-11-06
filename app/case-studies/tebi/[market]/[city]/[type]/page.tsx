import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../../_components/footer";
import { Nav } from "../../../_components/nav";
import { Button } from "../../../_components/ui";
import { allLocalPages, localPage } from "../../../local-pages";

// Only the generated combinations exist; anything else 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return allLocalPages();
}

type Props = { params: Promise<{ market: string; city: string; type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market, city, type } = await params;
  const page = localPage(market, city, type);
  if (!page) return {};
  // Inherits noindex/nofollow from the case-study layout
  return { title: `${page.h1} | Tebi`, description: page.intro };
}

export default async function LocalPage({ params }: Props) {
  const { market, city, type } = await params;
  const page = localPage(market, city, type);
  if (!page) notFound();
  const { copy, lang } = page.market;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Nav tone="dark" />
      <main lang={lang} className="px-3 pb-24 md:px-5">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        {/* Hero, like tebi.com/berlin: photo left, headline right, on espresso */}
        <section className="pt-3 md:pt-5">
          <div className="grid gap-3 rounded-3xl bg-espresso p-3 text-cream md:grid-cols-2 md:p-3">
            <div className="flex flex-col justify-center px-4 pb-8 pt-24 md:order-2 md:px-10 md:py-28">
              <nav aria-label="Breadcrumb" className="text-sm text-cream/60">
                <Link href="/case-studies/tebi/local" className="hover:text-cream hover:underline">{copy.all}</Link>
                {" / "}
                {page.market.name} / {page.city.name}
              </nav>
              <h1 className="mt-3 font-display text-[40px] font-medium leading-none tracking-[-0.05em] md:text-[56px]">{page.h1}</h1>
              <p className="mt-6 max-w-[520px] text-base font-medium leading-6 tracking-[-0.02em] text-cream/85">{page.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/case-studies/tebi#demo" arrow>{copy.demo}</Button>
                <Button href="/case-studies/tebi#demo" variant="ghost">{copy.start}</Button>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl md:order-1 md:aspect-auto md:min-h-[640px]">
              <Image src={page.hero.image} alt="" fill preload sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              {page.hero.label && (
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-lg bg-espresso/70 px-3 py-1.5 text-xs text-butter backdrop-blur">
                  <span aria-hidden>◉</span> {page.hero.label}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Real Tebi venues in this city, only where Tebi has published them */}
        {page.venues.length > 0 && page.venuesHeading && (
          <section className="mt-[90px]">
            <h2 className="font-display text-[36px] font-medium leading-none tracking-[-0.02em] md:text-[48px]">{page.venuesHeading}</h2>
            <div className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto">
              {page.venues.map((v) => (
                <figure key={v.name} className="relative aspect-[4/5] w-[70vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl">
                  <Image src={v.image} alt="" fill sizes="300px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {v.logo && <Image src={v.logo} alt="" width={102} height={58} className="absolute left-5 top-5 h-10 w-auto" />}
                  <figcaption className="absolute bottom-5 left-5 font-display text-2xl font-medium tracking-[-0.02em] text-cream">{v.name}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="mt-[90px] grid gap-5 md:grid-cols-3">
          {page.cards.map((c) => (
            <div key={c.title} className="rounded-[18px] bg-white p-6 md:p-[30px]">
              <h2 className="font-display text-[26px] font-medium leading-[1.2] tracking-[-0.05em]">{c.title}</h2>
              <p className="mt-3 text-base font-medium leading-6 tracking-[-0.02em] text-espresso/75">{c.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-[90px] grid gap-8 md:grid-cols-2">
          <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">FAQ</h2>
          <div className="space-y-2">
            {page.faq.map((f) => (
              <details key={f.q} className="group rounded-xl bg-white px-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium">
                  {f.q}
                  <span aria-hidden className="transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-espresso/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-6 py-[90px] md:flex-row md:items-center">
          <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">{page.cta}</h2>
          <div className="flex gap-3">
            <Button href="/case-studies/tebi#demo" arrow>{copy.demo}</Button>
            <Button href="/case-studies/tebi#demo" variant="espresso">{copy.start}</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
