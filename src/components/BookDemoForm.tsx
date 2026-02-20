'use client';

import { useState } from 'react';
import { CalendarDays, Check } from 'lucide-react';

export default function BookDemoForm() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: 'Other',
          company: company || 'Demo Request',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setCompany('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to book demo');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold">Demo request received</h3>
        <p className="text-sm text-[var(--muted)] mt-2">
          We will reach out within 24 hours with a calendar link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Work email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company"
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-white font-semibold px-5 py-3 hover:bg-[var(--accent-strong)] transition disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting...' : 'Book a demo'}
        <CalendarDays className="w-4 h-4" />
      </button>
    </form>
  );
}
