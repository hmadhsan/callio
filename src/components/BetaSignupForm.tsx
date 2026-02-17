'use client';

import { useState } from 'react';
import { ChevronRight, Loader2, Check } from 'lucide-react';

export default function BetaSignupForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, company: company || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setEmail('');
      setRole('Developer');
      setCompany('');
      setLoading(false);

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section id="beta-signup" className="border-t border-gray-200 py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">List Your API</h2>
          <p className="text-lg text-gray-600">
            Join the marketplace and make your API discoverable to thousands of AI agents
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-300 rounded-lg p-8 text-center">
            <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-green-900 mb-2">You're on the list</p>
            <p className="text-green-700">We'll be in touch soon with more information</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a... *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-600 transition"
                >
                  <option>Developer</option>
                  <option>API Provider</option>
                  <option>AI Startup</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 rounded p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request Access
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-600 text-center">
                We can't wait to show you what Callio can do for your APIs
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
