'use client';

import { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';

interface AddToAgentButtonProps {
  apiSlug: string;
  buttonClassName?: string;
}

export default function AddToAgentButton({ apiSlug, buttonClassName }: AddToAgentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInstall = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/agent/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: apiSlug }),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Unable to add API');
        setLoading(false);
        return;
      }

      setKey(data.key);
      setLoading(false);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setError('Unable to copy key.');
    }
  };

  if (key) {
    return (
      <div className="w-full">
        <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-left">
          <div className="text-lg font-semibold text-green-900 mb-2">✓ API Key Generated!</div>
          <div className="text-sm text-green-700 mb-4">
            Copy this key now and save it somewhere safe. You will not see it again.
          </div>
          
          {/* Key Display */}
          <div className="flex items-center gap-2 mb-6">
            <code className="flex-1 text-sm bg-white border border-green-200 rounded px-3 py-2 break-all font-mono">
              {key}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded flex items-center gap-2"
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

          {/* Usage Instructions */}
          <div className="border-t border-green-200 pt-4">
            <div className="text-sm font-semibold text-green-900 mb-3">How to use this key:</div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-white rounded p-3 border border-green-100">
                <div className="font-medium text-gray-900 mb-1">1. Add to your AI agent config:</div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`{
  "apiKey": "${key}",
  "provider": "callio"
}`}
                </pre>
              </div>
              
              <div className="bg-white rounded p-3 border border-green-100">
                <div className="font-medium text-gray-900 mb-1">2. Use in API requests:</div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`curl -H "Authorization: Bearer ${key}" \\
     https://api.example.com/endpoint`}
                </pre>
              </div>

              <div className="bg-white rounded p-3 border border-green-100">
                <div className="font-medium text-gray-900 mb-1">3. Or in your code:</div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`const response = await fetch(apiUrl, {
  headers: {
    'Authorization': 'Bearer ${key}'
  }
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleInstall}
        disabled={loading}
        className={
          buttonClassName ||
          'w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2'
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add to Agent'
        )}
      </button>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
