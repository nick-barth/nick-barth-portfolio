import Image from "next/image";
import { Carousel } from "./carousel";
import { SectionTitle } from "./ui";

const quotes = [
  {
    name: "ZeroZero",
    city: "Amsterdam",
    type: "Quick Service",
    img: "/case-studies/tebi/img/t-zerozero.webp",
    logo: "/case-studies/tebi/logos/zerozero.svg",
    quote: "Tebi really helped us to gain insights on what we can expect, what we've done in the past, what we're doing at the moment itself.",
  },
  {
    name: "Ari's",
    city: "Berlin",
    type: "Restaurant",
    img: "/case-studies/tebi/img/t-aris.webp",
    logo: "/case-studies/tebi/logos/aris.svg",
    quote: "Sometimes we do more than 400 covers a service—so payments need to be incredibly fast. Tebi is the one system that truly keeps up. It supports our high-volume restaurant while still giving me the flexibility to be creative with specials.",
  },
  {
    name: "Binnenvisser",
    city: "Amsterdam",
    type: "Restaurant",
    img: "/case-studies/tebi/img/t-binnenvisser.webp",
    logo: "/case-studies/tebi/logos/binnenvisser.svg",
    quote: "Switching to Tebi was unbelievably smooth. Support comes from real hospitality people who understand our day-to-day challenges. They’re a phone call away, guide us step by step, and answer within a day.",
  },
  {
    name: "Esra",
    city: "Amsterdam",
    type: "Restaurant",
    img: "/case-studies/tebi/img/t-esra.jpg",
    logo: "/case-studies/tebi/logos/esra.svg",
    quote: "With Inbox, everything comes to one place: any reservation comment, any message with a guest, anything the kitchen needs to know.",
  },
  {
    name: "Barracuda",
    city: "Amsterdam",
    type: "Restaurant",
    img: "/case-studies/tebi/img/t-barracuda.webp",
    logo: "/case-studies/tebi/logos/barracuda.svg",
    quote: "Tebi always thinks along with us to make everything more user-friendly and efficient.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <Carousel heading={<SectionTitle>Why operators choose Tebi.</SectionTitle>}>
        {quotes.map((q) => (
          <article
            key={q.name}
            className="relative flex aspect-[3/2] w-[85vw] max-w-[900px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl p-6 text-cream md:p-8"
          >
            <Image src={q.img} alt="" fill sizes="(min-width: 1024px) 900px, 85vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            <Image src={q.logo} alt={q.name} width={102} height={58} className="h-12 w-auto self-start" />
            <div>
              <blockquote className="max-w-[640px] font-display text-xl font-medium leading-snug tracking-[-0.02em] md:text-[26px]">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                {[q.name, q.city, q.type].map((t) => (
                  <span key={t} className="rounded-lg border border-cream/60 px-3 py-1.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </Carousel>
    </section>
  );
}
