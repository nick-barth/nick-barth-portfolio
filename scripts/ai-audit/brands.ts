/*
 * Brands to detect in answers. Each brand's `match` is tested against the answer text;
 * the order brands first appear in becomes the "recommended" ranking.
 *
 * Ambiguous names (Square, Toast, Dish, Revo, Ágora…) are matched case-sensitively or with
 * a qualifier so ordinary words don't count. Add competitors here as the raw answers
 * surface new ones (check `unmatchedCapitalised` in the raw output).
 */

export type Brand = { name: string; match: RegExp; tebi?: boolean };

export const brands: Brand[] = [
  { name: "Tebi", match: /\bTebi\b/i, tebi: true },
  // POS
  { name: "Lightspeed", match: /\bLightspeed\b/i },
  { name: "SumUp", match: /\bSum ?Up\b/i },
  { name: "Zettle", match: /\bZettle\b/i },
  { name: "Square", match: /\bSquare\b(?! meters| metres)/ },
  { name: "Toast", match: /\bToast\b/ },
  { name: "unTill", match: /\bun[Tt]ill\b/ },
  { name: "DISH POS", match: /\bDISH\b|\bDish POS\b|\bDISH POS\b/ },
  { name: "Orderbird", match: /\bOrder ?bird\b/i },
  { name: "Gastrofix", match: /\bGastrofix\b/i },
  { name: "MplusKASSA", match: /\bMplus(KASSA)?\b/i },
  { name: "Booq", match: /\bBooq\b/i },
  { name: "Eijsink", match: /\bEijsink\b/i },
  { name: "Loyverse", match: /\bLoyverse\b/i },
  { name: "Revo", match: /\bRevo( XEF| FLOW)?\b/ },
  // \b ignores accented letters, so use Unicode letter lookarounds
  { name: "Ágora", match: /(?<!\p{L})Ágora(?!\p{L})|\bAgora (TPV|POS|Hospitality)\b/u },
  { name: "ICG", match: /\bICG\b/ },
  { name: "Last.app", match: /\bLast\.app\b|\bLast app\b/i },
  { name: "Glop", match: /\bGlop\b/i },
  { name: "Hosteltáctil", match: /\bHostelt[áa]ctil\b/i },
  { name: "Cuiner", match: /\bCuiner\b/i },
  { name: "Camarero10", match: /\bCamarero ?10\b/i },
  { name: "Numier", match: /\bNumier\b/i },
  { name: "TPV Bar Plus", match: /\bTPV Bar Plus\b/i },
  // Added after the first full run surfaced them
  { name: "Twelve", match: /\bTwelve\b/ },
  { name: "Jimani", match: /\bJimani\b/i },
  { name: "CCV", match: /\bCCV\b/ },
  { name: "Xootle", match: /\bXootle\b/i },
  { name: "Kitking", match: /\bKitking\b/i },
  { name: "Buckaroo", match: /\bBuckaroo\b/i },
  { name: "Qamarero", match: /\bQamarero\b/i },
  { name: "Hiopos", match: /\bHiopos\b/i },
  { name: "Lymon", match: /\bLymon\b/i },
  { name: "OfiBarman", match: /\bOfi ?Barman\b/i },
  { name: "TPVHostel", match: /\bTPV ?Hostel\b/i },
  { name: "Tipsi TPV", match: /\bTipsi\b/i },
  { name: "Carbonara App", match: /\bCarbonara App\b/i },
  { name: "Ideiatek", match: /\bIdeiatek\b/i },
  { name: "Mesero", match: /\bMesero\b/ },
  // Germany
  { name: "ready2order", match: /\bready2order\b/i },
  { name: "Vectron", match: /\bVectron\b/i },
  { name: "gastronovi", match: /\bgastronovi\b/i },
  { name: "Tillhub", match: /\bTillhub\b/i },
  { name: "Hypersoft", match: /\bHypersoft\b/i },
  { name: "Gastro-MIS", match: /\bGastro-?MIS\b/i },
  { name: "Quandoo", match: /\bQuandoo\b/i },
  { name: "resmio", match: /\bresmio\b/i },
  { name: "aleno", match: /\baleno\b/i },
  // Reservations
  { name: "Tablein", match: /\bTablein\b/i },
  { name: "Resos", match: /\bresOS\b|\bResos\b/i },
  { name: "GloriaFood", match: /\bGloria ?Food\b/i },
  { name: "TheFork", match: /\bThe ?Fork\b|\bEl ?Tenedor\b/i },
  { name: "Zenchef", match: /\bZenchef\b/i },
  { name: "Formitable", match: /\bFormitable\b/i },
  { name: "OpenTable", match: /\bOpen ?Table\b/i },
  { name: "SevenRooms", match: /\bSeven ?Rooms\b/i },
  { name: "CoverManager", match: /\bCover ?Manager\b/i },
  { name: "Resy", match: /\bResy\b/ },
  { name: "Guestplan", match: /\bGuestplan\b/i },
  { name: "Restoo", match: /\bRestoo\b/i },
];

export type Detected = { brand: string; position: number };

/** Brands found in `text`, ordered by first appearance. */
export function detectBrands(text: string): Detected[] {
  const found: Detected[] = [];
  for (const b of brands) {
    const m = b.match.exec(text);
    if (m) found.push({ brand: b.name, position: m.index });
  }
  return found.sort((a, b) => a.position - b.position);
}

/**
 * Capitalised words that look like product names but aren't in the brand list —
 * a cheap way to spot competitors we haven't added yet.
 */
export function unmatchedCapitalised(text: string): string[] {
  const known = new Set(brands.map((b) => b.name.toLowerCase()));
  const words = text.match(/\*\*([A-Z][\w.&' -]{2,30})\*\*/g) ?? []; // bolded names in markdown answers
  return [...new Set(words.map((w) => w.replaceAll("*", "").trim()))].filter(
    (w) => !known.has(w.toLowerCase()) && detectBrands(w).length === 0, // e.g. "Lightspeed Restaurant" is already Lightspeed
  );
}
