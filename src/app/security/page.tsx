import Link from 'next/link';
import CallioLogo from '@/components/CallioLogo';

export const metadata = {
  title: 'Security & Compliance | Callio',
  description: 'Callio security statement and controls (self-attested).',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      <nav className="border-b border-[var(--line)] bg-[var(--page-bg)]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Home</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Security & Compliance (Self-attested)</h1>
        <p className="text-[var(--muted)] mb-6">This page contains a brief, self-attested summary of Callio's security posture. For formal attestation (SOC 2 / ISO / HIPAA) please contact hello@callio.dev.</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Key controls</h2>
          <ul className="list-disc pl-6 text-[var(--muted)]">
            <li>Secrets stored in environment variables and not committed to the repository.</li>
            <li>Provider credentials encrypted at rest with AES-256-GCM.</li>
            <li>Org accounts should use MFA; branch protection enabled.</li>
            <li>Automated dependency scanning and vulnerability monitoring.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="font-semibold">Controls matrix</h3>
          <p className="text-[var(--muted)] mt-2">See the starter controls matrix in the repository at <Link href="/docs/compliance/controls.md" className="text-[var(--accent)] underline">docs/compliance/controls.md</Link>.</p>
        </section>

      </main>
    </div>
  );
}
