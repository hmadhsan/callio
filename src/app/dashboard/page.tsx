import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Code2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const apis = await prisma.api.findMany({
    where: { providerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
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
          <Link href="/dashboard/new" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            + New API
          </Link>
        </div>
      </nav>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Your APIs</h1>
          <p className="text-gray-600 mb-8">Manage your marketplace listings.</p>

          {apis.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-600 mb-4">No APIs yet.</p>
              <Link
                href="/dashboard/new"
                className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              >
                Create your first API
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apis.map((api) => (
                <div key={api.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-3">{api.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{api.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{api.shortDescription}</p>
                  <Link href={`/skills/callio/${api.slug}`} className="text-sm text-blue-600 hover:text-blue-700">
                    View listing
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
