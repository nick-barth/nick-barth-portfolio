import { Button } from "./ui";

const order = [
  { qty: 2, name: "Paella", note: "No shellfish", price: "€14.00" },
  { qty: 1, name: "Hummus", note: "Herbs on the side · No pine nuts", price: "€7.50" },
  { qty: 2, name: "Gazpacho", note: "", price: "€16.00" },
];

const methods = ["Cash", "Invoice", "Card", "QR Payment"];

export function Connection() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-10">
      <div className="grid items-center gap-10 rounded-3xl bg-stone p-8 md:grid-cols-2 md:p-16">
        <div>
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-[44px]">
            Less tech integration.
            <br />
            More connection.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed">
            Hospitality businesses are overwhelmed with software that adds complexity instead of solving it, with
            disconnected tools, messy integrations, and multiplying costs. That’s why we built Tebi to flow.
          </p>
          <p className="mt-5 text-[17px] leading-relaxed">
            By connecting your service and admin in one system, Tebi gives you everything you need to run a
            profitable restaurant and nothing in the way of real hospitality.
          </p>
          <Button href="#features" variant="espresso" arrow className="mt-8">
            See how it works
          </Button>
        </div>

        {/* POS mock, rebuilt in HTML like the original */}
        <div className="mx-auto w-full max-w-[340px] space-y-3 text-espresso">
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-4 ring-white/60">
            <span className="font-display text-xl font-medium">4p · Sophia Berger</span>
            <span className="rounded-md bg-[#e5322d] px-2 py-0.5 text-sm font-medium text-white">Shellfish allergy</span>
          </div>
          <div className="divide-y divide-stone rounded-xl bg-white px-4 py-2 shadow-sm ring-4 ring-white/60">
            {order.map((o) => (
              <div key={o.name} className="flex items-start justify-between py-2 text-sm">
                <div className="flex gap-3">
                  <span className="font-semibold">{o.qty}</span>
                  <div>
                    <div className="font-semibold">{o.name}</div>
                    {o.note && <div className="text-xs text-espresso/60">{o.note}</div>}
                  </div>
                </div>
                <span className="flex items-center gap-2">
                  {o.price} <span className="size-1.5 rounded-full bg-espresso" />
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 pt-3 text-xs font-medium">
            {methods.map((m) => (
              <span key={m} className={`rounded-md px-2 py-1 ${m === "Card" ? "bg-espresso/15" : ""}`}>
                {m}
              </span>
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <span className="rounded-lg bg-[#7b74f0] px-4 py-2.5 font-semibold text-white">Pay €37,50</span>
          </div>
        </div>
      </div>
    </section>
  );
}
