import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Key, ExternalLink, Trash2 } from 'lucide-react';

export default async function KeysPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    redirect('/login');
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    include: {
      api: {
        select: {
          name: true,
          slug: true,
          icon: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-purple-600 hover:text-purple-700 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My API Keys
          </h1>
          <p className="text-gray-600">
            Manage your generated API keys for installed agents
          </p>
        </div>

        {/* Keys List */}
        {apiKeys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No API Keys Yet</h2>
            <p className="text-gray-600 mb-6">
              Browse the marketplace and click "Add to Agent" to generate your first API key
            </p>
            <Link 
              href="/skills/callio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse APIs
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <div 
                key={apiKey.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* API Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {apiKey.api.icon}
                    </div>

                    {/* API Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {apiKey.api.name}
                      </h3>
                      
                      {/* Key Display */}
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-gray-100 px-3 py-1 rounded border border-gray-200 font-mono">
                          callio_••••••••{apiKey.keyLast4}
                        </code>
                        <span className="text-xs text-gray-500">
                          Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        href={`/skills/callio/${apiKey.api.slug}`}
                        className="text-sm text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                      >
                        View API details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Actions */}
                  <form action={`/api/keys/${apiKey.id}/delete`} method="POST">
                    <button
                      type="submit"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Revoke this API key"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Security Note</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• API keys are shown only once when generated - save them securely</li>
            <li>• Keys are hashed and stored securely in the database</li>
            <li>• Revoking a key will immediately disable access</li>
            <li>• Never share your API keys publicly or commit them to version control</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
