import type { Metadata } from "next";
import { InViewAnimationWrapper } from "@/components/InViewAnimationWrapper";
import { BloodSplatterZone } from "@/components/BloodSplatterZone";

export const metadata: Metadata = {
  title: "Halloween 2026 — You're Invited",
  description: "Join us for Halloween, October 31st at 2 Adriaanstraat. Costumes welcome.",
  robots: {
    index: false,
    follow: false,
  },
};

const details = [
  {
    label: "When",
    value: "October 31st — 3-7 PM",
  },
  {
    label: "Where",
    value: "2 Adriaanstraat",
    href: "https://maps.google.com/?q=2+Adriaanstraat",
  },
  {
    label: "Costumes",
    value: "Welcome (not required, but encouraged)",
  },
  {
    label: "Trick-or-treat",
    value: "Around 7 PM",
  },
  {
    label: "Activities",
    value: "Verkleedkist, piñatas, apple bobbing, spooky films, pumpkin painting, caramel apples",
  },
];

export default function Halloween2026() {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: "#151312", color: "#f6f4ec" }}
    >
      <BloodSplatterZone>
      {/* ambient glow accents */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(255,122,61,0.16) 0%, rgba(255,122,61,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "55vw",
          height: "55vw",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, rgba(124,58,237,0) 70%)",
        }}
      />

      {/* floating ghosts */}
      <div className="absolute pointer-events-none ghost-float hidden sm:block" style={{ top: "8%", right: "16%", animationDuration: "11s", animationDelay: "0s" }}>
        <GhostSVG size={48} opacity={0.5} />
      </div>
      <div className="absolute pointer-events-none ghost-float" style={{ top: "18%", left: "6%", animationDuration: "13s", animationDelay: "-2s" }}>
        <GhostSVG size={34} opacity={0.35} />
      </div>
      <div className="absolute pointer-events-none ghost-float hidden md:block" style={{ top: "42%", right: "12%", animationDuration: "10s", animationDelay: "-4s" }}>
        <GhostSVG size={40} opacity={0.4} />
      </div>
      <div className="absolute pointer-events-none ghost-float" style={{ bottom: "14%", left: "8%", animationDuration: "14s", animationDelay: "-1s" }}>
        <GhostSVG size={30} opacity={0.3} />
      </div>
      <div className="absolute pointer-events-none ghost-float hidden sm:block" style={{ bottom: "6%", right: "22%", animationDuration: "12s", animationDelay: "-5s" }}>
        <GhostSVG size={44} opacity={0.45} />
      </div>

      <div
        className="w-full mx-auto relative"
        style={{ maxWidth: "760px" }}
      >
        <div className="px-6 sm:px-8 md:px-12 pt-20 sm:pt-28 md:pt-32 pb-20 sm:pb-28 md:pb-32">
          <InViewAnimationWrapper animationClass="animate-fade-in">
            <MoonSVG />
          </InViewAnimationWrapper>

          <div
            className="mt-8"
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "clamp(14px, 2.5vw, 18px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ff7a3d",
              fontWeight: 500,
            }}
          >
            You&apos;re invited
          </div>

          <h1
            className="mt-3"
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "clamp(44px, 12vw, 96px)",
              fontWeight: 400,
              lineHeight: "1.05",
              fontVariantLigatures: "common-ligatures",
              margin: 0,
            }}
          >
            Halloween{" "}
            <span
              className="animate-slide-in"
              style={{ color: "#7c3aed", display: "inline-block" }}
            >
              2026
            </span>
          </h1>

          <InViewAnimationWrapper animationClass="animate-fade-in-up">
            <p
              style={{
                fontFamily: '"Geist", "Geist Placeholder", sans-serif',
                fontSize: "clamp(16px, 4vw, 22px)",
                fontWeight: 300,
                lineHeight: "1.6",
                marginTop: "clamp(24px, 6vw, 40px)",
                color: "rgba(246,244,236,0.72)",
                maxWidth: "540px",
              }}
            >
              Come celebrate with us. Doors open all day, the pumpkins are
              carved, and things get properly spooky once the sun goes down.
            </p>
          </InViewAnimationWrapper>

          {/* Details card */}
          <div
            className="mt-12 sm:mt-16"
            style={{
              border: "1px solid rgba(246,244,236,0.14)",
              borderRadius: "16px",
              backgroundColor: "rgba(246,244,236,0.04)",
              padding: "clamp(20px, 5vw, 40px)",
            }}
          >
            <dl className="grid gap-6 sm:gap-8" style={{ gridTemplateColumns: "1fr" }}>
              {details.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-1 sm:gap-6 items-baseline"
                  style={{
                    gridTemplateColumns: "minmax(0, 140px) 1fr",
                  }}
                >
                  <dt
                    style={{
                      fontFamily: "'PP Pangaia', sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(246,244,236,0.5)",
                    }}
                  >
                    {item.label}
                  </dt>
                  <dd
                    style={{
                      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
                      fontSize: "clamp(17px, 3vw, 20px)",
                      fontWeight: 400,
                      margin: 0,
                    }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "underline", textDecorationColor: "rgba(246,244,236,0.3)" }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* RSVP */}
          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="https://wa.me/31639099809"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontSize: "18px",
                fontWeight: 500,
                backgroundColor: "#ff7a3d",
                color: "#151312",
                padding: "14px 32px",
                borderRadius: "999px",
                textDecoration: "none",
              }}
            >
              RSVP — WhatsApp
            </a>
            <span
              style={{
                fontFamily: '"Geist", "Geist Placeholder", sans-serif',
                fontSize: "15px",
                color: "rgba(246,244,236,0.5)",
              }}
            >
              +31 6 39099809
            </span>
          </div>
        </div>
      </div>
      </BloodSplatterZone>
    </div>
  );
}

function MoonSVG() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M36 8C27.5 10 21 17.8 21 27C21 36.9 29.1 45 39 45C42.1 45 45 44.2 47.5 42.8C43.4 47.9 37.1 51 30 51C17.3 51 7 40.7 7 28C7 15.3 17.3 5 30 5C32.1 5 34.1 5.3 36 8Z"
        fill="#ff7a3d"
        fillOpacity="0.9"
      />
    </svg>
  );
}

function GhostSVG({ size = 48, opacity = 0.4 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 2C10.059 2 2 10.059 2 20V52L8 46L14 52L20 46L26 52L32 46L38 52V20C38 10.059 29.941 2 20 2Z"
        fill="#f6f4ec"
        fillOpacity={opacity}
      />
      <circle cx="14" cy="22" r="2.4" fill="#151312" fillOpacity={opacity} />
      <circle cx="26" cy="22" r="2.4" fill="#151312" fillOpacity={opacity} />
    </svg>
  );
}
