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
