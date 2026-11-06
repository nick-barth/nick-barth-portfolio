"use client";

import Link from "next/link";
import { useState } from "react";

export type DirectoryMarket = {
  code: string;
  name: string;
  lang: string;
  venues: { slug: string; label: string }[];
  cities: { slug: string; name: string; pages: { slug: string; h1: string }[] }[];
};

/** Market switcher + city × venue-type grid; each cell is the page's real headline. */
export function Directory({ markets }: { markets: DirectoryMarket[] }) {
  const [code, setCode] = useState(markets[0]?.code);
  const m = markets.find((x) => x.code === code) ?? markets[0];

  return (
    <div>
      <div role="radiogroup" aria-label="Market" className="inline-flex flex-wrap gap-1 rounded-xl bg-white p-1 text-sm">
        {markets.map((x) => (
          <button
            key={x.code}
            role="radio"
            aria-checked={x.code === m.code}
            onClick={() => setCode(x.code)}
            className={`rounded-lg px-3 py-1.5 transition-colors ${x.code === m.code ? "bg-espresso text-cream" : "hover:bg-cream"}`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-[18px] bg-white p-4 md:p-[30px]">
        <table lang={m.lang} className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[13%] border-b border-stone py-3 pr-4 text-sm font-normal text-espresso/55">/{m.code}</th>
              {m.venues.map((v) => (
                <th key={v.slug} className="border-b border-stone px-3 py-3 text-sm font-normal text-espresso/55">
                  /{v.slug}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.cities.map((c) => (
              <tr key={c.slug} className="align-top">
                <th scope="row" className="border-b border-stone py-4 pr-4 text-left font-display text-xl font-medium tracking-[-0.02em]">
                  {c.name}
                  <span className="block font-sans text-xs font-normal text-espresso/45">/{c.slug}</span>
                </th>
                {c.pages.map((p) => (
                  <td key={p.slug} className="border-b border-stone px-3 py-4">
                    <Link
                      href={`/case-studies/tebi/${m.code}/${c.slug}/${p.slug}`}
                      className="group block rounded-lg p-2 -m-2 text-[15px] leading-snug hover:bg-cream"
                    >
                      {p.h1}
                      <span className="mt-1 block text-xs text-espresso/45 group-hover:text-espresso/70">Open →</span>
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
