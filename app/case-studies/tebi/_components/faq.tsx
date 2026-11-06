import { Chevron } from "./ui";

const faqs = [
  {
    q: "How are payments handled?",
    a: "Payments are fully embedded within the POS to eliminate double entry. We offer competitive rates typically reserved for large companies, custom tipping prompts to increase staff satisfaction, and invoice options for bigger groups. Plus, when Wi-Fi is down, terminals have sim cards as backup, or QR codes guests can scan to ensure payment is taken.",
  },
  {
    q: "How does pricing work?",
    a: "We offer subscriptions that grow with you and the fairest, most transparent payment fees. Start your subscription for free, and pay based on your revenue. You only pay per month and never get locked in to a contract.",
  },
  {
    q: "What hardware do I need?",
    a: "Tebi works on standard iOS and Android devices. You can use Tebi on any device (including payment terminals) to order and process payments. This flexibility means you can operate your business using the hardware you already own or prefer, without being locked into expensive proprietary equipment.",
  },
  {
    q: "What type of businesses can benefit from Tebi?",
    a: "Tebi is built for independent hospitality — restaurants, cafés, bars, and bakeries running one or two sites. Whether you're doing 40 covers or 400, the same system runs the floor, the kitchen, and the till. Nothing to configure that you won't use.",
  },
  {
    q: "How is Tebi different from other POS systems?",
    a: "Rather than juggling multiple systems with sloppy integrations, Tebi combines POS, reservations, kitchen display, payments and insights into one complete hospitality operating system. Plus, we deliver you transparent pricing, no locked-in contracts, and hospitality-first support, so you grow your business with a partner that has your back.",
  },
];

export function Faq() {
  return (
    <section className="grid gap-8 px-4 py-24 md:grid-cols-2 md:px-5">
      <div>
        <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">FAQ</h2>
        <p className="mt-4 max-w-[300px] text-[17px] leading-relaxed">
          Find quick answers to our most common questions. If you can’t find what you need, visit our{" "}
          <a href="#" className="border-b border-espresso">help section</a> or{" "}
          <a href="#" className="border-b border-espresso">contact us.</a>
        </p>
      </div>
      <div className="space-y-2">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl bg-white px-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[17px] font-medium">
              {f.q}
              <Chevron className="size-3 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-5 text-[15px] leading-relaxed text-espresso/80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
