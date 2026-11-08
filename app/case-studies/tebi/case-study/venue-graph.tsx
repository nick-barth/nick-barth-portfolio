"use client";

import { useEffect, useState } from "react";
import { suggestedDm } from "./dm";

/*
 * Network of Amsterdam venues around Tebi's own customers (scripts/ig-graph). Positions are
 * precomputed by build.ts. Colour: seeds espresso, leads raspberry (#b04a6e, always
 * labelled), venues linked to 2+ seeds blue (#3a6ea5), single-seed venues recessive grey.
 * Grey is below 3:1 on purpose (background); the lists below are the readable table view.
 *
 * Interaction: hover previews a node's links (and clears on leave); click selects it and opens
 * a detail card. Close with ×, Esc or a click on empty space.
 */

/** How build.ts scores a venue (scripts/ig-graph/build.ts) */
const SCORE_HELP =
  "Lead score: Tebi customers who follow them + customers who mention them, +3 pop-up, +3 opening soon, +2 weekend or seasonal, +1 under 60 posts";

type Seed = { handle: string; name: string; followers: number; x: number; y: number };
export type Venue = {
  handle: string; name: string; type: string; follows: string[]; score: number; notes: string; x: number; y: number;
  popup?: boolean; openingSoon?: boolean; partTime?: boolean; bio?: string; mentionedBy?: string[];
  layer?: "follow" | "mention"; followers?: number | null; posts?: number | null; latestPost?: string | null;
  /** Link to the venue's most recent post, when we've read its posts */
  latestPermalink?: string | null;
};
export type VenueGraphData = { seeds: Seed[]; targets: Venue[] };

const ESPRESSO = "#261c0a";
const CORE = "#3a6ea5";
const SINGLE = "#c9c2b4";
const POPUP = "#b04a6e";
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));
const firstLine = (bio = "") => bio.split("\n").map((l) => l.trim()).filter(Boolean)[0] ?? "";
const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
/**
 * Leads: pop-ups, openings and part-time venues (weekend-only or seasonal). All need a
 * till that's cheap when quiet and has no contract. These are the targets.
 */
const isNew = (v: Venue) => !!(v.popup || v.openingSoon || v.partTime);
const leadKind = (v: Venue) => (v.popup ? "Pop-up" : v.openingSoon ? "Opening soon" : "Weekend / seasonal");
const fill = (v: Venue) => (isNew(v) ? POPUP : v.follows.length >= 2 ? CORE : SINGLE);
const r = (k: number) => 3 + k * 2.5;
const nodeR = (v: Venue) => (isNew(v) ? Math.max(r(v.follows.length), 9) : r(v.follows.length));

export function VenueGraph({ data }: { data: VenueGraphData }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const seedName = Object.fromEntries(data.seeds.map((s) => [s.handle, s.name]));
  const all = [...data.seeds, ...data.targets];
  const pad = 70;
  const minX = Math.min(...all.map((n) => n.x)) - pad, maxX = Math.max(...all.map((n) => n.x)) + pad;
  const minY = Math.min(...all.map((n) => n.y)) - pad, maxY = Math.max(...all.map((n) => n.y)) + pad;
  const seedPos = Object.fromEntries(data.seeds.map((s) => [s.handle, s]));
  // Any node by handle, for mention links (a mention can come from a seed or a venue)
  const nodePos: Record<string, { x: number; y: number; name: string }> = Object.fromEntries(all.map((n) => [n.handle, n]));
  const nameOf = (h: string) => nodePos[h]?.name ?? h;

  // What's highlighted: a seed lights up its venues; a venue lights up its seeds and mentioners
  const activeVenue = data.targets.find((t) => t.handle === active);
  const lit = (v: Venue) =>
    !active || active === v.handle || v.follows.includes(active) || !!v.mentionedBy?.includes(active) ||
    !!activeVenue?.mentionedBy?.includes(v.handle);
  const litSeed = (s: Seed) =>
    !active || active === s.handle || !!activeVenue?.follows.includes(s.handle) || !!activeVenue?.mentionedBy?.includes(s.handle);

  const core = data.targets.filter((t) => t.follows.length >= 2);
  const leads = data.targets.filter(isNew);
  const toggle = (h: string) => setSelected((cur) => (cur === h ? null : h));
  const nodeEvents = (h: string) => ({
    onMouseEnter: () => setHovered(h),
    onMouseLeave: () => setHovered(null),
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      toggle(h);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(h);
      }
    },
  });

  const selVenue = data.targets.find((t) => t.handle === selected);
  const selSeed = data.seeds.find((s) => s.handle === selected);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <p className="text-espresso/70">
          {data.seeds.length} Tebi customers · {data.targets.length} Amsterdam venues · {core.length} linked to 2+ ·{" "}
          <strong className="text-[#b04a6e]">{leads.length} leads</strong>
        </p>
        <ul aria-label="Legend" className="flex flex-wrap gap-4">
          {[
            [ESPRESSO, "Tebi customer"],
            [POPUP, "Lead"],
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

      <figure className="relative mt-3 overflow-hidden rounded-xl bg-white">
        <svg
          viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
          className="mx-auto h-auto max-h-[720px] w-full"
          role="img"
          aria-label={`Network graph: ${data.targets.length} Amsterdam venues around ${data.seeds.length} Tebi customers`}
          onClick={() => setSelected(null)}
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
                    strokeOpacity={active ? (on ? 0.8 : 0.04) : 0.4}
                    strokeWidth={on ? 1.8 : 1.1}
                    strokeDasharray="5 4"
                    className="transition-[stroke-opacity] duration-200"
                  />
                );
              }),
            )}
          </g>

          {/* Follow links */}
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
                    strokeOpacity={active ? (on ? 0.7 : 0.03) : t.follows.length >= 2 ? 0.25 : 0.2}
                    strokeWidth={on ? 1.5 : 1}
                    className="transition-[stroke-opacity] duration-200"
                  />
                );
              }),
            )}
          </g>

          {/* Venues: singles first so the core and leads draw on top */}
          {[...data.targets].sort((a, b) => Number(isNew(a)) - Number(isNew(b)) || a.follows.length - b.follows.length).map((t) => {
            const isSel = selected === t.handle;
            return (
              <circle
                key={t.handle}
                cx={t.x} cy={t.y} r={nodeR(t) + (isSel ? 3 : 0)}
                fill={fill(t)}
                stroke={isSel ? ESPRESSO : "#fff"}
                strokeWidth={isSel ? 3 : 2}
                opacity={lit(t) ? 1 : 0.12}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${t.name}${isNew(t) ? `, ${leadKind(t)}` : ""}`}
                {...nodeEvents(t.handle)}
                className="cursor-pointer outline-none transition-opacity duration-200 focus-visible:stroke-[#261c0a]"
              />
            );
          })}

          {/* Labels: venues linked to 3+ customers, and every lead */}
          {data.targets.filter((t) => t.follows.length >= 3 || isNew(t)).map((t) => (
            <text
              key={`l-${t.handle}`}
              x={t.x} y={t.y - nodeR(t) - 5}
              textAnchor="middle" fontSize={15} fill={isNew(t) ? POPUP : ESPRESSO}
              fontWeight={isNew(t) ? 700 : 500}
              opacity={lit(t) ? 1 : 0.12}
              className="pointer-events-none transition-opacity duration-200"
              paintOrder="stroke" stroke="#fff" strokeWidth={3}
            >
              {t.name}
            </text>
          ))}

          {/* Seeds */}
          {data.seeds.map((s) => (
            <g
              key={s.handle}
              opacity={litSeed(s) ? 1 : 0.2}
              tabIndex={0}
              role="button"
              aria-pressed={selected === s.handle}
              aria-label={`${s.name}, Tebi customer`}
              {...nodeEvents(s.handle)}
              className="cursor-pointer outline-none transition-opacity duration-200"
            >
              <circle cx={s.x} cy={s.y} r={selected === s.handle ? 19 : 16} fill={ESPRESSO} stroke="#fff" strokeWidth={3} />
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

        {/* Hover name, only while previewing something that isn't open in the card */}
        {hovered && hovered !== selected && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-espresso px-3 py-1.5 text-xs text-cream">
            {nameOf(hovered)}
          </div>
        )}

        {/* Detail card */}
        {(selVenue || selSeed) && (
          <aside
            aria-label="Venue details"
            onClick={(e) => e.stopPropagation()}
            className="relative m-3 rounded-2xl bg-white p-5 ring-1 ring-stone sm:absolute sm:right-0 sm:top-0 sm:max-h-[calc(100%-1.5rem)] sm:w-[340px] sm:overflow-y-auto sm:shadow-xl"
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-espresso/60 hover:bg-cream hover:text-espresso"
            >
              ×
            </button>

            {selSeed && (
              <div className="pr-8">
                <p className="text-xs text-espresso/55">Tebi customer</p>
                <a href={`https://www.instagram.com/${selSeed.handle}/`} target="_blank" rel="noopener noreferrer" className="font-display text-2xl font-medium tracking-[-0.02em] hover:underline">
                  {selSeed.name}
                </a>
                <p className="text-xs text-espresso/50">@{selSeed.handle}</p>
                <p className="mt-4 text-sm">
                  Linked to <strong>{data.targets.filter((t) => t.follows.includes(selSeed.handle)).length}</strong> venues,
                  including <strong>{leads.filter((t) => t.follows.includes(selSeed.handle) || t.mentionedBy?.includes(selSeed.handle)).length}</strong> leads.
                </p>
              </div>
            )}

            {selVenue && (
              <div>
                <div className="pr-8">
                  {isNew(selVenue) && (
                    <span className="rounded bg-[#b04a6e]/10 px-1.5 py-0.5 text-xs text-[#b04a6e]">{leadKind(selVenue)}</span>
                  )}
                  <a
                    href={`https://www.instagram.com/${selVenue.handle}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block font-display text-2xl font-medium leading-tight tracking-[-0.02em] hover:underline"
                  >
                    {selVenue.name}
                  </a>
                  <p className="text-xs text-espresso/50">@{selVenue.handle}</p>
                </div>

                {selVenue.bio && <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm text-espresso/80">{selVenue.bio}</p>}

                <dl className="mt-4 grid grid-cols-4 gap-2 border-y border-stone py-3 text-center">
                  <div title={SCORE_HELP}>
                    <dt className="text-[11px] text-espresso/50">Lead score</dt>
                    <dd className="font-medium tabular-nums">{selVenue.score}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-espresso/50">Followers</dt>
                    <dd className="font-medium tabular-nums">{selVenue.followers != null ? fmt(selVenue.followers) : "–"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-espresso/50">Posts</dt>
                    <dd className="font-medium tabular-nums">{selVenue.posts ?? "–"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-espresso/50">Last post</dt>
                    <dd className="font-medium">{selVenue.latestPost ? date(selVenue.latestPost) : "–"}</dd>
                  </div>
                </dl>

                <div className="mt-3 space-y-1 text-sm">
                  {selVenue.follows.length > 0 && (
                    <p><span className="text-espresso/55">Followed by </span>{selVenue.follows.map((f) => seedName[f]).join(", ")}</p>
                  )}
                  {!!selVenue.mentionedBy?.length && (
                    <p><span className="text-espresso/55">Mentioned by </span>{selVenue.mentionedBy.map(nameOf).join(", ")}</p>
                  )}
                </div>

                {isNew(selVenue) && (
                  <div className="mt-4 rounded-xl bg-cream p-3">
                    <p className="text-[11px] uppercase tracking-wide text-espresso/50">Suggested DM</p>
                    <p className="mt-1 text-sm leading-snug">
                      {suggestedDm(selVenue, seedName[selVenue.follows[0]] ?? (selVenue.mentionedBy?.[0] && seedName[selVenue.mentionedBy[0]]))}
                    </p>
                  </div>
                )}

                {selVenue.latestPermalink && (
                  <div className="mt-4">
                    <p className="text-[11px] uppercase tracking-wide text-espresso/50">From their Instagram</p>
                    {/* Instagram's own post embed; keyed so switching venues reloads it */}
                    <iframe
                      key={selVenue.latestPermalink}
                      src={`${selVenue.latestPermalink.replace(/\/?$/, "/")}embed/`}
                      title={`Latest Instagram post by ${selVenue.name}`}
                      loading="lazy"
                      className="mt-1 h-[460px] w-full rounded-lg border border-stone bg-cream"
                    />
                  </div>
                )}
              </div>
            )}
          </aside>
        )}
      </figure>

      {/* Leads to message: the DM list */}
      {leads.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-espresso/60">Leads to message</p>
          <p className="mt-1 max-w-[760px] text-xs leading-relaxed text-espresso/50">
            Lead score: 1 point for every Tebi customer who follows them and every one who mentions them in a post, +3 for a
            pop-up, +3 for opening soon, +2 for weekend or seasonal, +1 for a new account (under 60 posts). Pop-up, opening and
            season are read from their Instagram name and bio.
          </p>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((t) => (
              <li key={t.handle} className="min-w-0">
                <button
                  onClick={() => toggle(t.handle)}
                  onMouseEnter={() => setHovered(t.handle)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={selected === t.handle}
                  className={`block w-full rounded-xl border p-4 text-left transition-colors ${
                    selected === t.handle ? "border-espresso bg-cream" : "border-stone hover:border-espresso/40"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-medium">{t.name}</span>
                    {t.followers != null && <span className="shrink-0 text-xs tabular-nums text-espresso/55">{fmt(t.followers)} followers</span>}
                  </span>
                  <span className="block text-xs text-espresso/50">
                    @{t.handle}
                    <span className="ml-2 rounded bg-[#b04a6e]/10 px-1.5 py-0.5 text-[#b04a6e]">{leadKind(t)}</span>
                    <span title={SCORE_HELP} className="ml-1.5 rounded border border-stone bg-white px-1.5 py-px tabular-nums text-espresso/70">
                      Score {t.score}
                    </span>
                  </span>
                  {firstLine(t.bio) && <span className="mt-2 line-clamp-2 block text-sm text-espresso/75">“{firstLine(t.bio)}”</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Table view: the core targets, ranked */}
      <div className="mt-6">
        <p className="text-sm text-espresso/60">Linked to the most Tebi customers</p>
        <ol className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {core
            .filter((t) => !isNew(t))
            // Ranked by the number shown: how many Tebi customers follow them
            .toSorted((a, b) => b.follows.length - a.follows.length)
            .slice(0, 15)
            .map((t, i) => (
            <li key={t.handle} className="min-w-0">
              <button
                onClick={() => toggle(t.handle)}
                onMouseEnter={() => setHovered(t.handle)}
                onMouseLeave={() => setHovered(null)}
                className="flex w-full items-baseline justify-between gap-3 border-b border-stone py-1.5 text-left text-[15px] hover:text-espresso/70"
              >
                <span className="min-w-0 truncate">
                  <span className="mr-2 tabular-nums text-espresso/40">{i + 1}</span>
                  {t.name}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-espresso/55">{t.follows.length} of {data.seeds.length}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
