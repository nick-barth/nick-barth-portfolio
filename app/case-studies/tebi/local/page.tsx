import type { Metadata } from "next";
import { Footer } from "../_components/footer";
import { Nav } from "../_components/nav";
import { allLocalPages, localPage, markets } from "../local-pages";
import { Directory, type DirectoryMarket } from "./directory";

export const metadata: Metadata = {
  title: "Local pages — Tebi case study · Nick Barth",
  description: "Directory of generated city × venue-type landing pages across Tebi's seven markets.",
};

export default function LocalIndex() {
  const total = allLocalPages().length;
  const cityCount = markets.reduce((n, m) => n + m.cities.length, 0);
  const venueCount = Object.keys(markets[0].copy.venues).length;
  const langCount = new Set(markets.map((m) => m.lang)).size;

  // Precompute every headline on the server so the client switcher only toggles markets
  const directory: DirectoryMarket[] = markets.map((m) => {
    const venues = Object.values(m.copy.venues).map((v) => ({ slug: v.slug, label: v.plural }));
    return {
      code: m.code,
      name: m.name,
      lang: m.lang,
      venues,
      cities: m.cities.map((c) => ({
        slug: c.slug,
        name: c.name,
        pages: venues.map((v) => ({ slug: v.slug, h1: localPage(m.code, c.slug, v.slug)?.h1 ?? "" })),
      })),
    };
  });

  const example = localPage("nl", "amsterdam", "wijnbar");
  const anatomy = [
    { part: "/nl", label: "markets", count: markets.length, examples: markets.map((m) => `/${m.code}`).join(" "), tint: "bg-butter" },
    {
      part: "/amsterdam",
      label: "cities per market",
      count: markets[0].cities.length,
      examples: markets[0].cities.map((c) => `/${c.slug}`).join(" "),
      tint: "bg-[#dfe7f1]",
    },
    {
      part: "/wijnbar",
      label: "venue types per city",
      count: venueCount,
      examples: Object.values(markets[0].copy.venues).map((v) => `/${v.slug}`).join(" "),
      tint: "bg-[#f1e0d3]",
    },
  ];

  const stats = [
    { value: total, label: "pages" },
    { value: markets.length, label: "markets" },
    { value: cityCount, label: "cities" },
    { value: venueCount, label: "venue types" },
    { value: langCount, label: "languages" },
  ];

  return (
    <>
      <Nav tone="light" />
      <main className="px-3 pb-24 md:px-5">
        <section className="pt-[150px] md:pt-[200px]">
          <h1 className="font-display text-[44px] font-medium leading-none tracking-[-0.05em] md:text-[64px]">Local pages</h1>
          <p className="mt-6 max-w-[760px] text-base font-medium leading-6 tracking-[-0.02em]">
            One page for every city and venue type in Tebi&apos;s markets, in the local language, answering the questions owners
            ask AI. Generated from one template; the live version would add local customers, local rules and Tebi&apos;s own data.
          </p>
        </section>

        {/* Headline numbers */}
        <section className="mt-[60px] grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s, i) => (
            <div key={s.label} className={`rounded-[18px] p-6 ${i === 0 ? "bg-espresso text-cream" : "bg-white"}`}>
              <p className="font-display text-[48px] font-medium leading-none tracking-[-0.05em]">{s.value}</p>
              <p className={`mt-2 text-sm ${i === 0 ? "text-cream/70" : "text-espresso/60"}`}>{s.label}</p>
            </div>
          ))}
        </section>

        {/* URL structure: anatomy of one URL, the counts behind it, and what it produces */}
        <section className="mt-3 rounded-[18px] bg-white p-6 md:p-[30px]">
          <p className="text-sm text-espresso/60">URL structure</p>

          {/* Address bar */}
          <div className="mt-4 flex items-center gap-3 overflow-x-auto rounded-full bg-cream px-4 py-3 font-mono text-[13px] sm:px-5 sm:py-3.5 sm:text-base md:text-xl">
            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-espresso/40" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span className="whitespace-nowrap">
              <span className="text-espresso/45">tebi.com</span>
              {anatomy.map((a) => (
                <span key={a.part} className={`rounded-md px-1 ${a.tint}`}>{a.part}</span>
              ))}
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-10">
            {/* One column per segment */}
            <div className="grid gap-3 sm:grid-cols-3">
              {anatomy.map((a, i) => (
                <div key={a.part} className="rounded-2xl border border-stone p-5">
                  <span className={`inline-block rounded-md px-1.5 font-mono text-sm ${a.tint}`}>{a.part}</span>
                  <p className="mt-3 font-display text-[40px] font-medium leading-none tracking-[-0.05em]">
                    {i > 0 && <span className="mr-1 text-2xl text-espresso/35">×</span>}
                    {a.count}
                  </p>
                  <p className="mt-1 text-sm font-medium">{a.label}</p>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-espresso/55">{a.examples}</p>
                </div>
              ))}
            </div>

            {/* What one URL produces, shown like a search result */}
            <div className="flex flex-col justify-center rounded-2xl bg-cream p-5">
              <p className="text-xs text-espresso/55">One page per combination, e.g.</p>
              <p className="mt-3 truncate font-mono text-xs text-espresso/60">tebi.com › nl › amsterdam › wijnbar</p>
              <p className="mt-1 font-display text-xl font-medium leading-snug tracking-[-0.02em] text-slate">{example?.h1}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-espresso/75">{example?.intro}</p>
              <p className="mt-4 border-t border-espresso/10 pt-3 text-sm">
                <span className="font-display text-2xl font-medium tracking-[-0.03em]">= {total}</span>{" "}
                <span className="text-espresso/60">pages in {langCount} languages</span>
              </p>
            </div>
          </div>
        </section>

        {/* Directory */}
        <section className="mt-[60px]">
          <h2 className="font-display text-[36px] font-medium leading-none tracking-[-0.02em] md:text-[48px]">All pages</h2>
          <p className="mt-4 mb-8 text-base font-medium tracking-[-0.02em] text-espresso/70">
            Pick a market; each cell is that page&apos;s headline and opens it.
          </p>
          <Directory markets={directory} />
        </section>
      </main>
      <Footer />
    </>
  );
}
