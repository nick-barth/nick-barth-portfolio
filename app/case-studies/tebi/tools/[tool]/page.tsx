import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../_components/footer";
import { Nav } from "../../_components/nav";
import { CardFees, DishCost, Seasonal } from "../calculators";
import { tools, type ToolSlug } from "../tools";

const calculators: Record<ToolSlug, () => React.ReactNode> = {
  seizoen: Seasonal,
  pinkosten: CardFees,
  gerecht: DishCost,
};

type Props = { params: Promise<{ tool: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  return { title: `${tool?.title} — Tebi case study · Nick Barth`, description: tool?.description };
}

export default async function ToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const Calculator = calculators[slug as ToolSlug];
  const others = tools.filter((t) => t.slug !== slug);

  return (
    <>
      <Nav tone="light" />
      <main className="px-3 pb-24 pt-[110px] md:px-5 md:pt-[130px]">
        <Calculator />
        <nav aria-label="Meer tools" className="mt-5 grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <Link key={t.slug} href={`/case-studies/tebi/tools/${t.slug}`} className="rounded-[18px] bg-white p-6 hover:bg-stone">
              <p className="text-sm text-espresso/60">Meer tools</p>
              <p className="mt-1 font-display text-2xl font-medium tracking-[-0.03em]">{t.title} →</p>
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  );
}
