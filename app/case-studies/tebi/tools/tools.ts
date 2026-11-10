/** Markets the calculators exist in. They're written in Dutch, so NL only for now. */
export const toolMarkets = ["nl"] as const;

/** /case-studies/tebi/{market}/tools, or one calculator's page with a slug */
export const toolPath = (slug?: string, market: string = toolMarkets[0]) =>
  `/case-studies/tebi/${market}/tools${slug ? `/${slug}` : ""}`;

/** The free calculators, one page each at toolPath(slug) */
export const tools = [
  {
    slug: "seizoen",
    title: "Rustige maand? Dan betaal je niks.",
    label: "Seasonal calculator",
    description: "Tebi's subscription across a seasonal year, against a fixed monthly fee.",
    tone: "bg-olive",
  },
  {
    slug: "pinkosten",
    title: "Wat kost pinnen je echt?",
    label: "Card fee calculator",
    description: "What card payments cost per year now, and with Tebi's rates.",
    tone: "bg-slate",
  },
  {
    slug: "gerecht",
    title: "Wat kost je gerecht?",
    label: "Dish cost calculator",
    description: "Cost per plate, a suggested menu price and food cost %, from purchase prices.",
    tone: "bg-wine",
  },
  {
    slug: "kassakosten",
    title: "Wat kost je kassa per jaar?",
    label: "POS cost calculator",
    description: "Subscription and card fees together, now against Tebi.",
    tone: "bg-espresso",
  },
  {
    slug: "kassakeuze",
    title: "Welke kassa past bij je zaak?",
    label: "POS chooser",
    description: "Four questions, then a checklist of what your POS has to do well.",
    tone: "bg-olive",
  },
  {
    slug: "break-even",
    title: "Hoeveel gasten heb je nodig?",
    label: "Break-even calculator",
    description: "Revenue and guests per day needed to cover your fixed costs.",
    tone: "bg-slate",
  },
  {
    slug: "personeelskosten",
    title: "Wat kost je personeel echt?",
    label: "Labour cost calculator",
    description: "Hourly wage plus holiday pay and employer charges, as a share of revenue.",
    tone: "bg-wine",
  },
  {
    slug: "prime-cost",
    title: "Wat is je prime cost?",
    label: "Prime cost calculator",
    description: "Purchasing plus staff as a share of revenue, against the 60–65% rule of thumb.",
    tone: "bg-espresso",
  },
  {
    slug: "winstmarge",
    title: "Wat hou je over van elk tientje?",
    label: "Profit margin calculator",
    description: "Profit margin and where each euro of revenue goes.",
    tone: "bg-olive",
  },
  {
    slug: "fooi",
    title: "Fooi eerlijk verdelen",
    label: "Tip split calculator",
    description: "Split the tip pot by hours, equally, or with a fixed share for the kitchen.",
    tone: "bg-slate",
  },
] as const;

export type ToolSlug = (typeof tools)[number]["slug"];
