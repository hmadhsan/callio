import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Callio - Make Your API Agent-Ready in Minutes",
  description: "Convert any API into an AI-discoverable, agent-usable tool in minutes. The API marketplace designed specifically for AI agents.",
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
