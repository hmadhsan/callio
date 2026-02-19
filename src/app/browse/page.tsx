import Link from 'next/link';
import { Code2, Search } from 'lucide-react';
import { getAllApis } from '@/lib/apiService';

export default async function BrowseAPIsPage() {
  const apis = await getAllApis();
  const categories = Array.from(new Set(apis.map((api) => api.category)));

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
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-blue-50/40 to-transparent py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse All APIs</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover {apis.length}+ APIs ready to integrate with your AI agents. Filter by category or search to find the perfect integration.
          </p>

          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search APIs..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              All APIs ({apis.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* API Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <Link key={api.id} href={`/skills/callio/${api.slug}`}>
                <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-lg transition cursor-pointer group h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl group-hover:scale-110 transition">{api.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{api.name}</h3>
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {api.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{api.shortDescription}</p>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Auth: {api.authentication.split('(')[0].trim()}</span>
                      <span>{api.webhook ? '🔔 Webhooks' : ''}</span>
                    </div>
                    <div className="text-xs text-gray-500">{api.endpointsCount} endpoints</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see your API?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Submit your API to the Callio marketplace and reach thousands of AI agents.
          </p>
          <Link
            href="/login"
            className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            List Your API
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/browse" className="hover:text-gray-900">
                    APIs
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    API Status
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2026 Callio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
