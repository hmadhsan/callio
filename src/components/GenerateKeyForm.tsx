'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';

type ApiMinimal = {
  id: string;
  slug: string;
  name: string;
  icon: string;
};

export default function GenerateKeyForm({ apis = [] }: { apis?: ApiMinimal[] }) {
  const [keyName, setKeyName] = useState('');
  const [scopes, setScopes] = useState<string[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState<number | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [upgradePrompt, setUpgradePrompt] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: keyName || 'Default API Key',
          scopes,
          monthlyLimit: monthlyLimit === '' ? null : Number(monthlyLimit)
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setGeneratedKey(data?.key || '');
        setShowForm(false);
        setUpgradePrompt(false);
        router.refresh();
      } else {
        if (response.status === 403 && data?.upgrade) {
          setShowForm(false);
          setUpgradePrompt(true);
        } else {
          alert(data?.error || 'Failed to generate key');
        }
      }
    } catch (error) {
      alert('Error generating key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  const handleDismissKey = () => {
    setGeneratedKey('');
    setKeyName('');
    setScopes([]);
    setMonthlyLimit('');
  };

  // Show the generated key
  if (generatedKey) {
    return (
      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Check className="w-5 h-5 text-green-600" />
          <h3 className="text-base font-semibold text-green-800">API Key Generated!</h3>
        </div>
        <p className="text-sm text-green-700 mb-4">
          Copy this key now — you won&apos;t be able to see it again.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <code className="flex-1 text-xs sm:text-sm bg-white border border-green-200 rounded-lg px-3.5 py-2.5 break-all font-mono select-all">
            {generatedKey}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <button
          onClick={handleDismissKey}
          className="text-sm text-green-700 hover:text-green-900 font-medium transition"
        >
          Done — I&apos;ve saved it
        </button>
      </div>
    );
  }

  if (upgradePrompt) {
    return (
      <div className="mb-6 relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-900/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900">
                API key limit reached
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Your Free plan includes 3 API keys. Upgrade to <span className="font-medium text-gray-900">Pro</span> for 10 keys, 5,000 requests/month, and priority support.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Upgrade to Pro
                </Link>
                <button
                  onClick={() => setUpgradePrompt(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
        >
          + Generate New Key
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Generate New API Key</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Name your key (e.g., Production, Development)"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            autoFocus
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">API Access Scope</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scopes.length === 0}
                onChange={() => setScopes([])}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm font-medium text-gray-900">Full Access (All APIs)</span>
            </label>
            <div className="h-px bg-gray-200 my-2" />
            {apis.map((api) => (
              <label key={api.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scopes.includes(api.slug)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setScopes([...scopes, api.slug]);
                    } else {
                      setScopes(scopes.filter(s => s !== api.slug));
                    }
                  }}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700 mt-0.5">{api.icon} {api.name}</span>
              </label>
            ))}
          </div>
          <button
            type="button"
            className="text-xs text-[var(--accent)] hover:underline mt-2"
            onClick={() => {
              const checked = scopes.length !== 0; // Check if "Full Access" is currently unchecked
              if (checked) {
                // Select all APIs
                setScopes(apis.map(api => api.slug));
              } else {
                setScopes([]); // Deselect all
              }
            }}
          >
            Toggle all
          </button>
          <p className="text-xs text-gray-500 mt-1.5">If "Full Access" is selected, the key can access any API.</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Request Limit (Optional)</label>
          <input
            type="number"
            min="1"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            placeholder="No limit"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1.5">Leave blank for unlimited requests (up to your plan's maximum capacity).</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          <button
            type="button"
            onClick={() => {
              setKeyName('');
              setScopes([]);
              setMonthlyLimit('');
              setShowForm(false);
            }}
            className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

