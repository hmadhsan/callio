'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { CallioMark } from '@/components/CallioLogo';
import ThemeToggle from '@/components/ThemeToggle';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to send reset email');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[var(--page-bg)] flex items-center justify-center px-4">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                        <CallioMark size={34} />
                        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Callio</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                    <p className="text-[var(--muted)]">Enter your email and we&apos;ll send you a reset link.</p>
                </div>

                <div className="bg-[var(--background)] rounded-2xl border border-[var(--line)] p-8 shadow-sm">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Check your email</h3>
                            <p className="text-[var(--muted)] text-sm mb-6">
                                We sent a password reset link to <strong>{email}</strong>
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white font-medium rounded-lg transition"
                            >
                                Return to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
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

                                {error && <p className="text-red-600 text-sm">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-[var(--muted)] mt-6">
                    Remebered your password?{' '}
                    <Link href="/login" className="text-[var(--ink)] font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
