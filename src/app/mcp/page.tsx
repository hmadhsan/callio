import Link from 'next/link';
import { Terminal, Copy, Zap, ArrowRight, Check, Box, Cpu, Sparkles } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';
import { ClaudeLogo, CursorLogo, AntigravityLogo } from '@/components/BrandLogos';

export default function McpPage() {
  const configJson = `{
  "mcpServers": {
    "callio": {
      "command": "npx",
      "args": ["-y", "github:hmadhsan/callio/mcp-server"],
      "env": {
        "CALLIO_API_KEY": "callio_your_key_here"
      }
    }
  }
}`;

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/docs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Docs</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 border-b border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Model Context Protocol
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Connect your AI agent to 50+ APIs
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8">
            Install the Callio MCP server and give Claude Code, Cursor, Antigravity, or any MCP-compatible agent instant access to the entire API ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] transition inline-flex items-center gap-2"
            >
              Get API Key <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/hmadhsan/callio/tree/main/mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--soft)] transition font-semibold inline-flex items-center gap-2"
            >
              View on GitHub <Terminal className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Compatible tools */}
      <section className="py-16 border-b border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            Works with your favorite AI tools
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[var(--line)] p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <ClaudeLogo className="w-12 h-12 rounded-xl" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Claude Code</h3>
              <p className="text-sm text-[var(--muted)] mb-2">Anthropic&apos;s coding agent</p>
              <code className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded">~/.claude/claude_desktop_config.json</code>
            </div>
            <div className="bg-white rounded-xl border border-[var(--line)] p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <CursorLogo className="w-10 h-10" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Cursor</h3>
              <p className="text-sm text-[var(--muted)] mb-2">AI-powered code editor</p>
              <code className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded">.cursor/mcp.json</code>
            </div>
            <div className="bg-white rounded-xl border border-[var(--line)] p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <AntigravityLogo className="w-12 h-12 rounded-xl" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Antigravity</h3>
              <p className="text-sm text-[var(--muted)] mb-2">AI development platform</p>
              <code className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded">MCP Settings</code>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-16 border-b border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-display)' }}>
            Setup in 2 minutes
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Get your Callio API key</h3>
                <p className="text-[var(--muted)] text-sm mb-3">
                  Sign up at callio.dev and generate an API key from your dashboard.
                </p>
                <Link
                  href="/keys"
                  className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                >
                  Go to API Keys <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Add to your AI tool config</h3>
                <p className="text-[var(--muted)] text-sm mb-4">
                  Copy this JSON into your MCP configuration file. Replace the API key with your own.
                </p>
                <div className="bg-[#1a1a1a] rounded-xl p-5 overflow-x-auto relative group">
                  <pre className="text-green-400 text-sm font-mono leading-relaxed">{configJson}</pre>
                </div>
                <div className="mt-3 text-xs text-[var(--muted)] space-y-1">
                  <p><strong>Claude Code:</strong> <code className="bg-[var(--soft)] px-1.5 py-0.5 rounded">~/.claude/claude_desktop_config.json</code></p>
                  <p><strong>Cursor:</strong> <code className="bg-[var(--soft)] px-1.5 py-0.5 rounded">.cursor/mcp.json</code></p>
                  <p><strong>Antigravity:</strong> MCP Settings panel</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Start using APIs</h3>
                <p className="text-[var(--muted)] text-sm mb-3">
                  Your agent now has 3 powerful tools. Just ask in natural language:
                </p>
                <div className="space-y-2">
                  {[
                    '"Search for email APIs on Callio"',
                    '"What endpoints does the Stripe API have?"',
                    '"Get post #1 from JSONPlaceholder through Callio"',
                    '"Search for AI companies using Apollo API"',
                  ].map((example) => (
                    <div key={example} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--ink)] italic">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tools */}
      <section className="py-16 border-b border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            3 tools, unlimited power
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[var(--line)] p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Box className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">search_apis</h3>
              <p className="text-sm text-[var(--muted)]">Discover and browse 50+ APIs by name, category, or description.</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--line)] p-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-semibold mb-1">get_api_info</h3>
              <p className="text-sm text-[var(--muted)]">Get full details — endpoints, parameters, examples, auth info.</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--line)] p-6">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">call_api</h3>
              <p className="text-sm text-[var(--muted)]">Execute any API call. Auth, rate limits, and routing all handled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to supercharge your agent?
          </h2>
          <p className="text-[var(--muted)] mb-8">
            Get started in under 2 minutes. Free tier includes 100 API calls/month.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] transition inline-flex items-center gap-2 text-lg"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
