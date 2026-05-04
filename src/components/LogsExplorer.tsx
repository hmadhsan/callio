'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Activity, AlertTriangle, Download, ExternalLink, Search } from 'lucide-react';

type LogRecord = {
  id: string;
  apiSlug: string;
  apiKeyId: string | null;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  createdAt: string;
  environment: 'production' | 'sandbox';
  apiKey: {
    id: string;
    name: string;
    keyLast4: string;
  } | null;
};

interface LogsExplorerProps {
  records: LogRecord[];
}

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-orange-100 text-orange-700',
  PATCH: 'bg-slate-200 text-slate-800',
  DELETE: 'bg-red-100 text-red-700',
};

function getStatusTone(status: number) {
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-700 border-green-200';
  if (status >= 400 && status < 500) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (status >= 500) return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function csvEscape(value: string | number | null) {
  const stringValue = value == null ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export default function LogsExplorer({ records }: LogsExplorerProps) {
  const [search, setSearch] = useState('');
  const [apiFilter, setApiFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [keyFilter, setKeyFilter] = useState('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(records[0]?.id ?? null);

  const apiOptions = useMemo(
    () => Array.from(new Set(records.map((record) => record.apiSlug))).sort(),
    [records]
  );

  const keyOptions = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    for (const record of records) {
      if (record.apiKey) {
        map.set(record.apiKey.id, {
          id: record.apiKey.id,
          label: `${record.apiKey.name} (...${record.apiKey.keyLast4})`,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      if (apiFilter !== 'all' && record.apiSlug !== apiFilter) return false;
      if (methodFilter !== 'all' && record.method !== methodFilter) return false;
      if (keyFilter === 'session' && record.apiKeyId) return false;
      if (keyFilter !== 'all' && keyFilter !== 'session' && record.apiKeyId !== keyFilter) return false;

      if (statusFilter === 'success' && !(record.status >= 200 && record.status < 300)) return false;
      if (statusFilter === 'client' && !(record.status >= 400 && record.status < 500)) return false;
      if (statusFilter === 'server' && !(record.status >= 500)) return false;
      if (statusFilter === 'pending' && record.status !== 0) return false;

      if (!query) return true;

      const haystack = [
        record.apiSlug,
        record.method,
        record.path,
        record.apiKey?.name,
        record.apiKey?.keyLast4,
        record.status,
        record.environment,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [records, search, apiFilter, methodFilter, statusFilter, keyFilter]);

  const selectedRecord = useMemo(() => {
    return filteredRecords.find((record) => record.id === selectedRecordId) ?? filteredRecords[0] ?? null;
  }, [filteredRecords, selectedRecordId]);

  const summary = useMemo(() => {
    const total = filteredRecords.length;
    const failures = filteredRecords.filter((record) => record.status >= 400).length;
    const avgLatency = total
      ? Math.round(filteredRecords.reduce((sum, record) => sum + record.latencyMs, 0) / total)
      : 0;
    const uniqueApis = new Set(filteredRecords.map((record) => record.apiSlug)).size;

    return { total, failures, avgLatency, uniqueApis };
  }, [filteredRecords]);

  const topFailures = useMemo(() => {
    const counts = new Map<string, number>();

    for (const record of filteredRecords) {
      if (record.status < 400) continue;
      const key = `${record.method} /${record.path}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredRecords]);

  const exportCsv = () => {
    const header = ['timestamp', 'api', 'method', 'path', 'status', 'latency_ms', 'environment', 'key_name'];
    const rows = filteredRecords.map((record) => [
      record.createdAt,
      record.apiSlug,
      record.method,
      `/${record.path}`,
      record.status,
      record.latencyMs,
      record.environment,
      record.apiKey ? `${record.apiKey.name} (...${record.apiKey.keyLast4})` : 'Browser session',
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => csvEscape(value)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `callio-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-xl border border-[var(--line)] p-5">
          <p className="text-sm text-[var(--muted)] mb-1">Requests</p>
          <p className="text-3xl font-bold text-[var(--ink)]">{summary.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--line)] p-5">
          <p className="text-sm text-[var(--muted)] mb-1">Failures</p>
          <p className="text-3xl font-bold text-[var(--ink)]">{summary.failures}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--line)] p-5">
          <p className="text-sm text-[var(--muted)] mb-1">Avg Latency</p>
          <p className="text-3xl font-bold text-[var(--ink)]">{summary.avgLatency}ms</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--line)] p-5">
          <p className="text-sm text-[var(--muted)] mb-1">APIs Touched</p>
          <p className="text-3xl font-bold text-[var(--ink)]">{summary.uniqueApis}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm">
        <div className="p-4 border-b border-[var(--line)] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
              <Activity className="w-4 h-4 text-[var(--accent)]" />
              Request Explorer
            </div>
            <button
              onClick={exportCsv}
              disabled={filteredRecords.length === 0}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--line)] hover:bg-[var(--soft)] transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
            <label className="relative">
              <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search path, API, key, or status"
                className="w-full rounded-lg border border-[var(--line)] bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </label>

            <select
              value={apiFilter}
              onChange={(event) => setApiFilter(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All APIs</option>
              {apiOptions.map((api) => (
                <option key={api} value={api}>{api}</option>
              ))}
            </select>

            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All methods</option>
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="success">2xx success</option>
              <option value="client">4xx client errors</option>
              <option value="server">5xx server errors</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={keyFilter}
              onChange={(event) => setKeyFilter(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All keys</option>
              <option value="session">Browser session</option>
              {keyOptions.map((key) => (
                <option key={key.id} value={key.id}>{key.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="grid xl:grid-cols-[minmax(0,1.7fr)_360px]">
            <div className="overflow-x-auto border-b xl:border-b-0 xl:border-r border-[var(--line)]">
              <table className="w-full text-sm text-left">
                <thead className="bg-[var(--soft)]/50 border-b border-[var(--line)]">
                  <tr>
                    <th className="px-6 py-3 font-medium text-[var(--muted)]">Timestamp</th>
                    <th className="px-6 py-3 font-medium text-[var(--muted)]">API</th>
                    <th className="px-6 py-3 font-medium text-[var(--muted)]">Method & Path</th>
                    <th className="px-6 py-3 font-medium text-[var(--muted)]">Env</th>
                    <th className="px-6 py-3 font-medium text-[var(--muted)]">Key</th>
                    <th className="px-6 py-3 font-medium text-[var(--muted)]">Status</th>
                    <th className="px-6 py-3 font-medium text-[var(--muted)] text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className={`transition cursor-pointer hover:bg-[var(--soft)]/50 ${selectedRecord?.id === record.id ? 'bg-[var(--soft)]/60' : ''}`}
                      onClick={() => setSelectedRecordId(record.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--muted)]">{formatDate(record.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--ink)]">{record.apiSlug}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColors[record.method] || 'bg-gray-100 text-gray-700'}`}>
                            {record.method}
                          </span>
                          <span className="font-mono text-xs text-[var(--muted)] truncate max-w-[260px]" title={`/${record.path}`}>
                            /{record.path}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            record.environment === 'sandbox'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {record.environment === 'sandbox' ? 'Sandbox' : 'Prod'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--muted)]">
                        {record.apiKey ? `${record.apiKey.name} (...${record.apiKey.keyLast4})` : 'Browser session'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getStatusTone(record.status)}`}>
                          {record.status === 0 ? 'Pending' : record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-[var(--muted)]">{record.latencyMs}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 bg-white">
              {selectedRecord ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)] mb-1">Request Details</p>
                    <p className="text-xs text-[var(--muted)]">Inspect a request and jump straight into replay.</p>
                  </div>

                  <div className="rounded-xl border border-[var(--line)] p-4 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">API</p>
                      <p className="font-medium text-[var(--ink)]">{selectedRecord.apiSlug}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Method & Path</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColors[selectedRecord.method] || 'bg-gray-100 text-gray-700'}`}>
                          {selectedRecord.method}
                        </span>
                        <code className="text-xs break-all text-[var(--ink)]">/{selectedRecord.path}</code>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Status</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getStatusTone(selectedRecord.status)}`}>
                          {selectedRecord.status === 0 ? 'Pending' : selectedRecord.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Latency</p>
                        <p className="font-medium text-[var(--ink)]">{selectedRecord.latencyMs}ms</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Environment</p>
                      <p className="text-sm text-[var(--ink)] capitalize">{selectedRecord.environment}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Triggered By</p>
                      <p className="text-sm text-[var(--ink)]">
                        {selectedRecord.apiKey ? `${selectedRecord.apiKey.name} (...${selectedRecord.apiKey.keyLast4})` : 'Browser session'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Timestamp</p>
                      <p className="text-sm text-[var(--ink)]">{formatDate(selectedRecord.createdAt)}</p>
                    </div>
                  </div>

                  <Link
                    href={`/skills/callio/${selectedRecord.apiSlug}?playground=1&method=${encodeURIComponent(selectedRecord.method)}&path=${encodeURIComponent(selectedRecord.path)}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-strong)] transition"
                  >
                    Replay In Playground
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <div className="rounded-xl border border-[var(--line)] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-semibold text-[var(--ink)]">Top Failing Endpoints</p>
                    </div>
                    {topFailures.length > 0 ? (
                      <div className="space-y-2">
                        {topFailures.map(([endpoint, count]) => (
                          <div key={endpoint} className="flex items-center justify-between text-sm gap-3">
                            <code className="text-xs text-[var(--ink)] break-all">{endpoint}</code>
                            <span className="text-[var(--muted)] whitespace-nowrap">{count} fail{count === 1 ? '' : 's'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--muted)]">No failures in the current filter set.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-[var(--muted)]">
                  Select a request to inspect it.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-[var(--muted)]">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No requests match the current filters.</p>
            <p className="text-sm mt-1">Try widening your search or clearing a filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
