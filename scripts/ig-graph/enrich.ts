#!/usr/bin/env bun
/*
 * Looks up every venue in followers.csv with Instagram's Business Discovery API (public
 * profile data of professional accounts) and caches the results in enrich.json.
 *
 *   bun scripts/ig-graph/enrich.ts            # look up whatever isn't cached yet
 *   bun scripts/ig-graph/enrich.ts --limit=5  # just a few
 *   bun scripts/ig-graph/enrich.ts --mentions # also accounts found in captions (mentions.json)
 *
 * Needs META_ACCESS_TOKEN and IG_USER_ID in .env (the IG account the lookups run through).
 * Meta's rate limit is per app per hour: the script reads the usage headers, stops at 85%
 * and exits; run it again later and it resumes from the cache. build.ts reads enrich.json.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const DIR = import.meta.dirname;
const CACHE = join(DIR, "enrich.json");
const TOKEN = process.env.META_ACCESS_TOKEN;
const IG = process.env.IG_USER_ID;
const STOP_AT = 85; // % of Meta's hourly allowance
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? Infinity);

if (!TOKEN || !IG) {
  console.error("Set META_ACCESS_TOKEN and IG_USER_ID in .env");
  process.exit(1);
}

export type Profile = {
  username: string;
  name?: string;
  biography?: string;
  website?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  /** Timestamp of the most recent post */
  latest_post?: string;
  fetchedAt: string;
  /** Set when the account couldn't be looked up (personal, private, renamed or gone) */
  error?: string;
};

const handles = [
  ...new Set(
    (await readFile(join(DIR, "followers.csv"), "utf8"))
      .split("\n")
      .slice(1)
      .map((l) => l.split(",")[2]?.trim().replace(/^@/, "").toLowerCase())
      .filter(Boolean),
  ),
];
if (process.argv.includes("--mentions")) {
  const mentions: { to: string }[] = JSON.parse(await readFile(join(DIR, "mentions.json"), "utf8").catch(() => "[]"));
  for (const m of mentions) if (!handles.includes(m.to)) handles.push(m.to);
}
const cache: Record<string, Profile> = JSON.parse(await readFile(CACHE, "utf8").catch(() => "{}"));
const todo = handles.filter((h) => !cache[h]).slice(0, limit);
console.log(`${handles.length} venues · ${handles.length - handles.filter((h) => !cache[h]).length} cached · looking up ${todo.length}`);

/** Highest usage % across Meta's app and business-use-case headers. */
function usage(h: Headers): number {
  let max = 0;
  for (const name of ["x-app-usage", "x-business-use-case-usage"]) {
    const raw = h.get(name);
    if (!raw) continue;
    const json = JSON.parse(raw);
    const entries = Array.isArray(json) ? json : Object.values(json).flat();
    for (const e of [json, ...entries] as any[])
      for (const k of ["call_count", "total_cputime", "total_time"]) if (typeof e?.[k] === "number") max = Math.max(max, e[k]);
  }
  return max;
}

const fields = (h: string) =>
  `business_discovery.username(${h}){username,name,biography,website,followers_count,follows_count,media_count,media.limit(1){timestamp}}`;

let done = 0;
for (const h of todo) {
  const res = await fetch(`https://graph.facebook.com/v23.0/${IG}?fields=${encodeURIComponent(fields(h))}&access_token=${TOKEN}`);
  const d: any = await res.json();
  const pct = usage(res.headers);

  if (d.error) {
    const code = d.error.code;
    // Rate limited or token problem: stop without caching, so it's retried next run
    if ([4, 17, 32, 613, 80002].includes(code) || code === 190) {
      console.log(`Stopped at @${h}: ${d.error.message} (code ${code})`);
      break;
    }
    // Anything else (not a business account, private, renamed): cache it so we don't retry
    cache[h] = { username: h, fetchedAt: new Date().toISOString(), error: d.error.message };
  } else {
    const b = d.business_discovery;
    cache[h] = {
      username: b.username,
      name: b.name,
      biography: b.biography,
      website: b.website,
      followers_count: b.followers_count,
      follows_count: b.follows_count,
      media_count: b.media_count,
      latest_post: b.media?.data?.[0]?.timestamp,
      fetchedAt: new Date().toISOString(),
    };
  }
  done++;
  await writeFile(CACHE, JSON.stringify(cache, null, 2) + "\n");
  console.log(`  ${String(done).padStart(3)}/${todo.length}  @${h.padEnd(32)} ${cache[h].error ? "– " + cache[h].error.slice(0, 50) : `${cache[h].followers_count} followers, ${cache[h].media_count} posts`}  [usage ${pct}%]`);

  if (pct >= STOP_AT) {
    console.log(`Usage at ${pct}% of Meta's hourly limit: stopping. Run again in about an hour to continue.`);
    break;
  }
  await sleep(1500);
}

const left = handles.filter((h) => !cache[h]).length;
console.log(`\nCached ${handles.length - left}/${handles.length}${left ? ` · ${left} left` : " · all done"}`);
