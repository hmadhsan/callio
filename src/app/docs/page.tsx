import Link from 'next/link';
import { Terminal, Key, ArrowRight, Layers, Zap, Shield, Code2 } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Documentation</h1>
        <p className="text-[var(--muted)] text-lg mb-10">Everything you need to get started with Callio.</p>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Start
          </h2>
          <div className="bg-white rounded-xl border border-[var(--line)] p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. Create an account</h3>
              <p className="text-[var(--muted)] text-sm mb-3">Sign up at callio.dev to get access to the dashboard and API key management.</p>
              <Link href="/signup" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                Create account <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Generate an API key</h3>
              <p className="text-[var(--muted)] text-sm mb-3">Go to your dashboard and generate a Callio API key. This single key works across all APIs.</p>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <code className="text-green-400 text-xs font-mono">callio_a1b2c3d4e5f6...</code>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Make your first API call</h3>
              <p className="text-[var(--muted)] text-sm mb-3">Use your key to call any API through the Callio proxy:</p>
              <div className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`curl -X GET "https://callio.dev/api/proxy/jsonplaceholder/posts/1" \\
  -H "Authorization: Bearer callio_your_key_here"`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Authentication
          </h2>
          <div className="bg-white rounded-xl border border-[var(--line)] p-6 space-y-4">
            <p className="text-[var(--muted)] text-sm">
              All API requests through Callio are authenticated using your Callio API key. Pass it as a Bearer token in the Authorization header:
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <pre className="text-green-400 text-xs font-mono">Authorization: Bearer callio_your_key_here</pre>
            </div>
            <p className="text-[var(--muted)] text-sm">
              For APIs that require provider authentication (e.g., Stripe, OpenAI), save your provider API key in the API detail page. Callio will automatically attach it when proxying your requests.
            </p>
          </div>
        </section>

        {/* Proxy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            API Proxy
          </h2>
          <div className="bg-white rounded-xl border border-[var(--line)] p-6 space-y-4">
            <p className="text-[var(--muted)] text-sm">
              Callio acts as a proxy between your application and upstream APIs. The proxy URL pattern is:
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <pre className="text-green-400 text-xs font-mono">https://callio.dev/api/proxy/{'<api-slug>'}{'/<path>'}</pre>
            </div>
            <p className="text-[var(--muted)] text-sm">For APIs with custom base URLs, you can also use the forwarding mode:</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <pre className="text-green-400 text-xs font-mono">
{`https://callio.dev/api/proxy/<api-slug>/forward?target=<encoded-url>`}
              </pre>
            </div>

            <h3 className="font-semibold mt-4">Supported methods</h3>
            <div className="flex gap-2 flex-wrap">
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
                <span key={method} className="text-xs font-mono bg-[var(--soft)] px-2.5 py-1 rounded-md">{method}</span>
              ))}
            </div>

            <h3 className="font-semibold mt-4">Response headers</h3>
            <p className="text-[var(--muted)] text-sm">Callio proxy responses include these headers:</p>
            <ul className="text-sm text-[var(--muted)] space-y-1 list-disc list-inside">
              <li><code className="text-xs font-mono bg-[var(--soft)] px-1 rounded">x-callio-proxy: true</code></li>
              <li><code className="text-xs font-mono bg-[var(--soft)] px-1 rounded">x-callio-api: {'<slug>'}</code></li>
              <li><code className="text-xs font-mono bg-[var(--soft)] px-1 rounded">x-callio-upstream-status: {'<status>'}</code></li>
            </ul>
          </div>
        </section>

        {/* Agent Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Agent Integration
          </h2>
          <div className="bg-white rounded-xl border border-[var(--line)] p-6 space-y-4">
            <p className="text-[var(--muted)] text-sm">
              Give your AI agent access to any API in the Callio marketplace. Use the &quot;Add to Agent&quot; button on any API page, or configure manually:
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs font-mono">
{`{
  "callio": {
    "api_key": "callio_your_key_here",
    "proxy_url": "https://callio.dev/api/proxy"
  }
}`}
              </pre>
            </div>
            <p className="text-[var(--muted)] text-sm">Your agent can then call any API through the proxy endpoint with the single key.</p>
          </div>
        </section>

        {/* SDKs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Code Examples
          </h2>
          <div className="bg-white rounded-xl border border-[var(--line)] p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Python</h3>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <pre className="text-green-400 text-xs font-mono">
{`import requests

headers = {"Authorization": "Bearer callio_your_key"}
response = requests.get(
    "https://callio.dev/api/proxy/jsonplaceholder/posts/1",
    headers=headers
)
print(response.json())`}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">JavaScript</h3>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <pre className="text-green-400 text-xs font-mono">
{`const response = await fetch(
  "https://callio.dev/api/proxy/jsonplaceholder/posts/1",
  { headers: { Authorization: "Bearer callio_your_key" } }
);
const data = await response.json();
console.log(data);`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center py-8 border-t border-[var(--line)]">
          <p className="text-[var(--muted)] text-sm">Need help? Contact us at <a href="mailto:founders@callio.dev" className="text-[var(--accent)] hover:underline">founders@callio.dev</a></p>
        </div>
      </div>
    </div>
  );
}
