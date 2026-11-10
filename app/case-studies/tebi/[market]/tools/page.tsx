import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../_components/footer";
import { Nav } from "../../_components/nav";
import { toolMarkets, toolPath, tools } from "../../tools/tools";

export const metadata: Metadata = {
  title: "Gratis horeca tools — Tebi case study · Nick Barth",
  description: "Ten free calculators for horeca owners: POS and card costs, cost per dish, break-even, labour, prime cost, margin and tips.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return toolMarkets.map((market) => ({ market }));
}

export default async function Tools({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  return (
    <>
      <Nav tone="light" />
      <main className="px-3 pb-24 md:px-5">
        <section className="pt-[150px] md:pt-[200px]">
          <h1 className="font-display text-[44px] font-medium leading-none tracking-[-0.05em] md:text-[64px]">Gratis horeca tools</h1>
          <p className="mt-6 max-w-[760px] text-base font-medium leading-6 tracking-[-0.02em]">
            Ten calculators owners look for before they switch POS, matching what Toast, Lightspeed and Bedrijfssoftwaregids
            offer. The pricing ones run on Tebi&apos;s real rates.
          </p>
        </section>
        <div className="mt-[60px] grid gap-3 md:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.slug} href={toolPath(t.slug, market)} className={`flex min-h-[260px] flex-col justify-between rounded-[28px] p-6 text-cream md:p-[30px] ${t.tone}`}>
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
