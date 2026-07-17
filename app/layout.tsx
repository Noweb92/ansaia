import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "ANSA — AI Receptionist for Perth Restaurants & Venues | Never Miss Another Call",
    template: "%s | ANSA",
  },
  description:
    "ANSA answers your venue’s calls 24/7 with a natural Australian voice. Bookings, messages, FAQs — handled. Built for Perth restaurants, cafés and hospitality venues. Live in 48 hours.",
  keywords: [
    "AI receptionist",
    "Perth",
    "restaurant phone answering",
    "missed calls",
    "AI phone answering Australia",
    "restaurant bookings",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE.url,
    siteName: "ANSA",
    title: "ANSA — AI Receptionist for Perth Restaurants & Venues",
    description:
      "Every call gets an ANSA. 24/7 answering, bookings and recaps for Perth hospitality venues. Live in 48 hours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANSA — AI Receptionist for Perth Restaurants & Venues",
    description:
      "Every call gets an ANSA. 24/7 answering, bookings and recaps for Perth hospitality venues.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ANSA — Automated Natural Speech Assistant",
  description:
    "AI receptionist answering calls 24/7 for restaurants and hospitality venues in Perth, Western Australia.",
  url: SITE.url,
  telephone: SITE.phoneIntl,
  email: SITE.email,
  founder: { "@type": "Person", name: SITE.founder },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Perth",
    addressRegion: "WA",
    addressCountry: "AU",
  },
  areaServed: { "@type": "City", name: "Perth" },
  openingHours: "Mo-Su 00:00-24:00",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        {children}
        <Footer />
        <Analytics />
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
