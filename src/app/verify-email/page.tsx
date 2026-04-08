'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import ThemeToggle from '@/components/ThemeToggle';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [resending, setResending] = useState(false);
    const [resendDone, setResendDone] = useState(false);
    const [resendError, setResendError] = useState('');

    const handleResend = async () => {
        setResending(true);
        setResendError('');
        try {
            await fetch('/api/auth/request-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setResendDone(true);
        } catch {
            setResendError('Failed to resend. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[var(--page-bg)] flex flex-col items-center justify-center px-4">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>
            <div className="mb-10">
                <CallioLogo size={32} />
            </div>

            <div className="w-full max-w-md bg-[var(--background)] border border-[var(--line)] rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-blue-500" />
                </div>

                <h1 className="text-2xl font-bold text-[var(--ink)] mb-3">Check your inbox</h1>
                <p className="text-[var(--muted)] mb-2">
                    We sent a verification link to
                </p>
                {email && (
                    <p className="font-semibold text-[var(--ink)] mb-6 truncate">{email}</p>
                )}
                <p className="text-sm text-[var(--muted)] mb-8">
                    Click the link in the email to verify your account and get started. It may take a minute to arrive.
                </p>

                {resendDone ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Verification email resent!
                    </div>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={resending || !email}
                        className="flex items-center justify-center gap-2 mx-auto text-sm text-[var(--muted)] hover:text-[var(--ink)] transition disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                        {resending ? 'Sending...' : 'Resend verification email'}
                    </button>
                )}

                {resendError && (
                    <p className="text-red-500 text-sm mt-3">{resendError}</p>
                )}

                <div className="mt-8 pt-6 border-t border-[var(--line)]">
                    <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">
                        ← Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
