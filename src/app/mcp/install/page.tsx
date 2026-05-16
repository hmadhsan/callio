import Link from 'next/link';
import CallioLogo from '@/components/CallioLogo';

export const metadata = {
  title: 'Install Callio MCP Server',
  description: 'Step-by-step install instructions for running the Callio MCP server in Cursor or locally.',
};

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      <nav className="border-b border-[var(--line)] bg-[var(--page-bg)]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/mcp" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">MCP Home</Link>
            <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">Home</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Install Callio MCP Server</h1>
        <p className="text-[var(--muted)] mb-6">Quick install steps for Cursor (or any MCP-compatible client). Choose your OS below and follow the short commands.</p>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--line)] p-6 bg-white">
            <h2 className="font-semibold mb-3">1) Download the MCP config</h2>
            <p className="text-[var(--muted)] mb-3">Click to download a ready-made <code className="bg-[var(--soft)] px-1.5 py-0.5 rounded">.cursor/mcp.json</code> with a placeholder API key.</p>
            <a href="/callio-cursor-mcp.json" download className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-md">Download config</a>
          </div>

          <div className="rounded-xl border border-[var(--line)] p-6 bg-white">
            <h2 className="font-semibold mb-3">2) Install helper (optional)</h2>
            <p className="text-[var(--muted)] mb-3">Use the installer script to prompt for your API key and write the config for you.</p>
            <div className="flex gap-2">
              <a href="/callio-mcp-install.sh" download className="px-3 py-2 rounded-md border bg-white">Download (sh)</a>
              <a href="/callio-mcp-install.ps1" download className="px-3 py-2 rounded-md border bg-white">Download (ps1)</a>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white border border-[var(--line)] rounded-xl p-6">
          <h3 className="font-semibold mb-3">Manual steps (one minute)</h3>
          <ol className="list-decimal list-inside text-[var(--muted)] space-y-2">
            <li>Download the config or run the installer script for your OS.</li>
            <li>Replace the placeholder <code>CALLIO_API_KEY</code> with the key from your Callio dashboard.</li>
            <li>Start/restart your MCP client (Cursor will detect `.cursor/mcp.json`).</li>
            <li>Confirm the MCP server shows three tools and a green status.</li>
          </ol>
          <div className="mt-4 text-sm text-[var(--muted)]">
            Example manual command to create the file:
            <pre className="bg-[var(--soft)] p-3 rounded mt-2 text-xs font-mono">mkdir -p .cursor && curl -o .cursor/mcp.json https://callio.dev/callio-cursor-mcp.json</pre>
          </div>
        </section>

        <section className="mt-8 flex items-start gap-6">
          <div className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg">
            {/* small animated SVG as a GIF placeholder */}
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="12" fill="#60a5fa">
                <animate attributeName="r" values="8;14;8" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <rect x="28" y="52" width="24" height="6" fill="#10b981" rx="3">
                <animate attributeName="width" values="10;28;10" dur="1.6s" repeatCount="indefinite" />
              </rect>
            </svg>
          </div>
          <div>
            <h4 className="font-semibold">Want a walkthrough?</h4>
            <p className="text-[var(--muted)]">We can add a short GIF or video walkthrough. For now the installer scripts provide a quick guided flow.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
