import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./tebi.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const display = Inter_Tight({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Tebi — Growth case study · Nick Barth",
  description: "A growth marketing case study for Tebi, built on a recreation of tebi.com.",
  // Uses Tebi's brand and imagery — keep it out of search results
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function TebiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`tebi-root ${inter.variable} ${display.variable}`}>{children}</div>;
}
