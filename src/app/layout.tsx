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
      <body
        className="antialiased bg-[var(--page-bg)] text-[var(--ink)]"
      >
        {children}
      </body>
    </html>
  );
}
