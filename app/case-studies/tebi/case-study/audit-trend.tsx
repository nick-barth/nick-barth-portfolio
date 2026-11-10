"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Tebi's mention rate per audit run (audit-history.json), by engine or by market. Runs are
 * spaced evenly, one step per run, with each run's date underneath.
 *
 * Colour (checked with the dataviz validator against white, all pairs):
 * - Engines: ChatGPT #8a7a10, Perplexity #7d5bb5, Gemini #109a8c. Kept clear of the
 *   market hues so an engine never reads as a market.
 * - Markets: the same NL / ES / DE colours as the share-of-voice bars.
 * - "All" is espresso in both views: the total, not one more category.
 * Every line is direct-labelled at its end and keyed in the legend, so colour is never
 * the only cue; the table under the chart has every value.
 */

export type AuditHistoryEntry = {
  date: string;
  answers: number;
  tebiMentioned: number;
  engines: Record<string, { mentioned: number; namedFirst: number; cited: number }>;
  markets: Record<string, { tebi: number; tebiRank: number; leader: { brand: string; share: number } }>;
};

type Series = { key: string; label: string; color: string; values: number[] };

const ALL = "#261c0a";
const ENGINES: Record<string, { label: string; color: string }> = {
  chatgpt: { label: "ChatGPT", color: "#8a7a10" },
  perplexity: { label: "Perplexity", color: "#7d5bb5" },
  gemini: { label: "Gemini", color: "#109a8c" },
};
const MARKET_COLOR: Record<string, string> = { NL: "#3a6ea5", ES: "#c4893f", DE: "#b04a6e" };

const pct = (n: number) => `${Math.round(n * 100)}%`;
const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// Plot geometry, in px: room on the left for the axis, on the right for end labels
const H = 260;
const PAD = { top: 12, right: 112, bottom: 42, left: 40 };
const LABEL_GAP = 15;

export function AuditTrend({ history }: { history: AuditHistoryEntry[] }) {
  const [view, setView] = useState<"engine" | "market">("engine");
  const [active, setActive] = useState<number | null>(null);
  const [width, setWidth] = useState(640);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const days = [...history].sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 2) return null;

  const all: Series = { key: "all", label: "All", color: ALL, values: days.map((d) => d.tebiMentioned) };
  const series: Series[] =
    view === "engine"
      ? [
          all,
          ...Object.entries(ENGINES).map(([id, e]) => ({ key: id, ...e, values: days.map((d) => d.engines[id]?.mentioned ?? 0) })),
        ]
      : [
          { ...all, values: days.map((d) => d.markets.All?.tebi ?? d.tebiMentioned) },
          ...Object.keys(MARKET_COLOR).map((m) => ({
            key: m,
            label: m,
            color: MARKET_COLOR[m],
            values: days.map((d) => d.markets[m]?.tebi ?? 0),
          })),
        ];

  // Scales: x one even step per run, y from 0 to the next 10%
  const plotW = width - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (days.length - 1)) * plotW;
  const yMax = Math.max(0.1, Math.ceil(Math.max(...series.flatMap((s) => s.values)) * 10) / 10);
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;
  const ticks = Array.from({ length: Math.round(yMax / 0.05) + 1 }, (_, i) => i * 0.05).filter((v) => v <= yMax + 1e-9);

  // End labels: sorted by value, then nudged apart so they never overlap
  const last = days.length - 1;

  // Run labels: always the last, then any earlier one with room (about 44px) to its right
  const runLabels = new Set([last]);
  for (let i = last - 1, edge = x(last); i >= 0; i--) {
    if (edge - x(i) >= 44) {
      runLabels.add(i);
      edge = x(i);
    }
  }
  const labels = series.map((s) => ({ s, y: y(s.values[last]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + LABEL_GAP);
  const overflow = labels.length ? labels[labels.length - 1].y - (PAD.top + plotH + 4) : 0;
  if (overflow > 0) {
    labels.forEach((l) => (l.y -= overflow));
    for (let i = labels.length - 2; i >= 0; i--) labels[i].y = Math.min(labels[i].y, labels[i + 1].y - LABEL_GAP);
  }

  const nearest = (clientX: number, rect: DOMRect) => {
    const px = clientX - rect.left;
    let best = 0;
    days.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    });
    return best;
  };

  const shown = active ?? null;
  const tipLeft = shown === null ? 0 : Math.min(Math.max(x(shown) + 12, 0), width - 180);

  return (
    <figure id="audit-trend" className="scroll-mt-28">
      <figcaption className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xl font-medium tracking-[-0.02em]">Tebi over time</p>
          <p className="mt-1 max-w-[640px] text-sm text-espresso/60">
            Share of answers naming Tebi, per audit run. Each run asks every prompt once, so a single answer moves an engine or
            market line by about 2 points.
          </p>
        </div>
        <div role="radiogroup" aria-label="Split by" className="flex gap-1 rounded-xl bg-cream p-1 text-sm">
          {(["engine", "market"] as const).map((v) => (
            <button
              key={v}
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${view === v ? "bg-espresso text-cream" : "hover:bg-stone"}`}
            >
              By {v}
            </button>
          ))}
        </div>
      </figcaption>

      <ul aria-label="Legend" className="mt-4 flex flex-wrap gap-4 text-sm">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>

      <div ref={box} className="relative mt-3">
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`Tebi mention rate by ${view}, ${day(days[0].date)} to ${day(days[last].date)}. Values in the table below.`}
          tabIndex={0}
          className="block overflow-visible outline-none"
          onPointerMove={(e) => setActive(nearest(e.clientX, e.currentTarget.getBoundingClientRect()))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((a) => a ?? last)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? last) - 1));
            if (e.key === "ArrowRight") setActive((a) => Math.min(last, (a ?? last) + 1));
          }}
        >
          {/* Recessive grid and axis */}
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={PAD.left + plotW} y1={y(v)} y2={y(v)} stroke="#261c0a" strokeOpacity={v === 0 ? 0.25 : 0.08} />
              <text x={PAD.left - 8} y={y(v)} dy="0.32em" textAnchor="end" className="fill-espresso/55 text-[11px] tabular-nums">
                {pct(v)}
              </text>
            </g>
          ))}
          {days.map((d, i) => runLabels.has(i) && (
            <text key={d.date} x={x(i)} y={H - 22} textAnchor="middle" className="fill-espresso/55 text-[11px]">
              <tspan x={x(i)} className="fill-espresso/80">Run {i + 1}</tspan>
              <tspan x={x(i)} dy="1.3em">{day(d.date)}</tspan>
            </text>
          ))}

          {shown !== null && <line x1={x(shown)} x2={x(shown)} y1={PAD.top} y2={PAD.top + plotH} stroke="#261c0a" strokeOpacity={0.3} />}

          {/* Lines: "All" drawn last so the total sits on top */}
          {[...series.slice(1), series[0]].map((s) => (
            <g key={s.key}>
              <polyline
                points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={shown === i ? 5 : 4} fill={s.color} stroke="#fff" strokeWidth={2} />
              ))}
            </g>
          ))}

          {/* Direct labels at the line ends */}
          {labels.map(({ s, y: ly }) => (
            <g key={s.key}>
              <line x1={x(last) + 7} x2={x(last) + 15} y1={ly} y2={ly} stroke={s.color} strokeWidth={2} strokeLinecap="round" />
              <text x={x(last) + 20} y={ly} dy="0.32em" className="fill-espresso text-[12px]">
                {s.label} <tspan className="fill-espresso/60 tabular-nums">{pct(s.values[last])}</tspan>
              </text>
            </g>
          ))}
        </svg>

        {shown !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-lg bg-espresso px-3 py-2 text-xs text-cream shadow-lg"
            style={{ left: tipLeft }}
          >
            <p className="mb-1 text-cream/70">Run {shown + 1} · {day(days[shown].date)}</p>
            {[...series]
              .sort((a, b) => b.values[shown] - a.values[shown])
              .map((s) => (
                <p key={s.key} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5">
                    {/* "All" is espresso, so on the dark tooltip its key turns cream */}
                    <span className="h-0.5 w-3 rounded-full" style={{ background: s.key === "all" ? "#f5efe3" : s.color }} />
                    <span className="text-cream/75">{s.label}</span>
                  </span>
                  <strong className="tabular-nums">{pct(s.values[shown])}</strong>
                </p>
              ))}
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-espresso/60 hover:text-espresso">Table view</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left tabular-nums">
            <thead className="text-espresso/60">
              <tr>
                <th className="py-1 pr-4 font-normal">Run</th>
                {series.map((s) => (
                  <th key={s.key} className="py-1 pr-4 font-normal">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={d.date} className="border-t border-stone">
                  <td className="py-1 pr-4">{i + 1} · {day(d.date)}</td>
                  {series.map((s) => (
                    <td key={s.key} className="py-1 pr-4">
                      {pct(s.values[i])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="mt-2 text-xs text-espresso/55">ChatGPT ran on gpt-5 on 6 Nov and on gpt-5-mini from 8 Nov.</p>
    </figure>
  );
}
