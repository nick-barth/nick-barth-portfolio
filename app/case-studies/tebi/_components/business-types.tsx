import Image from "next/image";
import { Carousel } from "./carousel";
import { SectionTitle } from "./ui";

const types = [
  { name: "Restaurants", img: "/case-studies/tebi/img/bt-restaurants.webp", body: "Tebi connects your front and back-of-house for smoother service and intuitive insights." },
  { name: "Bars & Clubs", img: "/case-studies/tebi/img/bt-bars.webp", body: "Take orders fast, keep tabs open or closed, and get paid instantly." },
  { name: "Cafes & Bakeries", img: "/case-studies/tebi/img/bt-cafes.webp", body: "Speed through sales and get orders right every time." },
  { name: "Quick Service", img: "/case-studies/tebi/img/bt-quick.webp", body: "One system to run your shop smoother and plan smarter." },
  { name: "Events & Venues", img: "/case-studies/tebi/img/bt-events.webp", body: "Run bar service, private dining, or anything in between with a system that adapts to your space." },
];

export function BusinessTypes() {
  return (
    <section className="bg-espresso py-16 text-cream md:py-20">
      <Carousel
        dark
        heading={
          <SectionTitle>
            For small shops and fine dining.
            <br />
            <span className="text-cream/50">Tebi flexes to your needs.</span>
          </SectionTitle>
        }
      >
        {types.map((t) => (
          <a
            key={t.name}
            href="#"
            className="group relative aspect-[4/5] w-[72vw] max-w-[400px] shrink-0 snap-start overflow-hidden rounded-2xl"
          >
            <Image
              src={t.img}
              alt=""
              fill
              sizes="400px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-6 bottom-6">
              <h3 className="font-display text-2xl font-medium tracking-[-0.02em]">{t.name}</h3>
              <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/85 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                {t.body}
              </p>
            </div>
          </a>
        ))}
      </Carousel>
    </section>
  );
}
