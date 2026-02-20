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
        <div className="bg-[var(--soft)] border border-[var(--line)] rounded-xl p-6 text-left">
          <div className="text-lg font-semibold text-[var(--ink)] mb-1">✓ API Key Generated!</div>
          <p className="text-sm text-[var(--muted)] mb-5">
            Copy this key now — you won&apos;t see it again.
          </p>
          
          {/* Key Display */}
          <div className="flex items-center gap-2 mb-8">
            <code className="flex-1 text-xs sm:text-sm bg-white border border-[var(--line)] rounded-lg px-3.5 py-2.5 break-all font-mono">
              {key}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition"
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
          <div className="border-t border-[var(--line)] pt-6">
            <div className="text-sm font-bold text-[var(--ink)] mb-5">How to use this key:</div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-[var(--line)]">
                <div className="text-sm font-medium text-[var(--ink)] mb-1">0. Save your provider key <span className="text-xs font-normal text-[var(--muted)]">(one time)</span></div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Scroll down and add your provider API key so Callio can forward requests on your behalf.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-[var(--line)]">
                <div className="text-sm font-medium text-[var(--ink)] mb-2">1. Add to your AI agent config:</div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`{
  "apiKey": "${key}",
  "provider": "callio"
}`}
                </pre>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-[var(--line)]">
                <div className="text-sm font-medium text-[var(--ink)] mb-2">2. Call via Callio proxy:</div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`curl -H "Authorization: Bearer ${key}" \\
     https://callio.dev/api/proxy/${apiSlug}/v1/endpoint`}
                </pre>
              </div>

              <div className="bg-white rounded-lg p-4 border border-[var(--line)]">
                <div className="text-sm font-medium text-[var(--ink)] mb-2">3. Or target a full URL:</div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`curl -H "Authorization: Bearer ${key}" \\
     "https://callio.dev/api/proxy/${apiSlug}?target=URL"`}
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
          'w-full px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-strong)] disabled:bg-gray-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2'
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
