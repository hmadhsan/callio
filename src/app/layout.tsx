import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Callio — The API Gateway for AI Agents",
  description: "One API gateway for AI agents. Discover, authenticate, and call 90+ APIs through a unified interface.",
  metadataBase: new URL("https://callio.dev"),
  openGraph: {
    title: "Callio — The API Gateway for AI Agents",
    description: "One API gateway for AI agents. Discover, authenticate, and call 90+ APIs through a unified interface.",
    url: "https://callio.dev",
    siteName: "Callio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Callio API Gateway",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Callio — The API Gateway for AI Agents",
    description: "One API gateway for AI agents. Discover, authenticate, and call 90+ APIs through a unified interface.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('callio-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F9B384E3Q2"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F9B384E3Q2');
        ` }} />
      </head>
      <body className="antialiased min-h-screen bg-[var(--page-bg)] text-[var(--ink)] transition-colors duration-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
