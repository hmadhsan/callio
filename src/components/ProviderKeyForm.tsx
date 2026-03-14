"use client";

import { useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ProviderKeyFormProps {
  apiSlug: string;
}

const SLUG_HINTS: Record<string, { placeholder: string; example: string }> = {
  openai: { placeholder: 'sk-proj-...', example: 'Your OpenAI API key (starts with sk-)' },
  github: { placeholder: 'ghp_...', example: 'Your GitHub personal access token' },
  sendgrid: { placeholder: 'SG....', example: 'Your SendGrid API key' },
  slack: { placeholder: 'xoxb-...', example: 'Your Slack bot token' },
  airtable: { placeholder: 'pat...', example: 'Your Airtable personal access token' },
};

export default function ProviderKeyForm({ apiSlug }: ProviderKeyFormProps) {
  const [providerKey, setProviderKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const hint = SLUG_HINTS[apiSlug] || { placeholder: 'Your provider API key...', example: 'The API key from the provider\'s dashboard' };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    // Validate: reject Callio keys
    const trimmed = providerKey.trim();
    if (trimmed.startsWith('callio_')) {
      setError('⚠️ This is your Callio key, NOT your provider key. Enter the API key from the provider (e.g. OpenAI, SendGrid) instead.');
      return;
    }
    if (!trimmed || trimmed.length < 10) {
      setError('Please enter a valid provider API key.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiSlug, providerKey: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('You must be logged in to save a provider key. Please log in first.');
        } else {
          setError(data.error || 'Unable to save provider key');
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setProviderKey('');
      setLoading(false);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-xl border-2 border-orange-200 p-5 bg-orange-50/80">
      <div className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        Step 1: Save your provider key
      </div>
      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
        This is <strong>NOT</strong> your Callio key. Enter the API key from the provider&apos;s dashboard (e.g. OpenAI/SendGrid).
      </p>
      <div className="space-y-3">
        <input
          type="password"
          value={providerKey}
          onChange={(event) => setProviderKey(event.target.value)}
          className="w-full px-3.5 py-2.5 border border-orange-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          placeholder={hint.placeholder}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg disabled:bg-gray-300 flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Provider Key'
          )}
        </button>
      </div>
      {error && <div className="mt-3 text-xs text-red-700 font-medium">{error}</div>}
      {success && (
        <div className="mt-3 text-xs text-green-700 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Provider key saved! You can now test in the playground above.
        </div>
      )}
    </form>
  );
}
