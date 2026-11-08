import Link from "next/link";
import type { ReactNode } from "react";
import { AuditResults, type AuditSummary } from "./audit-results";
import type { AuditPrompt } from "./audit-table";
// Both written by `bun run audit` (scripts/ai-audit); the summary only by complete runs
import auditData from "./audit-data.json";
import auditSummary from "./audit-summary.json";
// Written by `bun scripts/ig-graph/build.ts` from the hand-collected Instagram lists
import igGraph from "./ig-graph.json";
import { suggestedDm, suggestedDmEn } from "./dm";
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
          <strong>1. Build on a solid base.</strong>{" "}
          tebi.com already has AI crawlers in (?) and has an llms.txt. A few quick wins:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-[15px] text-espresso/80">
          <li>FAQ and article schema on the blog and comparison pages, so AI can quote them directly</li>
          <li>A unique title and H1 on every page, including the translated ones</li>
          <li>Comparison pages (?)</li>
        </ul>
      </div>

      <div className="space-y-3">
        <p>
          <strong>2. Local pages </strong> in each market&apos;s language, answering the questions owners ask AI.           <Link href="/case-studies/tebi/local" className="border-b border-espresso/40 hover:border-espresso">
            Prototype: 105 generated pages
          </Link>.  Then we would focus on guides.
        </p>
      </div>

      <div className="space-y-3">
        <p>
          <strong>3. Get listed where AI looks.</strong>{" "}
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
        <strong>Run the AI audit daily.</strong> The same 45 questions in ChatGPT, Perplexity and Gemini.
      </li>
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
    </div>
  );
}

function PopupChannel() {
  return (
    <div className="space-y-2">
      <p>Instagram DMs from Tebi, sent by hand.</p>
    </div>
  );
}

/** One example first DM per kind of lead, built from real leads with the graph's own template. */
const dmExamples: { kind: string; handle: string }[] = [
  { kind: "Pop-up", handle: "rookt.amsterdam" },
  { kind: "Opening soon", handle: "sichuan_territory" },
  { kind: "Weekend / seasonal", handle: "noorderpark_cafe" },
];

function PopupMessage() {
  const graph = igGraph as VenueGraphData;
  const seedName = Object.fromEntries(graph.seeds.map((x) => [x.handle, x.name]));
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {dmExamples.map((ex) => {
        const v = graph.targets.find((t) => t.handle === ex.handle);
        if (!v) return null;
        return (
          <div key={ex.handle}>
            <span className="rounded bg-[#b04a6e]/10 px-1.5 py-0.5 text-xs text-[#b04a6e]">{ex.kind}</span>
            <p className="mt-1.5 font-display text-[17px] font-medium leading-snug tracking-[-0.02em]">
              “{suggestedDm(v, seedName[v.follows[0]])}”
            </p>
            <p className="mt-1 text-sm text-espresso/60">{suggestedDmEn(v, seedName[v.follows[0]])}</p>
          </div>
        );
      })}
    </div>
  );
}

/** Who does what, week by week: the brief asks for both the teams and the 2–3 week path. */
const launchWeeks: { week: string; title: string; steps: { team: string; task: string }[] }[] = [
  {
    week: "Week 1",
    title: "Prep",
    steps: [
      { team: "Sales", task: "Load the leads into HubSpot, skip venues already on Tebi" },
      { team: "Account managers", task: "Get the OK from the 5 customers to be named in DMs" },
      { team: "Product marketing", task: "Sign off the Dutch DM copy and the claims (€0 under €10K, no contract)" },
      { team: "Design (optional)", task: "A simple pop-up landing page with a demo link per DM" },
    ],
  },
  {
    week: "Week 2",
    title: "Go live",
    steps: [
      { team: "Me", task: "Send 5 DMs a day by hand from Tebi's account, log every contact in HubSpot" },
      { team: "Sales", task: "Book a demo within 24 hours of a reply" },
    ],
  },
  {
    week: "Week 3",
    title: "Follow up and learn",
    steps: [
      { team: "Me + Sales", task: "Follow up once, run the demos, share a weekly readout" },
      { team: "Me", task: "Start the next batch from the customers' followers lists" },
    ],
  },
];

function PopupLaunch() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {launchWeeks.map((w) => (
        <div key={w.week} className="rounded-xl bg-cream p-4">
          <p className="font-medium">{w.title}</p>
          <ul className="mt-3 space-y-2.5">
            {w.steps.map((st) => (
              <li key={st.task} className="text-[14px] leading-snug">
                <span className="block text-xs font-medium text-[#b04a6e]">{st.team}</span>
                {st.task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PopupSuccess() {
  return (
    <div className="space-y-3">
      <ul className="space-y-1.5">
        <li>15 DMs, 5+ replies, 3 demos, 1 live</li>
      </ul>
    </div>
  );
}

/* ---------- 02 Backup plan: Sligro ---------- */

const sligroPlan = [
  {
    q: "Why Sligro",
    a: "Business-only wholesaler. Independent owners still do their own stock run, with costs on their mind, and no POS brand is in the store.",
  },
  { q: "The merchant", a: "Independent cafés and restaurants in Amsterdam that shop at Sligro themselves." },
  { q: "The channel", a: "A stand at the Amsterdam Sligro checkouts on busy mornings. Bidfood if Sligro says no." },
  {
    q: "The message",
    a: "“Je weet wat je hier betaalt. Weet je ook wat het je oplevert?” Scan your receipt, get a free cost check per dish.",
  },
  { q: "The launch", a: "Two mornings at one store, me and one sales rep. Every scan and demo logged in HubSpot." },
  {
    q: "Success",
    a: "50 scans, 10 demos, 2 live. The pooled, anonymous prices become an Amsterdam horeca price index for Tebi to publish.",
  },
];

function SligroBackup() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {sligroPlan.map(({ q, a }) => (
        <div key={q}>
          <p className="font-medium">{q}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-espresso/80">{a}</p>
        </div>
      ))}
    </div>
  );
}

type Experiment = { links?: { label: string; href: string }[]; rows: [string, string][] };

const experiments: Record<"tools" | "referral" | "openings", Experiment> = {
  tools: {
    links: [
      { label: "Rustige maand? Dan betaal je niks.", href: "/case-studies/tebi/tools/seizoen" },
      { label: "Wat kost pinnen je echt?", href: "/case-studies/tebi/tools/pinkosten" },
      { label: "Wat kost je gerecht?", href: "/case-studies/tebi/tools/gerecht" },
    ],
    rows: [
      ["Hypothesis", "People who care about money will prompt for tools.  This means they are almost always going to be ICP."],
      ["Build", "10 calculators, matching what Toast, Lightspeed and Bedrijfssoftwaregids offer: seasonal subscription, card fees, POS cost, POS chooser, cost per dish, break-even, labour cost, prime cost, profit margin, tip split. "],
      ["Cost", "15 minutes of design & content eyeballs 👁️👄👁️. Two days implementation time."],
      ["Double down", "1,000 uses, or AEO saturation."],
      ["Stop", "Can't stop, won't stop"],
      ["Team", "Marketing"],
    ],
  },
  referral: {
    rows: [
      ["Hypothesis", "Tebi already has a strong referral programme, and it works (?). Most customers just don't think to share their code. A nudge and a ready Instagram DM would get more of them to do it."],
      ["Build", "Each customer gets a short list of venues from their own Instagram network that aren't on Tebi, with their code and a ready Instagram DM. Sent after a strong week, by email or by their account manager."],
      ["Cost", "The existing rewards, nothing new. A day to pull each customer's venue list, a day to set up the email."],
      ["Double down", "Twice as many referrals a month as before the nudge."],
      ["Stop", "No more referrals than usual after 6 weeks."],
      ["Team", "Account managers, Sales."],
    ],
  },
  openings: {
    rows: [
      ["Hypothesis", "A new operating permit application means a venue is weeks from opening and hasn't committed to software yet.  We will likely be the first to reach them, and their inbox won't be red very often, so having an encouraging message from Tebi is hype."],
      ["Build", "A daily scrape of Amsterdam's new permit applications in the Gemeenteblad. Each address gets matched to the venue's Instagram, then an Instagram DM from Tebi (same flow as challenge 02), logged in HubSpot."],
      ["Cost", "€0 for the data, a day to set up the scraperino."],
      ["Double down", "1 in 5 new applications books a demo. Then add Rotterdam, Utrecht and The Hague."],
      ["Stop", "Most applications turn out to be takeovers that keep their POS, or chains that buy centrally."],
      ["Team", "Me, Sales."],
    ],
  },
};

function ExperimentCard({ links, rows }: Experiment) {
  return (
    <div className="space-y-5">
      {links && (
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg bg-cream px-3 py-1.5 text-sm font-medium hover:bg-stone">
              {l.label} →
            </Link>
          ))}
        </div>
      )}
      <dl className="grid gap-x-6 gap-y-4 md:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-espresso/60">{k}</dt>
            <dd className="mt-0.5 text-[15px] leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
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
      { label: "The channel", ask: "Where you'd reach them, and why it's an untapped opportunity.", content: <PopupChannel />, double: true },
      { label: "The message", ask: "What you'd say, in their words: the actual headline or first line.", content: <PopupMessage />, wide: true },
      { label: "The launch", ask: "Who you'd work with across product marketing, design, sales or local teams, and how it goes live in 2–3 weeks.", content: <PopupLaunch />, double: true },
      { label: "Success", ask: "What would tell you it's working after 30 days.", content: <PopupSuccess /> },
      { label: "Backup plan", ask: "", content: <SligroBackup />, wide: true },
    ],
  },
  {
    id: "first-60-days",
    tone: "olive",
    num: "03",
    title: "Your first 60 days",
    intro: "AEO tools, a referral push, and venues about to open.",
    parts: [
      { label: "AEO Tools", ask: experiment, content: <ExperimentCard {...experiments.tools} />, wide: true },
      { label: "Referral push", ask: experiment, content: <ExperimentCard {...experiments.referral} />, wide: true },
      { label: "Venues about to open", ask: experiment, content: <ExperimentCard {...experiments.openings} />, wide: true },
    ],
  },
];
