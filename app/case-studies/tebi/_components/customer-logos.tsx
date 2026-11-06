import Image from "next/image";

export function CustomerLogos() {
  return (
    <section className="py-10">
      <p className="text-center text-lg md:text-xl">Thousands of operators grow their business with Tebi</p>
      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <Image
              key={k}
              src="/case-studies/tebi/img/customer-logos.png"
              alt={k === 0 ? "107, BAK, Zoldering, Rijsel, Bouillon Amsterdam, Marseille, OUE, Spaghetteria, Frieda, Julius Ernst, Remi" : ""}
              width={2550}
              height={108}
              className="h-[54px] w-auto max-w-none pr-16 mix-blend-multiply"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
