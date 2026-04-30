import Link from 'next/link';
import { Search, Key, ArrowRight, Zap, Shield, Layers, Terminal } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse APIs</Link>
            <Link href="/docs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Docs</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            How Callio works
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            One key. One gateway. Every external API your agent or AI-native app needs to call, MCP-native and production-ready.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16 mb-20">
          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">1</span>
                <h2 className="text-2xl font-bold">Pick the tools your agent needs</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Browse the catalog by category: search, comms, data, payments, identity, AI tooling, and more. The right APIs for whatever your agent has to do, in one place.
              </p>
              <Link href="/browse" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                Browse APIs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-[var(--line)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-[var(--muted)]" />
                <div className="flex-1 h-8 bg-[var(--soft)] rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['📧 SendGrid', '🤖 OpenAI', '💬 Slack', '📊 Analytics', '🔍 Scraper', '🌐 Globe'].map((item) => (
                  <div key={item} className="bg-[var(--soft)] rounded-lg p-3 text-sm">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">2</span>
                <h2 className="text-2xl font-bold">Get one key (sandbox or prod)</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Generate a Callio key from your dashboard. Use a sandbox key while you build, switch to a production key for real traffic. One key authenticates every API in the catalog.
              </p>
              <Link href="/keys" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                Manage keys <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 md:order-1">
              <p className="text-gray-500 text-xs mb-2 font-mono">Your Callio API Key</p>
              <div className="bg-[#2a2a2a] rounded-lg p-3 font-mono text-green-400 text-sm">
                callio_a1b2c3d4e5f6g7h8i9j0k1l2
              </div>
              <p className="text-gray-500 text-xs mt-3">Works with every API — no extra keys needed</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">3</span>
                <h2 className="text-2xl font-bold">Call from MCP or HTTP</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Drop our MCP server into Cursor / Claude / Antigravity, or call the HTTP proxy directly from any backend or agent runtime. We handle auth, retries, and observability.
              </p>
              <Link href="/docs" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                Read the docs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6">
              <pre className="text-green-400 text-xs font-mono overflow-x-auto">
{`curl -X GET \\
  "https://callio.dev/api/proxy/jsonplaceholder/posts/1" \\
  -H "Authorization: Bearer callio_..." \\

# Response
{
  "data": [...],
  "has_more": false
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            Why agent builders choose Callio
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Key, title: 'One key, every tool', desc: 'No more juggling N provider signups and N auth flows. One Callio key handles the whole catalog.' },
              { icon: Terminal, title: 'MCP-native', desc: 'Plug into Cursor, Claude, and Antigravity in minutes. Your agent gets discovery, describe, and call as three tools.' },
              { icon: Shield, title: 'BYOK + encrypted', desc: 'Save your provider keys once. They\u2019re AES-256 encrypted at rest and injected at the proxy, never exposed in logs.' },
              { icon: Layers, title: 'Sandbox + production', desc: 'Build against a sandbox key, ship with a production key. Same gateway, separate quotas and traffic.' },
              { icon: Zap, title: 'Just HTTP', desc: 'No vendor SDK lock-in. Call from any language or agent runtime that can speak HTTP.' },
              { icon: Search, title: 'Observability built in', desc: 'See every routed call, status, and provider error in the dashboard. Trust the path your agent depends on.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-[var(--line)] p-6">
                <Icon className="w-6 h-6 mb-3 text-[var(--accent)]" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[var(--accent)] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Wire your agent in minutes</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">Sign up, grab a key, and pick your path: install MCP into your editor, or call the HTTP proxy from your stack.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="px-6 py-3 bg-white text-[var(--accent)] font-semibold rounded-lg hover:bg-gray-100 transition">
              Get a key
            </Link>
            <Link href="/mcp" className="px-6 py-3 border border-white/30 font-semibold rounded-lg hover:bg-white/10 transition">
              Install MCP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
