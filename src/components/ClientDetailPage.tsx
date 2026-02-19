'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, ExternalLink, Code2, Zap, Lock, Globe, Play } from 'lucide-react';
import AddToAgentButton from '@/components/AddToAgentButton';
import ProviderKeyForm from '@/components/ProviderKeyForm';
import CodeExamples from '@/components/CodeExamples';
import ApiPlayground from '@/components/ApiPlayground';

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  parameters: Parameter[];
}

interface ApiInfo {
  slug: string;
  name: string;
  icon: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  useCases: string[];
  documentation?: string;
  authentication: string;
  rateLimit: string;
  pricing: string;
  webhook: boolean;
  baseUrl?: string;
  allowUnauthenticated?: boolean;
  setupGuide?: string;
  setupUrl?: string;
}

interface ClientDetailPageProps {
  api: ApiInfo;
  endpoints: Endpoint[];
}

export default function ClientDetailPage({ api, endpoints }: ClientDetailPageProps) {
  const [showPlayground, setShowPlayground] = useState(false);

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

      {/* Back Link */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/skills/callio"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All APIs
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{api.icon}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{api.name}</h1>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {api.category}
                  </span>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-6">{api.shortDescription}</p>
              <p className="text-gray-700 leading-relaxed">{api.fullDescription}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 w-full md:w-80 flex-shrink-0 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Details</h3>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Auth Type</div>
                    <div className="text-gray-600 text-xs">{api.authentication}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Rate Limit</div>
                    <div className="text-gray-600 text-xs">{api.rateLimit}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Pricing</div>
                    <div className="text-gray-600 text-xs">{api.pricing}</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2">
                {endpoints.length > 0 && (
                  <button
                    onClick={() => setShowPlayground(true)}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Try It
                  </button>
                )}
                <AddToAgentButton apiSlug={api.slug} />
                {api.documentation && (
                  <a
                    href={api.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm"
                  >
                    Full Docs <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Provider Key Form - For BYOK integration */}
              {!api.allowUnauthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <ProviderKeyForm apiSlug={api.slug} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Setup Guide - Show for APIs that require credentials */}
      {!api.allowUnauthenticated && api.setupGuide && (
        <section className="border-b border-orange-200 bg-orange-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  {api.authentication}
                </h3>
                <p className="text-orange-800 whitespace-pre-wrap mb-4">{api.setupGuide}</p>
                {api.setupUrl && (
                  <a
                    href={api.setupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
                  >
                    Get API Credentials <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Public API Badge - Show for APIs that don't require authentication */}
      {api.allowUnauthenticated && (
        <section className="border-b border-green-200 bg-green-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">
                ✓ This is a public API - No credentials needed! Try it right now in the playground.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Installation Section - SIMPLIFIED */}
      <section className="border-b border-gray-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Getting Started</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Try It Instantly</h3>
                <p className="text-gray-600 text-sm">Click "Try It" above to test the API in the playground</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Add to Your Agent</h3>
                <p className="text-gray-600 text-sm">Click "Add to Agent" to get your API key and integrate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Common Use Cases</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {api.useCases.map((useCase, idx) => (
              <div key={idx} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">💻 Code Examples</h2>
          <p className="text-gray-700 mb-6">Get started quickly with these code examples in your favorite language</p>
          <CodeExamples apiSlug={api.slug} baseUrl={api.baseUrl} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to integrate {api.name}?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Test endpoints live or generate your API key and start building in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AddToAgentButton apiSlug={api.slug} />
            {endpoints.length > 0 && (
              <button
                onClick={() => setShowPlayground(true)}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Try API Live
              </button>
            )}
            <Link
              href="/skills/callio"
              className="px-8 py-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition text-center"
            >
              Browse More APIs
            </Link>
          </div>
        </div>
      </section>

      {/* API Playground Modal */}
      {showPlayground && (
        <ApiPlayground
          apiSlug={api.slug}
          endpoints={endpoints}
          baseUrl={api.baseUrl || ''}
          onClose={() => setShowPlayground(false)}
        />
      )}
    </div>
  );
}
