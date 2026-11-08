#!/usr/bin/env bun
/*
 * Reads recent posts of venue accounts with Instagram's Business Discovery API and extracts
 * every @mention from the captions: collaborations, guest chefs, takeovers, pop-up hosts.
 *
 *   bun scripts/ig-graph/mentions.ts              # the 5 seeds
 *   bun scripts/ig-graph/mentions.ts --core       # seeds + venues linked to 2+ seeds
 *   bun scripts/ig-graph/mentions.ts --handles=a,b
 *
 * Posts are cached in posts.json (re-runs only fetch what's missing); every mention is
 * written to mentions.json with its date, link and the words around it. Same rate-limit
 * handling as enrich.ts: stops at 85% of Meta's hourly allowance, resume later.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const DIR = import.meta.dirname;
const POSTS = join(DIR, "posts.json");
const MENTIONS = join(DIR, "mentions.json");
const TOKEN = process.env.META_ACCESS_TOKEN;
const IG = process.env.IG_USER_ID;
const STOP_AT = 85;
const PER_ACCOUNT = 25;

if (!TOKEN || !IG) {
  console.error("Set META_ACCESS_TOKEN and IG_USER_ID in .env");
  process.exit(1);
}

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")) as [string, string?][]);
const clean = (h: string) => h.replace(/^@/, "").toLowerCase();

/* ---------- Which accounts to read ---------- */

const seedRows = (await readFile(join(DIR, "seeds.csv"), "utf8")).split("\n").slice(1).map((l) => clean(l.split(",")[0] ?? "")).filter(Boolean);
let accounts = seedRows;
if ("core" in args) {
  const graph = JSON.parse(await readFile(join(DIR, "../../app/case-studies/tebi/case-study/ig-graph.json"), "utf8"));
  accounts = [...seedRows, ...graph.targets.filter((t: any) => t.follows.length >= 2).map((t: any) => t.handle)];
}
if (args.handles) accounts = args.handles.split(",").map(clean);

type Post = { caption: string; timestamp: string; permalink: string };
const posts: Record<string, { fetchedAt: string; posts: Post[]; error?: string }> = JSON.parse(await readFile(POSTS, "utf8").catch(() => "{}"));

/* ---------- Fetch ---------- */

function usage(h: Headers): number {
  let max = 0;
  for (const name of ["x-app-usage", "x-business-use-case-usage"]) {
    const raw = h.get(name);
    if (!raw) continue;
    const json = JSON.parse(raw);
    for (const e of [json, ...(Array.isArray(json) ? json : Object.values(json).flat())] as any[])
      for (const k of ["call_count", "total_cputime", "total_time"]) if (typeof e?.[k] === "number") max = Math.max(max, e[k]);
  }
  return max;
}

const todo = accounts.filter((h) => !posts[h]);
console.log(`${accounts.length} accounts · ${accounts.length - todo.length} cached · fetching ${todo.length}`);
for (const [i, h] of todo.entries()) {
  const fields = `business_discovery.username(${h}){media.limit(${PER_ACCOUNT}){caption,timestamp,permalink}}`;
  const res = await fetch(`https://graph.facebook.com/v23.0/${IG}?fields=${encodeURIComponent(fields)}&access_token=${TOKEN}`);
  const d: any = await res.json();
  const pct = usage(res.headers);
  if (d.error) {
    if ([4, 17, 32, 613, 80002, 190].includes(d.error.code)) {
      console.log(`Stopped at @${h}: ${d.error.message}`);
      break;
    }
    posts[h] = { fetchedAt: new Date().toISOString(), posts: [], error: d.error.message };
  } else {
    posts[h] = {
      fetchedAt: new Date().toISOString(),
      posts: (d.business_discovery?.media?.data ?? []).map((m: any) => ({ caption: m.caption ?? "", timestamp: m.timestamp, permalink: m.permalink })),
    };
  }
  await writeFile(POSTS, JSON.stringify(posts, null, 2) + "\n");
  console.log(`  ${i + 1}/${todo.length}  @${h.padEnd(30)} ${posts[h].error ? "– " + posts[h].error!.slice(0, 50) : `${posts[h].posts.length} posts`}  [usage ${pct}%]`);
  if (pct >= STOP_AT) {
    console.log(`Usage at ${pct}%: stopping. Run again in about an hour.`);
    break;
  }
  await sleep(1500);
}

/* ---------- Extract mentions ---------- */

// Instagram handles: letters, digits, dot, underscore; a trailing dot is sentence punctuation
/*
 * Business Discovery returns captions with the "@" stripped ("see you at tonton.noord"), so
 * mentions are found three ways: a real @handle; a bare word that is a handle we already know
 * (seeds and venues in followers.csv); or a bare word shaped like a handle, with a dot or
 * underscore inside (pelusa.amsterdam), that isn't a web address, email or time.
 */
const MENTION = /(?<![a-z0-9._@])@?([a-z0-9][a-z0-9._]{1,29})/gi;
const knownHandles = new Set([
  ...seedRows,
  ...(await readFile(join(DIR, "followers.csv"), "utf8")).split("\n").slice(1).map((l) => clean(l.split(",")[2] ?? "")).filter(Boolean),
]);
const WEB = /\.(com|nl|de|be|fr|es|it|eu|org|net|io|co|uk|app|shop|store|info)$/i;
function asHandle(raw: string, explicit: boolean): string | null {
  const h = raw.toLowerCase().replace(/[._]+$/, "");
  if (h.length < 3 || /^\d+([.:]\d+)*$/.test(h)) return null; // numbers, times like 17.00
  if (explicit || knownHandles.has(h)) return h;
  if (!/[._]/.test(h) || WEB.test(h) || /\.\./.test(h)) return null; // needs a dot/underscore, not a domain
  return h;
}
const POPUP_WORDS = /pop[\s-]?up|takeover|take-over|guest ?chef|gastkok|residen(cy|tie)|supper ?club|collab|samenwerking|one night only|for one night|chef'?s? table|dinner series|samen met|x\s/i;

type Mention = { from: string; to: string; timestamp: string; permalink: string; context: string; popupContext: boolean };
const mentions: Mention[] = [];
for (const [from, entry] of Object.entries(posts)) {
  for (const p of entry.posts) {
    for (const m of p.caption.matchAll(MENTION)) {
      // Skip emails (preceded by @ inside a word is excluded by the lookbehind) and URLs
      if (/^https?:|www\./i.test(p.caption.slice(Math.max(0, (m.index ?? 0) - 8), m.index))) continue;
      const to = asHandle(m[1], m[0].startsWith("@"));
      if (!to || to === from) continue;
      const at = m.index ?? 0;
      const context = p.caption.slice(Math.max(0, at - 70), at + m[0].length + 70).replace(/\s+/g, " ").trim();
      mentions.push({ from, to, timestamp: p.timestamp, permalink: p.permalink, context, popupContext: POPUP_WORDS.test(p.caption) });
    }
  }
}
await writeFile(MENTIONS, JSON.stringify(mentions, null, 2) + "\n");

/* ---------- Summary ---------- */

const byTo = new Map<string, { from: Set<string>; n: number; popup: number; latest: string }>();
for (const m of mentions) {
  const e = byTo.get(m.to) ?? { from: new Set(), n: 0, popup: 0, latest: "" };
  e.from.add(m.from);
  e.n++;
  if (m.popupContext) e.popup++;
  if (m.timestamp > e.latest) e.latest = m.timestamp;
  byTo.set(m.to, e);
}
const fetched = Object.values(posts).filter((p) => !p.error);
console.log(`\n${fetched.length} accounts read · ${fetched.reduce((n, p) => n + p.posts.length, 0)} posts · ${mentions.length} mentions of ${byTo.size} accounts`);
console.log("Most mentioned (by how many accounts, then in pop-up/collab posts):");
for (const [h, e] of [...byTo].sort((a, b) => b[1].from.size - a[1].from.size || b[1].popup - a[1].popup || b[1].n - a[1].n).slice(0, 25))
  console.log(`  @${h.padEnd(30)} by ${e.from.size} · ${e.n}× · ${e.popup} in pop-up/collab posts · latest ${e.latest.slice(0, 10)}`);
