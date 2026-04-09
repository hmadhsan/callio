import { CalendarDays } from 'lucide-react';
import { CALENDLY_DEMO_URL } from '@/lib/site';

export default function BookDemoForm() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--muted)]">
        Pick a time that works for you. Opens our scheduling page in a new tab.
      </p>
      <a
        href={CALENDLY_DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-white font-semibold px-5 py-3 hover:bg-[var(--accent-strong)] transition"
      >
        Book a demo
        <CalendarDays className="w-4 h-4" />
      </a>
    </div>
  );
}
