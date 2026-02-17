import { ChevronRight, Code2, Zap, Lock, GitBranch, Terminal, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedApis } from '@/lib/apiService';
import BetaSignupForm from '@/components/BetaSignupForm';

export default async function Home() {
  const featuredApis = await getFeaturedApis();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold">Callio</span>
          </div>
          <div className="text-xs text-gray-500">
            Early Access Beta
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
                  <div className="text-2xl font-bold text-gray-900">50+</div>
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

      {/* Featured APIs Section */}
      <section className="border-t border-gray-200 py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured APIs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the most popular API integrations on Callio. Add any to your agent in minutes.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredApis.map((api) => (
              <Link key={api.id} href={`/skills/callio/${api.slug}`}>
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition cursor-pointer group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition">
                    {api.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{api.name}</h3>
                  <p className="text-sm text-gray-600">{api.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/skills/callio">
              <button className="px-6 py-2 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition">
                Browse All 50+ APIs
              </button>
            </Link>
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

      <BetaSignupForm />

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
