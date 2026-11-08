/** The free calculators, one page each at /case-studies/tebi/tools/{slug} */
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
] as const;

export type ToolSlug = (typeof tools)[number]["slug"];
