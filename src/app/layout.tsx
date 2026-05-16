import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Callio \u2014 The API Gateway for AI Agents",
  description: "One key. One gateway. Every tool your agent needs. MCP-native and production-ready for teams shipping AI agents and AI-native apps.",
  metadataBase: new URL("https://callio.dev"),
  openGraph: {
    title: "Callio \u2014 The API Gateway for AI Agents",
    description: "One key. One gateway. Every tool your agent needs. MCP-native and production-ready for teams shipping AI agents and AI-native apps.",
    url: "https://callio.dev",
    siteName: "Callio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Callio \u2014 The API Gateway for AI Agents",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Callio \u2014 The API Gateway for AI Agents",
    description: "One key. One gateway. Every tool your agent needs. MCP-native and production-ready.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F9B384E3Q2"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F9B384E3Q2');
        ` }} />
        {/* Apollo.io website tracker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  function initApollo(){
    var n=Math.random().toString(36).substring(7),
    o=document.createElement("script");
    o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
    o.async=true;
    o.defer=true;
    o.onload=function(){
      if (window.trackingFunctions && window.trackingFunctions.onLoad) {
        window.trackingFunctions.onLoad({appId:"69d956fbedd664001523ab5e"});
      }
    };
    document.head.appendChild(o);
  }
  initApollo();
})();
            `.trim(),
          }}
        />
      </head>
      <body
        className="antialiased bg-[var(--page-bg)] text-[var(--ink)]"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
