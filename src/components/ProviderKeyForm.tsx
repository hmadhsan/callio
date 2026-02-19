"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProviderKeyFormProps {
  apiSlug: string;
}

export default function ProviderKeyForm({ apiSlug }: ProviderKeyFormProps) {
  const [providerKey, setProviderKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiSlug, providerKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to save provider key');
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
    <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-gray-200 p-4 bg-gray-50">
      <div className="text-sm font-semibold text-gray-900 mb-2">Connect your provider key</div>
      <p className="text-xs text-gray-600 mb-3">
        Add your provider API key so Callio can proxy requests for this API.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          value={providerKey}
          onChange={(event) => setProviderKey(event.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="sk_live_..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Key'
          )}
        </button>
      </div>
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      {success && <div className="mt-2 text-xs text-green-700">Key saved successfully.</div>}
    </form>
  );
}
