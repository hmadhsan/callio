'use client';

import { useState } from 'react';
import { Mail, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeamInviteForm({ workspaceId }: { workspaceId: string }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/team/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, workspaceId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send invite');
            }

            setMessage('Invite sent successfully!');
            setEmail('');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <div>
                <label className="sr-only">Email address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-[var(--muted)]" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-[var(--line)] rounded-lg text-sm bg-[var(--soft)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                        placeholder="colleague@company.com"
                        required
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            {message && <p className="text-green-600 text-xs font-medium">{message}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--ink)] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-black transition-colors disabled:opacity-70"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Send Invite
            </button>
        </form>
    );
}
