'use client';

import { useState } from 'react';
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function KeyTableRow({ apiKey }: { apiKey: any }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayKey = showKey ? apiKey.key : `${apiKey.key.slice(0, 7)}${'•'.repeat(apiKey.key.length - 11)}${apiKey.key.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">callio</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            {displayKey}
          </code>
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-1 text-gray-400 hover:text-gray-600 transition"
            title={showKey ? 'Hide' : 'Show'}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 transition"
            title={copied ? 'Copied!' : 'Copy'}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">{new Date(apiKey.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">Never</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-block px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">Active</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <form action={`/api/keys/${apiKey.id}/delete`} method="POST" onSubmit={(e) => {
          if (!confirm('Are you sure you want to delete this key?')) {
            e.preventDefault();
          }
        }}>
          <button
            type="submit"
            className="text-red-600 hover:text-red-700 transition"
            title="Delete key"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </form>
      </td>
    </tr>
  );
}
