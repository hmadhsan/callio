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
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-left">
          <div className="text-sm font-semibold text-green-900 mb-2">API added to your agent</div>
          <div className="text-xs text-green-700 mb-3">Copy this key now. You will not see it again.</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-white border border-green-200 rounded px-3 py-2 break-all">
              {key}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
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
