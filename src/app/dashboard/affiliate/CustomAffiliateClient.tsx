'use client';

import { useState } from 'react';
import { Copy, Check, TrendingUp, Users, DollarSign, ExternalLink } from 'lucide-react';
import type { Affiliate, Payout } from '@prisma/client';

export default function AffiliateDashboardClient({
  affiliate
}: {
  affiliate: Affiliate & { payouts: Payout[] }
}) {
  const [copied, setCopied] = useState(false);
  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/?ref=${affiliate.referralCode}`
    : `https://callio.dev/?ref=${affiliate.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const COMMISSION_RATE = 20; // 20% recurring

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Affiliate Program</h1>
        <p className="text-[var(--muted)] text-sm">
          Earn a {COMMISSION_RATE}% recurring commission for every customer you refer to Callio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[var(--line)] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[var(--muted)]">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Unpaid Balance</span>
          </div>
          <p className="text-2xl font-bold">${affiliate.balance.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-[var(--line)] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[var(--muted)]">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Earned</span>
          </div>
          <p className="text-2xl font-bold">${affiliate.totalEarned.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--line)] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[var(--muted)]">
            <ExternalLink className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Clicks</span>
          </div>
          <p className="text-2xl font-bold">{affiliate.clickCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--line)] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[var(--muted)]">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Referrals</span>
          </div>
          <p className="text-2xl font-bold">{affiliate.conversions}</p>
        </div>
      </div>

      {/* Your Link */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-[var(--line)] rounded-lg px-4 py-3 font-mono text-sm overflow-x-auto whitespace-nowrap">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-[var(--page-bg)] rounded-lg font-medium hover:bg-gray-800 transition shadow-sm whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">
          Share this link on your blog, social media, or with your network. When users visit Callio through this link, a 60-day tracking cookie is assigned to them.
        </p>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Payout History</h2>
        {affiliate.payouts.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">You have no payouts yet. Once your balance reaches $50, we will process a payout to your registered email address at the end of the month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--muted)] uppercase bg-gray-50 border-b border-[var(--line)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {affiliate.payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-[var(--line)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">{new Date(payout.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium">${payout.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${
                        payout.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        payout.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)] font-mono text-xs">{payout.reference || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
