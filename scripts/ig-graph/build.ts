#!/usr/bin/env bun
/*
 * Builds the Instagram venue graph from the two hand-filled CSVs in this folder and
 * writes app/case-studies/tebi/case-study/ig-graph.json for the 02 section.
 *
 * `relation` is "follower" (venue follows the seed, the default) or "following" (the seed
 * follows the venue). Either counts as a connection.
 *
 * Profiles from enrich.json (Instagram Business Discovery) add bio, posts and followers,
 * and flag pop-ups, venues opening soon and confirmed-Amsterdam ones.
 *
 * exclude.csv lists accounts judged by hand not to be leads; they're dropped.
 *
 * Target score = seeds connected (social proof) + 3 if pop-up + 3 if opening soon
 *   + 2 if part-time (weekend-only or seasonal)
 *   + 1 if under 60 posts + 1 per account that mentioned them in a post. Accounts the
 *   lookup couldn't find are dropped.
 *
 * mentions.json (from mentions.ts) adds a second layer: accounts @mentioned in the recent
 * posts of seeds and core venues, kept only if they look like active Amsterdam hospitality
 * venues, pop-ups or openings, and linked to whoever mentioned them. Pop-up and
 *   opening flags only count when the account posted in the last ACTIVE_DAYS days.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = import.meta.dirname;
const OUT = join(DIR, "../../app/case-studies/tebi/case-study/ig-graph.json");

/** Minimal CSV parser: header row, commas, double-quoted fields with "" escapes. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const clean = (h: string) => h.replace(/^@/, "").toLowerCase();

type Profile = { name?: string; biography?: string; website?: string; followers_count?: number; media_count?: number; latest_post?: string; error?: string };
// Recent posts read by mentions.ts (newest first): used for each venue's latest post link
const postsByHandle: Record<string, { posts: { permalink: string; timestamp: string }[] }> =
  JSON.parse(await readFile(join(DIR, "posts.json"), "utf8").catch(() => "{}"));
// embeds.json: per venue, the newest post whose Instagram embed actually renders (checked
// headlessly; null = embedding off). Falls back to the newest post for unchecked venues.
const embeds: Record<string, string | null> = JSON.parse(await readFile(join(DIR, "embeds.json"), "utf8").catch(() => "{}"));
const latestPermalink = (h: string) => (h in embeds ? embeds[h] : (postsByHandle[h]?.posts?.[0]?.permalink ?? null));

const profiles: Record<string, Profile> = JSON.parse(await readFile(join(DIR, "enrich.json"), "utf8").catch(() => "{}"));

const ACTIVE_DAYS = 183;
const activeSince = Date.now() - ACTIVE_DAYS * 86_400_000;

/*
 * POS fit: the goal is selling a till, so a target must sell food or drink to guests on site.
 * Personal accounts (a bio starting "Chef / Co-owner…") are contacts, not venues; suppliers,
 * agencies and media don't run a till, unless they run a pop-up or opening themselves.
 */
const PERSON = /^\W*(chef|co-?owner|owner|founder|co-?founder|cook|kok|sommelier|winemaker|bartender|private chef)\b(?!['’]s)/i;
// Signs a venue sells to guests on site, which outweigh supplier words ("own wine import")
const SELLS = /opening ?hours|openingstijden|\bopen\b|menu|[àa] la carte|restaurant|caf[eé]|\bbar\b|\bstore\b|\bshop\b|winkel|proeflokaal|\blunch\b|\bdin(n)?er\b|tasting room|\d{1,2}[:.]\d{2}\s*[-–]/i;
const NON_POS = /\bimport(er)?\b|groothandel|wholesale|distribut|agency|agentschap|magazine|podcast|photograph|fotograf|journalist|\bwriter\b|\bauthor\b|records|\blabel\b|\bradio\b|sounds? & stories/i;
const firstBioLine = (bio: string) => bio.split("\n").map((l) => l.trim()).filter(Boolean)[0] ?? "";

// Open only some days or part of the year: same need as a pop-up (cheap when quiet, no contract).
// Seasonal means a seasonal *venue* (not seasonal food); weekend-only means weekend days and
// no Monday–Thursday anywhere in the bio.
const SEASONAL_VENUE = /seasonal (beach |pop[\s-]?up |summer )?(venue|bar|terrace|terras|spot)|seizoensgebonden|\b(mei|may|april|apr)\b\s*[-–t/m]+\s*\b(sept(ember)?|sep|oct(ober)?|okt(ober)?)\b|summer only|alleen in de zomer|zomerseizoen/i;
const WEEKEND = /saturday|sunday|zaterdag|zondag|\bsat\b|\bsun\b|\bza\s*([-–&\/]\s*zo\b|\d)|\bzo\s*\d|weekend/i;
const WEEKDAY = /\b(mon|tue|wed|thu)[a-z]*\b|\b(maandag|dinsdag|woensdag|donderdag)\b|\b(ma|di|wo|woe|do)\s*([-–&\/,]|t\/m|\d)|\b(weekdays?|weekdagen|daily|dagelijks|every ?day|elke dag)\b|7 ?(dagen|days)|7\/7/i;
const ANY_DAY = new RegExp(`${WEEKEND.source}|${WEEKDAY.source}|\\b(fri|vr)[a-z]*\\b|vrijdag`, "i");
const HOURS = /\d{1,2}([:.]\d{2})?\s*[-–]\s*\d{1,2}/;
/** Weekend-only: weekend days, no Mon–Thu, and no opening-hours line without days (= every day). */
const isPartTime = (bio: string) => {
  if (SEASONAL_VENUE.test(bio) || /weekends? only|alleen (in het )?weekend/i.test(bio)) return true;
  const dailyHours = bio.split("\n").some((l) => HOURS.test(l) && !ANY_DAY.test(l));
  return WEEKEND.test(bio) && !WEEKDAY.test(bio) && !dailyHours;
};

const POPUP = /pop[\s-]?up|supper ?club|residen(cy|tie)|guest ?chef|gastkok|\btijdelijke?\b|\btemporary\b|takeover|chef'?s? table|dinner series|diner club|for one night/i;
const OPENING = /opening \d{1,2}([\/-]\d{1,2})? (jan|feb|mar|apr|may|mei|jun|jul|aug|sep|oct|okt|nov|dec)|opent (op )?\d{1,2} (jan|feb|maa|apr|mei|jun|jul|aug|sep|okt|nov|dec)|binnenkort|coming soon|opening (late |early )?20\d\d|nieuw(e)? (zaak|restaurant)|opening soon|opent (in|op|binnenkort)|soon open|opening (in|on|this)|\bin the making\b|in aanbouw|under construction|we open (in|on|soon|this)/i;
const AMSTERDAM = /amsterdam|\b(ams|adam|020)\b|noord|jordaan|de pijp|ndsm/i;

const seeds = parseCsv(await readFile(join(DIR, "seeds.csv"), "utf8")).filter((s) => s.handle);
const rows = parseCsv(await readFile(join(DIR, "followers.csv"), "utf8")).filter((r) => r.seed_handle && r.follower_handle);
const seedSet = new Set(seeds.map((s) => clean(s.handle)));
const excluded = new Set(parseCsv(await readFile(join(DIR, "exclude.csv"), "utf8").catch(() => "handle\n")).map((r) => clean(r.handle)));

const unknownSeeds = [...new Set(rows.map((r) => clean(r.seed_handle)).filter((h) => !seedSet.has(h)))];
if (unknownSeeds.length) console.warn(`⚠ followers.csv mentions seeds not in seeds.csv: ${unknownSeeds.join(", ")}`);

type Target = {
  handle: string; name: string; type: string; neighbourhood: string; openingSoon: boolean; posts: number | null;
  follows: string[]; relations: Record<string, string>; score: number; notes: string;
  popup: boolean; partTime: boolean; active: boolean; amsterdam: boolean; posFit: boolean; mentionedBy: string[]; layer: "follow" | "mention"; followers: number | null; bio: string; latestPost: string | null;
};
const targets = new Map<string, Target>();
for (const r of rows) {
  const h = clean(r.follower_handle);
  if (seedSet.has(h)) continue; // seeds following each other aren't targets
  const t = targets.get(h) ?? {
    handle: h, name: r.venue_name || h, type: r.type, neighbourhood: r.neighbourhood,
    openingSoon: /^(y|yes|ja|true|1)$/i.test(r.opening_soon), posts: r.posts ? Number(r.posts) : null, follows: [], relations: {}, score: 0, notes: r.notes,
    popup: false, partTime: false, active: false, posFit: true, mentionedBy: [], layer: "follow", amsterdam: /Amsterdam/.test(r.notes), followers: null, bio: "", latestPost: null,
  };
  const s = clean(r.seed_handle);
  if (!t.follows.includes(s)) t.follows.push(s);
  t.relations[s] = r.relation === "following" ? "following" : "follower";
  targets.set(h, t);
}
for (const [h, t] of targets) {
  const p = profiles[h];
  if (p?.error) { targets.delete(h); continue; } // personal, private or gone
  if (p) {
    t.bio = p.biography ?? "";
    t.posts = p.media_count ?? t.posts;
    t.followers = p.followers_count ?? null;
    t.latestPost = p.latest_post ?? null;
    if (OPENING.test(t.bio)) t.openingSoon = true;
    if (AMSTERDAM.test(`${t.bio} ${p.website ?? ""}`)) t.amsterdam = true;
  }
  t.active = !!t.latestPost && Date.parse(t.latestPost) >= activeSince;
  // A pop-up or opening that hasn't posted in months isn't a lead
  t.popup = t.active && POPUP.test(`${t.handle} ${t.name} ${t.type} ${t.bio}`);
  if (!t.active) t.openingSoon = false;
  t.posFit = !PERSON.test(firstBioLine(t.bio)) && (!NON_POS.test(t.bio) || SELLS.test(t.bio) || t.popup || t.openingSoon);
  t.partTime = t.active && isPartTime(t.bio);
  if (!t.posFit) { t.popup = false; t.openingSoon = false; t.partTime = false; } // not a lead, whatever the bio says
  if (t.popup && !t.type) t.type = "pop-up";
  t.score = t.follows.length + (t.popup ? 3 : 0) + (t.openingSoon ? 3 : 0) + (t.posts !== null && t.posts < 60 ? 1 : 0);
}

/* ---------- Mentions layer ---------- */

const VENUE = /restaurant|\bbar\b|caf[eé]|wijn|wine|\bvin\b|bakker|bakery|boulanger|kitchen|keuken|dinner|diner|\beten\b|food|coffee|koffie|deli\b|pizza|pop[\s-]?up|supper|bistro|brasserie|proeflokaal|taqueria|ramen|sushi|\bchef\b|lunchroom|eatery|tavern/i;
type Mention = { from: string; to: string; timestamp: string; context: string };
const mentionList: Mention[] = JSON.parse(await readFile(join(DIR, "mentions.json"), "utf8").catch(() => "[]"));
const mentioners = new Map<string, Set<string>>();
for (const m of mentionList) {
  if (!mentioners.has(m.to)) mentioners.set(m.to, new Set());
  mentioners.get(m.to)!.add(m.from);
}
let mentionAdded = 0;
for (const [h, froms] of mentioners) {
  if (seedSet.has(h)) continue;
  const known = targets.get(h);
  if (known) { known.mentionedBy = [...froms]; continue; }
  const p = profiles[h];
  if (!p || p.error) continue; // not looked up yet, or personal/private
  const name = p.name || h;
  const bio = p.biography ?? "";
  const latestPost = p.latest_post ?? null;
  const active = !!latestPost && Date.parse(latestPost) >= activeSince;
  const popup = active && POPUP.test(`${h} ${name} ${bio}`);
  const openingSoon = active && OPENING.test(bio);
  const amsterdam = AMSTERDAM.test(`${h} ${bio} ${p.website ?? ""}`);
  const partTime = active && isPartTime(bio);
  const posFit = !PERSON.test(firstBioLine(bio)) && (!NON_POS.test(bio) || SELLS.test(bio) || popup || openingSoon);
  if (!posFit) continue; // people and suppliers are contacts, not till customers
  // Only active Amsterdam hospitality, or any active pop-up/opening, joins the graph
  if (!active || !(popup || openingSoon || (amsterdam && (partTime || VENUE.test(`${h} ${name} ${bio}`))))) continue;
  targets.set(h, {
    handle: h, name, type: popup ? "pop-up" : "", neighbourhood: "", openingSoon, posts: p.media_count ?? null,
    follows: [], relations: {}, score: 0, notes: "found via mentions", popup, partTime, active, amsterdam, posFit,
    followers: p.followers_count ?? null, bio, latestPost, mentionedBy: [...froms], layer: "mention",
  });
  mentionAdded++;
}
for (const h of excluded) targets.delete(h);
for (const t of targets.values())
  t.score = t.follows.length + t.mentionedBy.length + (t.popup ? 3 : 0) + (t.openingSoon ? 3 : 0) + (t.partTime ? 2 : 0) + (t.posts !== null && t.posts < 60 ? 1 : 0);

/*
 * Layout, computed here so the page only draws it. Seeds sit on a circle; each venue starts
 * at the average position of the seeds it's connected to (pulled inward the more seeds it
 * has), venues with one seed form a halo outside it, then a few hundred rounds of collision
 * relaxation spread them out. Deterministic: same CSVs, same picture.
 */
const RADIUS = 300;
const seedPos = new Map(seeds.map((s, i) => {
  const a = -Math.PI / 2 + (i / seeds.length) * Math.PI * 2;
  return [clean(s.handle), { x: Math.cos(a) * RADIUS, y: Math.sin(a) * RADIUS }];
}));
const hash = (str: string) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const nodeR = (k: number) => 3 + k * 2.5;
type P = { x: number; y: number; r: number; fixed: boolean; label: boolean };
const pos = new Map<string, P>();
for (const [h, p] of seedPos) pos.set(h, { ...p, r: 14, fixed: true, label: true });
for (const t of targets.values()) {
  if (!t.follows.length) continue; // mention-only venues are placed below, next to who mentioned them
  const ps = t.follows.map((s) => seedPos.get(s)!).filter(Boolean);
  const cx = ps.reduce((a, p) => a + p.x, 0) / ps.length, cy = ps.reduce((a, p) => a + p.y, 0) / ps.length;
  const k = t.follows.length;
  const pull = k === 1 ? 1.45 : Math.max(0.1, 0.8 - 0.2 * (k - 2));
  const h = hash(t.handle), ang = (h % 360) * (Math.PI / 180), jit = 10 + (h % 40);
  // Labelled: venues linked to 3+ seeds, and every lead (they're named in the graph)
  const lead = t.popup || t.openingSoon || t.partTime;
  pos.set(t.handle, { x: cx * pull + Math.cos(ang) * jit, y: cy * pull + Math.sin(ang) * jit, r: nodeR(k), fixed: false, label: k >= 3 || lead });
}
// Mention-only venues: just outside the average position of the accounts that mentioned them
for (const t of targets.values()) {
  if (t.follows.length) continue;
  const ps = t.mentionedBy.map((m) => pos.get(m)).filter((p): p is P => !!p);
  if (!ps.length) { targets.delete(t.handle); continue; }
  const cx = ps.reduce((a, p) => a + p.x, 0) / ps.length, cy = ps.reduce((a, p) => a + p.y, 0) / ps.length;
  const h = hash(t.handle), ang = (h % 360) * (Math.PI / 180), jit = 25 + (h % 30);
  pos.set(t.handle, { x: cx * 1.18 + Math.cos(ang) * jit, y: cy * 1.18 + Math.sin(ang) * jit, r: 6, fixed: false, label: t.popup || t.openingSoon || t.partTime });
}
const nodes = [...pos.values()];
for (let iter = 0; iter < 300; iter++) {
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      // Labelled nodes (3+ seeds) keep room around them for their name
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01;
      const min = a.r + b.r + 3 + (a.label && b.label ? 80 : a.label || b.label ? 16 : 0);
      if (d >= min) continue;
      const push = (min - d) / 2, ux = dx / d, uy = dy / d;
      if (!a.fixed) { a.x -= ux * push * (b.fixed ? 2 : 1); a.y -= uy * push * (b.fixed ? 2 : 1); }
      if (!b.fixed) { b.x += ux * push * (a.fixed ? 2 : 1); b.y += uy * push * (a.fixed ? 2 : 1); }
    }
}
const xy = (h: string) => { const p = pos.get(h)!; return { x: Math.round(p.x), y: Math.round(p.y) }; };

const ranked = [...targets.values()].sort((a, b) => b.score - a.score || b.follows.length - a.follows.length || a.handle.localeCompare(b.handle));
const graph = {
  generatedAt: new Date().toISOString(),
  seeds: seeds.map((s) => ({ handle: clean(s.handle), name: s.name || s.handle, why: s.why, followers: ranked.filter((t) => t.follows.includes(clean(s.handle))).length, ...xy(clean(s.handle)) })),
  targets: ranked.map((t) => ({ ...t, latestPermalink: latestPermalink(t.handle), ...xy(t.handle) })),
  // Edge direction follows Instagram: from the account that follows to the one followed
  edges: [
    ...ranked.flatMap((t) =>
      t.follows.map((s) => (t.relations[s] === "following" ? { from: s, to: t.handle, kind: "follow" } : { from: t.handle, to: s, kind: "follow" })),
    ),
    ...ranked.flatMap((t) => t.mentionedBy.filter((m) => pos.has(m)).map((m) => ({ from: m, to: t.handle, kind: "mention" }))),
  ],
};
await writeFile(OUT, JSON.stringify(graph, null, 2) + "\n");

console.log(`${graph.seeds.length} seeds · ${ranked.length} venues (${mentionAdded} found via mentions) · ${graph.edges.length} links`);
console.log(`Following 2+ seeds: ${ranked.filter((t) => t.follows.length >= 2).length} · pop-ups: ${ranked.filter((t) => t.popup).length} · opening soon: ${ranked.filter((t) => t.openingSoon).length} · enriched: ${ranked.filter((t) => t.followers !== null).length} · active (posted in ${ACTIVE_DAYS}d): ${ranked.filter((t) => t.active).length} · part-time: ${ranked.filter((t) => t.partTime).length} · not a lead: ${ranked.filter((t) => !t.posFit).length} · excluded by hand: ${excluded.size}`);
console.log("Top targets:");
for (const t of ranked.slice(0, 10)) console.log(`  ${String(t.score).padStart(2)}  @${t.handle}  follows ${t.follows.length}${t.popup ? " · POP-UP" : ""}${t.openingSoon ? " · opening soon" : ""}`);
console.log(`Wrote ${OUT.replace(/.*\/app\//, "app/")}`);
