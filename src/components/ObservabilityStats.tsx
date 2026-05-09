'use client';

import { useEffect, useState } from 'react';
import { BarChart3, AlertCircle, Zap, TrendingUp } from 'lucide-react';

interface Stats {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  avgLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  totalRequestSize: number;
  totalResponseSize: number;
  statusCounts: Record<number, number>;
  apiBreakdown: Record<string, any>;
}

export default function ObservabilityStats({ days = 7 }: { days?: number }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [days]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/observability/stats?days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-24 rounded-lg" />
      ))}
    </div>;
  }

  if (!stats) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  const successRate = stats.totalRequests > 0 
    ? Math.round((stats.successCount / stats.totalRequests) * 100)
    : 0;

  const errorRate = stats.totalRequests > 0
    ? Math.round((stats.errorCount / stats.totalRequests) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-medium text-[var(--muted)]">Total Requests</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalRequests}</div>
        </div>

        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-[var(--muted)]">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{successRate}%</div>
        </div>

        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-[var(--muted)]">Error Rate</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{errorRate}%</div>
        </div>

        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-[var(--muted)]">Avg Latency</span>
          </div>
          <div className="text-2xl font-bold">{stats.avgLatencyMs}ms</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3">Latency</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Min:</span>
              <span className="font-medium">{stats.minLatencyMs}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Max:</span>
              <span className="font-medium">{stats.maxLatencyMs}ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3">Data Volume</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Request:</span>
              <span className="font-medium">{(stats.totalRequestSize / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Response:</span>
              <span className="font-medium">{(stats.totalResponseSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Breakdown */}
      {Object.keys(stats.apiBreakdown).length > 0 && (
        <div className="bg-white border border-[var(--line)] rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3">API Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(stats.apiBreakdown).map(([api, data]: [string, any]) => (
              <div key={api} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0">
                <span className="font-medium text-[var(--ink)]">{api}</span>
                <div className="flex gap-4">
                  <span className="text-[var(--muted)]">{data.count} calls</span>
                  <span className="text-[var(--muted)]">{data.avgLatency}ms avg</span>
                  {data.errorCount > 0 && <span className="text-red-600">{data.errorCount} errors</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
