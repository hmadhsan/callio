import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Code2, Link2 } from 'lucide-react';
import KeyTableRow from '@/components/KeyTableRow';
import GenerateKeyForm from '@/components/GenerateKeyForm';

export default async function KeysPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    redirect('/login');
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">API Keys</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-gray-900">API Keys</h1>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Personal</span>
            </div>
            <p className="text-gray-600">Manage your personal API keys for programmatic access to Callio</p>
          </div>
        </div>

        {/* Generate New Key Form */}
        <GenerateKeyForm />

        {/* Keys Table or Empty State */}
        {apiKeys.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <Link2 className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No API Keys</h2>
            <p className="text-gray-600 mb-6">Generate your first API key to start using the Callio API.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">API Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <KeyTableRow key={apiKey.id} apiKey={apiKey} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
