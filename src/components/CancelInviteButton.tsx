'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CancelInviteButton({ inviteId, workspaceId }: { inviteId: string, workspaceId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this invite?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/team/invite/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteId, workspaceId })
            });

            const data = await res.json();
            if (res.ok) {
                router.refresh();
            } else {
                alert(data.error || 'Failed to cancel invite');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={loading}
            className="p-1.5 text-[var(--muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Cancel Invite"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
