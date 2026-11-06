import Perplexity, { APIError } from "@perplexity-ai/perplexity_ai";

/*
 * One adapter per engine. Each takes a prompt and returns the answer text plus the URLs it
 * cited. OpenAI and Gemini use plain fetch against their REST APIs; Perplexity uses its
 * official SDK, as its Agent API docs recommend.
 *
 * Caveat for the write-up: API answers approximate, but aren't identical to, what the
 * consumer apps show (ChatGPT app, perplexity.ai, gemini.google.com). They are, however,
 * reproducible, which is what weekly tracking needs.
 */

export type EngineId = "chatgpt" | "perplexity" | "gemini";

export type Prompt = {
  id: string;
  market: string;
  lang: string;
  /** ISO 3166-1 alpha-2, used to localise web search */
  country: string;
  city?: string;
  prompt: string;
  gloss?: string;
};

export type Answer = {
  text: string;
  /** Cited URLs, in the order the engine returned them */
  citations: { url: string; title?: string }[];
  /** Gemini only: whether the model chose to search the web for the plain prompt */
  searched?: boolean;
  /** Gemini only: true when the answer came from a re-ask nudging it to use web sources */
  nudged?: boolean;
  /** What the API reported using, for cost tracking (summed when Gemini is re-asked) */
  usage?: Usage;
  model: string;
};

export type Usage = {
  inputTokens: number;
  cachedInputTokens?: number;
  /** Includes reasoning / thinking tokens, which all three providers bill as output */
  outputTokens: number;
  /** Web searches the engine ran (each is billed separately by OpenAI and Gemini) */
  searches: number;
  /** Exact cost in USD when the API reports it (Perplexity) */
  reportedCostUsd?: number;
};

export type Engine = {
  id: EngineId;
  label: string;
  /** Env var that must be set for this engine to run */
  keyVar: string;
  run: (p: Prompt) => Promise<Answer>;
};

const env = (k: string, fallback = "") => process.env[k] ?? fallback;

async function post(url: string, body: unknown, headers: Record<string, string>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180_000),
  });
  if (!res.ok) throw new HttpError(res.status, await res.text());
  return res.json() as Promise<any>;
}

async function get(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new HttpError(res.status, await res.text());
  return res.json() as Promise<any>;
}

export class HttpError extends Error {
  constructor(public status: number, public body: string) {
    super(`HTTP ${status}: ${body.slice(0, 300)}`);
  }
  /** Out of credit or quota: waiting won't help, unlike a short-term rate limit */
  get isQuota() {
    return this.status === 429 && /insufficient_quota|credit_balance|exceeded your current quota|billing/i.test(this.body);
  }
}

/* ChatGPT — OpenAI Responses API with the web search tool */
const chatgpt: Engine = {
  id: "chatgpt",
  label: "ChatGPT",
  keyVar: "OPENAI_API_KEY",
  async run(p) {
    const model = env("OPENAI_MODEL", "gpt-5");
    const json = await post(
      "https://api.openai.com/v1/responses",
      {
        model,
        input: p.prompt,
        tools: [{ type: "web_search", user_location: { type: "approximate", country: p.country, city: p.city } }],
      },
      { Authorization: `Bearer ${env("OPENAI_API_KEY")}` },
    );
    const usage: Usage = {
      inputTokens: json.usage?.input_tokens ?? 0,
      cachedInputTokens: json.usage?.input_tokens_details?.cached_tokens ?? 0,
      outputTokens: json.usage?.output_tokens ?? 0,
      searches: (json.output ?? []).filter((o: any) => o.type === "web_search_call").length,
    };
    const parts = (json.output ?? [])
      .filter((o: any) => o.type === "message")
      .flatMap((o: any) => o.content ?? [])
      .filter((c: any) => c.type === "output_text");
    return {
      model,
      usage,
      text: parts.map((c: any) => c.text).join("\n"),
      citations: parts
        .flatMap((c: any) => c.annotations ?? [])
        .filter((a: any) => a.type === "url_citation")
        .map((a: any) => ({ url: a.url, title: a.title })),
    };
  },
};

/*
 * Perplexity — Agent API via the official SDK (POST /v1/agent, which replaced Sonar).
 * `effort: "fast"` is the documented preset equivalent of the old `sonar` model and
 * bundles the web_search tool. Sources come from the `search_results` output item.
 * Docs: docs.perplexity.ai/docs/agent-api/quickstart and /presets
 */
const perplexity: Engine = {
  id: "perplexity",
  label: "Perplexity",
  keyVar: "PERPLEXITY_API_KEY",
  async run(p) {
    const effort = env("PERPLEXITY_EFFORT", "fast");
    // maxRetries 0: run.ts owns retries so every engine backs off the same way
    const client = new Perplexity({ apiKey: env("PERPLEXITY_API_KEY"), maxRetries: 0, timeout: 180_000 });
    try {
      const res = await client.responses.create({ effort, input: p.prompt });
      const citations = (res.output ?? [])
        .flatMap((o) => (o.type === "search_results" ? o.results : []))
        .map((r) => ({ url: r.url, title: r.title }));
      const u = res.usage;
      const usage: Usage = {
        inputTokens: u?.input_tokens ?? 0,
        cachedInputTokens: u?.input_tokens_details?.cache_read_input_tokens ?? 0,
        outputTokens: u?.output_tokens ?? 0,
        searches: (res.output ?? []).filter((o) => o.type === "search_results").length,
        reportedCostUsd: u?.cost?.total_cost,
      };
      return { model: res.model ?? `effort:${effort}`, text: res.output_text ?? "", citations, usage };
    } catch (err) {
      if (err instanceof APIError && err.status) throw new HttpError(err.status, err.message);
      throw err;
    }
  },
};

/*
 * Gemini — generateContent with Google Search grounding.
 * Gemini decides for itself whether to search, and for plain recommendation questions it
 * often answers from training memory instead. That's a finding in itself (see `searched`),
 * but the audit also needs sources, so a memory-only answer is re-asked with a one-line
 * nudge in the prompt's language and flagged `nudged`.
 */
const NUDGE: Record<string, string> = {
  nl: "Gebruik actuele bronnen van internet.",
  es: "Usa fuentes actuales de internet.",
  de: "Nutze aktuelle Quellen aus dem Internet.",
  it: "Usa fonti attuali dal web.",
  en: "Use current web sources.",
};

const gemini: Engine = {
  id: "gemini",
  label: "Gemini",
  keyVar: "GEMINI_API_KEY",
  async run(p) {
    const model = env("GEMINI_MODEL", "gemini-flash-latest");
    const ask = async (text: string) => {
      const json = await post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        { contents: [{ role: "user", parts: [{ text }] }], tools: [{ google_search: {} }] },
        { "x-goog-api-key": env("GEMINI_API_KEY") },
      );
      const cand = json.candidates?.[0];
      // Grounding URIs are vertexaisearch redirects; the chunk title carries the real domain
      const chunks = cand?.groundingMetadata?.groundingChunks ?? [];
      const um = json.usageMetadata ?? {};
      const usage: Usage = {
        // Search results fed to the model count as input (toolUsePromptTokenCount)
        inputTokens: (um.promptTokenCount ?? 0) + (um.toolUsePromptTokenCount ?? 0),
        cachedInputTokens: um.cachedContentTokenCount ?? 0,
        outputTokens: (um.candidatesTokenCount ?? 0) + (um.thoughtsTokenCount ?? 0),
        searches: cand?.groundingMetadata?.webSearchQueries?.length ?? 0,
      };
      return {
        model: json.modelVersion ?? model,
        usage,
        text: (cand?.content?.parts ?? []).map((x: any) => x.text ?? "").join(""),
        citations: chunks.filter((c: any) => c.web).map((c: any) => ({ url: c.web.uri, title: c.web.title })),
      };
    };
    const plain = await ask(p.prompt);
    if (plain.citations.length) return { ...plain, searched: true, nudged: false };
    const nudged = await ask(`${p.prompt} ${NUDGE[p.lang] ?? NUDGE.en}`);
    // Both calls are billed, so the answer carries their combined usage
    const both: Usage = {
      inputTokens: plain.usage.inputTokens + nudged.usage.inputTokens,
      cachedInputTokens: (plain.usage.cachedInputTokens ?? 0) + (nudged.usage.cachedInputTokens ?? 0),
      outputTokens: plain.usage.outputTokens + nudged.usage.outputTokens,
      searches: plain.usage.searches + nudged.usage.searches,
    };
    return nudged.citations.length
      ? { ...nudged, usage: both, searched: false, nudged: true }
      : { ...plain, usage: both, searched: false, nudged: false };
  },
};

export const engines: Engine[] = [chatgpt, perplexity, gemini];

/** Registrable-ish domain for a citation, e.g. "www.capterra.nl/x" → "capterra.nl". */
export function domainOf(c: { url: string; title?: string }): string {
  try {
    const host = new URL(c.url).hostname.replace(/^www\./, "");
    // Gemini redirect links: fall back to the title, which Google sets to the source domain
    if (host.includes("vertexaisearch") && c.title) return c.title.replace(/^www\./, "");
    return host;
  } catch {
    return c.title ?? c.url;
  }
}
