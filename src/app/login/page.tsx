'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { Suspense } from 'react';
import { CallioMark } from '@/components/CallioLogo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  useEffect(() => {
    const raw = searchParams.get('error');
    if (!raw) return;
    const err = decodeURIComponent(raw).trim();
    const messages: Record<string, string> = {
      google_denied: 'Google sign-in was cancelled.',
      oauth_not_configured: 'Google sign-in is not configured on this server.',
      token_exchange_failed:
        'Google could not complete sign-in. Usually the Authorized redirect URI in Google Cloud Console does not match this site exactly (check https, www, and path /api/auth/google/callback). Redeploy after changing NEXT_PUBLIC_APP_URL.',
      redirect_uri_mismatch:
        'Google rejected the redirect URL. In Google Cloud → Credentials → your OAuth client, add the exact callback URL this app uses (both https://www.callio.dev and https://callio.dev if needed), then save and wait a few minutes.',
      invalid_grant:
        'That sign-in session expired or was already used. Click “Continue with Google” again (avoid double-clicks).',
      userinfo_failed: 'Could not read your Google profile. Please try again.',
      no_email: 'Your Google account has no email on file. Use a different Google account or sign in with email.',
      no_code: 'Sign-in was interrupted before completion. Please try again.',
      oauth_failed:
        'Something went wrong while finishing sign-in (database or session). Try again or use email / magic link.',
      'invalid-token': 'That email link is invalid or expired. Request a new one from the login page.',
    };
    setError(
      messages[err] ??
        `Sign-in could not finish (error code: ${err}). Check the URL matches your Google OAuth redirect URIs and redeploy after env changes.`
    );
  }, [searchParams]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const redirect = searchParams.get('redirect');
        router.push(redirect || '/dashboard');
      } else if (data.requiresVerification) {
        setUnverifiedEmail(data.email || email);
        setError('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMagicSent(true);
      } else {
        setError(data.error || 'Failed to send link');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <CallioMark size={34} />
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Callio</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-[var(--muted)]">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--line)] p-8 shadow-sm">
          {/* Google Sign In */}
          <a
            href="/api/auth/google"
            className="w-full py-2.5 border border-[var(--line)] rounded-lg text-sm font-medium transition flex items-center justify-center gap-3 hover:bg-[var(--soft)] mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[var(--line)]" />
            <span className="text-xs text-[var(--muted)] uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-[var(--line)]" />
          </div>

          {magicSent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Check your email</h3>
              <p className="text-[var(--muted)] text-sm">We sent a sign-in link to <strong>{email}</strong></p>
            </div>
          ) : (
            <>
              {/* Tab Toggle */}
              <div className="flex mb-6 border border-[var(--line)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setMode('password')}
                  className={`flex-1 py-2 text-sm font-medium transition ${mode === 'password' ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)] hover:bg-[var(--soft)]'}`}
                >
                  Password
                </button>
                <button
                  onClick={() => setMode('magic')}
                  className={`flex-1 py-2 text-sm font-medium transition ${mode === 'magic' ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)] hover:bg-[var(--soft)]'}`}
                >
                  Magic Link
                </button>
              </div>

              <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-[var(--line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ink)] placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {mode === 'password' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium">Password</label>
                        <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:underline" tabIndex={-1}>
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-10 py-2.5 border border-[var(--line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ink)] placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {unverifiedEmail ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                      <p className="text-amber-800 font-medium mb-1">Please verify your email to continue.</p>
                      <p className="text-amber-700 mb-2">We sent a link to <strong>{unverifiedEmail}</strong>.</p>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch('/api/auth/request-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: unverifiedEmail }) });
                          setUnverifiedEmail('');
                          setError('Verification email resent! Check your inbox.');
                        }}
                        className="text-amber-800 underline hover:no-underline text-xs"
                      >
                        Resend verification email
                      </button>
                    </div>
                  ) : error ? (
                    <p className="text-red-600 text-sm">{error}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {mode === 'password' ? 'Sign In' : 'Send Magic Link'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--ink)] font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
