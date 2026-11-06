"use client";

import { useState } from "react";

export type Engine = "chatgpt" | "perplexity" | "gemini";

export const engines: { id: Engine; label: string }[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
];

/** One engine's answer to one prompt. `null` = not run yet. */
export type EngineResult = {
  tebiMentioned: boolean;
  /** Brands recommended, in the order they appear */
  recommended: string[];
  /** Domains cited as sources */
  sources: string[];
  /** Share of runs that mentioned Tebi, when each prompt was run more than once */
  mentionRate?: number;
} | null;

export type AuditPrompt = {
  id: string;
  market: string;
  lang: string;
  prompt: string;
  /** English gloss for non-English prompts */
  gloss?: string;
  results: Record<Engine, EngineResult>;
};

function Cell({ r }: { r: EngineResult }) {
  if (!r) return <span className="text-espresso/30">—</span>;
  if (r.tebiMentioned)
    return (
      <span className="rounded-md bg-butter px-2 py-0.5 text-xs font-medium text-espresso">
        Tebi {r.mentionRate !== undefined && r.mentionRate < 1 ? `${Math.round(r.mentionRate * 100)}%` : "✓"}
      </span>
    );
  return <span className="text-xs text-espresso/70">{r.recommended.slice(0, 2).join(", ") || "No brands"}</span>;
}

/** AI-audit results grid with a market filter. Use it inside a part's `content` in content.tsx. */
export function AuditTable({ prompts }: { prompts: AuditPrompt[] }) {
  const markets = ["All", ...new Set(prompts.map((p) => p.market))];
  const [market, setMarket] = useState("All");
  const rows = prompts.filter((p) => market === "All" || p.market === market);

  const answers = rows.flatMap((p) => engines.map((e) => p.results[e.id]));
  const run = answers.filter(Boolean);
  const mentioned = run.filter((r) => r?.tebiMentioned).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-xl bg-cream p-1 text-sm">
          {markets.map((m) => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${market === m ? "bg-espresso text-cream" : "hover:bg-stone"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="text-sm text-espresso/70">
          {run.length === 0 ? (
            <>Not run yet · {rows.length} prompts × {engines.length} engines</>
          ) : (
            <>
              Tebi named in at least half the runs for <strong>{mentioned}</strong> of {run.length} prompt × engine pairs
              {run.length < answers.length && <> ({answers.length - run.length} still to run)</>}
            </>
          )}
        </p>
      </div>

      <div className="no-scrollbar mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-espresso/55">
            <tr className="border-b border-stone">
              <th className="py-3 pr-4 font-normal">Prompt</th>
              {engines.map((e) => (
                <th key={e.id} className="w-[13%] px-2 py-3 font-normal">{e.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-stone align-top">
                <td className="py-3 pr-4">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 rounded border border-espresso/25 px-1.5 text-[11px] uppercase">{p.lang}</span>
                    <div>
                      <p>{p.prompt}</p>
                      {p.gloss && <p className="mt-0.5 text-xs text-espresso/50">{p.gloss}</p>}
                    </div>
                  </div>
                </td>
                {engines.map((e) => (
                  <td key={e.id} className="px-2 py-3"><Cell r={p.results[e.id]} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
