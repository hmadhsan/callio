import { ChevronRight, Code2, Zap, Lock, GitBranch, Terminal, Github, Twitter, Key } from 'lucide-react';
import Link from 'next/link';
import { getAllApis } from '@/lib/apiService';
import BetaSignupForm from '@/components/BetaSignupForm';
import WaitlistForm from '@/components/WaitlistForm';
import { cookies } from 'next/headers';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import SkillsApisTabs from '@/components/SkillsApisTabs';

export default async function Home() {
  const allApis = await getAllApis();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">Callio</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/skills" 
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                Skills
              </Link>
              <Link 
                href="/browse" 
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                APIs
              </Link>
              <Link 
                href="/docs" 
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                Docs
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  href="/keys" 
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  My Keys
                </Link>
                <Link 
                  href="/api/auth/logout" 
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup" 
                  className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center">
            <div className="inline-block mb-4 px-3 py-1 bg-blue-100 rounded-full border border-blue-200">
              <span className="text-sm font-semibold text-blue-700">The API Marketplace for Agents</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Your APIs,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Everywhere Agents Need Them
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Make your APIs discoverable and executable by AI agents. Callio turns any REST API into an agent-ready integration that agents can find, understand, and use automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105">
                  List Your API
                </button>
              </Link>
              <Link href="/skills/callio">
                <button className="px-6 sm:px-8 py-3 sm:py-4 border border-gray-300 hover:border-gray-400 text-gray-900 font-semibold rounded-lg transition bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-2">
                  Browse APIs <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by AI builders</p>
              <div className="flex justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{allApis.length}</div>
                  <div className="text-xs text-gray-600">APIs Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1000s</div>
                  <div className="text-xs text-gray-600">Agents Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24h</div>
                  <div className="text-xs text-gray-600">Setup Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills and APIs Tabs */}
      <SkillsApisTabs apis={allApis.map(api => ({
        id: api.id,
        name: api.name,
        slug: api.slug,
        icon: api.icon,
        description: api.shortDescription,
        category: api.category
      }))} />

      {/* Quick Start Guide */}
      <section className="border-t border-gray-200 py-20 bg-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get Started in 30 Seconds</h2>
            <p className="text-lg text-gray-600">Three simple steps to access any API</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sign Up Free</h3>
              <p className="text-gray-600">Create your account and get your Callio API key instantly</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Pick an API</h3>
              <p className="text-gray-600">Browse our marketplace and choose from 50+ APIs</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Start Calling</h3>
              <p className="text-gray-600">Use your Callio key to call any API through our proxy</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-600">EXAMPLE REQUEST</span>
            </div>
            <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm">
{`curl -X GET \\
  'https://callio.app/api/proxy/search-discovery/search?q=AI' \\
  -H 'Authorization: Bearer YOUR_CALLIO_KEY'`}
            </pre>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">One key. All APIs. Zero complexity.</p>
              <Link 
                href="/docs" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View Docs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For API Providers */}
      <section className="border-t border-gray-200 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">For API Providers</h2>
              <p className="text-lg text-gray-600 mb-8">
                Turn your REST API into an AI-ready integration in three simple steps.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Provide OpenAPI Spec</h3>
                    <p className="text-sm text-gray-600">Upload your OpenAPI specification or let us auto-generate one</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Callio Generates Schema</h3>
                    <p className="text-sm text-gray-600">We create an AI-optimized schema with natural language descriptions</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Go Live</h3>
                    <p className="text-sm text-gray-600">Agents discover and start using your API automatically</p>
                  </div>
                </div>
              </div>

              <Link href="/login">
                <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                  List Your API
                </button>
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="bg-gray-100 h-64 rounded flex items-center justify-center text-gray-400 mb-6">
                <div className="text-center">
                  <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">API Configuration Dashboard</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Marketplace Flow */}
      <section className="border-t border-gray-200 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How the Marketplace Works</h2>
            <p className="text-lg text-gray-600">From API provider to agent execution in minutes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Provider Side */}
            <div>
              <h3 className="text-xl font-bold mb-8 text-gray-900">For API Providers</h3>
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Submit OpenAPI Spec</h4>
                      <p className="text-sm text-gray-600 mt-1">Upload your API documentation and authentication details</p>
                    </div>
                  </div>
                  <div className="absolute left-3.5 top-12 w-0.5 h-8 bg-gray-200"></div>
                </div>

                <div className="relative">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Schema Generation</h4>
                      <p className="text-sm text-gray-600 mt-1">Callio auto-generates AI-optimized schema with natural language descriptions</p>
                    </div>
                  </div>
                  <div className="absolute left-3.5 top-12 w-0.5 h-8 bg-gray-200"></div>
                </div>

                <div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Go Live</h4>
                      <p className="text-sm text-gray-600 mt-1">Your API is instantly discoverable by AI agents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Side */}
            <div>
              <h3 className="text-xl font-bold mb-8 text-gray-900">For AI Agents</h3>
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Browse Marketplace</h4>
                      <p className="text-sm text-gray-600 mt-1">Search and filter APIs by capability, category, or use case</p>
                    </div>
                  </div>
                  <div className="absolute left-3.5 top-12 w-0.5 h-8 bg-gray-200"></div>
                </div>

                <div className="relative">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Select & Integrate</h4>
                      <p className="text-sm text-gray-600 mt-1">One-click integration adds API to your agent's toolkit</p>
                    </div>
                  </div>
                  <div className="absolute left-3.5 top-12 w-0.5 h-8 bg-gray-200"></div>
                </div>

                <div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Automatic Execution</h4>
                      <p className="text-sm text-gray-600 mt-1">Agent automatically handles schema, auth, and response handling</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Demo Section */}
      <section className="border-t border-gray-200 py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See Callio in Action
            </h2>
            <p className="text-lg text-gray-600">
              Watch how agents interact with your API through Callio
            </p>
          </div>

          {/* Interactive Demo - Book Style */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Code Example */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-sm ml-4 font-mono">terminal.js</span>
              </div>
              <div className="p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                <div className="mb-2">
                  <span className="text-gray-500">{'>'} </span>
                  <span className="text-green-400">curl</span>
                  <span className="text-gray-300"> \\</span>
                </div>
                <div className="ml-4 mb-2">
                  <span className="text-gray-300">-H </span>
                  <span className="text-orange-400">'Authorization: Bearer callio_...'</span>
                  <span className="text-gray-300"> \\</span>
                </div>
                <div className="ml-4 mb-4">
                  <span className="text-gray-300">-X GET </span>
                  <span className="text-blue-400">'https://callio.app/api/proxy/search-discovery/search'</span>
                </div>

                <div className="mb-4 text-green-400">
                  {'{'} <span className="text-orange-400">"query"</span>: <span className="text-yellow-400">"machine learning"</span> {'}'}
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="text-green-400 mb-2">
                    HTTP/1.1 200 OK
                  </div>
                  <div className="text-gray-400 text-xs mb-3">
                    content-type: application/json
                  </div>
                  <div className="text-green-400">
                    {'{'}
                  </div>
                  <div className="ml-4 text-gray-300">
                    <div><span className="text-orange-400">"results"</span>: [</div>
                    <div className="ml-4">
                      <div className="mb-1">{'{'}
                        <span className="text-orange-400">"title"</span>: <span className="text-yellow-400">"Deep Learning...",</span>
                      </div>
                      <div><span className="text-orange-400">"url"</span>: <span className="text-yellow-400">"..."</span> {'}'},</div>
                    </div>
                    <div>],</div>
                    <div><span className="text-orange-400">"total"</span>: <span className="text-blue-400">1250</span></div>
                  </div>
                  <div className="text-green-400">
                    {'}'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Unified API Gateway
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                One authentication method. One request format. Access hundreds of APIs without learning different SDKs or managing multiple API keys.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Single API Key</h4>
                    <p className="text-gray-600 text-sm">One Callio key gives you access to all APIs in the marketplace</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Unified Proxy</h4>
                    <p className="text-gray-600 text-sm">All requests go through the same endpoint - no learning curve</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Agent Ready</h4>
                    <p className="text-gray-600 text-sm">AI agents can automatically discover and use any API</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Key Benefit:</strong> Agents don't need custom code for each API. They understand Callio's unified interface and can handle any API automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="border-t border-gray-200 py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
            Join Our Early Access Program
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Be among the first to access Callio. Limited spots available for API providers and AI builders.
          </p>
          <div>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-gray-200 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-base">
            Currently onboarding early API providers and AI builders.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-semibold">Callio</span>
            </div>

            <div className="flex gap-8 items-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Contact
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Privacy Policy
              </a>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-xs text-gray-600">
            <p>&copy; 2026 Callio. Building the API marketplace for agents.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
