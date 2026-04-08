import Link from 'next/link';
import { Search, Key, ArrowRight, Zap, Shield, Layers, Terminal } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-50">
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
            How Callio Works
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            One API key to discover, authenticate, and call any API. Built for developers and AI agents.
          </p>
        </div>

        <div className="mb-16">
          <div className="bg-white rounded-xl border border-[var(--line)] p-4 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold">Watch: How Callio Works</h2>
              <a
                href="https://youtu.be/laXk4u5vwEI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                Watch on YouTube <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg border border-[var(--line)]" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/laXk4u5vwEI"
                title="How Callio Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-16 mb-20">
          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">1</span>
                <h2 className="text-2xl font-bold">Browse the Marketplace</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Explore APIs and skills organized by category. From data enrichment to web scraping, email services to AI models — find exactly what you need.
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
                <h2 className="text-2xl font-bold">Get One API Key</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Generate a single Callio API key from your dashboard. This key authenticates you across every API in the marketplace. No more juggling dozens of keys.
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
                <h2 className="text-2xl font-bold">Call Any API</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Route your requests through the Callio proxy. We handle authentication, rate limiting, and error handling. Your agent gets a unified interface.
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
            Why developers choose Callio
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Key, title: 'One Key for All', desc: 'Stop managing dozens of API keys. One Callio key unlocks every API in the marketplace.' },
              { icon: Shield, title: 'Secure by Default', desc: 'Provider keys are encrypted and never exposed. Callio handles auth injection at the proxy level.' },
              { icon: Zap, title: 'Zero Config', desc: 'No SDK, no client library. Just HTTP requests through the proxy with your Callio key.' },
              { icon: Layers, title: 'Unified Interface', desc: 'Every API follows the same proxy pattern. Consistent error handling and response format.' },
              { icon: Terminal, title: 'Agent-Ready', desc: 'Built for AI agents. One config block gives your agent access to the entire API ecosystem.' },
              { icon: Search, title: 'Discovery', desc: 'Browse, search, and evaluate APIs before integrating. Interactive playground to test live.' },
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
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Ready to get started?</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">Create an account, generate your API key, and start making calls in under 2 minutes.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="px-6 py-3 bg-white text-[var(--accent)] font-semibold rounded-lg hover:bg-gray-100 transition">
              Create Account
            </Link>
            <Link href="/docs" className="px-6 py-3 border border-white/30 font-semibold rounded-lg hover:bg-white/10 transition">
              Read Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
