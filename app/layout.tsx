import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit, Bodoni_Moda } from "next/font/google";
import localFont from "next/font/local";
import ParallaxFooter from "@/components/ParallaxFooter";
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
  title: "Nick Barth — GTM Engineer",
  description: "GTM Engineer specializing in data-driven growth systems and revenue infrastructure. 11+ years architecting sustainable go-to-market foundations.",
  keywords: "GTM engineer, growth engineering, data-driven growth, revenue optimization, go-to-market strategy, growth systems, PLG",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://new-nick-barth.vercel.app"),
  openGraph: {
    title: "Nick Barth — GTM Engineer",
    description: "GTM Engineer specializing in data-driven growth systems and revenue infrastructure. 11+ years architecting sustainable go-to-market foundations.",
    url: "https://new-nick-barth.vercel.app",
    siteName: "Nick Barth",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nick Barth — GTM Engineer",
    description: "GTM Engineer specializing in data-driven growth systems and revenue infrastructure. 11+ years of impact.",
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
  alternates: {
    canonical: "https://new-nick-barth.vercel.app",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
    jobTitle: "GTM Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Personio",
    },
    sameAs: [
      "https://www.linkedin.com/in/nicholasbarth/",
      "https://twitter.com/nickbarth",
    ],
    description: "GTM Engineer specializing in data-driven growth systems and revenue infrastructure. 11+ years architecting sustainable go-to-market foundations.",
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
      <body className="min-h-full flex flex-col">{children}<ParallaxFooter /></body>
    </html>
  );
}
