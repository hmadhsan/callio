import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Code2, Zap, BookOpen, Key } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const userKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
  });

  const apis = await prisma.api.findMany({
    where: { providerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const primaryKey = userKeys[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
            <Link href="/keys" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
              My Keys
            </Link>
            <Link 
              href="/api/auth/logout" 
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sign out
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Get Started</h1>
            <p className="text-lg text-gray-600">Start using APIs in your AI agent.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Setup */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Quick Setup</h2>

              {/* Step 1: API Key */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold mb-2">Your Callio API Key</h3>
                    <p className="text-sm text-gray-600 mb-4">Use this key to authenticate with the Callio proxy in your agent.</p>
                    {primaryKey ? (
                      <div className="bg-gray-100 p-3 rounded font-mono text-xs break-all">
                        {`callio_••••••••••••${primaryKey.keyLast4}`}
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-3 rounded text-sm text-gray-600">
                        No API keys generated yet. Visit My Keys to create one.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Connect Providers */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold mb-2">Connect Your API Providers</h3>
                    <p className="text-sm text-gray-600 mb-4">Add credentials for APIs you want to use (OpenAI, Stripe, SendGrid, etc.)</p>
                    <Link 
                      href="/keys"
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                    >
                      Go to My Keys
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 3: Browse APIs */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold mb-2">Explore Available APIs</h3>
                    <p className="text-sm text-gray-600 mb-4">Browse our marketplace of pre-configured APIs and start using them right away.</p>
                    <Link 
                      href="/browse"
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                    >
                      Browse APIs
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Can Do */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">What you can do</h2>
              
              <div className="space-y-4">
                <Link
                  href="/keys"
                  className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 transition group"
                >
                  <Key className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">My API Keys</div>
                    <div className="text-xs text-gray-500">View and manage your keys</div>
                  </div>
                </Link>

                <Link
                  href="/browse"
                  className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 transition group"
                >
                  <Zap className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Browse APIs</div>
                    <div className="text-xs text-gray-500">Explore all available APIs</div>
                  </div>
                </Link>

                <Link
                  href="/docs"
                  className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 transition group"
                >
                  <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Documentation</div>
                    <div className="text-xs text-gray-500">Learn how to use Callio</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Your APIs Section */}
          {apis.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Your Listed APIs</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {apis.map((api) => (
                  <div key={api.id} className="p-6 bg-white border border-gray-200 rounded-lg">
                    <div className="text-3xl mb-3">{api.icon}</div>
                    <h3 className="font-semibold text-lg mb-1">{api.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{api.shortDescription}</p>
                    <Link href={`/skills/${api.slug}`} className="text-sm text-blue-600 hover:text-blue-700">
                      View listing
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
