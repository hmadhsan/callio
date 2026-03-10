'use client';

import { useState, useEffect, useCallback } from 'react';

/* ─── Design tokens ─────────────────────────────────────────────── */
const C = {
    bg: '#FAFAF8',      // warm off-white
    card: '#FFFFFF',
    border: '#E8E5DF',
    ink: '#111110',      // near-black
    muted: '#6B6860',
    faint: '#9B9890',
    accent: '#DA6B1E',      // callio orange — used sparingly
    accentL: '#FDF0E6',
};

const label = (txt: string, light = false) => (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.45)' : C.faint, marginBottom: 14 }}>{txt}</div>
);

const rule = <div style={{ width: 40, height: 3, background: C.accent, borderRadius: 2, marginBottom: 28 }} />;

const slides = [

    /* ══ 1. Cover ═══════════════════════════════════════════════════ */
    <div key="cover" style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 100px', position: 'relative', overflow: 'hidden' }}>
        {/* background grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #D9D6D0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.55 }} />
        {/* right accent block */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, background: C.accent }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.accent, marginBottom: 32 }}>callio.dev</div>
            <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, color: C.ink, letterSpacing: -2, margin: '0 0 24px' }}>
                One Key.<br />Every API.
            </h1>
            <p style={{ fontSize: 20, color: C.muted, lineHeight: 1.65, maxWidth: 520, margin: '0 0 56px' }}>
                A unified API gateway that gives developers and AI agents authenticated, rate-limited access to any third-party API through a single credential.
            </p>
            <div style={{ display: 'flex', gap: 0, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', background: C.card, width: 'fit-content' }}>
                {[['50+', 'APIs integrated'], ['$20/mo', 'Starting price'], ['Live', 'In production']].map(([num, lbl], i) => (
                    <div key={lbl} style={{ padding: '20px 36px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none', textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: C.accent, marginBottom: 2 }}>{num}</div>
                        <div style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}>{lbl}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>,

    /* ══ 2. Problem ═════════════════════════════════════════════════ */
    <div key="problem" style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 100px' }}>
        {label('Problem')}
        <h2 style={{ fontSize: 48, fontWeight: 900, color: C.ink, letterSpacing: -1.5, margin: '0 0 8px', lineHeight: 1.1 }}>API integration is<br />a developer tax.</h2>
        {rule}
        <p style={{ fontSize: 17, color: C.muted, marginBottom: 44, maxWidth: 600, lineHeight: 1.6 }}>Every API ships its own auth scheme, rate-limit policy, and billing portal. Teams spend weeks on glue code instead of shipping features.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
                ['01', 'Key sprawl', 'Dozens of provider secrets scattered across repositories, CI environments, and shared Slack messages. One leak means downtime.'],
                ['02', 'No unified view', 'Error rates, costs, and usage live in separate dashboards. There is no single pane for API health.'],
                ['03', 'AI agents can\'t auth', 'LLM agents need live API access. Hard-coding provider secrets inside agents is insecure and unscalable.'],
            ].map(([num, title, desc]) => (
                <div key={num} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 24px', position: 'relative' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: '0.12em', marginBottom: 12 }}>{num}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
                </div>
            ))}
        </div>
    </div>,

    /* ══ 3. Solution ════════════════════════════════════════════════ */
    <div key="solution" style={{ background: C.ink, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 100px' }}>
        {label('Solution', true)}
        <h2 style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: -1.5, margin: '0 0 8px', lineHeight: 1.1 }}>One key. Every API.<br />Fully managed.</h2>
        <div style={{ width: 40, height: 3, background: C.accent, borderRadius: 2, marginBottom: 28 }} />
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', marginBottom: 44, maxWidth: 600, lineHeight: 1.6 }}>Callio proxies every third-party API call, injecting credentials, enforcing rate limits, and logging usage — invisibly.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
                ['BYOK Credentials', 'Save provider keys once, encrypted at rest with AES-256-GCM. Callio injects them on every request. No more secret sprawl.'],
                ['AI Agent Ready', 'Native Model Context Protocol support. Any LLM agent calls any API with one key — zero per-provider configuration needed.'],
                ['Unified Analytics', 'Every proxied request is logged. Latency, status codes, and per-API usage in a single dashboard.'],
                ['Zapier + Make', 'Built-in polling trigger endpoint — non-developers automate full API workflows without a single line of code.'],
            ].map(([title, desc]) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '24px 26px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{desc}</div>
                </div>
            ))}
        </div>
    </div>,

    /* ══ 4. Business Model ══════════════════════════════════════════ */
    <div key="biz" style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 100px' }}>
        {label('Business Model')}
        <h2 style={{ fontSize: 48, fontWeight: 900, color: C.ink, letterSpacing: -1.5, margin: '0 0 8px', lineHeight: 1.1 }}>SaaS + usage-based.</h2>
        {rule}
        <p style={{ fontSize: 17, color: C.muted, marginBottom: 36, lineHeight: 1.6 }}>Subscription revenue floors our MRR. Usage overages are the growth lever — customers who scale pay more automatically.</p>

        {/* Pricing row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            {[
                { tier: 'Starter', price: '$5', sub: '/month', items: ['50 requests/month', '3 API keys', 'MCP access'], highlight: false },
                { tier: 'Pro', price: '$20', sub: '/month', items: ['5,000 requests/month', '10 API keys', 'Full analytics', 'Webhooks'], highlight: true },
                { tier: 'Team', price: '$99', sub: '/month', items: ['50,000 requests/month', 'Unlimited keys', 'Advanced analytics', 'Dedicated support'], highlight: false },
            ].map(p => (
                <div key={p.tier} style={{ flex: 1, background: p.highlight ? C.accent : C.card, border: `1.5px solid ${p.highlight ? C.accent : C.border}`, borderRadius: 16, padding: '24px 22px', position: 'relative' }}>
                    {p.highlight && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: C.ink, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 99 }}>Most Popular</div>}
                    <div style={{ fontSize: 13, fontWeight: 700, color: p.highlight ? 'rgba(255,255,255,0.8)' : C.muted, marginBottom: 6 }}>{p.tier}</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: p.highlight ? '#fff' : C.ink, marginBottom: 16 }}>{p.price}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>{p.sub}</span></div>
                    {p.items.map(f => (
                        <div key={f} style={{ fontSize: 13, color: p.highlight ? 'rgba(255,255,255,0.8)' : C.muted, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ color: p.highlight ? '#fff' : C.accent, fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>—</span>{f}
                        </div>
                    ))}
                </div>
            ))}
        </div>

        {/* Revenue lines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {['Subscription MRR', 'Usage overage', 'Provider rev-share', 'Enterprise custom'].map(r => (
                <div key={r} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
                    <span style={{ color: C.accent, fontWeight: 800, marginRight: 6 }}>—</span>{r}
                </div>
            ))}
        </div>
    </div>,

    /* ══ 5. Founder ═════════════════════════════════════════════════ */
    <div key="founder" style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 100px' }}>
        {label('Founder')}
        <h2 style={{ fontSize: 48, fontWeight: 900, color: C.ink, letterSpacing: -1.5, margin: '0 0 8px', lineHeight: 1.1 }}>Built by an engineer.<br />Shipped solo.</h2>
        {rule}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 64, alignItems: 'center' }}>
            {/* Photo column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
                <div style={{ width: 200, height: 200, borderRadius: 16, overflow: 'hidden', border: `3px solid ${C.border}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/founder.jpg" alt="H. Hassan" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 2 }}>H. Hassan</div>
                    <div style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>Founder & CEO</div>
                </div>
                <a
                    href="https://www.linkedin.com/in/h-hassan-sde/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#0A66C2', color: '#fff', fontSize: 12.5, fontWeight: 600, padding: '9px 16px', borderRadius: 8, textDecoration: 'none' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    linkedin.com/in/h-hassan-sde
                </a>
            </div>

            {/* Bio column */}
            <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
                    {['Software Engineer', 'Builder', 'Conference Speaker'].map(t => (
                        <span key={t} style={{ border: `1.5px solid ${C.border}`, color: C.muted, fontSize: 12.5, fontWeight: 600, padding: '5px 14px', borderRadius: 99 }}>{t}</span>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[
                        ['Full-Stack Engineer', 'Built Callio end-to-end — API proxy, AES-256-GCM encryption, Stripe billing, team workspaces, and AI agent integrations — solo and in production.'],
                        ['International Conference Speaker', 'Speaker at developer and technology conferences across multiple countries, focused on AI, APIs, and modern software engineering.'],
                        ['Fast Shipper', 'Took Callio from concept to a live product with 50+ integrations, real billing, and an MCP-compatible agent marketplace.'],
                    ].map(([title, desc]) => (
                        <div key={title} style={{ display: 'grid', gridTemplateColumns: '4px 1fr', gap: 20, alignItems: 'start' }}>
                            <div style={{ width: 4, height: '100%', minHeight: 52, background: C.accent, borderRadius: 2, marginTop: 3 }} />
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 5 }}>{title}</div>
                                <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>,

    /* ══ 6. The Ask ═════════════════════════════════════════════════ */
    <div key="ask" style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #D9D6D0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.55 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: C.accent }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
            {label('The Ask')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                {/* Left */}
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.faint, marginBottom: 4 }}>Raising</div>
                    <div style={{ fontSize: 80, fontWeight: 900, color: C.ink, letterSpacing: -3, lineHeight: 1, marginBottom: 8 }}>$500K</div>
                    <div style={{ fontSize: 15, color: C.muted, marginBottom: 40, fontStyle: 'italic' }}>Pre-Seed · 18-month runway</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[['40%', 'Engineering'], ['30%', 'Growth & GTM'], ['20%', 'Sales'], ['10%', 'Infrastructure']].map(([pct, desc]) => (
                            <div key={pct} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 14, alignItems: 'center', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px' }}>
                                <div style={{ fontSize: 16, fontWeight: 900, color: C.accent }}>{pct}</div>
                                <div style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right */}
                <div>
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, marginBottom: 20 }}>12-Month Targets</div>
                        {[
                            ['$50K MRR', 'from 500 paying teams'],
                            ['3 Contracts', '@ $20K+ ACV enterprise'],
                            ['200+ APIs', 'in the marketplace'],
                            ['Category leader', 'for AI agent API access'],
                        ].map(([stat, desc]) => (
                            <div key={stat} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center', paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: 16, fontWeight: 900, color: C.ink, whiteSpace: 'nowrap' }}>{stat}</div>
                                <div style={{ fontSize: 13, color: C.muted }}>{desc}</div>
                            </div>
                        )).slice(0, -1).concat(
                            <div key="last" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center' }}>
                                <div style={{ fontSize: 16, fontWeight: 900, color: C.ink, whiteSpace: 'nowrap' }}>Category leader</div>
                                <div style={{ fontSize: 13, color: C.muted }}>for AI agent API access</div>
                            </div>
                        )}
                    </div>
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>callio.dev</div>
                        <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, marginTop: 2 }}>hello@callio.dev</div>
                    </div>
                </div>
            </div>
        </div>
    </div>,
];

const SLIDE_LABELS = ['Cover', 'Problem', 'Solution', 'Business Model', 'Founder', 'The Ask'];

export default function PitchPage() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');
    const [animating, setAnimating] = useState(false);

    const goTo = useCallback((idx: number) => {
        if (idx < 0 || idx >= slides.length || animating) return;
        setDirection(idx > current ? 'forward' : 'back');
        setAnimating(true);
        setTimeout(() => { setCurrent(idx); setAnimating(false); }, 200);
    }, [current, animating]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [current, goTo]);

    const isDark = current === 2; // Solution slide is dark

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

            {/* Slide area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                {/* Slide label */}
                <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 10, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.25)' : C.faint, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', padding: '4px 10px', borderRadius: 6 }}>
                    {SLIDE_LABELS[current]} · {current + 1}/{slides.length}
                </div>
                {/* Animated slide */}
                <div style={{ width: '100%', height: '100%', opacity: animating ? 0 : 1, transform: animating ? `translateX(${direction === 'forward' ? '16px' : '-16px'})` : 'none', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>
                    {slides[current]}
                </div>
            </div>

            {/* Bottom nav */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '10px 24px', background: C.card, borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => goTo(current - 1)} disabled={current === 0} style={{ background: 'none', border: 'none', cursor: current === 0 ? 'default' : 'pointer', color: current === 0 ? C.border : C.muted, fontSize: 18, padding: '2px 8px', lineHeight: 1 }}>←</button>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {slides.map((_, i) => (
                        <div key={i} onClick={() => goTo(i)} title={SLIDE_LABELS[i]} style={{ width: i === current ? 22 : 7, height: 7, borderRadius: 99, background: i === current ? C.accent : C.border, cursor: 'pointer', transition: 'all 0.22s ease' }} />
                    ))}
                </div>
                <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} style={{ background: 'none', border: 'none', cursor: current === slides.length - 1 ? 'default' : 'pointer', color: current === slides.length - 1 ? C.border : C.muted, fontSize: 18, padding: '2px 8px', lineHeight: 1 }}>→</button>
                <span style={{ fontSize: 11, color: C.faint, fontWeight: 600, letterSpacing: '0.08em', minWidth: 40, textAlign: 'center' }}>{current + 1} / {slides.length}</span>
            </div>
        </div>
    );
}
