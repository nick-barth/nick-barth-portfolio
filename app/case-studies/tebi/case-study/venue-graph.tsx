"use client";

import { useState } from "react";

/*
 * Network of Amsterdam venues around Tebi's own customers (scripts/ig-graph). Positions are
 * precomputed by build.ts. Colour: seeds espresso, pop-ups raspberry (#b04a6e, always labelled),
 * venues linked to 2+ seeds blue (#3a6ea5), single-seed venues recessive grey. Grey is below 3:1 on purpose (background), so every
 * node has a hover/focus tooltip and the ranked list below is the readable table view.
 */

type Seed = { handle: string; name: string; followers: number; x: number; y: number };
type Venue = {
  handle: string; name: string; type: string; follows: string[]; score: number; notes: string; x: number; y: number;
  popup?: boolean; openingSoon?: boolean; partTime?: boolean; bio?: string; mentionedBy?: string[]; layer?: "follow" | "mention"; followers?: number | null; posts?: number | null; latestPost?: string | null;
};
export type VenueGraphData = { seeds: Seed[]; targets: Venue[] };

const ESPRESSO = "#261c0a";
const CORE = "#3a6ea5";
const SINGLE = "#c9c2b4";
const POPUP = "#b04a6e";
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));
const firstLine = (bio = "") => bio.split("\n").map((l) => l.trim()).filter(Boolean)[0] ?? "";
/**
 * Till leads: pop-ups, openings and part-time venues (weekend-only or seasonal). All need a
 * till that's cheap when quiet and has no contract. These are the targets.
 */
const isNew = (v: Venue) => !!(v.popup || v.openingSoon || v.partTime);
const leadKind = (v: Venue) => (v.popup ? "Pop-up" : v.openingSoon ? "Opening soon" : "Weekend / seasonal");
const fill = (v: Venue) => (isNew(v) ? POPUP : v.follows.length >= 2 ? CORE : SINGLE);
const r = (k: number) => 3 + k * 2.5;

export function VenueGraph({ data }: { data: VenueGraphData }) {
  const [active, setActive] = useState<string | null>(null);
  const seedName = Object.fromEntries(data.seeds.map((s) => [s.handle, s.name]));
  const all = [...data.seeds, ...data.targets];
  const pad = 70;
  const minX = Math.min(...all.map((n) => n.x)) - pad, maxX = Math.max(...all.map((n) => n.x)) + pad;
  const minY = Math.min(...all.map((n) => n.y)) - pad, maxY = Math.max(...all.map((n) => n.y)) + pad;
  const seedPos = Object.fromEntries(data.seeds.map((s) => [s.handle, s]));
  // Any node by handle, for mention links (a mention can come from a seed or a venue)
  const nodePos: Record<string, { x: number; y: number; name: string }> = Object.fromEntries(
    [...data.seeds, ...data.targets].map((n) => [n.handle, n]),
  );

  // What's highlighted: a seed lights up its venues; a venue lights up its seeds
  const activeVenue = data.targets.find((t) => t.handle === active);
  const lit = (v: Venue) =>
    !active || active === v.handle || v.follows.includes(active) || !!v.mentionedBy?.includes(active) ||
    !!activeVenue?.mentionedBy?.includes(v.handle);
  const litSeed = (s: Seed) => !active || active === s.handle || !!activeVenue?.follows.includes(s.handle);

  const core = data.targets.filter((t) => t.follows.length >= 2);
  const popups = data.targets.filter(isNew);
  const tooltip = active
    ? activeVenue
      ? [
          `${activeVenue.name} · @${activeVenue.handle}`,
          activeVenue.followers != null ? `${fmt(activeVenue.followers)} followers · ${activeVenue.posts ?? "?"} posts` : null,
          activeVenue.follows.length ? `Linked to ${activeVenue.follows.map((f) => seedName[f]).join(", ")}` : null,
          activeVenue.mentionedBy?.length ? `Mentioned by ${activeVenue.mentionedBy.map((m) => nodePos[m]?.name ?? m).join(", ")}` : null,
        ].filter(Boolean).join(" · ")
      : `${seedName[active]} · Tebi customer · ${data.targets.filter((t) => t.follows.includes(active)).length} venues`
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <p className="text-espresso/70">
          {data.seeds.length} Tebi customers · {data.targets.length} Amsterdam venues · {core.length} linked to 2+ ·{" "}
          <strong className="text-[#b04a6e]">{popups.length} till leads</strong>
        </p>
        <ul aria-label="Legend" className="flex flex-wrap gap-4">
          {[
            [ESPRESSO, "Tebi customer"],
            [POPUP, "Till lead: pop-up, opening, weekend or seasonal"],
            [CORE, "Linked to 2+"],
            [SINGLE, "Linked to 1"],
          ].map(([c, l]) => (
            <li key={l} className="flex items-center gap-1.5">
              <span className="size-3 rounded-full" style={{ background: c }} />
              {l}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <svg width="18" height="6" aria-hidden><line x1="0" y1="3" x2="18" y2="3" stroke={POPUP} strokeWidth="2" strokeDasharray="4 3" /></svg>
            Mentioned in a post
          </li>
        </ul>
      </div>

      <figure className="relative mt-4 overflow-hidden rounded-xl bg-white">
        <svg
          viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
          className="mx-auto h-auto max-h-[720px] w-full"
          role="img"
          aria-label={`Network graph: ${data.targets.length} Amsterdam venues around ${data.seeds.length} Tebi customers`}
          onMouseLeave={() => setActive(null)}
        >
          {/* Mention links: dashed, from the account whose post mentioned them */}
          <g>
            {data.targets.flatMap((t) =>
              (t.mentionedBy ?? []).map((m) => {
                const p = nodePos[m];
                if (!p) return null;
                const on = active && (active === t.handle || active === m);
                return (
                  <line
                    key={`m-${m}-${t.handle}`}
                    x1={t.x} y1={t.y} x2={p.x} y2={p.y}
                    stroke={on ? ESPRESSO : POPUP}
                    strokeOpacity={active ? (on ? 0.8 : 0.05) : 0.45}
                    strokeWidth={on ? 1.8 : 1.2}
                    strokeDasharray="5 4"
                  />
                );
              }),
            )}
          </g>

          {/* Edges */}
          <g>
            {data.targets.flatMap((t) =>
              t.follows.map((s) => {
                const p = seedPos[s];
                if (!p) return null;
                const on = active && (active === t.handle || active === s);
                return (
                  <line
                    key={`${t.handle}-${s}`}
                    x1={t.x} y1={t.y} x2={p.x} y2={p.y}
                    stroke={on ? ESPRESSO : fill(t)}
                    strokeOpacity={active ? (on ? 0.7 : 0.04) : t.follows.length >= 2 ? 0.28 : 0.22}
                    strokeWidth={on ? 1.5 : 1}
                  />
                );
              }),
            )}
          </g>

          {/* Venues: singles first so the core draws on top */}
          {[...data.targets].sort((a, b) => Number(isNew(a)) - Number(isNew(b)) || a.follows.length - b.follows.length).map((t) => {
            const k = t.follows.length;
            return (
              <circle
                key={t.handle}
                cx={t.x} cy={t.y} r={isNew(t) ? Math.max(r(k), 9) : r(k)}
                fill={fill(t)}
                stroke="#fff" strokeWidth={2}
                opacity={lit(t) ? 1 : 0.15}
                tabIndex={k >= 2 || isNew(t) ? 0 : -1}
                aria-label={`${t.name}, linked to ${k} Tebi customer${k > 1 ? "s" : ""}`}
                onMouseEnter={() => setActive(t.handle)}
                onFocus={() => setActive(t.handle)}
                onBlur={() => setActive(null)}
                className="cursor-pointer outline-none"
              />
            );
          })}

          {/* Labels for the venues linked to 3+ customers */}
          {data.targets.filter((t) => t.follows.length >= 3 || isNew(t)).map((t) => (
            <text
              key={`l-${t.handle}`}
              x={t.x} y={t.y - (isNew(t) ? Math.max(r(t.follows.length), 9) : r(t.follows.length)) - 5}
              textAnchor="middle" fontSize={15} fill={isNew(t) ? POPUP : ESPRESSO}
              fontWeight={isNew(t) ? 700 : 500}
              opacity={lit(t) ? 1 : 0.15}
              className="pointer-events-none font-medium"
              paintOrder="stroke" stroke="#fff" strokeWidth={3}
            >
              {t.name}
            </text>
          ))}

          {/* Seeds */}
          {data.seeds.map((s) => (
            <g
              key={s.handle}
              opacity={litSeed(s) ? 1 : 0.25}
              tabIndex={0}
              aria-label={`${s.name}, Tebi customer`}
              onMouseEnter={() => setActive(s.handle)}
              onFocus={() => setActive(s.handle)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none"
            >
              <circle cx={s.x} cy={s.y} r={16} fill={ESPRESSO} stroke="#fff" strokeWidth={3} />
              <text
                x={s.x} y={s.y + (s.y > 0 ? 40 : -28)}
                textAnchor="middle" fontSize={21} fill={ESPRESSO}
                className="font-semibold" paintOrder="stroke" stroke="#fff" strokeWidth={4}
              >
                {s.name}
              </text>
            </g>
          ))}
        </svg>

        {tooltip && (
          <figcaption className="pointer-events-none absolute left-3 top-3 max-w-[80%] rounded-lg bg-espresso px-3 py-2 text-xs text-cream">
            {tooltip}
          </figcaption>
        )}
      </figure>

      {/* Pop-ups to message: the DM list */}
      {popups.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-espresso/60">Till leads to message</p>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popups.map((t) => (
              <li
                key={t.handle}
                className="rounded-xl border border-stone p-4"
                onMouseEnter={() => setActive(t.handle)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <a
                    href={`https://www.instagram.com/${t.handle}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-medium hover:underline"
                  >
                    {t.name}
                  </a>
                  {t.followers != null && <span className="shrink-0 text-xs tabular-nums text-espresso/55">{fmt(t.followers)} followers</span>}
                </div>
                <p className="text-xs text-espresso/50">
                  @{t.handle}
                  <span className="ml-2 rounded bg-[#b04a6e]/10 px-1.5 py-0.5 text-[#b04a6e]">
                    {leadKind(t)}
                  </span>
                </p>
                {firstLine(t.bio) && <p className="mt-2 line-clamp-2 text-sm text-espresso/75">“{firstLine(t.bio)}”</p>}
                <p className="mt-2 text-xs text-espresso/60">
                  {t.follows.length > 0 && <>Linked to {t.follows.map((f) => seedName[f]).join(", ")}</>}
                  {!!t.mentionedBy?.length && <>{t.follows.length > 0 && " · "}Mentioned by {t.mentionedBy.map((m) => nodePos[m]?.name ?? m).join(", ")}</>}
                  {t.latestPost && <> · last post {new Date(t.latestPost).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Table view: the core targets, ranked */}
      <div className="mt-6">
        <p className="text-sm text-espresso/60">Linked to the most Tebi customers</p>
        <ol className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {core.filter((t) => !isNew(t)).slice(0, 15).map((t, i) => (
            <li
              key={t.handle}
              className="flex items-baseline justify-between gap-3 border-b border-stone py-1.5 text-[15px]"
              onMouseEnter={() => setActive(t.handle)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="min-w-0 truncate">
                <span className="mr-2 tabular-nums text-espresso/40">{i + 1}</span>
                {t.name}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-espresso/55">{t.follows.length} of {data.seeds.length}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
