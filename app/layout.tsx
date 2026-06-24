import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Bodoni_Moda } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nick Barth — Product Engineer",
  description: "Growth Engineer at Personio, based in Utrecht. Turning data into revenue.",
  keywords: "growth engineering, product strategy, product engineer, GTM",
  openGraph: {
    title: "Nick Barth — Product Engineer",
    description: "Growth Engineer at Personio, based in Utrecht. Turning data into revenue.",
    url: "https://new-nick-barth.vercel.app",
    siteName: "Nick Barth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nick Barth — Product Engineer",
    description: "Growth Engineer at Personio, based in Utrecht. Turning data into revenue.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
