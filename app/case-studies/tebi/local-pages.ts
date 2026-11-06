/*
 * Programmatic local landing pages for the case study (challenge 01, "Act"):
 * /case-studies/tebi/{market}/{city}/{venue type}, one per city × venue type in each of
 * Tebi's 7 markets, in the market's language.
 *
 * Deliberately simple templated copy: this is a prototype of the structure, not content
 * to publish. Claims stick to what Tebi states publicly (runs on iOS/Android incl. iPad;
 * POS, reservations, kitchen display, payments and inventory in one subscription; no
 * contract; pricing scales with revenue and can start free; Interchange++ card fees).
 * The whole /case-studies/tebi tree is noindex, so search engines don't index these.
 */

export type VenueKey = "restaurant" | "wineBar" | "cafe" | "bakery" | "bar";

type City = { slug: string; name: string; /** Finnish locative, e.g. "Helsingissä" */ locative?: string };

type Copy = {
  /** Venue type: slug for the URL and plural for the copy */
  venues: Record<VenueKey, { slug: string; plural: string }>;
  /** "in {city}" with the language's own preposition or case */
  inCity: (c: City) => string;
  h1: string;
  intro: string;
  cards: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  cta: string;
  demo: string;
  start: string;
  all: string;
  /** Heading above real local venues, e.g. "Built for the venues feeding {city}" */
  venuesHeading?: string;
};

export type Market = { code: string; name: string; lang: string; cities: City[]; copy: Copy };

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? `{${k}}`);

export const markets: Market[] = [
  {
    code: "nl",
    name: "Netherlands",
    lang: "nl",
    cities: [
      { slug: "amsterdam", name: "Amsterdam" },
      { slug: "rotterdam", name: "Rotterdam" },
      { slug: "utrecht", name: "Utrecht" },
    ],
    copy: {
      venues: {
        restaurant: { slug: "restaurant", plural: "restaurants" },
        wineBar: { slug: "wijnbar", plural: "wijnbars" },
        cafe: { slug: "cafe", plural: "cafés" },
        bakery: { slug: "bakkerij", plural: "bakkerijen" },
        bar: { slug: "bar", plural: "bars" },
      },
      inCity: (c) => `in ${c.name}`,
      h1: "Kassasysteem voor {venue} {in}",
      intro: "Tebi verbindt je kassa, reserveringen, keukenscherm en betalingen in één systeem, gemaakt voor {venue} {in}. Geen contract, en een prijs die meegroeit met je omzet.",
      cards: [
        { title: "Kassa en keuken in één", body: "Bestellingen gaan direct van de kassa naar het keukenscherm. Geen dubbel werk, minder fouten." },
        { title: "Reserveringen zonder kosten per couvert", body: "Neem boekingen aan via je eigen website en Google, zonder commissie per gast." },
        { title: "Betalingen ingebouwd", body: "Pinautomaten, tap to pay en rekeningen splitsen, met transparante Interchange++-tarieven." },
      ],
      faq: [
        { q: "Werkt Tebi op een iPad?", a: "Ja. Tebi draait op gewone iOS- en Android-apparaten, ook iPads, dus je kunt hardware gebruiken die je al hebt." },
        { q: "Heeft Tebi reserveringen en een keukenscherm in één systeem?", a: "Ja. Kassa, reserveringen, keukenscherm, betalingen en voorraad zitten in één abonnement." },
        { q: "Zit er een contract aan vast?", a: "Nee. Tebi heeft geen contracten of opzegtermijnen; je betaalt per maand." },
        { q: "Wat kost Tebi?", a: "Het abonnement schaalt mee met je maandomzet en je kunt gratis starten. Pintransacties worden gerekend tegen transparante Interchange++-tarieven." },
      ],
      cta: "Klaar om Tebi te zien {in}?",
      demo: "Boek een demo",
      start: "Aan de slag",
      all: "Alle lokale pagina's",
      venuesHeading: "Gemaakt voor de horeca van {city}",
    },
  },
  {
    code: "de",
    name: "Germany",
    lang: "de",
    cities: [
      { slug: "berlin", name: "Berlin" },
      { slug: "hamburg", name: "Hamburg" },
      { slug: "muenchen", name: "München" },
    ],
    copy: {
      venues: {
        restaurant: { slug: "restaurant", plural: "Restaurants" },
        wineBar: { slug: "weinbar", plural: "Weinbars" },
        cafe: { slug: "cafe", plural: "Cafés" },
        bakery: { slug: "baeckerei", plural: "Bäckereien" },
        bar: { slug: "bar", plural: "Bars" },
      },
      inCity: (c) => `in ${c.name}`,
      h1: "Kassensystem für {venue} {in}",
      intro: "Tebi verbindet Kasse, Reservierungen, Küchenmonitor und Zahlungen in einem System, gemacht für {venue} {in}. Ohne Vertragsbindung und mit einem Preis, der mit deinem Umsatz wächst.",
      cards: [
        { title: "Kasse und Küche in einem", body: "Bestellungen gehen direkt von der Kasse auf den Küchenmonitor. Keine doppelte Eingabe, weniger Fehler." },
        { title: "Reservierungen ohne Gebühren pro Gast", body: "Nimm Buchungen über deine Website und Google an, ohne Provision pro Gast." },
        { title: "Zahlungen integriert", body: "Kartenterminals, Tap to Pay und getrennte Rechnungen, mit transparenten Interchange++-Gebühren." },
      ],
      faq: [
        { q: "Läuft Tebi auf einem iPad?", a: "Ja. Tebi läuft auf normalen iOS- und Android-Geräten, auch auf iPads, sodass du vorhandene Hardware nutzen kannst." },
        { q: "Hat Tebi Reservierungen und einen Küchenmonitor in einem System?", a: "Ja. Kasse, Reservierungen, Küchenmonitor, Zahlungen und Warenwirtschaft sind in einem Abo enthalten." },
        { q: "Gibt es eine Vertragsbindung?", a: "Nein. Tebi hat keine Verträge oder Kündigungsfristen; du zahlst monatlich." },
        { q: "Was kostet Tebi?", a: "Das Abo richtet sich nach deinem Monatsumsatz, und du kannst kostenlos starten. Kartenzahlungen werden zu transparenten Interchange++-Gebühren abgerechnet." },
      ],
      cta: "Bereit, Tebi {in} zu sehen?",
      demo: "Demo buchen",
      start: "Loslegen",
      all: "Alle lokalen Seiten",
      venuesHeading: "Gemacht für die Gastronomie in {city}",
    },
  },
  {
    code: "es",
    name: "Spain",
    lang: "es",
    cities: [
      { slug: "madrid", name: "Madrid" },
      { slug: "barcelona", name: "Barcelona" },
      { slug: "valencia", name: "Valencia" },
    ],
    copy: {
      venues: {
        restaurant: { slug: "restaurante", plural: "restaurantes" },
        wineBar: { slug: "bar-de-vinos", plural: "bares de vinos" },
        cafe: { slug: "cafeteria", plural: "cafeterías" },
        bakery: { slug: "panaderia", plural: "panaderías" },
        bar: { slug: "bar", plural: "bares" },
      },
      inCity: (c) => `en ${c.name}`,
      h1: "TPV para {venue} {in}",
      intro: "Tebi conecta tu caja, reservas, pantalla de cocina y pagos en un solo sistema, pensado para {venue} {in}. Sin permanencia y con un precio que crece con tu facturación.",
      cards: [
        { title: "Caja y cocina en uno", body: "Los pedidos pasan directamente del TPV a la pantalla de cocina. Sin duplicar trabajo y con menos errores." },
        { title: "Reservas sin comisión por comensal", body: "Recibe reservas en tu web y en Google, sin comisión por cliente." },
        { title: "Pagos integrados", body: "Datáfonos, pago con el móvil y cuentas divididas, con comisiones Interchange++ transparentes." },
      ],
      faq: [
        { q: "¿Tebi funciona en un iPad?", a: "Sí. Tebi funciona en dispositivos iOS y Android normales, incluidos los iPad, así que puedes usar el hardware que ya tienes." },
        { q: "¿Tebi tiene reservas y pantalla de cocina en un mismo sistema?", a: "Sí. TPV, reservas, pantalla de cocina, pagos e inventario están incluidos en una sola suscripción." },
        { q: "¿Hay permanencia?", a: "No. Tebi no tiene permanencia ni plazos de preaviso; pagas cada mes." },
        { q: "¿Cuánto cuesta Tebi?", a: "La suscripción depende de tu facturación mensual y puedes empezar gratis. Los pagos con tarjeta se cobran con comisiones Interchange++ transparentes." },
      ],
      cta: "¿Quieres ver Tebi {in}?",
      demo: "Reservar una demo",
      start: "Empezar",
      all: "Todas las páginas locales",
      venuesHeading: "Pensado para la hostelería de {city}",
    },
  },
  {
    code: "it",
    name: "Italy",
    lang: "it",
    cities: [
      { slug: "milano", name: "Milano" },
      { slug: "roma", name: "Roma" },
      { slug: "firenze", name: "Firenze" },
    ],
    copy: {
      venues: {
        restaurant: { slug: "ristorante", plural: "ristoranti" },
        wineBar: { slug: "enoteca", plural: "enoteche" },
        cafe: { slug: "caffe", plural: "caffè" },
        bakery: { slug: "panetteria", plural: "panetterie" },
        bar: { slug: "bar", plural: "bar" },
      },
      inCity: (c) => `a ${c.name}`,
      h1: "Sistema di cassa per {venue} {in}",
      intro: "Tebi collega cassa, prenotazioni, monitor di cucina e pagamenti in un unico sistema, pensato per {venue} {in}. Nessun vincolo contrattuale e un prezzo che cresce con il tuo fatturato.",
      cards: [
        { title: "Cassa e cucina insieme", body: "Gli ordini passano direttamente dalla cassa al monitor di cucina. Niente doppi inserimenti, meno errori." },
        { title: "Prenotazioni senza costi a coperto", body: "Ricevi prenotazioni dal tuo sito e da Google, senza commissioni per ospite." },
        { title: "Pagamenti integrati", body: "POS per carte, tap to pay e conti divisi, con commissioni Interchange++ trasparenti." },
      ],
      faq: [
        { q: "Tebi funziona su un iPad?", a: "Sì. Tebi funziona su normali dispositivi iOS e Android, iPad compresi, quindi puoi usare l'hardware che hai già." },
        { q: "Tebi ha prenotazioni e monitor di cucina in un unico sistema?", a: "Sì. Cassa, prenotazioni, monitor di cucina, pagamenti e magazzino sono inclusi in un solo abbonamento." },
        { q: "C'è un vincolo contrattuale?", a: "No. Tebi non ha contratti né periodi di preavviso; paghi ogni mese." },
        { q: "Quanto costa Tebi?", a: "L'abbonamento dipende dal fatturato mensile e puoi iniziare gratis. I pagamenti con carta hanno commissioni Interchange++ trasparenti." },
      ],
      cta: "Vuoi vedere Tebi {in}?",
      demo: "Prenota una demo",
      start: "Inizia",
      all: "Tutte le pagine locali",
      venuesHeading: "Pensato per i locali di {city}",
    },
  },
  {
    code: "gb",
    name: "United Kingdom",
    lang: "en",
    cities: [
      { slug: "london", name: "London" },
      { slug: "manchester", name: "Manchester" },
      { slug: "bristol", name: "Bristol" },
    ],
    copy: {
      venues: {
        restaurant: { slug: "restaurant", plural: "restaurants" },
        wineBar: { slug: "wine-bar", plural: "wine bars" },
        cafe: { slug: "cafe", plural: "cafés" },
        bakery: { slug: "bakery", plural: "bakeries" },
        bar: { slug: "bar", plural: "bars" },
      },
      inCity: (c) => `in ${c.name}`,
      h1: "POS system for {venue} {in}",
      intro: "Tebi connects your till, reservations, kitchen display and payments in one system, built for {venue} {in}. No contract, and pricing that grows with your revenue.",
      cards: [
        { title: "Till and kitchen in one", body: "Orders go straight from the POS to the kitchen display. No double entry, fewer mistakes." },
        { title: "Reservations without per-cover fees", body: "Take bookings on your own website and Google, with no commission per guest." },
        { title: "Payments built in", body: "Card terminals, tap to pay and split bills, with transparent Interchange++ fees." },
      ],
      faq: [
        { q: "Does Tebi work on an iPad?", a: "Yes. Tebi runs on standard iOS and Android devices, including iPads, so you can use hardware you already own." },
        { q: "Does Tebi have reservations and a kitchen display in one system?", a: "Yes. POS, reservations, kitchen display, payments and inventory are all part of one subscription." },
        { q: "Is there a contract?", a: "No. Tebi has no contracts or notice periods; you pay monthly." },
        { q: "What does Tebi cost?", a: "The subscription scales with your monthly revenue, and you can start for free. Card payments are charged at transparent Interchange++ rates." },
      ],
      cta: "Ready to see Tebi {in}?",
      demo: "Book a demo",
      start: "Get started",
      all: "All local pages",
      venuesHeading: "Built for the venues feeding {city}",
    },
  },
  {
    code: "dk",
    name: "Denmark",
    lang: "da",
    cities: [
      { slug: "koebenhavn", name: "København" },
      { slug: "aarhus", name: "Aarhus" },
      { slug: "odense", name: "Odense" },
    ],
    copy: {
      venues: {
        restaurant: { slug: "restaurant", plural: "restauranter" },
        wineBar: { slug: "vinbar", plural: "vinbarer" },
        cafe: { slug: "cafe", plural: "caféer" },
        bakery: { slug: "bageri", plural: "bagerier" },
        bar: { slug: "bar", plural: "barer" },
      },
      inCity: (c) => `i ${c.name}`,
      h1: "Kassesystem til {venue} {in}",
      intro: "Tebi samler kasse, bordreservationer, køkkenskærm og betalinger i ét system, bygget til {venue} {in}. Ingen binding og en pris, der vokser med din omsætning.",
      cards: [
        { title: "Kasse og køkken i ét", body: "Bestillinger går direkte fra kassen til køkkenskærmen. Ingen dobbelt indtastning og færre fejl." },
        { title: "Reservationer uden gebyr pr. kuvert", body: "Tag imod bookinger på din egen hjemmeside og Google uden kommission pr. gæst." },
        { title: "Betalinger indbygget", body: "Kortterminaler, tap to pay og delte regninger med gennemsigtige Interchange++-gebyrer." },
      ],
      faq: [
        { q: "Virker Tebi på en iPad?", a: "Ja. Tebi kører på almindelige iOS- og Android-enheder, også iPads, så du kan bruge den hardware, du allerede har." },
        { q: "Har Tebi reservationer og køkkenskærm i ét system?", a: "Ja. Kasse, reservationer, køkkenskærm, betalinger og lager er med i ét abonnement." },
        { q: "Er der binding?", a: "Nej. Tebi har ingen kontrakter eller opsigelsesperiode; du betaler månedligt." },
        { q: "Hvad koster Tebi?", a: "Abonnementet følger din månedlige omsætning, og du kan starte gratis. Kortbetalinger afregnes til gennemsigtige Interchange++-gebyrer." },
      ],
      cta: "Klar til at se Tebi {in}?",
      demo: "Book en demo",
      start: "Kom i gang",
      all: "Alle lokale sider",
      venuesHeading: "Bygget til spisestederne i {city}",
    },
  },
  {
    code: "fi",
    name: "Finland",
    lang: "fi",
    cities: [
      { slug: "helsinki", name: "Helsinki", locative: "Helsingissä" },
      { slug: "tampere", name: "Tampere", locative: "Tampereella" },
      { slug: "turku", name: "Turku", locative: "Turussa" },
    ],
    copy: {
      // Finnish: venue in the allative ("for restaurants"), city in the locative ("in Helsinki")
      venues: {
        restaurant: { slug: "ravintola", plural: "ravintoloille" },
        wineBar: { slug: "viinibaari", plural: "viinibaareille" },
        cafe: { slug: "kahvila", plural: "kahviloille" },
        bakery: { slug: "leipomo", plural: "leipomoille" },
        bar: { slug: "baari", plural: "baareille" },
      },
      inCity: (c) => c.locative ?? c.name,
      h1: "Kassajärjestelmä {venue} {in}",
      intro: "Tebi yhdistää kassan, pöytävaraukset, keittiönäytön ja maksut yhteen järjestelmään, joka on tehty {venue} {in}. Ei sitoutumista, ja hinta kasvaa liikevaihtosi mukana.",
      cards: [
        { title: "Kassa ja keittiö samassa", body: "Tilaukset siirtyvät suoraan kassalta keittiönäytölle. Ei kaksinkertaista kirjaamista, vähemmän virheitä." },
        { title: "Varaukset ilman asiakaskohtaisia maksuja", body: "Ota varauksia omilta verkkosivuiltasi ja Googlesta ilman asiakaskohtaista provisiota." },
        { title: "Maksut sisäänrakennettuna", body: "Korttipäätteet, lähimaksu ja jaetut laskut läpinäkyvillä Interchange++-hinnoilla." },
      ],
      faq: [
        { q: "Toimiiko Tebi iPadilla?", a: "Kyllä. Tebi toimii tavallisilla iOS- ja Android-laitteilla, myös iPadeilla, joten voit käyttää laitteita, jotka sinulla jo on." },
        { q: "Onko Tebissä varaukset ja keittiönäyttö samassa järjestelmässä?", a: "Kyllä. Kassa, varaukset, keittiönäyttö, maksut ja varasto kuuluvat samaan tilaukseen." },
        { q: "Onko sopimuksessa määräaikaa?", a: "Ei. Tebillä ei ole määräaikaisia sopimuksia tai irtisanomisaikaa; maksat kuukausittain." },
        { q: "Mitä Tebi maksaa?", a: "Tilauksen hinta määräytyy kuukausittaisen liikevaihdon mukaan, ja voit aloittaa ilmaiseksi. Korttimaksut veloitetaan läpinäkyvillä Interchange++-hinnoilla." },
      ],
      cta: "Haluatko nähdä Tebin käytössä {in}?",
      demo: "Varaa esittely",
      start: "Aloita",
      all: "Kaikki paikalliset sivut",
    },
  },
];

const venueKeys: VenueKey[] = ["restaurant", "wineBar", "cafe", "bakery", "bar"];

const IMG = "/case-studies/tebi/img";

/** Hero photo per venue type, all Tebi's own photography (the bakery is Kometen Brood). */
const venueImage: Record<VenueKey, string> = {
  restaurant: `${IMG}/bt-restaurants.webp`,
  wineBar: `${IMG}/hero.webp`,
  cafe: `${IMG}/bt-cafes.webp`,
  bakery: `${IMG}/local/amsterdam-kometen-brood.webp`,
  bar: `${IMG}/bt-bars.webp`,
};

type LocalVenue = { name: string; image: string; logo?: string };

/** Real Tebi venues, only for cities where Tebi has published them (homepage, /berlin, blog). */
const cityVenues: Record<string, { hero?: { image: string; label: string }; venues: LocalVenue[] }> = {
  "nl/amsterdam": {
    venues: [
      { name: "ZeroZero", image: `${IMG}/t-zerozero.webp`, logo: "/case-studies/tebi/logos/zerozero.svg" },
      { name: "Binnenvisser", image: `${IMG}/t-binnenvisser.webp`, logo: "/case-studies/tebi/logos/binnenvisser.svg" },
      { name: "Esra", image: `${IMG}/t-esra.jpg`, logo: "/case-studies/tebi/logos/esra.svg" },
      { name: "Barracuda", image: `${IMG}/t-barracuda.webp`, logo: "/case-studies/tebi/logos/barracuda.svg" },
      { name: "Kometen Brood", image: `${IMG}/local/amsterdam-kometen-brood.webp` },
    ],
  },
  "de/berlin": {
    hero: { image: `${IMG}/local/berlin-julius-ernst-hero.webp`, label: "Julius Ernst, Berlin" },
    venues: [
      { name: "Boii Boii", image: `${IMG}/local/berlin-boii-boii.webp` },
      { name: "Bravo", image: `${IMG}/local/berlin-bravo.webp` },
      { name: "Ari's", image: `${IMG}/local/berlin-aris.webp` },
    ],
  },
};

/** Every page as URL params, for generateStaticParams and the index. */
export function allLocalPages() {
  return markets.flatMap((m) =>
    m.cities.flatMap((c) => venueKeys.map((v) => ({ market: m.code, city: c.slug, type: m.copy.venues[v].slug }))),
  );
}

/** Resolve URL params to the filled-in page content, or null if unknown. */
export function localPage(marketCode: string, citySlug: string, typeSlug: string) {
  const m = markets.find((x) => x.code === marketCode);
  const c = m?.cities.find((x) => x.slug === citySlug);
  const vKey = m && venueKeys.find((k) => m.copy.venues[k].slug === typeSlug);
  if (!m || !c || !vKey) return null;
  const vars = { venue: m.copy.venues[vKey].plural, in: m.copy.inCity(c), city: c.name };
  return {
    market: m,
    city: c,
    venueKey: vKey,
    h1: fill(m.copy.h1, vars),
    intro: fill(m.copy.intro, vars),
    cta: fill(m.copy.cta, vars),
    cards: m.copy.cards,
    faq: m.copy.faq,
    hero: cityVenues[`${m.code}/${c.slug}`]?.hero ?? { image: venueImage[vKey], label: null as string | null },
    venues: cityVenues[`${m.code}/${c.slug}`]?.venues ?? [],
    venuesHeading: m.copy.venuesHeading ? fill(m.copy.venuesHeading, vars) : null,
  };
}
