"use client";

import { useState, type ReactNode } from "react";

const eur = (n: number, digits = 0) =>
  `€${n.toLocaleString("nl-NL", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

/* ---------- Shared bits ---------- */

function Panel({ id, tone, title, intro, children }: { id: string; tone: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section id={id} className={`rounded-[28px] p-5 text-cream md:p-[30px] ${tone}`}>
      <h1 className="font-display text-[40px] font-medium leading-none tracking-[-0.05em] md:text-[64px]">{title}</h1>
      <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-cream/80">{intro}</p>
      <div className="mt-8 grid gap-3 lg:grid-cols-[3fr_2fr]">{children}</div>
    </section>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[18px] bg-white p-5 text-espresso md:p-6 ${className}`}>{children}</div>;
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm text-espresso/65">{label}</span>
      <span className="mt-1.5 flex items-center gap-1 rounded-xl border border-stone bg-cream/50 px-3 py-2.5 focus-within:border-espresso">
        {prefix && <span className="text-espresso/50">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full min-w-0 bg-transparent font-medium outline-none"
        />
        {suffix && <span className="text-espresso/50">{suffix}</span>}
      </span>
    </label>
  );
}

function Big({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <p className="text-sm text-espresso/65">{label}</p>
      <p className="mt-1 font-display text-[44px] font-medium leading-none tracking-[-0.05em] md:text-[56px]">{value}</p>
      {note && <p className="mt-1.5 text-sm text-espresso/60">{note}</p>}
    </div>
  );
}

/* ---------- 1. Pinkosten ---------- */

// tebi.com/nl/pricing, November 2026: interchange++ for card-present payments
const TEBI_FIXED = 0.05;
const TEBI_PCT = { debit: 0, card: 0.0025, amex: 0.022 };

export function CardFees() {
  const [revenue, setRevenue] = useState(30000);
  const [ticket, setTicket] = useState(25);
  const [debit, setDebit] = useState(60);
  const [amex, setAmex] = useState(5);
  const [rate, setRate] = useState(1.8);

  const card = Math.max(0, 100 - debit - amex);
  const tx = ticket > 0 ? revenue / ticket : 0;
  const tebi = tx * TEBI_FIXED + revenue * ((card / 100) * TEBI_PCT.card + (amex / 100) * TEBI_PCT.amex);
  const now = revenue * (rate / 100);
  const saved = now - tebi;

  return (
    <Panel
      id="pinkosten"
      tone="bg-slate"
      title="Wat kost pinnen je echt?"
      intro="Vul je pinomzet en je huidige tarief in. Je ziet wat je nu per jaar betaalt, en wat dat bij Tebi zou zijn: je betaalt de echte kosten per kaart, plus 5 cent."
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Pinomzet per maand" prefix="€" value={revenue} onChange={setRevenue} step={1000} />
          <NumberField label="Gemiddeld bonbedrag" prefix="€" value={ticket} onChange={setTicket} />
          <NumberField label="Je huidige tarief" suffix="%" value={rate} onChange={setRate} step={0.05} />
        </div>
        <p className="mt-6 text-sm text-espresso/65">Hoe betalen je gasten?</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <NumberField label="Maestro / V Pay" suffix="%" value={debit} onChange={(n) => setDebit(Math.min(n, 100 - amex))} />
          <NumberField label="Amex" suffix="%" value={amex} onChange={(n) => setAmex(Math.min(n, 100 - debit))} />
          <div>
            <span className="text-sm text-espresso/65">Visa / Mastercard</span>
            <p className="mt-1.5 rounded-xl bg-cream px-3 py-2.5 font-medium">{card}%</p>
          </div>
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-espresso/65">Nu, per jaar</p>
            <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{eur(now * 12)}</p>
          </div>
          <div>
            <p className="text-sm text-espresso/65">Met Tebi, per jaar</p>
            <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{eur(tebi * 12)}</p>
          </div>
        </div>
        <Big
          label={saved >= 0 ? "Je houdt over" : "Tebi kost meer"}
          value={`${eur(Math.abs(saved) * 12)}/jaar`}
          note={`${Math.round(tx).toLocaleString("nl-NL")} transacties per maand. Gemiddeld ${((tebi / (revenue || 1)) * 100).toFixed(2).replace(".", ",")}% bij Tebi.`}
        />
      </Card>
    </Panel>
  );
}

/* ---------- 2. Seizoen ---------- */

// tebi.com pricing slider: subscription = max(0, (revenue − €10K) × 0.2%)
const subscription = (revenue: number) => Math.max(0, (revenue - 10000) * 0.002);
const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

// Share of the peak month's revenue, per month
const PROFILES = {
  terras: { label: "Zomerterras", shape: [0.3, 0.3, 0.45, 0.65, 0.85, 1, 1, 1, 0.8, 0.55, 0.35, 0.45] },
  strand: { label: "Strandtent", shape: [0, 0, 0.15, 0.45, 0.75, 1, 1, 1, 0.6, 0.15, 0, 0] },
  popup: { label: "Pop-up", shape: [0, 0, 0, 0, 0.6, 1, 0.9, 0, 0, 0, 0, 0] },
  heeljaar: { label: "Hele jaar open", shape: [0.8, 0.8, 0.85, 0.9, 0.95, 1, 0.9, 0.85, 0.95, 0.95, 0.9, 1] },
} as const;
type Profile = keyof typeof PROFILES;

export function Seasonal() {
  const [profile, setProfile] = useState<Profile>("terras");
  const [peak, setPeak] = useState(60000);
  const [fixed, setFixed] = useState(90);
  const [hover, setHover] = useState<number | null>(null);

  const months = PROFILES[profile].shape.map((s) => {
    const revenue = Math.round(s * peak);
    return { revenue, tebi: subscription(revenue) };
  });
  const tebiYear = months.reduce((n, m) => n + m.tebi, 0);
  const fixedYear = fixed * 12;
  const free = months.filter((m) => m.tebi === 0).length;
  const max = Math.max(fixed, ...months.map((m) => m.tebi), 1);
  const h = 180;

  return (
    <Panel
      id="seizoen"
      tone="bg-olive"
      title="Rustige maand? Dan betaal je niks."
      intro="Bij Tebi groeit het abonnement mee met je omzet. Onder de €10.000 omzet per maand betaal je €0. Kies hoe je jaar loopt en vergelijk met een vast abonnement."
    >
      <Card>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Soort zaak">
          {(Object.keys(PROFILES) as Profile[]).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={profile === p}
              onClick={() => setProfile(p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                profile === p ? "bg-espresso text-cream" : "bg-cream hover:bg-stone"
              }`}
            >
              {PROFILES[p].label}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <NumberField label="Omzet in je drukste maand" prefix="€" value={peak} onChange={setPeak} step={5000} />
          <NumberField label="Je huidige vaste abonnement" prefix="€" suffix="/mnd" value={fixed} onChange={setFixed} step={5} />
        </div>

        {/* Subscription per month: Tebi bars against the flat fee line */}
        <div className="mt-6">
          <div className="flex items-center gap-4 text-xs text-espresso/70">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-olive" /> Tebi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-[#978d7a]" /> Vast abonnement
            </span>
          </div>
          <div className="relative mt-3" style={{ height: h }}>
            <div
              className="absolute inset-x-0 z-10 border-t-2 border-dashed border-[#978d7a]"
              style={{ bottom: (fixed / max) * h }}
              aria-hidden
            />
            <div className="absolute inset-0 grid grid-cols-12 items-end gap-1 border-b border-stone">
              {months.map((m, i) => (
                <div
                  key={MONTHS[i]}
                  className="relative flex h-full items-end"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div
                    className={`w-full rounded-t-[4px] bg-olive transition-opacity ${hover !== null && hover !== i ? "opacity-50" : ""}`}
                    style={{ height: Math.max(m.tebi > 0 ? 2 : 0, (m.tebi / max) * h) }}
                  />
                  {hover === i && (
                    <div className="absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-espresso px-2.5 py-1.5 text-xs text-cream">
                      {MONTHS[i]}: {eur(m.revenue)} omzet · Tebi {eur(m.tebi)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1.5 grid grid-cols-12 gap-1 text-center text-[11px] text-espresso/55">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-espresso/65">Vast, per jaar</p>
            <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{eur(fixedYear)}</p>
          </div>
          <div>
            <p className="text-sm text-espresso/65">Tebi, per jaar</p>
            <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{eur(tebiYear)}</p>
          </div>
        </div>
        <Big
          label={fixedYear >= tebiYear ? "Je houdt over" : "Tebi kost meer"}
          value={`${eur(Math.abs(fixedYear - tebiYear))}/jaar`}
          note={free ? `${free} ${free === 1 ? "maand" : "maanden"} betaal je €0.` : undefined}
        />
      </Card>
    </Panel>
  );
}

/* ---------- 3. Kostprijs per gerecht ---------- */

type Row = { name: string; price: number; unit: string; qty: number };

const EXAMPLE: Row[] = [
  { name: "Rundergehakt", price: 14.5, unit: "kg", qty: 0.18 },
  { name: "Briochebroodje", price: 0.55, unit: "st", qty: 1 },
  { name: "Cheddar", price: 16, unit: "kg", qty: 0.03 },
  { name: "Friet", price: 2.6, unit: "kg", qty: 0.2 },
  { name: "Sla, tomaat, saus", price: 0.6, unit: "st", qty: 1 },
];
const VAT = 0.09;

export function DishCost() {
  const [rows, setRows] = useState<Row[]>(EXAMPLE);
  const [target, setTarget] = useState(28);
  const [menu, setMenu] = useState(18.5);

  const update = (i: number, patch: Partial<Row>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const cost = rows.reduce((n, r) => n + r.price * r.qty, 0);
  const advised = target > 0 ? (cost / (target / 100)) * (1 + VAT) : 0;
  const menuEx = menu / (1 + VAT);
  const actual = menuEx > 0 ? (cost / menuEx) * 100 : 0;

  return (
    <Panel
      id="gerecht"
      tone="bg-wine"
      title="Wat kost je gerecht?"
      intro="Zet de ingrediënten erin met je inkoopprijs, bijvoorbeeld van je laatste bon. Je ziet de kostprijs per bord en wat het op de kaart moet kosten."
    >
      <Card>
        <div className="hidden grid-cols-[1fr_96px_64px_88px_28px] gap-2 text-sm text-espresso/65 sm:grid">
          <span>Ingrediënt</span>
          <span>Inkoopprijs</span>
          <span>Per</span>
          <span>Per bord</span>
          <span />
        </div>
        <div className="mt-2 grid gap-3 sm:gap-2">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_72px_1fr_28px] gap-2 sm:grid-cols-[1fr_96px_64px_88px_28px]">
              <input
                aria-label="Ingrediënt"
                value={r.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="col-span-4 rounded-lg border border-stone px-2.5 py-2 outline-none focus:border-espresso sm:col-span-1"
              />
              <input
                aria-label="Inkoopprijs in euro"
                type="number"
                min={0}
                step={0.1}
                value={r.price}
                onChange={(e) => update(i, { price: Math.max(0, Number(e.target.value)) })}
                className="min-w-0 rounded-lg border border-stone px-2.5 py-2 outline-none focus:border-espresso"
              />
              <select
                aria-label="Eenheid"
                value={r.unit}
                onChange={(e) => update(i, { unit: e.target.value })}
                className="rounded-lg border border-stone bg-white px-1.5 py-2 outline-none focus:border-espresso"
              >
                <option value="kg">kg</option>
                <option value="l">liter</option>
                <option value="st">stuk</option>
              </select>
              <input
                aria-label={`Hoeveelheid per bord in ${r.unit}`}
                type="number"
                min={0}
                step={0.005}
                value={r.qty}
                onChange={(e) => update(i, { qty: Math.max(0, Number(e.target.value)) })}
                className="min-w-0 rounded-lg border border-stone px-2.5 py-2 outline-none focus:border-espresso"
              />
              <button
                type="button"
                aria-label={`${r.name || "Regel"} verwijderen`}
                onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                className="rounded-lg text-espresso/40 hover:bg-cream hover:text-espresso"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((r) => [...r, { name: "", price: 0, unit: "kg", qty: 0 }])}
          className="mt-3 rounded-lg bg-cream px-3 py-1.5 text-sm font-medium hover:bg-stone"
        >
          + Ingrediënt
        </button>
        <div className="mt-6 grid gap-4 border-t border-stone pt-5 sm:grid-cols-2">
          <NumberField label="Food cost die je wilt" suffix="%" value={target} onChange={setTarget} />
          <NumberField label="Prijs nu op de kaart (incl. btw)" prefix="€" value={menu} onChange={setMenu} step={0.5} />
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <Big label="Kostprijs per bord" value={eur(cost, 2)} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-espresso/65">Advies op de kaart</p>
            <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{eur(advised, 2)}</p>
            <p className="mt-1 text-xs text-espresso/55">bij {target}% food cost, incl. 9% btw</p>
          </div>
          <div>
            <p className="text-sm text-espresso/65">Food cost nu</p>
            <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{actual.toFixed(0)}%</p>
            <p className="mt-1 text-xs text-espresso/55">{eur(menuEx - cost, 2)} marge per bord</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-espresso/70">
          In Tebi hangen recepten aan je voorraad en verkoop, dus deze som loopt vanzelf mee als je inkoopprijzen veranderen.
        </p>
      </Card>
    </Panel>
  );
}

/* ---------- Shared bits for the tools below ---------- */

const pctNl = (n: number, digits = 0) => `${(Number.isFinite(n) ? n : 0).toFixed(digits).replace(".", ",")}%`;

function Choice<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {(Object.keys(options) as T[]).map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={value === k}
          onClick={() => onChange(k)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === k ? "bg-espresso text-cream" : "bg-cream hover:bg-stone"
          }`}
        >
          {options[k]}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <p className="text-sm text-espresso/65">{label}</p>
      <p className="mt-1 font-display text-3xl font-medium tracking-[-0.04em]">{value}</p>
      {note && <p className="mt-1 text-xs text-espresso/55">{note}</p>}
    </div>
  );
}

/** Where each euro of revenue goes: one stacked bar with a labelled legend underneath */
function Split({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((n, p) => n + Math.max(0, p.value), 0) || 1;
  return (
    <div>
      <div className="flex h-4 gap-[2px] overflow-hidden rounded-[4px] bg-cream">
        {parts
          .filter((p) => p.value > 0)
          .map((p) => (
            <span key={p.label} title={p.label} style={{ flexGrow: p.value / total, flexBasis: 0, background: p.color }} />
          ))}
      </div>
      <ul className="mt-3 grid gap-1.5 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ background: p.color }} />
              {p.label}
            </span>
            <span className="tabular-nums text-espresso/70">{pctNl((Math.max(0, p.value) / total) * 100)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SPLIT_COLORS = ["#5a6c17", "#587293", "#661b1a", "#c4893f", "#978d7a", "#261c0a"];

/* ---------- 4. Kassakosten ---------- */

// Typical card mix (same rates as the card fee calculator): rest is Maestro / V Pay
const MIX = { card: 0.35, amex: 0.05 };

export function PosCost() {
  const [revenue, setRevenue] = useState(40000);
  const [cardShare, setCardShare] = useState(80);
  const [ticket, setTicket] = useState(25);
  const [sub, setSub] = useState(129);
  const [rate, setRate] = useState(1.8);

  const cardRevenue = revenue * (cardShare / 100);
  const tx = ticket > 0 ? cardRevenue / ticket : 0;
  const nowFees = cardRevenue * (rate / 100);
  const tebiSub = subscription(revenue);
  const tebiFees = tx * TEBI_FIXED + cardRevenue * (MIX.card * TEBI_PCT.card + MIX.amex * TEBI_PCT.amex);
  const now = sub + nowFees;
  const tebi = tebiSub + tebiFees;

  return (
    <Panel
      id="kassakosten"
      tone="bg-espresso"
      title="Wat kost je kassa per jaar?"
      intro="Abonnement en pinkosten bij elkaar, want daar zit het grootste deel van je kassakosten. Vul in wat je nu betaalt en vergelijk met Tebi."
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Omzet per maand" prefix="€" value={revenue} onChange={setRevenue} step={1000} />
          <NumberField label="Deel dat gepind wordt" suffix="%" value={cardShare} onChange={(n) => setCardShare(Math.min(n, 100))} step={5} />
          <NumberField label="Gemiddeld bonbedrag" prefix="€" value={ticket} onChange={setTicket} />
          <NumberField label="Je abonnement nu, incl. modules" prefix="€" suffix="/mnd" value={sub} onChange={setSub} step={5} />
          <NumberField label="Je pintarief nu" suffix="%" value={rate} onChange={setRate} step={0.05} />
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2 border-t border-stone pt-5 text-sm">
          <span className="text-espresso/65">Per maand</span>
          <span className="text-right text-espresso/65">Nu</span>
          <span className="text-right text-espresso/65">Tebi</span>
          <span>Abonnement</span>
          <span className="text-right tabular-nums">{eur(sub)}</span>
          <span className="text-right tabular-nums">{eur(tebiSub)}</span>
          <span>Pinkosten</span>
          <span className="text-right tabular-nums">{eur(nowFees)}</span>
          <span className="text-right tabular-nums">{eur(tebiFees)}</span>
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Nu, per jaar" value={eur(now * 12)} />
          <Stat label="Met Tebi, per jaar" value={eur(tebi * 12)} />
        </div>
        <Big
          label={now >= tebi ? "Je houdt over" : "Tebi kost meer"}
          value={`${eur(Math.abs(now - tebi) * 12)}/jaar`}
          note="Hardware niet meegerekend. Pinkosten bij Tebi met een gangbare kaartmix: 60% Maestro/V Pay, 35% Visa/Mastercard, 5% Amex."
        />
      </Card>
    </Panel>
  );
}

/* ---------- 5. Kassakeuzehulp ---------- */

const VENUES = { restaurant: "Restaurant", bar: "Café of bar", koffie: "Koffiebar", seizoen: "Seizoen of pop-up" } as const;
const SERVICE = { tafel: "Aan tafel", balie: "Aan de bar of balie" } as const;
const NEEDS = {
  voorraad: "Voorraad en recepten",
  reserveren: "Reserveringen",
  qr: "Bestellen via QR",
  locaties: "Meerdere locaties",
} as const;
type Need = keyof typeof NEEDS;

export function PosChooser() {
  const [venue, setVenue] = useState<keyof typeof VENUES>("restaurant");
  const [service, setService] = useState<keyof typeof SERVICE>("tafel");
  const [revenue, setRevenue] = useState(25000);
  const [needs, setNeeds] = useState<Set<Need>>(new Set(["voorraad"]));
  const toggle = (n: Need) =>
    setNeeds((s) => {
      const next = new Set(s);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const checks: string[] = [];
  if (venue === "seizoen") checks.push("Een abonnement dat meebeweegt met je omzet, of dat je per maand kunt stopzetten. Anders betaal je in de stille maanden voor niks.");
  if (service === "tafel") checks.push("Bestellen op een handheld aan tafel, die meteen naar keuken en bar gaat.");
  else checks.push("Snel afrekenen aan de balie: tikken op het scherm en betalen in één beweging.");
  if (venue === "restaurant") checks.push("Gangen en tafelplattegrond, zodat de keuken weet wanneer het volgende gerecht kan.");
  if (venue === "koffie") checks.push("Korte knoppen voor je bestsellers en een klantenkaart of stempelkaart.");
  if (venue === "bar") checks.push("Openstaande rekeningen per gast of groep, en splitsen bij het afrekenen.");
  if (needs.has("voorraad")) checks.push("Recepten die aan je voorraad hangen, zodat elke verkoop je voorraad bijwerkt.");
  if (needs.has("reserveren")) checks.push("Een koppeling met je reserveringssysteem, zodat de rekening aan de tafel hangt.");
  if (needs.has("qr")) checks.push("Bestellen en betalen via QR aan tafel, zonder extra losse app.");
  if (needs.has("locaties")) checks.push("Eén menu en één rapportage voor al je locaties.");
  checks.push("Vraag altijd naar het pintarief per kaartsoort, de opzegtermijn en wat de hardware kost.");

  const tebi = subscription(revenue);

  return (
    <Panel
      id="kassakeuze"
      tone="bg-olive"
      title="Welke kassa past bij je zaak?"
      intro="Vier vragen over je zaak. Je krijgt een lijstje waar je kassa in elk geval goed in moet zijn, om naast de offertes te leggen."
    >
      <Card>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm text-espresso/65">Wat voor zaak heb je?</p>
            <Choice label="Soort zaak" value={venue} options={VENUES} onChange={setVenue} />
          </div>
          <div>
            <p className="mb-2 text-sm text-espresso/65">Hoe bestellen je gasten?</p>
            <Choice label="Bediening" value={service} options={SERVICE} onChange={setService} />
          </div>
          <div>
            <p className="mb-2 text-sm text-espresso/65">Wat heb je nodig?</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(NEEDS) as Need[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={needs.has(n)}
                  onClick={() => toggle(n)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    needs.has(n) ? "bg-espresso text-cream" : "bg-cream hover:bg-stone"
                  }`}
                >
                  {NEEDS[n]}
                </button>
              ))}
            </div>
          </div>
          <NumberField label="Omzet per maand" prefix="€" value={revenue} onChange={setRevenue} step={1000} />
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <div>
          <p className="text-sm text-espresso/65">Je kassa moet dit kunnen</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed">
            {checks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
        <p className="text-sm leading-relaxed text-espresso/70">
          Bij {eur(revenue)} omzet per maand is het Tebi-abonnement {eur(tebi)} per maand
          {tebi === 0 ? ", want onder de €10.000 omzet betaal je niks." : "."}
        </p>
      </Card>
    </Panel>
  );
}

/* ---------- 6. Break-even ---------- */

export function BreakEven() {
  const [rent, setRent] = useState(4500);
  const [staff, setStaff] = useState(14000);
  const [other, setOther] = useState(3000);
  const [cogs, setCogs] = useState(30);
  const [fees, setFees] = useState(1.5);
  const [spend, setSpend] = useState(32);
  const [days, setDays] = useState(26);
  const [covers, setCovers] = useState(40);

  const fixed = rent + staff + other;
  const margin = 1 - (cogs + fees) / 100;
  const breakEven = margin > 0 ? fixed / margin : Infinity;
  const perDay = spend > 0 && days > 0 ? breakEven / spend / days : Infinity;
  const revenue = covers * spend * days;
  const result = revenue * margin - fixed;
  const finite = Number.isFinite(breakEven);

  return (
    <Panel
      id="break-even"
      tone="bg-slate"
      title="Hoeveel gasten heb je nodig?"
      intro="Je vaste kosten moeten elke maand terugverdiend worden. Zie hoeveel omzet en hoeveel gasten per dag je nodig hebt om quitte te spelen."
    >
      <Card>
        <p className="text-sm text-espresso/65">Vaste kosten per maand</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <NumberField label="Huur" prefix="€" value={rent} onChange={setRent} step={250} />
          <NumberField label="Personeel" prefix="€" value={staff} onChange={setStaff} step={500} />
          <NumberField label="Overig" prefix="€" value={other} onChange={setOther} step={250} />
        </div>
        <p className="mt-6 text-sm text-espresso/65">Per gast</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <NumberField label="Inkoop" suffix="% van omzet" value={cogs} onChange={setCogs} />
          <NumberField label="Pinkosten" suffix="%" value={fees} onChange={setFees} step={0.1} />
          <NumberField label="Besteding per gast" prefix="€" value={spend} onChange={setSpend} />
        </div>
        <div className="mt-6 grid gap-4 border-t border-stone pt-5 sm:grid-cols-2">
          <NumberField label="Dagen open per maand" value={days} onChange={(n) => setDays(Math.min(n, 31))} />
          <NumberField label="Gasten per dag nu" value={covers} onChange={setCovers} />
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <Big
          label="Gasten per dag om quitte te spelen"
          value={finite ? Math.ceil(perDay).toLocaleString("nl-NL") : "–"}
          note={finite ? `${eur(breakEven)} omzet per maand.` : "Je inkoop en pinkosten zijn samen 100% of meer van je omzet."}
        />
        <Stat
          label={result >= 0 ? "Bij je huidige gasten hou je over" : "Bij je huidige gasten kom je tekort"}
          value={`${eur(Math.abs(result))}/mnd`}
          note={`${eur(revenue)} omzet per maand.`}
        />
      </Card>
    </Panel>
  );
}

/* ---------- 7. Personeelskosten ---------- */

const HOLIDAY_PAY = 0.08;

export function LabourCost() {
  const [wage, setWage] = useState(15);
  const [hours, setHours] = useState(220);
  const [charges, setCharges] = useState(25);
  const [revenue, setRevenue] = useState(60000);

  const gross = wage * hours * (52 / 12);
  const total = gross * (1 + HOLIDAY_PAY) * (1 + charges / 100);
  const share = revenue > 0 ? (total / revenue) * 100 : 0;
  const perHour = hours > 0 ? total / (hours * (52 / 12)) : 0;

  return (
    <Panel
      id="personeelskosten"
      tone="bg-wine"
      title="Wat kost je personeel echt?"
      intro="Een uurloon van €15 kost je als werkgever flink meer. Reken met vakantiegeld en werkgeverslasten erbij, en zie welk deel van je omzet naar personeel gaat."
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Gemiddeld bruto uurloon" prefix="€" value={wage} onChange={setWage} step={0.5} />
          <NumberField label="Uren per week, hele team" value={hours} onChange={setHours} step={10} />
          <NumberField label="Werkgeverslasten" suffix="%" value={charges} onChange={setCharges} />
          <NumberField label="Omzet per maand" prefix="€" value={revenue} onChange={setRevenue} step={1000} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-espresso/60">
          Werkgeverslasten zijn premies, pensioen en verzekeringen bovenop het brutoloon. In de horeca vaak 20 tot 30%. 8%
          vakantiegeld rekenen we er altijd bij.
        </p>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <Big label="Personeelskosten per maand" value={eur(total)} note={`${eur(perHour, 2)} per gewerkt uur, bij ${eur(wage, 2)} bruto.`} />
        <div>
          <Stat label="Deel van je omzet" value={pctNl(share)} note="Vaak genoemd als gezond voor horeca: rond 30 tot 35%." />
          <div className="mt-3 h-3 rounded-[4px] bg-cream">
            <div className="h-full rounded-[4px] bg-wine transition-[width] duration-500" style={{ width: `${Math.min(share, 100)}%` }} />
          </div>
        </div>
      </Card>
    </Panel>
  );
}

/* ---------- 8. Prime cost ---------- */

export function PrimeCost() {
  const [revenue, setRevenue] = useState(60000);
  const [food, setFood] = useState(13000);
  const [drinks, setDrinks] = useState(5000);
  const [staff, setStaff] = useState(20000);

  const prime = food + drinks + staff;
  const share = revenue > 0 ? (prime / revenue) * 100 : 0;
  const rest = revenue - prime;
  const verdict = share <= 60 ? "Netjes. Er blijft genoeg over voor huur en winst." : share <= 65 ? "Op het randje. Kijk waar inkoop of rooster strakker kan." : "Te hoog. Na huur en vaste lasten blijft er weinig over.";

  return (
    <Panel
      id="prime-cost"
      tone="bg-espresso"
      title="Wat is je prime cost?"
      intro="Inkoop plus personeel: je twee grootste kosten bij elkaar. Ligt dat onder de 60 tot 65% van je omzet, dan heb je ruimte voor huur en winst."
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Omzet per maand" prefix="€" value={revenue} onChange={setRevenue} step={1000} />
          <NumberField label="Inkoop eten" prefix="€" value={food} onChange={setFood} step={500} />
          <NumberField label="Inkoop drank" prefix="€" value={drinks} onChange={setDrinks} step={500} />
          <NumberField label="Personeel, incl. lasten" prefix="€" value={staff} onChange={setStaff} step={500} />
        </div>
        <div className="mt-6 border-t border-stone pt-5">
          <Split
            parts={[
              { label: "Eten", value: food, color: SPLIT_COLORS[0] },
              { label: "Drank", value: drinks, color: SPLIT_COLORS[1] },
              { label: "Personeel", value: staff, color: SPLIT_COLORS[2] },
              { label: "Over voor de rest", value: rest, color: SPLIT_COLORS[4] },
            ]}
          />
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <Big label="Prime cost" value={pctNl(share)} note={`${eur(prime)} van ${eur(revenue)} omzet.`} />
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Food cost" value={pctNl(revenue > 0 ? ((food + drinks) / revenue) * 100 : 0)} />
          <Stat label="Personeel" value={pctNl(revenue > 0 ? (staff / revenue) * 100 : 0)} />
        </div>
        <p className="text-sm leading-relaxed text-espresso/70">{verdict}</p>
      </Card>
    </Panel>
  );
}

/* ---------- 9. Winstmarge ---------- */

export function ProfitMargin() {
  const [revenue, setRevenue] = useState(60000);
  const [cogs, setCogs] = useState(18000);
  const [staff, setStaff] = useState(20000);
  const [rent, setRent] = useState(6000);
  const [energy, setEnergy] = useState(2500);
  const [other, setOther] = useState(4500);

  const costs = cogs + staff + rent + energy + other;
  const profit = revenue - costs;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const perTen = revenue > 0 ? (profit / revenue) * 10 : 0;

  return (
    <Panel
      id="winstmarge"
      tone="bg-olive"
      title="Wat hou je over van elk tientje?"
      intro="Zet je omzet en kosten van een gewone maand erin. Je ziet je winstmarge en waar elke euro omzet naartoe gaat."
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Omzet per maand" prefix="€" value={revenue} onChange={setRevenue} step={1000} />
          <NumberField label="Inkoop eten en drank" prefix="€" value={cogs} onChange={setCogs} step={500} />
          <NumberField label="Personeel, incl. lasten" prefix="€" value={staff} onChange={setStaff} step={500} />
          <NumberField label="Huur" prefix="€" value={rent} onChange={setRent} step={250} />
          <NumberField label="Energie" prefix="€" value={energy} onChange={setEnergy} step={100} />
          <NumberField label="Overig (verzekering, kassa, marketing)" prefix="€" value={other} onChange={setOther} step={250} />
        </div>
        <div className="mt-6 border-t border-stone pt-5">
          <Split
            parts={[
              { label: "Inkoop", value: cogs, color: SPLIT_COLORS[0] },
              { label: "Personeel", value: staff, color: SPLIT_COLORS[1] },
              { label: "Huur", value: rent, color: SPLIT_COLORS[2] },
              { label: "Energie", value: energy, color: SPLIT_COLORS[3] },
              { label: "Overig", value: other, color: SPLIT_COLORS[4] },
              { label: "Winst", value: profit, color: SPLIT_COLORS[5] },
            ]}
          />
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6">
        <Big
          label={profit >= 0 ? "Van elke €10 omzet hou je over" : "Op elke €10 omzet verlies je"}
          value={eur(Math.abs(perTen), 2)}
          note={`Winstmarge ${pctNl(margin, 1)}.`}
        />
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Winst per maand" value={eur(profit)} />
          <Stat label="Winst per jaar" value={eur(profit * 12)} />
        </div>
        <p className="text-sm leading-relaxed text-espresso/70">Vóór belasting en afschrijvingen. Veel horecazaken zitten tussen de 3 en 10%.</p>
      </Card>
    </Panel>
  );
}

/* ---------- 10. Fooi verdelen ---------- */

type Person = { name: string; hours: number; role: "bediening" | "keuken" };

const TEAM: Person[] = [
  { name: "Sanne", hours: 32, role: "bediening" },
  { name: "Daan", hours: 24, role: "bediening" },
  { name: "Noor", hours: 16, role: "bediening" },
  { name: "Youssef", hours: 36, role: "keuken" },
  { name: "Lotte", hours: 20, role: "keuken" },
];
const METHODS = { uren: "Naar uren", gelijk: "Iedereen gelijk", keuken: "Vast deel voor de keuken" } as const;

export function TipSplit() {
  const [tips, setTips] = useState(1200);
  const [team, setTeam] = useState<Person[]>(TEAM);
  const [method, setMethod] = useState<keyof typeof METHODS>("uren");
  const [kitchen, setKitchen] = useState(30);

  const update = (i: number, patch: Partial<Person>) => setTeam((t) => t.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const byHours = (people: Person[], pot: number) => {
    const total = people.reduce((n, p) => n + p.hours, 0);
    return (p: Person) => (total > 0 ? (p.hours / total) * pot : 0);
  };
  const share = (p: Person) => {
    if (method === "gelijk") return team.length ? tips / team.length : 0;
    if (method === "uren") return byHours(team, tips)(p);
    const crew = team.filter((x) => x.role === p.role);
    const hasKitchen = team.some((x) => x.role === "keuken");
    const hasFloor = team.some((x) => x.role === "bediening");
    // If one side is empty, the whole pot goes to the other
    const pot = !hasKitchen || !hasFloor ? tips : p.role === "keuken" ? tips * (kitchen / 100) : tips * (1 - kitchen / 100);
    return byHours(crew, pot)(p);
  };

  return (
    <Panel
      id="fooi"
      tone="bg-slate"
      title="Fooi eerlijk verdelen"
      intro="Vul de fooipot en het rooster van deze week in. Kies hoe je verdeelt en zie meteen wie wat krijgt."
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Fooipot" prefix="€" value={tips} onChange={setTips} step={50} />
          {method === "keuken" && <NumberField label="Deel voor de keuken" suffix="%" value={kitchen} onChange={(n) => setKitchen(Math.min(n, 100))} step={5} />}
        </div>
        <div className="mt-5">
          <Choice label="Verdeling" value={method} options={METHODS} onChange={setMethod} />
        </div>
        <div className="mt-6 hidden grid-cols-[1fr_80px_120px_28px] gap-2 text-sm text-espresso/65 sm:grid">
          <span>Naam</span>
          <span>Uren</span>
          <span>Rol</span>
          <span />
        </div>
        <div className="mt-2 grid gap-3 sm:gap-2">
          {team.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_72px_1fr_28px] gap-2 sm:grid-cols-[1fr_80px_120px_28px]">
              <input
                aria-label="Naam"
                value={p.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="col-span-4 rounded-lg border border-stone px-2.5 py-2 outline-none focus:border-espresso sm:col-span-1"
              />
              <input
                aria-label="Uren"
                type="number"
                min={0}
                value={p.hours}
                onChange={(e) => update(i, { hours: Math.max(0, Number(e.target.value)) })}
                className="min-w-0 rounded-lg border border-stone px-2.5 py-2 outline-none focus:border-espresso"
              />
              <select
                aria-label="Rol"
                value={p.role}
                onChange={(e) => update(i, { role: e.target.value as Person["role"] })}
                className="rounded-lg border border-stone bg-white px-1.5 py-2 outline-none focus:border-espresso"
              >
                <option value="bediening">Bediening</option>
                <option value="keuken">Keuken</option>
              </select>
              <button
                type="button"
                aria-label={`${p.name || "Regel"} verwijderen`}
                onClick={() => setTeam((t) => t.filter((_, j) => j !== i))}
                className="rounded-lg text-espresso/40 hover:bg-cream hover:text-espresso"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTeam((t) => [...t, { name: "", hours: 0, role: "bediening" }])}
          className="mt-3 rounded-lg bg-cream px-3 py-1.5 text-sm font-medium hover:bg-stone"
        >
          + Collega
        </button>
      </Card>
      <Card className="flex flex-col gap-5">
        <p className="text-sm text-espresso/65">Wie krijgt wat</p>
        <ul className="grid gap-2">
          {team.map((p, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4 border-b border-stone pb-2 last:border-0">
              <span>
                {p.name || "Naamloos"} <span className="text-sm text-espresso/55">· {p.hours} uur</span>
              </span>
              <span className="font-display text-2xl font-medium tabular-nums tracking-[-0.03em]">{eur(share(p), 2)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-auto text-sm leading-relaxed text-espresso/70">
          Spreek de verdeling vooraf af met je team en zet hem op papier, dan is er aan het eind van de week geen discussie.
        </p>
      </Card>
    </Panel>
  );
}
