import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Sparkles, Lock, Rocket, Gauge, Check, ArrowRight,
  Search, Shield, Cpu, Globe, MessageSquare, Database, BarChart3,
  Mail, Cloud, Code2, ChevronDown, Terminal, Layers, Workflow, Key,
} from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogoComponent from '@/components/CallioLogo';
import AuthAwareCTA from '@/components/AuthAwareCTA';
import AnimatedHeroSVG from '@/components/AnimatedHeroSVG';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { ClaudeLogo, CursorLogo, AntigravityLogo } from '@/components/BrandLogos';
import { getCatalogApiCount } from '@/lib/catalog-count';

/** Bumps when ISR rebuilds; catalog count uses its own 5-minute cache. */
export const revalidate = 300;

const API_CATEGORIES = [
  { icon: Search, name: 'Search', desc: 'Web, news, products' },
  { icon: Mail, name: 'Email', desc: 'Send, verify, find' },
  { icon: Database, name: 'Data', desc: 'Enrich, scrape, extract' },
  { icon: MessageSquare, name: 'Messaging', desc: 'SMS, chat, notifications' },
  { icon: BarChart3, name: 'Analytics', desc: 'Tracking, insights' },
  { icon: Cloud, name: 'Cloud', desc: 'AWS, GCP, Azure' },
  { icon: Shield, name: 'Identity', desc: 'Auth, KYC, verify' },
  { icon: Globe, name: 'Social', desc: 'LinkedIn, X, Instagram' },
  { icon: Cpu, name: 'AI / ML', desc: 'Models, embeddings' },
  { icon: Code2, name: 'Dev Tools', desc: 'GitHub, CI/CD, logs' },
  { icon: Layers, name: 'Storage', desc: 'Files, S3, CDN' },
];

function buildFaqs(apiCount: number): { q: string; a: ReactNode }[] {
  return [
    {
      q: 'What is Callio?',
      a: `Callio is the API gateway for AI agents and AI-native apps. One key and one interface in front of ${apiCount} external APIs your agent or product needs to call.`,
    },
    {
      q: 'How is this different from calling each API directly?',
      a: 'Instead of writing a client, auth flow, retry policy, and key rotation for every provider, you point your agent at Callio. We handle routing, auth injection, errors, and observability so you don\u2019t maintain N integrations yourself.',
    },
    {
      q: 'Who is Callio for?',
      a: 'Teams building AI agents, AI-native SaaS, and dev tools that lean on a lot of external APIs. Typical user: a founder or engineer who wants to ship features instead of maintaining a folder full of API clients.',
    },
    {
      q: 'How does the MCP integration work?',
      a: (
        <>
          Drop our MCP server into Cursor, Claude, Antigravity, or any MCP-compatible client and your agent can call every API in the catalog with the same Callio key.{' '}
          <Link href="/mcp" className="text-[var(--accent)] underline font-medium">
            See setup
          </Link>
          .
        </>
      ),
    },
    {
      q: 'Do I need provider keys for the upstream APIs?',
      a: 'For most providers you bring your own key once and Callio injects it on each request (BYOK). Some public APIs work without one. Either way, your provider credentials are encrypted at rest.',
    },
    {
      q: 'How much does it cost to start?',
      a: (
        <>
          There\u2019s a free tier with 500 proxy requests and 2 sandbox keys so you can actually build and test before paying. Paid plans start at $19/month (Builder) for real product traffic.{' '}
          <Link href="/pricing" className="text-[var(--accent)] underline font-medium">
            See pricing
          </Link>
          .
        </>
      ),
    },
  ];
}

function FAQItem({ q, a }: { q: string; a: ReactNode }) {
  return (
    <details className="group border-b border-[var(--line)]">
      <summary className="flex items-center justify-between py-5 cursor-pointer text-left">
        <span className="font-medium text-[var(--ink)] pr-4">{q}</span>
        <ChevronDown className="w-5 h-5 text-[var(--muted)] shrink-0 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="pb-5 text-[var(--muted)] leading-relaxed">{a}</div>
    </details>
  );
}

export default async function Home() {
  const apiCount = await getCatalogApiCount();
  const faqs = buildFaqs(apiCount);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-[rgba(250,250,250,0.8)] border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <CallioLogoComponent size={34} />
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/mcp" className="font-semibold hover:text-[var(--violet)] transition flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--violet)] inline-block" />
              MCP
            </Link>
            <Link href="/browse" className="hover:text-[var(--accent)] transition">Browse APIs</Link>
            <Link href="/pricing" className="hover:text-[var(--accent)] transition">Pricing</Link>
            <Link href="/docs" className="hover:text-[var(--accent)] transition">Docs</Link>
            <Link href="/how-it-works" className="hover:text-[var(--accent)] transition">How it works</Link>
          </nav>
          <UserNav variant="landing" />
        </div>
      </header>
      <AnalyticsTracker />

      {/* ── Hero ── */}
      <section id="hero" className="relative overflow-hidden">
        {/* layered radial gradients — subtle blue wash on top of the existing neutral one */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.04),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(37,99,235,0.09),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(37,99,235,0.04),transparent_60%)]" />
        {/* faint dotted grid for the "infra" feel */}
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_85%)]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--violet)]/20 bg-[var(--violet-soft)]">
            <Sparkles className="w-4 h-4 text-[var(--violet)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--violet-strong)]">Built for AI agents &amp; AI-native apps</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-display font-bold tracking-tight leading-[1.05] max-w-3xl">
            Every tool your agent needs.<br className="hidden sm:block" /> <span className="italic text-[var(--ink)]">One key. One gateway.</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[var(--muted)] max-w-2xl">
            Callio is the API gateway for teams shipping AI agents and AI-native products. One key, MCP-native install, and {apiCount} APIs your agent can call in production from day one.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <AuthAwareCTA
              className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] transition"
            />
            <Link
              href="/mcp"
              className="px-6 py-3 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--soft)] transition font-semibold inline-flex items-center gap-2"
            >
              Install MCP server <Terminal className="w-4 h-4" />
            </Link>
          </div>



          {/* Stats row */}
          <div id="stats" className="mt-12 flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-2xl font-semibold text-[var(--ink)]">{apiCount}</div>
              <div className="text-[var(--muted)]">APIs in the catalog</div>
            </div>
            <div className="w-px bg-[var(--line)]" />
            <div>
              <div className="text-2xl font-semibold text-[var(--ink)]">1</div>
              <div className="text-[var(--muted)]">key for everything</div>
            </div>
            <div className="w-px bg-[var(--line)]" />
            <div>
              <div className="text-2xl font-semibold text-[var(--violet-strong)]">MCP-native</div>
              <div className="text-[var(--muted)]">in Cursor, Claude, Antigravity</div>
            </div>
            <div className="w-px bg-[var(--line)] hidden sm:block" />
            <div className="hidden sm:block">
              <div className="text-2xl font-semibold text-[var(--ink)]">Sandbox + prod</div>
              <div className="text-[var(--muted)]">environments built in</div>
            </div>
          </div>

          {/* Works with bar */}
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
            <span className="font-medium">Plugs into</span>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <ClaudeLogo className="w-5 h-5" />
                <span className="font-semibold text-[var(--ink)]">Claude</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <CursorLogo className="w-5 h-5" />
                <span className="font-semibold text-[var(--ink)]">Cursor</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <AntigravityLogo className="w-5 h-5" />
                <span className="font-semibold text-[var(--ink)]">Antigravity</span>
              </div>
            </div>
            <span className="text-[var(--line)]">|</span>
            <Link href="/mcp" className="hover:text-[var(--accent)] transition font-medium">All MCP setups →</Link>
          </div>

          {/* Animated Hero Diagram */}
          <div className="mt-16 w-full hidden md:block">
            <AnimatedHeroSVG />
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display">From signup to a calling agent in minutes</h2>
            <p className="mt-3 text-[var(--muted)] text-lg max-w-xl mx-auto">Three steps. No SDK sprawl, no per-API auth flows.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-2 text-6xl font-display italic text-[var(--violet)]/15 select-none group-hover:text-[var(--violet)]/30 transition">1</div>
              <div className="relative bg-[var(--page-bg)] rounded-2xl border border-[var(--line)] p-6 pt-10 h-full hover:border-[var(--violet)]/30 transition">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center mb-4">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Get one key</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Sign up, grab a Callio key (sandbox or production). One key replaces dozens of provider signups for your agent.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-2 text-6xl font-display italic text-[var(--violet)]/15 select-none group-hover:text-[var(--violet)]/30 transition">2</div>
              <div className="relative bg-[var(--page-bg)] rounded-2xl border border-[var(--line)] p-6 pt-10 h-full hover:border-[var(--violet)]/30 transition">
                <div className="w-10 h-10 rounded-lg bg-[var(--violet)] text-white flex items-center justify-center mb-4">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Install in your agent</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Drop the MCP server into Cursor, Claude, or Antigravity. Or call our HTTP proxy from any backend or agent runtime.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-2 text-6xl font-display italic text-[var(--violet)]/15 select-none group-hover:text-[var(--violet)]/30 transition">3</div>
              <div className="relative bg-[var(--page-bg)] rounded-2xl border border-[var(--line)] p-6 pt-10 h-full hover:border-[var(--violet)]/30 transition">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center mb-4">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ship to production</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Watch traffic, retries, and errors in the dashboard. Move from sandbox to production keys when you&apos;re ready.
                </p>
              </div>
            </div>
          </div>

          {/* Product Hunt Badge */}
          <div className="mt-16 flex justify-center">
            <a href="https://www.producthunt.com/products/callio-3/launches/callio-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-callio-3" target="_blank" rel="noopener noreferrer">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1083879&theme=light&t=1773491181328" alt="Callio - Connect any API with AI Agent under 1 minute | Product Hunt" width="250" height="54" />
            </a>
          </div>
        </div>
      </section>


      {/* ── Code snippet ── */}
      <section id="code-snippet" className="py-20 sm:py-24 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display">Drop into your agent stack</h2>
            <p className="mt-4 text-[var(--muted)] text-lg">
              Use it from Node, Python, Go, or directly from your agent runtime. One HTTP path, one key, every upstream you care about.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[var(--ink)]" />
                <span className="text-[var(--muted)]">Works with any language or framework</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[var(--ink)]" />
                <span className="text-[var(--muted)]">One unified proxy — just change the slug</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[var(--ink)]" />
                <span className="text-[var(--muted)]">Bring your own provider keys (BYOK)</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-[#0a0a0a] text-[#e4e4e7] p-6 font-mono text-sm leading-relaxed overflow-x-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="text-[#6b7280] mb-1"># 1. Install the SDK</div>
            <div><span className="text-[#60a5fa]">npm</span> install callio-sdk</div>

            <div className="mt-4 text-[#6b7280]"># 2. Initialize with your single Callio key</div>
            <div><span className="text-[#60a5fa]">import</span> {`{`} CallioClient {`}`} <span className="text-[#60a5fa]">from</span> <span className="text-[#34d399]">&apos;callio-sdk&apos;</span>;</div>
            <div className="mt-2"><span className="text-[#60a5fa]">const</span> callio = <span className="text-[#60a5fa]">new</span> <span className="text-[#fbbf24]">CallioClient</span>(<span className="text-[#34d399]">&apos;callio_your_api_key&apos;</span>);</div>

            <div className="mt-4 text-[#6b7280]"># 3. Call ANY API through the unified proxy</div>
            <div><span className="text-[#6b7280]">{'/* OpenAI */'}</span></div>
            <div><span className="text-[#60a5fa]">await</span> callio.<span className="text-[#fbbf24]">post</span>(<span className="text-[#34d399]">&apos;openai&apos;</span>, <span className="text-[#34d399]">&apos;v1/chat/completions&apos;</span>, {`{`}</div>
            <div className="ml-4">model: <span className="text-[#34d399]">&apos;gpt-4&apos;</span>,</div>
            <div className="ml-4">messages: [{`{`} role: <span className="text-[#34d399]">&apos;user&apos;</span>, content: <span className="text-[#34d399]">&apos;Hi!&apos;</span> {`}`}]</div>
            <div>{`}`});</div>

            <div className="mt-4 text-[#6b7280]">{'/* Same key, different API - just change the slug! */'}</div>
            <div><span className="text-[#60a5fa]">await</span> callio.<span className="text-[#fbbf24]">post</span>(<span className="text-[#34d399]">&apos;sendgrid&apos;</span>, <span className="text-[#34d399]">&apos;v3/mail/send&apos;</span>, {`{`}</div>
            <div className="ml-4">to: <span className="text-[#34d399]">&apos;user@co.com&apos;</span>, subject: <span className="text-[#34d399]">&apos;Hello&apos;</span></div>
            <div>{`}`});</div>
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section id="security" className="py-20 sm:py-24 border-t border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-5">
            <Shield className="w-3.5 h-3.5" />
            Built with Security
          </div>
          <h2 className="text-3xl sm:text-4xl font-display">Your credentials, your control</h2>
          <p className="mt-4 text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Provider keys are AES-256 encrypted at rest. Callio keys are hashed. We never store request or response data.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border border-[var(--line)] p-6">
              <Lock className="w-5 h-5 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-[var(--ink)] mb-1">Encrypted at rest</h3>
              <p className="text-sm text-[var(--muted)]">All provider credentials are AES-256-GCM encrypted before storage.</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] p-6">
              <Shield className="w-5 h-5 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-[var(--ink)] mb-1">Zero data logging</h3>
              <p className="text-sm text-[var(--muted)]">Request and response bodies pass through — we only log metadata.</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] p-6">
              <Gauge className="w-5 h-5 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-[var(--ink)] mb-1">Built-in rate limits</h3>
              <p className="text-sm text-[var(--muted)]">Per-plan quotas and real-time usage monitoring from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MCP Setup ── */}
      <section id="mcp-setup" className="py-20 sm:py-24 bg-[#0a0a0a] text-white border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                MCP Server
              </div>
              <h2 className="text-3xl sm:text-4xl font-display">Connect Antigravity, Cursor &amp; more</h2>
              <p className="mt-4 text-[#a1a1aa] text-lg">
                Install the MCP server and your AI agent gets instant access to {apiCount} APIs through the same unified gateway.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { tool: 'Antigravity', path: 'MCP Settings panel' },
                  { tool: 'Cursor', path: '.cursor/mcp.json' },
                  { tool: 'Claude Code', path: '~/.claude/claude_desktop_config.json' },
                ].map((t) => (
                  <div key={t.tool} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-white font-medium">{t.tool}</span>
                    <span className="text-[#6b7280]">→</span>
                    <code className="text-[#a1a1aa] text-xs">{t.path}</code>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/mcp"
                  className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition inline-flex items-center gap-2"
                >
                  Setup guide <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://github.com/hmadhsan/callio-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full border border-[#333] text-[#a1a1aa] hover:text-white hover:border-[#555] transition font-semibold inline-flex items-center gap-2"
                >
                  View source <Terminal className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-[#141414] border border-[#222] p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#222]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[#555] text-xs">mcp config</span>
              </div>
              <div className="text-[#6b7280]">{`{`}</div>
              <div className="ml-4"><span className="text-[#60a5fa]">&quot;mcpServers&quot;</span>: {`{`}</div>
              <div className="ml-8"><span className="text-[#60a5fa]">&quot;callio&quot;</span>: {`{`}</div>
              <div className="ml-12"><span className="text-[#60a5fa]">&quot;command&quot;</span>: <span className="text-[#34d399]">&quot;npx&quot;</span>,</div>
              <div className="ml-12"><span className="text-[#60a5fa]">&quot;args&quot;</span>: [<span className="text-[#34d399]">&quot;-y&quot;</span>, <span className="text-[#34d399]">&quot;github:hmadhsan/callio-mcp&quot;</span>],</div>
              <div className="ml-12"><span className="text-[#60a5fa]">&quot;env&quot;</span>: {`{`}</div>
              <div className="ml-16"><span className="text-[#60a5fa]">&quot;CALLIO_API_KEY&quot;</span>: <span className="text-[#fbbf24]">&quot;callio_your_key&quot;</span></div>
              <div className="ml-12">{`}`}</div>
              <div className="ml-8">{`}`}</div>
              <div className="ml-4">{`}`}</div>
              <div className="text-[#6b7280]">{`}`}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── API Showcase ── */}
      <section id="apis" className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display">A catalog tuned for agents</h2>
            <p className="mt-3 text-[var(--muted)] text-lg max-w-xl mx-auto">
              The categories agents actually need: search, comms, data, payments, identity, AI tooling, and more, all behind one key.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {API_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="group rounded-xl border border-[var(--line)] bg-[var(--page-bg)] hover:border-[var(--accent)] hover:shadow-md transition p-5 cursor-default"
              >
                <cat.icon className="w-6 h-6 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-sm">{cat.name}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">{cat.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--muted)] mt-8">
            And many more. New APIs added every week.
          </p>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-20 sm:py-24 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display">Built for teams shipping AI</h2>
            <p className="mt-3 text-[var(--muted)] text-lg">Wherever your agent runs, Callio is the one external API surface in front of it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Agent builders</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Give your agent search, comms, data, payments, and more without writing a new client and auth flow for every provider.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center mb-5">
                <Rocket className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-native startups</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Ship faster with one gateway in front of every external API your product depends on. Skip the integration backlog.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--violet)]/30 bg-white p-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--violet)]/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-[var(--violet-soft)] flex items-center justify-center mb-5">
                  <Workflow className="w-6 h-6 text-[var(--violet-strong)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  Devs in Cursor &amp; Claude
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--violet-strong)] bg-[var(--violet-soft)] px-2 py-0.5 rounded-full">MCP</span>
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Install our MCP server once and your editor or assistant can hit {apiCount} APIs through Callio with the same key.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-display text-center mb-10">Frequently asked questions</h2>
          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>



      {/* ── Contact Us ── */}
      <section id="contact" className="py-20 sm:py-24 bg-[var(--accent)] text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display">Get in touch</h2>
          <p className="mt-4 text-white/70 text-lg">
            Have questions, feedback, or want to list your API? We&apos;d love to hear from you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Us
            </Link>
            <AuthAwareCTA
              className="px-8 py-3.5 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="footer" className="py-12 bg-[#0a0a0a] text-[#a1a1aa]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="10" fill="#fff" />
                  <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12c2.1 0 4.08-.54 5.8-1.49" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="28" cy="14" r="3" fill="#0a0a0a" />
                </svg>
                <span className="text-white font-semibold">Callio</span>
              </div>
              <p className="text-sm max-w-xs">The API gateway for AI agents. One unified interface to discover, authenticate, and call {apiCount} APIs.</p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Product</div>
                <div className="space-y-2">
                  <Link href="/browse" className="block hover:text-white transition">Browse APIs</Link>
                  <Link href="/pricing" className="block hover:text-white transition">Pricing</Link>
                  <Link href="/how-it-works" className="block hover:text-white transition">How it works</Link>
                  <Link href="/mcp" className="block hover:text-white transition">MCP Server</Link>
                  <Link href="/docs" className="block hover:text-white transition">Docs</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Account</div>
                <div className="space-y-2">
                  <Link href="/signup" className="block hover:text-white transition">Sign Up</Link>
                  <Link href="/login" className="block hover:text-white transition">Log In</Link>
                  <Link href="/dashboard" className="block hover:text-white transition">Dashboard</Link>
                  <Link href="/keys" className="block hover:text-white transition">API Keys</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Company</div>
                <div className="space-y-2">
                  <a href="#contact" className="block hover:text-white transition">Contact</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>&copy; 2026 Callio. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="https://x.com/ai_callio" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">X / Twitter</a>
              <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
