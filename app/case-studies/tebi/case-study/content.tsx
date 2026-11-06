import type { ReactNode } from "react";
import { AuditResults, type AuditSummary } from "./audit-results";
import type { AuditPrompt } from "./audit-table";
// Both written by `bun run audit` (scripts/ai-audit); the summary only by complete runs
import auditData from "./audit-data.json";
import auditSummary from "./audit-summary.json";

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

export type Part = {
  label: string;
  /** What the brief asks for here, shown as a placeholder until `content` is set */
  ask: string;
  content: ReactNode | null;
  /** Span the whole row instead of a third */
  wide?: boolean;
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
      { label: "Explain", ask: "What patterns do you see? Why do competitors show up and Tebi doesn't?", content: null },
      { label: "Act", ask: "The 3 things you'd ship in the first 30 days: pages, content, listings, reviews or third-party sources.", content: null },
      { label: "Track", ask: "How you'd measure progress when analytics don't separate AI traffic yet.", content: null },
    ],
  },
  {
    id: "untapped",
    tone: "wine",
    num: "02",
    title: "Untapped acquisition opportunity",
    intro: "One type of operator in one market, reached through a channel competitors aren't using.",
    parts: [
      { label: "The merchant", ask: "Who they are, what's on their mind this month, and where their attention goes.", content: null },
      { label: "The channel", ask: "Where you'd reach them, and why it's an untapped opportunity.", content: null },
      { label: "The message", ask: "What you'd say, in their words: the actual headline or first line.", content: null },
      { label: "The launch", ask: "Who you'd work with across product marketing, design, sales or local teams, and how it goes live in 2–3 weeks.", content: null },
      { label: "Success", ask: "What would tell you it's working after 30 days.", content: null },
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
