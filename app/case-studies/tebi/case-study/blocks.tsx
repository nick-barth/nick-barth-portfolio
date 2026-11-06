import type { ReactNode } from "react";

/*
 * Building blocks in the style of tebi.com's comparison pages: white cards on cream,
 * 18px corners, 30px padding, 26px card titles, 16px medium body copy.
 */

/** The check mark Tebi uses on its "Why operators choose Tebi" cards. */
export function Check({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[18px] bg-white p-6 md:p-[30px] ${className}`}>{children}</div>;
}

/** Small labelled fact, for laying out answers inside a card. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-espresso/55">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

/** Big number with a caption. */
export function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div>
      <p className="font-display text-[44px] font-medium leading-none tracking-[-0.05em]">{value}</p>
      <p className="mt-3">{label}</p>
      {note && <p className="mt-1 text-sm text-espresso/55">{note}</p>}
    </div>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="rounded-lg border border-espresso/20 px-2.5 py-1 text-sm">
          {t}
        </span>
      ))}
    </div>
  );
}
