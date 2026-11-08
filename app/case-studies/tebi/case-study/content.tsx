import Link from "next/link";
import type { ReactNode } from "react";
import { AuditResults, type AuditSummary } from "./audit-results";
import type { AuditPrompt } from "./audit-table";
// Both written by `bun run audit` (scripts/ai-audit); the summary only by complete runs
import auditData from "./audit-data.json";
import auditSummary from "./audit-summary.json";
// Written by `bun scripts/ig-graph/build.ts` from the hand-collected Instagram lists
import igGraph from "./ig-graph.json";
import { VenueGraph, type VenueGraphData } from "./venue-graph";

const audit = auditData as AuditPrompt[];

/*
 * Everything on the Case Study page comes from here. The layout follows tebi.com's
 * comparison pages (e.g. /compare/tebi-vs-lightspeed); the structure, titles, tasks and
 * part labels follow Tebi's brief ("Growth Marketer Case Study", Nov 2026).
 *
 * - Each part renders as a white card. Set `content` to JSX to answer it, or leave it
 *   `null` to show the brief's ask as a placeholder. `wide: true` spans the full row.
 * - Building blocks for answers live in ./blocks.tsx and ./audit-table.tsx.
 */

export const hero = {
  title: "Growth Marketer case study",
  subtitle: "My answers to Tebi's three challenges, built inside a working recreation of tebi.com.",
};

/** Pages the engines cited for Dutch owners' questions, from the 6 Nov 2026 run */
const citedPages = [
  { url: "https://www.kassazaak.nl/horeca/", label: "kassazaak.nl/horeca/", kind: "POS comparison page for hospitality" },
  { url: "https://www.lightspeedhq.nl/kassasysteem/amsterdam/", label: "lightspeedhq.nl/kassasysteem/amsterdam/", kind: "Lightspeed's own Amsterdam landing page" },
  { url: "https://bedrijfssoftwaregids.nl/blog/lightspeed-vs-untill-2026/", label: "bedrijfssoftwaregids.nl/blog/lightspeed-vs-untill-2026/", kind: "Lightspeed vs unTill comparison article" },
];

// Explain card is hidden for now; add { label: "Explain", ask: "What patterns do you see? Why do competitors show up and Tebi doesn't?", content: <ExplainContent /> } back to the 01 parts to show it
export function ExplainContent() {
  return (
    <div>
      <p className="text-espresso/60">Cited pages</p>
      <ul className="mt-3 space-y-2">
        {citedPages.map((p) => (
          <li key={p.url}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="break-all border-b border-espresso/40 hover:border-espresso">
              {p.label}
            </a>
            <span className="block text-sm text-espresso/55">{p.kind}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Third-party pages the engines cite most, per market (competitors' own sites left out).
 * Picked from the 6 Nov 2026 run; counts are read live from audit-summary.json.
 */
const listings: { market: string; page: string; url: string }[] = [
  { market: "NL", page: "bedrijfssoftwaregids.nl/blog/beste-kassasysteem-horeca", url: "https://bedrijfssoftwaregids.nl/blog/beste-kassasysteem-horeca/" },
  { market: "NL", page: "kassazaak.nl/horeca", url: "https://www.kassazaak.nl/horeca/" },
  { market: "NL", page: "nl.mobiletransaction.org/kassasystemen-voor-horeca", url: "https://nl.mobiletransaction.org/kassasystemen-voor-horeca/" },
  { market: "NL", page: "shiftbase.com/nl/blog/beste-kassasysteem", url: "https://www.shiftbase.com/nl/blog/beste-kassasysteem" },
  { market: "DE", page: "fuer-gruender.de/wissen/unternehmen-fuehren/buchhaltung/kasse/gastronomie", url: "https://www.fuer-gruender.de/wissen/unternehmen-fuehren/buchhaltung/kasse/gastronomie/" },
  { market: "DE", page: "de.mobiletransaction.org/kassensysteme-fuer-gastronomie", url: "https://de.mobiletransaction.org/kassensysteme-fuer-gastronomie/" },
  { market: "DE", page: "ordio.com/insights/ratgeber/kassensystem-gastronomie-vergleich", url: "https://www.ordio.com/insights/ratgeber/kassensystem-gastronomie-vergleich" },
  { market: "DE", page: "kassensystemevergleich.de/gastronomie-registrierkassen-und-kassensysteme", url: "https://www.kassensystemevergleich.de/gastronomie-registrierkassen-und-kassensysteme/" },
  { market: "ES", page: "hitsystems.es/blog/Los-10-Mejores-TPV-para-Hosteler%C3%ADa-en-Espa%C3%B1a-2025", url: "https://www.hitsystems.es/blog/Los-10-Mejores-TPV-para-Hosteler%C3%ADa-en-Espa%C3%B1a-2025" },
  { market: "ES", page: "lymon.es/blog/tpv-ranking", url: "https://lymon.es/blog/tpv-ranking" },
  { market: "ES", page: "stelorder.com/blog/mejores-programas-tpv", url: "https://www.stelorder.com/blog/mejores-programas-tpv/" },
  { market: "ES", page: "hackceleration.com/es/labs/mejor/software-tpv", url: "https://hackceleration.com/es/labs/mejor/software-tpv/" },
];

/** How many answers in a market cited a page, from the latest complete run. */
function citedCount(market: string, page: string) {
  const m = (auditSummary as AuditSummary).markets.find((x) => x.market === market);
  return m?.topPages?.find((p) => p.page === page)?.count;
}

function ActContent() {
  const markets = [...new Set(listings.map((l) => l.market))];
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p>
          <strong>1. Local pages</strong> at <code className="font-mono text-sm">/{"{market}"}/{"{city}"}/{"{venue type}"}</code>, in
          each market&apos;s language, answering the questions owners ask AI.
        </p>
        <p>
          <Link href="/case-studies/tebi/local" className="border-b border-espresso/40 hover:border-espresso">
            Prototype: 105 generated pages
          </Link>{" "}
          <span className="text-espresso/60">(7 markets × 3 cities × 5 venue types)</span>
        </p>
      </div>

      <div className="space-y-3">
        <p>
          <strong>2. Get listed where AI looks.</strong>{" "}
          These comparison sites run on affiliate marketing, so Tebi needs an affiliate programme to get listed.
        </p>
        <div className="grid gap-5 pt-1 sm:grid-cols-3">
        {markets.map((mk) => (
          <div key={mk} className="min-w-0">
            <p className="text-sm text-espresso/55">{mk}</p>
            <ul className="mt-1 space-y-1">
              {listings
                .filter((l) => l.market === mk)
                .map((l) => {
                  const n = citedCount(l.market, l.page);
                  const domain = l.page.split("/")[0];
                  return (
                    <li key={l.page} className="flex items-baseline justify-between gap-3 text-[15px]">
                      <a href={l.url} target="_blank" rel="noopener noreferrer" title={l.page} className="truncate border-b border-espresso/30 hover:border-espresso">
                        {domain}
                      </a>
                      {n !== undefined && <span className="shrink-0 text-sm tabular-nums text-espresso/55">cited {n}×</span>}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function TrackContent() {
  return (
    <ul className="space-y-3">
      <li>
        <strong>UTM source.</strong> ChatGPT tags its links (<code className="font-mono text-sm">utm_source=chatgpt.com</code> /{" "}
        <code className="font-mono text-sm">openai</code>); group these with AI referrers in GA4.
      </li>
      <li>
        <strong>Deep-linked pages as a proxy.</strong> Untagged visits landing straight on deep pages (local pages, comparisons)
        count as AI traffic.
      </li>
      <li>
        <strong>SEO as a proxy.</strong> AI answers lean on pages that rank, so track rankings and impressions for the target
        questions in Google Search Console and Bing Webmaster Tools.
      </li>
    </ul>
  );
}

/* ---------- 02 Untapped acquisition: pop-ups ---------- */

function PopupMerchant() {
  return (
    <div className="space-y-2">
      <p>Pop-ups, new openings and weekend-only or seasonal venues in Amsterdam&apos;s scene.</p>
      <p className="text-espresso/70">Right now: a run to plan, a host to find, a till that&apos;s cheap when it&apos;s quiet.</p>
      <p className="text-espresso/70">Attention: Instagram, and the venues that host them.</p>
    </div>
  );
}

function PopupChannel() {
  return (
    <div className="space-y-2">
      <p>Instagram DMs from Tebi, sent by hand by an intern.</p>
      <p className="text-espresso/70">
        Targets come from the network above: who Tebi&apos;s customers follow and mention, filtered to venues that run a till.
      </p>
      <p className="text-espresso/70">Competitors buy ads. Nobody DMs the pop-up.</p>
    </div>
  );
}

function PopupMessage() {
  return (
    <div className="space-y-2">
      <p className="font-display text-lg font-medium leading-snug tracking-[-0.02em]">
        “Zag dat Kantine Kees in the making is 👀 Barracuda draait op Tebi. Geen contract, gewoon je iPad, en €0 per maand
        onder €10K omzet. Zin om te zien hoe?”
      </p>
      <p className="text-sm text-espresso/60">
        Saw Kantine Kees is in the making. Barracuda runs on Tebi. No contract, just your iPad, €0 a month under €10K. Want
        to see how?
      </p>
    </div>
  );
}

function PopupLaunch() {
  return (
    <ul className="space-y-1.5">
      <li><strong>Week 1:</strong> target list from the network, checked against Tebi&apos;s CRM; DM templates signed off by product marketing</li>
      <li><strong>Week 2:</strong> intern sends 10 DMs a day, each with its own demo link</li>
      <li><strong>Week 3:</strong> follow-ups, sales runs the demos</li>
    </ul>
  );
}

function PopupSuccess() {
  return (
    <div className="space-y-3">
      <p className="text-espresso/70">First pass, from 5 customers&apos; profiles: 15 till leads.</p>
      <ul className="space-y-1.5">
        <li>15 DMs, 5+ replies, 3 demos, 1 live</li>
        <li>Then the customers&apos; followers lists: 150 DMs, 10 demos, 3 live</li>
      </ul>
    </div>
  );
}

/* ---------- 02 Backup plan: Sligro ---------- */

function SligroBackup() {
  return (
    <p>
      Ads at Sligro&apos;s Amsterdam checkouts, plus a stand on busy mornings: only businesses shop there, and owners are in
      buying mode. Message: “Je weet wat je hier betaalt. Weet je ook wat het je oplevert?” If Sligro won&apos;t sell space
      inside, try car-park banners and trolley ads, or Bidfood. Success is demos from the Sligro QR code at under €600 each.
    </p>
  );
}

export type Part = {
  label: string;
  /** What the brief asks for here, shown as a placeholder until `content` is set */
  ask: string;
  content: ReactNode | null;
  /** Span the whole row instead of a third */
  wide?: boolean;
  /** Span two thirds of the row */
  double?: boolean;
};

/** Panel colours, matching the slides in Tebi's brief */
export type Tone = "espresso" | "slate" | "wine" | "olive";

export type Section = {
  id: string;
  num?: string;
  title: string;
  tone: Tone;
  /** The task, as Tebi framed it — shown under the heading when set */
  intro?: string;
  parts: Part[];
};

const experiment = "Hypothesis, what you'd build and how long, cost, the result that means double down, what makes you stop, and who you'd need.";

export const sections: Section[] = [
  {
    id: "context",
    tone: "espresso",
    title: "Where we are today",
    intro: "A read of the numbers Tebi shared.",
    parts: [
      { label: "What the numbers say", ask: "What the data Tebi shared tells you.", content: null },
      { label: "Where I'd dig in", ask: "What's messy or incomplete, and what you'd check first.", content: null },
      { label: "What I'm assuming", ask: "The reasonable assumptions you'd make to move on.", content: null },
    ],
  },
  {
    id: "ai-answers",
    tone: "slate",
    num: "01",
    title: "Get found in AI answers",
    parts: [
      { label: "AI Audit", ask: "10–15 questions a restaurant owner would really ask, in at least two markets and languages, run in ChatGPT, Perplexity, Gemini and Google AI Overviews. Who gets recommended, and which sources are cited?", content: audit.length ? <AuditResults summary={auditSummary as AuditSummary} prompts={audit} /> : null, wide: true },
      { label: "Act", ask: "The 3 things you'd ship in the first 30 days: pages, content, listings, reviews or third-party sources.", content: <ActContent />, double: true },
      { label: "Track", ask: "How you'd measure progress when analytics don't separate AI traffic yet.", content: <TrackContent /> },
    ],
  },
  {
    id: "untapped",
    tone: "wine",
    num: "02",
    title: "Untapped acquisition opportunity",
    intro: "Pop-ups and part-time venues in Amsterdam, found through Tebi's own customers on Instagram.",
    parts: [
      { label: "The network", ask: "", content: <VenueGraph data={igGraph as VenueGraphData} />, wide: true },
      { label: "The merchant", ask: "Who they are, what's on their mind this month, and where their attention goes.", content: <PopupMerchant /> },
      { label: "The channel", ask: "Where you'd reach them, and why it's an untapped opportunity.", content: <PopupChannel /> },
      { label: "The message", ask: "What you'd say, in their words: the actual headline or first line.", content: <PopupMessage /> },
      { label: "The launch", ask: "Who you'd work with across product marketing, design, sales or local teams, and how it goes live in 2–3 weeks.", content: <PopupLaunch /> },
      { label: "Success", ask: "What would tell you it's working after 30 days.", content: <PopupSuccess /> },
      { label: "Backup plan", ask: "", content: <SligroBackup />, wide: true },
    ],
  },
  {
    id: "first-60-days",
    tone: "olive",
    num: "03",
    title: "Your first 60 days",
    intro: "Three acquisition experiments, each as a mini project overview, and the order you'd run them in.",
    parts: [
      { label: "Experiment A", ask: experiment, content: null },
      { label: "Experiment B", ask: experiment, content: null },
      { label: "Experiment C", ask: experiment, content: null },
      { label: "The order", ask: "The order you'd run them in, and why.", content: null, wide: true },
    ],
  },
];
