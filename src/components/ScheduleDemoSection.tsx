'use client';

import Link from 'next/link';
import { CalendarDays, Check, ArrowRight } from 'lucide-react';
import { CALENDLY_DEMO_URL } from '@/lib/site';

export default function ScheduleDemoSection() {
  return (
    <section id="schedule-demo" className="py-20 sm:py-24 border-t border-[var(--line)]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-5">
            <CalendarDays className="w-3.5 h-3.5" />
            Schedule a Demo
          </div>
          <h2 className="text-3xl sm:text-4xl font-display mb-4">
            See Callio in action
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Walk through Callio with our team. Learn how to connect your agent to 2000+ APIs in minutes and streamline your integration workflow.
          </p>
        </div>

        {/* Main Demo Card */}
        <div className="rounded-3xl border border-[var(--line)] bg-white p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Left: Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                What you'll discover:
              </h3>
              <ul className="space-y-4">
                {[
                  'How to set up your first API proxy in 2 minutes',
                  'MCP integration for Claude, Cursor & other tools',
                  'Real-time observability dashboard & analytics',
                  'Best practices for production deployments',
                  'Custom setup for your team\'s specific workflow',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--muted)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[var(--ink)] mb-2">
                  Pick your time
                </h3>
                <p className="text-sm text-[var(--muted)] mb-6">
                  Our team will guide you through Callio features tailored to your use case. Sessions are typically 20-30 minutes.
                </p>
              </div>
              <div>
                <a
                  href={CALENDLY_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-white font-semibold px-6 py-4 hover:bg-[var(--accent-strong)] transition shadow-lg hover:shadow-xl"
                >
                  Schedule a demo
                  <CalendarDays className="w-5 h-5" />
                </a>
                <p className="text-xs text-[var(--muted)] text-center mt-4">
                  Opens Calendly in a new tab
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted)] mb-4">
            Or reach out directly for enterprise inquiries:
          </p>
          <a
            href="mailto:hello@callio.dev"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-strong)] font-medium transition"
          >
            hello@callio.dev
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
