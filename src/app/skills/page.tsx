import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { getAllApis } from '@/lib/apiService';
import { getCurrentUser } from '@/lib/auth';

export default async function SkillsPage() {
  const allApis = await getAllApis();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
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
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
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

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Available Skills</h1>
          <p className="text-gray-700 mb-12 text-lg">Browse all available APIs and skills you can use.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allApis.map((api) => (
              <Link 
                key={api.id}
                href={`/skills/${api.slug}`}
                className="group p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{api.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{api.name}</h3>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{api.shortDescription}</p>
                <span className="text-sm text-blue-600 font-medium group-hover:underline">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
