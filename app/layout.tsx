import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Bodoni_Moda } from "next/font/google";
import { localFont } from "next/font/local";
import "./globals.css";

const maziusDisplay = localFont({
  src: [
    {
      path: "../public/fonts/MaziusDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MaziusDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/MaziusDisplay-Extraitalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/MaziusDisplay-ExtraItalicBold.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-mazius",
});

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
  keywords: "growth engineering, product strategy, product engineer, GTM, growth hacker",
  metadataBase: new URL("https://new-nick-barth.vercel.app"),
  canonical: "https://new-nick-barth.vercel.app",
  openGraph: {
    title: "Nick Barth — Product Engineer",
    description: "Growth Engineer at Personio, based in Utrecht. Turning data into revenue.",
    url: "https://new-nick-barth.vercel.app",
    siteName: "Nick Barth",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nick Barth — Product Engineer",
    description: "Growth Engineer at Personio, based in Utrecht. Turning data into revenue.",
    creator: "@nickbarth",
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  alternates: {
    canonical: "https://new-nick-barth.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nick Barth",
    url: "https://new-nick-barth.vercel.app",
    jobTitle: "Growth Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Personio",
    },
    sameAs: [
      "https://www.linkedin.com/in/nicholasbarth/",
      "https://twitter.com/nickbarth",
    ],
    description: "Growth Engineer at Personio, based in Utrecht. Turning data into revenue.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${bodoniModa.variable} ${maziusDisplay.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
