import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M2 4.5 6 8.5 10 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const variants = {
  butter: "bg-butter text-espresso hover:bg-[#efdc3f]",
  espresso: "bg-espresso text-cream hover:bg-black",
  ghost: "border border-butter/70 bg-espresso/40 text-cream backdrop-blur hover:bg-espresso/60",
};

type ButtonProps = {
  href: string;
  variant?: keyof typeof variants;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

export function Button({ href, variant = "butter", arrow = false, children, className = "", ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[15px] font-medium transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight />}
    </Link>
  );
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl ${className}`}>
      {children}
    </h2>
  );
}
