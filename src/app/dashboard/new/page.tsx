import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Code2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import ApiCreateForm from '@/components/ApiCreateForm';

export default async function NewApiPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
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
            <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Back to dashboard
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Submit a new API</h1>
          <p className="text-gray-600 mb-8">Upload OpenAPI JSON to auto-generate endpoints.</p>
          <ApiCreateForm />
        </div>
      </section>
    </div>
  );
}
