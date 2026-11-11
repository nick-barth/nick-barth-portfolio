"use client";

import { useEffect, useState } from "react";

/*
 * Every prompt, with its own share of voice as waffle grids. Each square is one answer:
 * a row per engine, a column per run, filled when that answer named the brand. So a
 * prompt's grids show exact counts and which engine said it, with no rounding.
 *
 * Colour matches the single-market bars: Tebi espresso on a butter tile, competitors the
 * muted neutral #978d7a, empty answers cream. Counts are always printed next to each grid,
 * so colour is never the only cue. Engine comes from the filters above; the list is always
 * one country at a time (45 prompts at once is too long), following the market filter
 * when it names a country.
 */

export type Engine = "chatgpt" | "perplexity" | "gemini";

export const engines: { id: Engine; label: string }[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
];

/** One engine's answers to one prompt, summarised. `null` = not run. */
export type EngineResult = {
  tebiMentioned: boolean;
  recommended: string[];
  sources: string[];
  mentionRate?: number;
} | null;

export type PromptBrand = {
  brand: string;
  all: number;
  byEngine: Record<Engine, number>;
  /** One flag per answer, by engine then run; null when that answer is missing */
  hits?: Record<Engine, (boolean | null)[]>;
};

export type AuditPrompt = {
  id: string;
  market: string;
  lang: string;
  prompt: string;
  /** English gloss for non-English prompts */
  gloss?: string;
  answers?: number;
  /** Top brands for this prompt, plus Tebi */
  brands?: PromptBrand[];
  results: Record<Engine, EngineResult>;
};

const TEBI = "#261c0a";
const OTHER = "#978d7a";
const EMPTY = "#efe9dc";
const COMPETITORS = 4;

/** A brand's answers as a grid: rows = engines, columns = runs */
function Waffle({ b, engine, runs }: { b: PromptBrand; engine: "all" | Engine; runs: number }) {
  const tebi = b.brand === "Tebi";
  const rows = engines.map((e) => ({ id: e.id, cells: b.hits?.[e.id] ?? Array<boolean | null>(runs).fill(null) }));
  const inScope = rows.filter((r) => engine === "all" || r.id === engine).flatMap((r) => r.cells);
  const answered = inScope.filter((c) => c !== null).length;
  const named = inScope.filter(Boolean).length;

  return (
    <li
      tabIndex={0}
      aria-label={`${b.brand}: named in ${named} of ${answered} answers`}
      className={`group relative min-w-0 rounded-lg px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-espresso ${
        tebi ? "bg-butter/45" : ""
      }`}
    >
      <span className={`block truncate text-[13px] leading-tight ${tebi ? "font-semibold" : ""}`} title={b.brand}>
        {b.brand}
      </span>
      <span className="mt-1.5 flex items-center gap-2">
      <span aria-hidden className="grid shrink-0 gap-[2px]" style={{ gridTemplateColumns: `repeat(${runs}, 8px)` }}>
        {rows.flatMap((r) =>
          r.cells.map((c, i) => (
            <span
              key={`${r.id}-${i}`}
              className={`size-2 rounded-[2px] transition-opacity ${engine !== "all" && r.id !== engine ? "opacity-25" : ""}`}
              // On Tebi's butter tile, empty answers are white so they still read as squares
              style={{ background: c ? (tebi ? TEBI : OTHER) : c === null ? "transparent" : tebi ? "#fff" : EMPTY }}
            />
          )),
        )}
      </span>
      <span className={`text-xs tabular-nums ${tebi ? "font-semibold" : "text-espresso/60"}`}>
        {named}/{answered}
      </span>
      </span>
      {/* Tooltip: per-engine counts */}
      <span className="pointer-events-none absolute left-0 top-full z-10 hidden min-w-40 rounded-lg bg-espresso px-3 py-2 text-xs text-cream shadow-lg group-hover:block group-focus:block">
        <strong className="mb-1 block">{b.brand}</strong>
        {rows.map((r) => (
          <span key={r.id} className="flex justify-between gap-4">
            <span className="text-cream/75">{engines.find((e) => e.id === r.id)?.label}</span>
            <strong className="tabular-nums">
              {r.cells.filter(Boolean).length}/{r.cells.filter((c) => c !== null).length}
            </strong>
          </span>
        ))}
      </span>
    </li>
  );
}

/** The legend: one example grid with its rows and columns spelled out */
function Key({ runs }: { runs: number }) {
  return (
    <div className="flex items-center gap-3 text-xs text-espresso/65">
      <span aria-hidden className="grid shrink-0 gap-[2px]" style={{ gridTemplateColumns: `repeat(${runs}, 8px)` }}>
        {Array.from({ length: engines.length * runs }, (_, i) => (
          <span key={i} className="size-2 rounded-[2px]" style={{ background: i % 3 === 0 ? OTHER : EMPTY }} />
        ))}
      </span>
      <span>
        Each square is one answer. Rows: {engines.map((e) => e.label).join(", ")}. Columns: {runs} {runs === 1 ? "run" : "runs"}.
        Filled = brand named.
      </span>
    </div>
  );
}

/** Per-prompt waffles, scoped by the market and engine filters above it. */
export function AuditTable({
  prompts,
  runsPerPrompt = 1,
  market = "All",
  engine = "all",
}: {
  prompts: AuditPrompt[];
  runsPerPrompt?: number;
  market?: string;
  engine?: "all" | Engine;
}) {
  const countries = [...new Set(prompts.map((p) => p.market))];
  const [country, setCountry] = useState(countries.includes(market) ? market : countries.includes("NL") ? "NL" : countries[0]);
  useEffect(() => {
    if (countries.includes(market)) setCountry(market);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);
  const rows = prompts.filter((p) => p.market === country);
  const value = (b: PromptBrand) => (engine === "all" ? b.all : b.byEngine[engine] ?? 0);

  // Tebi's total over the prompts in view, counted from the answers themselves
  const tebiCells = rows.flatMap((p) => {
    const t = p.brands?.find((b) => b.brand === "Tebi");
    return engines.filter((e) => engine === "all" || e.id === engine).flatMap((e) => t?.hits?.[e.id] ?? []);
  });
  const answered = tebiCells.filter((c) => c !== null).length;
  const named = tebiCells.filter(Boolean).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-xl font-medium tracking-[-0.02em]">Question by question</p>
            <div role="radiogroup" aria-label="Country" className="flex gap-1 rounded-xl bg-cream p-1 text-sm">
              {countries.map((c) => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={country === c}
                  onClick={() => setCountry(c)}
                  className={`rounded-lg px-3 py-1 transition-colors ${country === c ? "bg-espresso text-cream" : "hover:bg-stone"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <Key runs={runsPerPrompt} />
          </div>
        </div>
        <p className="text-sm text-espresso/70">
          Tebi named in <strong>{named}</strong> of {answered} answers · {Math.round((named / Math.max(answered, 1)) * 100)}%
        </p>
      </div>

      <ul className="mt-5 border-t border-stone">
        {rows.map((p) => {
          const brands = p.brands ?? [];
          const tebi = brands.find((b) => b.brand === "Tebi");
          const competitors = brands
            .filter((b) => b.brand !== "Tebi")
            .sort((a, b) => value(b) - value(a))
            .slice(0, COMPETITORS);
          return (
            <li key={p.id} className="grid gap-3 border-b border-stone py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-6">
              <div className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0 rounded border border-espresso/25 px-1.5 text-[11px] uppercase">{p.lang}</span>
                <div>
                  <p>{p.prompt}</p>
                  {p.gloss && <p className="mt-0.5 text-xs text-espresso/50">{p.gloss}</p>}
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
                {tebi && <Waffle b={tebi} engine={engine} runs={runsPerPrompt} />}
                {competitors.map((b) => (
                  <Waffle key={b.brand} b={b} engine={engine} runs={runsPerPrompt} />
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
