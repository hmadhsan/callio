'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { CallioMark } from '@/components/CallioLogo';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing password reset token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid token.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-white rounded-2xl border border-[var(--line)] p-8 shadow-sm text-center py-12">
                <p className="text-red-500 font-medium mb-4">Invalid or missing reset token.</p>
                <Link href="/forgot-password" className="text-[var(--accent)] hover:underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-8 shadow-sm">
            {success ? (
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Password reset complete</h3>
                    <p className="text-[var(--muted)] text-sm mb-6">
                        Your password has been successfully updated.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white font-medium rounded-lg transition"
                    >
                        Sign In with New Password
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">New Password</label>
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

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-[var(--line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ink)] placeholder:text-gray-400"
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
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                        <CallioMark size={34} />
                        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Callio</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Create new password</h1>
                    <p className="text-[var(--muted)]">Please enter a strong new password.</p>
                </div>

                <Suspense fallback={
                    <div className="flex justify-center p-12 bg-white rounded-2xl border border-[var(--line)]">
                        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
