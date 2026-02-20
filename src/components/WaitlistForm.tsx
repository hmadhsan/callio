'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
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
        body: JSON.stringify({ email, role, company }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setCompany('');
        setRole('Developer');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.detail || data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] p-8 text-center">
        <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Welcome to the waitlist!</h3>
        <p className="text-[var(--muted)]">We'll contact you soon via email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--line)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-[var(--line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ink)] placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-[var(--line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ink)] placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">I'm interested in</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Developer', 'API Provider', 'AI Startup', 'Other'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                role === option
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--soft)] text-[var(--ink)] hover:bg-[var(--soft-strong)]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-strong)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-full transition"
      >
        {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
      </button>

      <p className="text-xs text-[var(--muted)] text-center mt-4">
        We'll never spam you. Unsubscribe anytime.
      </p>
    </form>
  );
}
