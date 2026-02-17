'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginUrl, setLoginUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to send link');
        setLoading(false);
        return;
      }

      if (data.loginUrl) {
        setMessage('Email service is disabled. Redirecting you to sign in now...');
        setLoginUrl(data.loginUrl);
        setLoading(false);
        setTimeout(() => {
          window.location.href = data.loginUrl;
        }, 400);
        return;
      }

      setMessage('Check your email for the sign-in link.');
      setLoginUrl('');
      setLoading(false);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <Link href="/" className="text-lg font-bold hover:text-blue-600 transition">
              Callio
            </Link>
          </div>
          <div className="text-xs text-gray-500">Provider Sign In</div>
        </div>
      </nav>

      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-600 mb-8">We will email you a secure magic link.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {error && <div className="bg-red-50 border border-red-300 rounded p-3 text-red-700 text-sm">{error}</div>}
            {message && <div className="bg-green-50 border border-green-300 rounded p-3 text-green-700 text-sm">{message}</div>}
            {loginUrl && (
              <a
                href={loginUrl}
                className="block text-sm text-blue-600 hover:text-blue-700"
              >
                Sign in now
              </a>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
