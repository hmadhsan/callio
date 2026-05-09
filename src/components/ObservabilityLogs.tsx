'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ApiCallLog {
  id: string;
  apiSlug: string;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  requestSize: number | null;
  responseSize: number | null;
  errorMessage: string | null;
  createdAt: string;
}

export default function ObservabilityLogs({ days = 7, apiSlug }: { days?: number; apiSlug?: string }) {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, limit, apiSlug, days]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = `/api/observability/logs?page=${page}&limit=${limit}&days=${days}`;
      if (apiSlug) url += `&apiSlug=${apiSlug}`;
      if (filter) url += `&status=${filter}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-amber-600';
    return 'text-red-600';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700';
      case 'POST': return 'bg-green-100 text-green-700';
      case 'PUT': return 'bg-amber-100 text-amber-700';
      case 'PATCH': return 'bg-purple-100 text-purple-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const pages = Math.ceil(total / limit);

  if (loading && logs.length === 0) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="font-semibold text-sm">Recent API Calls</h3>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="text-sm border border-[var(--line)] rounded px-2 py-1"
          >
            <option value="">All statuses</option>
            <option value="200">2xx Success</option>
            <option value="4">4xx Errors</option>
            <option value="5">5xx Server Errors</option>
          </select>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="text-sm border border-[var(--line)] rounded px-2 py-1"
          >
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {logs.length > 0 ? (
        <div className="overflow-x-auto border border-[var(--line)] rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-[var(--soft)] border-b border-[var(--line)]">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">API</th>
                <th className="px-4 py-2 text-left font-semibold">Method</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Latency</th>
                <th className="px-4 py-2 text-left font-semibold">Size</th>
                <th className="px-4 py-2 text-left font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--line)] hover:bg-[var(--soft)]">
                  <td className="px-4 py-2 font-medium">{log.apiSlug}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className={`px-4 py-2 font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </td>
                  <td className="px-4 py-2">{log.latencyMs}ms</td>
                  <td className="px-4 py-2 text-[var(--muted)] text-xs">
                    {log.requestSize && log.responseSize ? `${log.requestSize}→${log.responseSize}b` : '—'}
                  </td>
                  <td className="px-4 py-2 text-[var(--muted)] text-xs">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-[var(--muted)] py-8">No logs found</div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--muted)]">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded border border-[var(--line)] hover:bg-[var(--soft)] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2 py-1 rounded text-sm ${
                    p === page
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--line)] hover:bg-[var(--soft)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="p-2 rounded border border-[var(--line)] hover:bg-[var(--soft)] disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
