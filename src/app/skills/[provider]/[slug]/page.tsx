import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, ExternalLink, Code2, Zap, Lock, Globe } from 'lucide-react';
import { getApiBySlug, getAllApis } from '@/lib/apiService';
import AddToAgentButton from '@/components/AddToAgentButton';

export async function generateStaticParams() {
  try {
    if (!process.env.DATABASE_URL) {
      return [];
    }

    const apis = await getAllApis();
    return apis.map((api) => ({
      provider: 'callio',
      slug: api.slug,
    }));
  } catch {
    return [];
  }
}

type SkillParams = { provider: string; slug: string };

export default async function SkillDetailPage({ params }: { params: SkillParams | Promise<SkillParams> }) {
  const resolvedParams = await Promise.resolve(params);

  if (resolvedParams.provider !== 'callio') {
    notFound();
  }

  const api = await getApiBySlug(resolvedParams.slug);

  if (!api) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <Link href="/" className="text-lg font-bold hover:text-blue-600 transition">
              Callio
            </Link>
          </div>
          <div className="text-xs text-gray-500">API Marketplace</div>
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

            <div className="bg-white border border-gray-200 rounded-lg p-6 w-full md:w-80 flex-shrink-0">
              <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Authentication</div>
                    <div className="text-gray-600">{api.authentication}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Rate Limit</div>
                    <div className="text-gray-600">{api.rateLimit}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Webhook Support</div>
                    <div className="text-gray-600">{api.webhook ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="text-sm font-medium text-gray-900 mb-2">Pricing</div>
                <div className="text-sm text-gray-600 mb-4">{api.pricing}</div>
              </div>

              <AddToAgentButton apiSlug={api.slug} />
              {api.documentation && (
                <a
                  href={api.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full px-4 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  View Docs <ExternalLink className="w-4 h-4" />
                </a>
              )}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to integrate {api.name}?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Generate your API key and start building in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AddToAgentButton apiSlug={api.slug} />
            <Link
              href="/skills/callio"
              className="px-8 py-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition text-center"
            >
              Browse More APIs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}