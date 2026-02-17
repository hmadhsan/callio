'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ApiCreateForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('🔌');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [authentication, setAuthentication] = useState('API Key (Bearer token)');
  const [rateLimit, setRateLimit] = useState('');
  const [pricing, setPricing] = useState('');
  const [webhook, setWebhook] = useState(false);
  const [useCases, setUseCases] = useState('');
  const [openapiJson, setOpenapiJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/provider/apis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          icon,
          shortDescription,
          fullDescription,
          documentation,
          authentication,
          rateLimit,
          pricing,
          webhook,
          useCases: useCases
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          openapiJson: openapiJson || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setName('');
      setCategory('');
      setIcon('🔌');
      setShortDescription('');
      setFullDescription('');
      setDocumentation('');
      setAuthentication('API Key (Bearer token)');
      setRateLimit('');
      setPricing('');
      setWebhook(false);
      setUseCases('');
      setOpenapiJson('');
      setLoading(false);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            maxLength={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Documentation URL</label>
          <input
            value={documentation}
            onChange={(e) => setDocumentation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="https://docs.example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
        <input
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
        <textarea
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[120px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Use Cases (comma-separated)</label>
        <input
          value={useCases}
          onChange={(e) => setUseCases(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          placeholder="Send verification codes, Alert users, Marketing campaigns"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Authentication</label>
          <input
            value={authentication}
            onChange={(e) => setAuthentication(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit</label>
          <input
            value={rateLimit}
            onChange={(e) => setRateLimit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="1000 requests/minute"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
          <input
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="$0.01 per request"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={webhook}
          onChange={(e) => setWebhook(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">Webhook support available</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">OpenAPI JSON (optional)</label>
        <textarea
          value={openapiJson}
          onChange={(e) => setOpenapiJson(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[180px] font-mono text-sm"
          placeholder="Paste OpenAPI JSON here to auto-create endpoints"
        />
      </div>

      {error && <div className="bg-red-50 border border-red-300 rounded p-3 text-red-700 text-sm">{error}</div>}
      {success && (
        <div className="bg-green-50 border border-green-300 rounded p-3 text-green-700 text-sm">
          API created successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create API'
        )}
      </button>
    </form>
  );
}
