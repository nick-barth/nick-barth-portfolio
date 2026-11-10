"use client";

import { useState } from "react";
import { AuditTable, type AuditPrompt } from "./audit-table";
import { AuditTrend, type AuditHistoryEntry } from "./audit-trend";

/*
 * Results of the AI-answer audit (scripts/ai-audit): headline tiles, share of voice and
 * most-cited sources per market, then the per-prompt table as the detailed view.
 *
 * Colour (all checked with the dataviz validator against the white card):
 * - One market: Tebi espresso, every other brand/domain a muted neutral (#978d7a, 3.1:1,
 *   ΔE 41 from espresso under CVD).
 * - All markets: bars stack by market, NL #3a6ea5 / ES #c4893f / DE #b04a6e (all checks
 *   pass across every pair, worst CVD ΔE 8.9 — segments also have 2px gaps and the
 *   tooltip names each market, so colour is never the only cue). Colour then encodes market, so Tebi is marked with a butter row band
 *   and bold text instead.
 * Every bar is labelled with its name and value, so identity never relies on colour alone.
 */

type EngineKey = "chatgpt" | "perplexity" | "gemini";

export type AuditSummary = {
  generatedAt: string;
  runsPerPrompt: number;
  prompts: number;
  answers: number;
  tebiMentioned: number;
  engines: { id: EngineKey; label: string; model: string | null; answers: number; mentioned: number; namedFirst: number; cited: number }[];
  geminiSearchedUnprompted: number | null;
  cost?: { totalUsd: number; pricedAnswers: number; byEngine: Record<string, number> };
  markets: {
    market: string;
    answers: number;
    brands: { brand: string; all: number; byEngine: Record<string, number>; split?: Record<string, Record<string, number>> }[];
    sources: Record<string, { domain: string; answers: number; split?: Record<string, number> }[]>;
    topPages?: CitedPage[];
    notablePages?: (CitedPage & { note?: string })[];
  }[];
};

const TEBI = "#261c0a";
const OTHER = "#978d7a";
const MARKET_COLOR: Record<string, string> = { NL: "#3a6ea5", ES: "#c4893f", DE: "#b04a6e" };

type Segment = { key: string; value: number; color: string };

type CitedPage = { page: string; url: string; answers: number; count: number; engines: string[] };

const pct = (n: number) => `${Math.round(n * 100)}%`;

function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-xl bg-cream p-1 text-sm">
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 transition-colors ${value === o.id ? "bg-espresso text-cream" : "hover:bg-stone"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * One labelled horizontal bar on a 0–100% track, with a hover/focus tooltip. With
 * `segments` it stacks them left to right (2px surface gap between fills, rounded end).
 */
function Bar({ name, value, highlight, tooltip, segments }: {
  name: string;
  value: number;
  highlight: boolean;
  tooltip: React.ReactNode;
  segments?: Segment[];
}) {
  const stacked = segments?.filter((s) => s.value > 0);
  return (
    <li
      tabIndex={0}
      className={`group relative -mx-2 grid grid-cols-[minmax(0,6.5rem)_1fr_2.75rem] items-center gap-2 sm:grid-cols-[minmax(0,9rem)_1fr_3rem] sm:gap-3 rounded-md px-2 py-[5px] outline-none ${
        highlight ? "bg-butter/45" : ""
      }`}
    >
      <span className={`truncate text-sm ${highlight ? "font-semibold" : ""}`} title={name}>{name}</span>
      <span className="relative h-3.5 rounded-r-[4px] bg-cream">
        {stacked ? (
          <span className="absolute inset-y-0 left-0 flex gap-[2px] transition-[width] duration-500" style={{ width: `${value * 100}%` }}>
            {stacked.map((s, i) => (
              <span
                key={s.key}
                className={i === stacked.length - 1 ? "rounded-r-[4px]" : ""}
                // Normalised: flex-grow values summing below 1 would leave the bar part-empty
                style={{ flexGrow: s.value / value, flexBasis: 0, background: s.color }}
              />
            ))}
          </span>
        ) : (
          <span
            className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[width] duration-500"
            style={{ width: `${Math.max(value * 100, 0)}%`, background: highlight ? TEBI : OTHER }}
          />
        )}
      </span>
      <span className={`text-right text-sm tabular-nums ${highlight ? "font-semibold" : "text-espresso/70"}`}>{pct(value)}</span>
      {/* Tooltip: hover or keyboard focus */}
      <span className="pointer-events-none absolute left-[7rem] top-full sm:left-[9.75rem] z-10 hidden min-w-48 rounded-lg bg-espresso px-3 py-2 text-xs text-cream shadow-lg group-hover:block group-focus:block">
        {tooltip}
      </span>
    </li>
  );
}

export function AuditResults({ summary, prompts, history = [] }: { summary: AuditSummary; prompts: AuditPrompt[]; history?: AuditHistoryEntry[] }) {
  const [market, setMarket] = useState(summary.markets[0]?.market ?? "NL");
  const [engine, setEngine] = useState<"all" | EngineKey>("all");
  const m = summary.markets.find((x) => x.market === market) ?? summary.markets[0];
  const where = market === "All" ? "across all markets" : `in ${market}`;
  const stackedView = market === "All";
  const marketKeys = summary.markets.map((x) => x.market).filter((k) => k !== "All");
  const toSegments = (split?: Record<string, number>): Segment[] | undefined =>
    stackedView && split ? marketKeys.map((k) => ({ key: k, value: split[k] ?? 0, color: MARKET_COLOR[k] ?? OTHER })) : undefined;
  const splitLines = (split?: Record<string, number>) =>
    stackedView && split
      ? marketKeys.map((k) => (
          <span key={k} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[2px]" style={{ background: MARKET_COLOR[k] ?? OTHER }} />
              from {k}
            </span>
            <span className="tabular-nums">{pct(split[k] ?? 0)}</span>
          </span>
        ))
      : null;
  const engineLabel = engine === "all" ? "all" : summary.engines.find((e) => e.id === engine)?.label;

  const brands = m.brands
    .map((b) => ({ ...b, value: engine === "all" ? b.all : b.byEngine[engine] ?? 0 }))
    .sort((a, b) => b.value - a.value || (a.brand === "Tebi" ? 1 : -1));
  const sources = m.sources[engine] ?? [];
  const tebiRank = brands.findIndex((b) => b.brand === "Tebi") + 1;
  const tebiValue = brands.find((b) => b.brand === "Tebi")?.value ?? 0;
  const date = new Date(summary.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-12">
      {/* Filters: one row, above both charts */}
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Market" value={market} onChange={setMarket} options={summary.markets.map((x) => ({ id: x.market, label: x.market }))} />
        <Segmented
          label="Engine"
          value={engine}
          onChange={setEngine}
          options={[{ id: "all" as const, label: "All engines" }, ...summary.engines.map((e) => ({ id: e.id, label: e.label }))]}
        />
        {stackedView && (
          <ul aria-label="Legend" className="flex gap-4 text-sm sm:ml-auto">
            {marketKeys.map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className="size-3 rounded-[3px]" style={{ background: MARKET_COLOR[k] ?? OTHER }} />
                {k}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <figure>
          <figcaption>
            <p className="font-display text-xl font-medium tracking-[-0.02em]">Who gets recommended {where}</p>
            <p className="mt-1 text-sm text-espresso/60">
              Share of {engineLabel} answers naming each brand. Tebi is #{tebiRank} at {pct(tebiValue)}.
            </p>
          </figcaption>
          <ul className="mt-5">
            {brands.map((b) => (
              <Bar
                key={b.brand}
                name={b.brand}
                value={b.value}
                highlight={b.brand === "Tebi"}
                segments={toSegments(b.split?.[engine])}
                tooltip={
                  <>
                    <strong className="block">{b.brand} · {market === "All" ? "all markets" : market}</strong>
                    {splitLines(b.split?.[engine])}
                    {stackedView && <span className="my-1 block border-t border-cream/20" />}
                    {summary.engines.map((e) => (
                      <span key={e.id} className="flex justify-between gap-4">
                        <span>{e.label}</span>
                        <span className="tabular-nums">{pct(b.byEngine[e.id] ?? 0)}</span>
                      </span>
                    ))}
                  </>
                }
              />
            ))}
          </ul>
        </figure>

        <figure>
          <figcaption>
            <p className="font-display text-xl font-medium tracking-[-0.02em]">What they cite</p>
            <p className="mt-1 text-sm text-espresso/60">Share of {engineLabel} answers citing each site.</p>
          </figcaption>
          <ul className="mt-5">
            {sources.map((s) => {
              const tebi = /(^|\.)tebi\.com$/.test(s.domain);
              return (
                <Bar
                  key={s.domain}
                  name={s.domain}
                  value={s.answers}
                  highlight={tebi}
                  segments={toSegments(s.split)}
                  tooltip={
                    <>
                      <span className="block">Cited in {pct(s.answers)} of {engineLabel} answers {where}</span>
                      {splitLines(s.split)}
                    </>
                  }
                />
              );
            })}
          </ul>
        </figure>
      </div>

      {/* Detail: the table view */}
      <div>
        <AuditTable prompts={prompts} runsPerPrompt={summary.runsPerPrompt} />
      </div>

      {/* Headline: Tebi's visibility overall, then per engine */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col rounded-2xl bg-espresso p-6 text-cream">
          <p className="font-display text-[56px] font-medium leading-none tracking-[-0.05em]">{pct(summary.tebiMentioned)}</p>
          <p className="mt-3 text-[15px] leading-snug">of {summary.answers} AI answers named Tebi</p>
          <ul className="mt-6 space-y-1.5 border-t border-cream/20 pt-4 text-sm lg:mt-auto">
            {summary.markets
              .filter((x) => x.market !== "All")
              .map((x) => (
                <li key={x.market} className="flex justify-between gap-3">
                  <span>{x.market}</span>
                  <span className="tabular-nums">{pct(x.brands.find((b) => b.brand === "Tebi")?.all ?? 0)}</span>
                </li>
              ))}
          </ul>
          <p className="mt-3 text-xs text-cream/60">
            {summary.prompts} prompts × {summary.engines.length} engines × {summary.runsPerPrompt} {summary.runsPerPrompt === 1 ? "run" : "runs"} · {date}
          </p>
        </div>
        {summary.engines.map((e) => (
          <div key={e.id} className="rounded-2xl bg-cream p-6">
            <p className="text-sm text-espresso/60">{e.label}</p>
            <p className="mt-1 font-display text-[44px] font-medium leading-none tracking-[-0.05em]">{pct(e.mentioned)}</p>
            <p className="mt-2 text-sm">mentioned Tebi</p>
            <p className="mt-3 text-xs leading-relaxed text-espresso/60">
              Named first {pct(e.namedFirst)} · tebi.com cited {pct(e.cited)}
              {e.model && <><br />{e.model}</>}
            </p>
          </div>
        ))}
      </div>

      <AuditTrend history={history} />
    </div>
  );
}
