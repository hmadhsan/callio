import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Callio — The API Gateway for AI Agents",
  description: "50+ APIs, 399 endpoints, one key. Connect your AI agent to any API through MCP or REST proxy. Works with Claude Code, Cursor & Antigravity.",
  metadataBase: new URL("https://callio.dev"),
  openGraph: {
    title: "Callio — The API Gateway for AI Agents",
    description: "50+ APIs, 399 endpoints, one key. Connect your AI agent to any API through MCP or REST proxy.",
    url: "https://callio.dev",
    siteName: "Callio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Callio — The API Gateway for AI Agents",
    description: "50+ APIs, 399 endpoints, one key. Connect your AI agent to any API through MCP or REST proxy.",
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
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F9B384E3Q2');
        ` }} />
      </head>
      <body
        className="antialiased bg-[var(--page-bg)] text-[var(--ink)]"
      >
        {children}
      </body>
    </html>
  );
}
