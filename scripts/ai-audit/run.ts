#!/usr/bin/env bun
/*
 * AI-answer audit for Tebi's case study, challenge 01.
 *
 *   bun scripts/ai-audit/run.ts                     # every prompt × every engine with a key
 *   bun scripts/ai-audit/run.ts --runs=3            # repeat each answer 3× (answers vary)
 *   bun scripts/ai-audit/run.ts --engines=chatgpt,gemini --market=ES
 *   bun scripts/ai-audit/run.ts --only=nl-1,es-2 --dry-run
 *   bun scripts/ai-audit/run.ts --rescore=results/<timestamp>   # re-detect brands, no API calls
 *   bun scripts/ai-audit/run.ts --market=DE --runs=3 --merge=results/<timestamp>
 *       # run only DE, then combine with an earlier run so totals cover every market
 *   bun scripts/ai-audit/run.ts --runs=3 --merge=results/<timestamp> --only-missing
 *       # run only prompts the earlier run doesn't have yet, then combine
 *
 * Writes scripts/ai-audit/results/<timestamp>/{raw.json,summary.md} and refreshes
 * app/case-studies/tebi/case-study/audit-data.json for the case study page.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { join, resolve } from "node:path";
import { detectBrands, unmatchedCapitalised } from "./brands";
import { domainOf, engines, HttpError, type Answer, type Engine, type EngineId, type Prompt, type Usage } from "./engines";

const DIR = import.meta.dirname;
const readJson = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const PAGE_DATA = join(DIR, "../../app/case-studies/tebi/case-study/audit-data.json");
const PAGE_SUMMARY = join(DIR, "../../app/case-studies/tebi/case-study/audit-summary.json");
const PAGE_HISTORY = join(DIR, "../../app/case-studies/tebi/case-study/audit-history.json");
const CONCURRENCY = 3;

/* ---------- CLI ---------- */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);
const runs = Number(args.runs ?? 1);
const list = (v?: string) => (v ? v.split(",").map((s) => s.trim()) : undefined);

const saved = args.rescore ? await readJson(resolve(DIR, args.rescore, "raw.json")) : null;

const allPrompts: Prompt[] = saved?.prompts ?? (await readJson(join(DIR, "prompts.json")));
let prompts = allPrompts.filter(
  (p) => (!args.market || p.market === args.market) && (!args.only || list(args.only)!.includes(p.id)),
);

/**
 * Rows from an earlier run, re-keyed to today's prompt ids by matching the prompt TEXT.
 * Renaming ids keeps the answers; rewording a prompt makes it count as new.
 */
async function loadEarlier(dir: string) {
  const earlier = await readJson(resolve(DIR, dir, "raw.json"));
  const textById = new Map<string, string>((earlier.prompts as Prompt[]).map((p) => [p.id, `${p.market}|${p.prompt}`]));
  const idByText = new Map(allPrompts.map((p) => [`${p.market}|${p.prompt}`, p.id]));
  const rows = (earlier.rows as { promptId: string }[]).flatMap((r) => {
    const id = idByText.get(textById.get(r.promptId) ?? "");
    return id ? [{ ...r, promptId: id }] : [];
  });
  return { runs: earlier.runs as number, rows };
}

// --only-missing (with --merge): skip prompts the earlier run already answered
if (args["only-missing"]) {
  if (!args.merge) throw new Error("--only-missing needs --merge=results/<timestamp> to know what's already done");
  const done = new Set((await loadEarlier(args.merge)).rows.map((r) => r.promptId));
  prompts = prompts.filter((p) => !done.has(p.id));
}

const wanted = list(args.engines);
const selected = engines.filter((e) => !wanted || wanted.includes(e.id));
let active = saved
  ? selected.filter((e) => saved.engines.includes(e.id))
  : selected.filter((e) => process.env[e.keyVar]);
const skipped = saved ? [] : selected.filter((e) => !process.env[e.keyVar]);

console.log(saved ? `Rescoring ${args.rescore}` : `Prompts: ${prompts.length} · runs each: ${runs}`);
console.log(`Engines: ${active.map((e) => e.label).join(", ") || "none"}`);
for (const e of skipped) console.log(`  skipping ${e.label} — set ${e.keyVar} in .env`);
if (!active.length) {
  console.error("\nNo engines have API keys. Add them to .env in the repo root (see scripts/ai-audit/.env.example).");
  process.exit(1);
}
if (args["dry-run"]) {
  console.log(`\nDry run: would make ${prompts.length * active.length * runs} requests.`);
  process.exit(0);
}

/* ---------- Run ---------- */

type Row = {
  promptId: string;
  market: string;
  engine: EngineId;
  run: number;
  ok: boolean;
  error?: string;
  ms: number;
  model?: string;
  /** Gemini only, see engines.ts */
  searched?: boolean;
  nudged?: boolean;
  usage?: Usage;
  /** USD: exact when the API reports it, otherwise estimated from pricing.json */
  costUsd?: number | null;
  costSource?: "reported" | "estimated" | "unpriced";
  text: string;
  citations: Answer["citations"];
  domains: string[];
  brands: string[];
  tebiMentioned: boolean;
  /** 1-based position of Tebi among detected brands, null if absent */
  tebiRank: number | null;
  tebiCited: boolean;
  unmatched: string[];
};

async function withRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = !(err instanceof HttpError) || ((err.status === 429 || err.status >= 500) && !err.isQuota);
      if (!retryable || i >= tries) throw err;
      await sleep(2 ** i * 1000 + Math.random() * 500);
    }
  }
}

/* ---------- Cost ---------- */

type PricePeriod = { model: string; from: string; inputPerM: number; cachedInputPerM?: number; outputPerM: number; searchPer1k: number };
const pricing: Record<string, PricePeriod[]> = await readJson(join(DIR, "pricing.json"));

/** USD for one answer: the API's own figure if it reports one, else usage × the price in force that day. */
function priceOf(engine: EngineId, model: string | undefined, usage: Usage | undefined, day: string) {
  if (!usage) return { costUsd: null, costSource: "unpriced" as const };
  if (usage.reportedCostUsd !== undefined) return { costUsd: usage.reportedCostUsd, costSource: "reported" as const };
  const period = (pricing[engine] ?? [])
    .filter((p) => model?.startsWith(p.model) && p.from <= day)
    .sort((a, b) => b.from.localeCompare(a.from))[0];
  if (!period) return { costUsd: null, costSource: "unpriced" as const };
  const cached = usage.cachedInputTokens ?? 0;
  const cost =
    ((usage.inputTokens - cached) * period.inputPerM + cached * (period.cachedInputPerM ?? period.inputPerM) + usage.outputTokens * period.outputPerM) / 1e6 +
    (usage.searches * period.searchPer1k) / 1000;
  return { costUsd: cost, costSource: "estimated" as const };
}

/** Everything derived from the raw answer — rerun by --rescore after editing brands.ts. */
function score(text: string, citations: Answer["citations"]) {
  const detected = detectBrands(text).map((d) => d.brand);
  const domains = [...new Set(citations.map(domainOf))];
  const rank = detected.indexOf("Tebi");
  return {
    domains,
    brands: detected,
    tebiMentioned: rank >= 0,
    tebiRank: rank >= 0 ? rank + 1 : null,
    tebiCited: domains.some((d) => d.endsWith("tebi.com") || d.endsWith("tebi.co")),
    unmatched: unmatchedCapitalised(text),
  };
}

async function runOne(engine: Engine, p: Prompt, run: number): Promise<Row> {
  const started = performance.now();
  const base = { promptId: p.id, market: p.market, engine: engine.id, run };
  try {
    const a = await withRetry(() => engine.run(p));
    return {
      ...base,
      ok: true,
      ms: Math.round(performance.now() - started),
      model: a.model,
      searched: a.searched,
      nudged: a.nudged,
      usage: a.usage,
      ...priceOf(engine.id, a.model, a.usage, new Date().toISOString().slice(0, 10)),
      text: a.text,
      citations: a.citations,
      ...score(a.text, a.citations),
    };
  } catch (err) {
    return {
      ...base, ok: false, error: String(err), ms: Math.round(performance.now() - started),
      text: "", citations: [], domains: [], brands: [], tebiMentioned: false, tebiRank: null, tebiCited: false, unmatched: [],
    };
  }
}

/** Run tasks with a per-engine concurrency cap, printing progress. */
async function pool(tasks: (() => Promise<Row>)[], limit: number) {
  const out: Row[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < tasks.length) {
        const row = await tasks[next++]();
        out.push(row);
        const mark = !row.ok ? "✗ error" : row.tebiMentioned ? "✓ Tebi" : "– no Tebi";
        console.log(`  ${row.engine.padEnd(10)} ${row.promptId.padEnd(6)} run ${row.run}  ${mark}${row.ok ? "" : `  ${row.error?.slice(0, 120)}`}`);
      }
    }),
  );
  return out;
}

console.log("");
const promptIds = new Set(prompts.map((p) => p.id));
let activeIds = new Set(active.map((e) => e.id));
let rows: Row[] = saved
  ? (saved.rows as Row[])
      .filter((r) => promptIds.has(r.promptId) && activeIds.has(r.engine))
      .map((r) => (r.ok ? { ...r, ...score(r.text, r.citations) } : r))
  : (
      await Promise.all(
        active.map((e) =>
          pool(prompts.flatMap((p) => Array.from({ length: runs }, (_, r) => () => runOne(e, p, r + 1))), CONCURRENCY),
        ),
      )
    ).flat();
const runsUsed = saved?.runs ?? runs;

// --merge: add an earlier run's answers for every prompt × engine this run didn't cover
if (args.merge) {
  const earlier = await loadEarlier(args.merge);
  if (earlier.runs !== runsUsed) console.warn(`⚠ merging a ${earlier.runs}-run result into a ${runsUsed}-run one — mention rates mix sample sizes`);
  const covered = new Set(rows.map((r) => `${r.promptId}|${r.engine}`));
  const extra = (earlier.rows as Row[]).filter((r) => !covered.has(`${r.promptId}|${r.engine}`));
  rows = [...rows, ...extra.map((r) => (r.ok ? { ...r, ...score(r.text, r.citations) } : r))];
  const inRows = new Set(rows.map((r) => r.promptId));
  prompts = allPrompts.filter((p) => inRows.has(p.id));
  active = engines.filter((e) => rows.some((r) => r.engine === e.id));
  activeIds = new Set(active.map((e) => e.id));
  console.log(`Merged ${extra.length} answers from ${args.merge}: now ${prompts.length} prompts × ${active.length} engines`);
}

/* ---------- Aggregate ---------- */

const ok = rows.filter((r) => r.ok);
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "—");
const count = <T,>(xs: T[]) => {
  const m = new Map<T, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

/** Brands ranked by how often they appear across runs, ties broken by average position. */
function topBrands(rs: Row[], n = 5) {
  const stats = new Map<string, { hits: number; pos: number }>();
  for (const r of rs)
    r.brands.forEach((b, i) => {
      const s = stats.get(b) ?? { hits: 0, pos: 0 };
      s.hits++;
      s.pos += i;
      stats.set(b, s);
    });
  return [...stats.entries()]
    .sort((a, b) => b[1].hits - a[1].hits || a[1].pos / a[1].hits - b[1].pos / b[1].hits)
    .slice(0, n)
    .map(([b]) => b);
}

/* Page data: same shape as AuditPrompt in case-study/audit-table.tsx */
const engineIds: EngineId[] = ["chatgpt", "perplexity", "gemini"];
const pageData = allPrompts
  .filter((p) => prompts.includes(p))
  .map((p) => ({
    id: p.id,
    market: p.market,
    lang: p.lang,
    prompt: p.prompt,
    gloss: p.gloss,
    results: Object.fromEntries(
      engineIds.map((id) => {
        const rs = ok.filter((r) => r.promptId === p.id && r.engine === id);
        if (!rs.length) return [id, null];
        const rate = rs.filter((r) => r.tebiMentioned).length / rs.length;
        return [
          id,
          {
            tebiMentioned: rate >= 0.5,
            mentionRate: rate,
            recommended: topBrands(rs),
            sources: count(rs.flatMap((r) => r.domains)).slice(0, 5).map(([d]) => d),
          },
        ];
      }),
    ),
  }));

/* Summary markdown */
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const lines: string[] = [];
const table = (head: string[], body: (string | number)[][]) => {
  lines.push(`| ${head.join(" | ")} |`, `|${head.map(() => " --- ").join("|")}|`);
  for (const r of body) lines.push(`| ${r.join(" | ")} |`);
  lines.push("");
};

lines.push(`# AI answer audit — ${new Date().toLocaleString("en-GB")}`, "");
lines.push(`${prompts.length} prompts × ${active.length} engines × ${runsUsed} run(s) = ${rows.length} requests, ${rows.length - ok.length} failed.`, "");
lines.push(`Models: ${[...new Set(ok.map((r) => `${r.engine}=${r.model}`))].join(", ")}`, "");

lines.push("## Tebi visibility by engine", "");
table(
  ["Engine", "Answers", "Tebi mentioned", "Tebi named first", "tebi.com cited"],
  active.map((e) => {
    const rs = ok.filter((r) => r.engine === e.id);
    return [e.label, rs.length, pct(rs.filter((r) => r.tebiMentioned).length, rs.length), pct(rs.filter((r) => r.tebiRank === 1).length, rs.length), pct(rs.filter((r) => r.tebiCited).length, rs.length)];
  }),
);
const gemRows = ok.filter((r) => r.engine === "gemini");
if (gemRows.length)
  lines.push(
    `Gemini searched the web on its own for ${pct(gemRows.filter((r) => r.searched).length, gemRows.length)} of prompts and answered from memory otherwise; ` +
      `${pct(gemRows.filter((r) => r.nudged).length, gemRows.length)} were re-asked with a "use current sources" nudge to collect citations.`,
    "",
  );

for (const market of [...new Set(prompts.map((p) => p.market))]) {
  const rs = ok.filter((r) => r.market === market);
  lines.push(`## ${market}: share of voice`, "", "Share of answers that mention each brand.", "");
  const brandsHere = count(rs.flatMap((r) => r.brands)).slice(0, 12).map(([b]) => b);
  if (!brandsHere.includes("Tebi")) brandsHere.push("Tebi");
  table(
    ["Brand", ...active.map((e) => e.label), "All"],
    brandsHere.map((b) => [
      b === "Tebi" ? "**Tebi**" : b,
      ...active.map((e) => {
        const er = rs.filter((r) => r.engine === e.id);
        return pct(er.filter((r) => r.brands.includes(b)).length, er.length);
      }),
      pct(rs.filter((r) => r.brands.includes(b)).length, rs.length),
    ]),
  );
  lines.push(`## ${market}: most-cited sources`, "");
  table(["Domain", "Citations", "Answers citing it"], count(rs.flatMap((r) => r.domains)).slice(0, 15).map(([d, n]) => [d, n, pct(n, rs.length)]));
}

/* Cost (only rows from runs that recorded usage) */
const priced = ok.filter((r) => typeof r.costUsd === "number");
if (priced.length) {
  const usd = (n: number) => `$${n.toFixed(n < 1 ? 4 : 2)}`;
  const sum = (rs: Row[]) => rs.reduce((t, r) => t + (r.costUsd ?? 0), 0);
  lines.push("## Cost", "");
  lines.push("Perplexity is exact (reported by its API); ChatGPT and Gemini are estimated from tokens and searches × pricing.json, without free allowances.", "");
  table(
    ["Engine", "Answers priced", "Total", "Per answer", "Searches", "How"],
    active.map((e) => {
      const rs = priced.filter((r) => r.engine === e.id);
      return [e.label, rs.length, usd(sum(rs)), rs.length ? usd(sum(rs) / rs.length) : "—", rs.reduce((t, r) => t + (r.usage?.searches ?? 0), 0), rs[0]?.costSource ?? "—"];
    }),
  );
  lines.push(`**Total: ${usd(sum(priced))}** for ${priced.length} answers${priced.length < ok.length ? ` (${ok.length - priced.length} answers from older runs have no usage recorded)` : ""}.`, "");
}

lines.push("## Per prompt", "");
for (const p of prompts) {
  lines.push(`**${p.id}** — ${p.prompt}${p.gloss ? ` _(${p.gloss})_` : ""}`, "");
  for (const e of active) {
    const rs = ok.filter((r) => r.promptId === p.id && r.engine === e.id);
    if (!rs.length) { lines.push(`- ${e.label}: failed`); continue; }
    const mention = rs.filter((r) => r.tebiMentioned).length;
    lines.push(`- ${e.label}: ${topBrands(rs, 6).join(", ") || "no brands"} · Tebi ${mention}/${rs.length}`);
  }
  lines.push("");
}

const candidates = count(ok.flatMap((r) => r.unmatched)).filter(([, n]) => n >= 2).slice(0, 30);
if (candidates.length) {
  lines.push("## Possible brands not in brands.ts", "", "Bolded names in answers that didn't match a known brand. Add real competitors to brands.ts, then re-score this run for free with `--rescore=results/<timestamp>`.", "");
  lines.push(candidates.map(([w, n]) => `${w} (${n})`).join(", "), "");
}

/* ---------- Write ---------- */

const outDir = join(DIR, "results", stamp);
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "raw.json"), JSON.stringify({ prompts, runs: runsUsed, engines: active.map((e) => e.id), rows }, null, 2));
await writeFile(join(outDir, "summary.md"), lines.join("\n"));
// Merge into the existing page data so runs of different engines (or prompts) add up
// instead of overwriting each other: this run replaces only the engines it ran.
const existing: typeof pageData = await readJson(PAGE_DATA).catch(() => []);
const merged = allPrompts
  .map((p) => {
    const fresh = pageData.find((d) => d.id === p.id);
    const old = existing.find((d) => d.id === p.id);
    if (!fresh) return old;
    if (!old) return fresh;
    const results = Object.fromEntries(
      engineIds.map((id) => [id, activeIds.has(id) ? fresh.results[id] : old.results[id] ?? null]),
    );
    return { ...fresh, results };
  })
  .filter(Boolean);
await writeFile(PAGE_DATA, JSON.stringify(merged, null, 2) + "\n");

// Totals for the charts on the case study page. Only a complete run (every prompt, every
// engine) may replace them, so one-prompt tests never overwrite the real numbers.
const complete = prompts.length === allPrompts.length && active.length === engines.length;
if (complete) {
  const rate = (rs: Row[], f: (r: Row) => boolean) => (rs.length ? rs.filter(f).length / rs.length : 0);
  const marketList = [...new Set(prompts.map((p) => p.market))];
  /** Share of `sub` answers that are from each market AND match `f` — parts of rate(sub, f). */
  const splitByMarket = (sub: Row[], f: (r: Row) => boolean) =>
    Object.fromEntries(marketList.map((mk) => [mk, rate(sub, (r) => r.market === mk && f(r))]));
  const summary = {
    generatedAt: new Date().toISOString(),
    runsPerPrompt: runsUsed,
    prompts: prompts.length,
    answers: ok.length,
    tebiMentioned: rate(ok, (r) => r.tebiMentioned),
    engines: active.map((e) => {
      const rs = ok.filter((r) => r.engine === e.id);
      return {
        id: e.id,
        label: e.label,
        model: rs[0]?.model ?? null,
        answers: rs.length,
        mentioned: rate(rs, (r) => r.tebiMentioned),
        namedFirst: rate(rs, (r) => r.tebiRank === 1),
        cited: rate(rs, (r) => r.tebiCited),
      };
    }),
    geminiSearchedUnprompted: gemRows.length ? rate(gemRows, (r) => !!r.searched) : null,
    // Cost of the answers in this summary that recorded usage (exact for Perplexity)
    cost: (() => {
      const priced = ok.filter((r) => typeof r.costUsd === "number");
      const total = (rs: Row[]) => rs.reduce((t, r) => t + (r.costUsd ?? 0), 0);
      return {
        totalUsd: total(priced),
        pricedAnswers: priced.length,
        byEngine: Object.fromEntries(active.map((e) => [e.id, total(priced.filter((r) => r.engine === e.id))])),
      };
    })(),
    // "All" first: every market combined, then each market on its own
    markets: ["All", ...marketList].map((market) => {
      const rs = market === "All" ? ok : ok.filter((r) => r.market === market);
      const subsets = [["all", rs] as const, ...active.map((e) => [e.id, rs.filter((r) => r.engine === e.id)] as const)];
      const names = count(rs.flatMap((r) => r.brands)).slice(0, 12).map(([b]) => b);
      if (!names.includes("Tebi")) names.push("Tebi");
      return {
        market,
        answers: rs.length,
        brands: names.map((brand) => ({
          brand,
          all: rate(rs, (r) => r.brands.includes(brand)),
          byEngine: Object.fromEntries(
            active.map((e) => [e.id, rate(rs.filter((r) => r.engine === e.id), (r) => r.brands.includes(brand))]),
          ),
          // Each market's contribution to that share (sums to it), for the stacked bars
          split: Object.fromEntries(subsets.map(([key, sub]) => [key, splitByMarket(sub, (r) => r.brands.includes(brand))])),
        })),
        // Top cited domains as a share of answers, for all engines and for each engine
        sources: Object.fromEntries(
          subsets.map(([key, sub]) => [
            key,
            count(sub.flatMap((r) => r.domains))
              .slice(0, 10)
              .map(([domain, n]) => ({
                domain,
                answers: n / sub.length,
                split: splitByMarket(sub, (r) => r.domains.includes(domain)),
              })),
          ]),
        ),
      };
    }),
  };
  await writeFile(PAGE_SUMMARY, JSON.stringify(summary, null, 2) + "\n");

  // Time series: one point per day from fresh complete runs (a rescore re-reads old
  // answers, so it doesn't count as a new day). A second run on the same day replaces it.
  if (!saved) {
    const day = summary.generatedAt.slice(0, 10);
    const point = {
      date: day,
      generatedAt: summary.generatedAt,
      runsPerPrompt: summary.runsPerPrompt,
      prompts: summary.prompts,
      answers: summary.answers,
      tebiMentioned: summary.tebiMentioned,
      engines: Object.fromEntries(summary.engines.map((e) => [e.id, { mentioned: e.mentioned, namedFirst: e.namedFirst, cited: e.cited }])),
      markets: Object.fromEntries(
        summary.markets.map((m) => {
          const ranked = [...m.brands].sort((a, b) => b.all - a.all);
          const tebi = ranked.findIndex((b) => b.brand === "Tebi");
          return [m.market, { tebi: ranked[tebi]?.all ?? 0, tebiRank: tebi + 1, leader: { brand: ranked[0]?.brand, share: ranked[0]?.all ?? 0 } }];
        }),
      ),
      costUsd: summary.cost.totalUsd,
    };
    const history: (typeof point)[] = await readJson(PAGE_HISTORY).catch(() => []);
    const next = [...history.filter((h) => h.date !== day), point].sort((a, b) => a.date.localeCompare(b.date));
    await writeFile(PAGE_HISTORY, JSON.stringify(next, null, 2) + "\n");
    console.log(`Time series: ${next.length} day(s) in audit-history.json`);
  }
}

console.log(`\n${lines.slice(0, 40).join("\n")}\n…`);
console.log(`\nSaved ${join("scripts/ai-audit/results", stamp)}/summary.md and raw.json`);
console.log(`Updated app/case-studies/tebi/case-study/audit-data.json`);
