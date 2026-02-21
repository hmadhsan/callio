'use client';

import { useState } from 'react';
import { Copy, Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KeyTableRow({ apiKey }: { apiKey: any }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Only show masked key (we don't store plain keys for security)
  const displayKey = `callio_••••••••••••${apiKey?.keyLast4 || '****'}`;

  const handleCopy = async () => {
    // Message to copy since we don't have the plain key
    await navigator.clipboard.writeText('Copy your API key from the generation dialog');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/keys/${apiKey.id}/delete`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setShowDeleteModal(false);
        router.refresh();
      } else {
        alert('Failed to delete key');
      }
    } catch (error) {
      alert('Error deleting key');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-4 py-4 whitespace-nowrap">
          <code className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            {displayKey}
          </code>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="text-sm font-medium text-gray-900">{apiKey?.name || 'Default API Key'}</span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-600">{apiKey?.api?.name || '—'}</span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-600">{new Date(apiKey.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-3">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Active</span>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete key"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Beautiful Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete API Key</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete this API key? Any applications using this key will immediately lose access. This action cannot be undone.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                  <code className="text-xs font-mono text-gray-700 break-all">
                    {displayKey}
                  </code>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Key'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
