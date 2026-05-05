import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import ApiCreateForm from '@/components/ApiCreateForm';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewApiPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Register an upstream tool
        </h1>
        <p className="text-[var(--muted)] mb-8">
          Add your own HTTP API so agent traffic can flow through Callio&apos;s proxy—same logging, quotas, and secret injection as managed integrations.
        </p>

        <ApiCreateForm />
      </div>
    </div>
  );
}
