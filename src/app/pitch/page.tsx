'use client';

import { useState, useEffect, useCallback } from 'react';

const slides = [
    // ── 1. Cover ──────────────────────────────────────────────────────────────
    <div key="cover" style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px', position: 'relative', overflow: 'hidden', height: '100%',
    }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 700px 500px at 50% 60%, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, background: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>callio</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>callio.dev</div>
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, color: '#fff', maxWidth: 760, margin: '0 auto 24px' }}>
                One Key to Rule<br /><span style={{ color: '#f97316' }}>Every API</span>
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 56px', lineHeight: 1.6 }}>
                The unified API gateway that lets developers and AI agents call any third-party API through a single, authenticated, usage-tracked endpoint.
            </p>
            <div style={{ display: 'inline-flex', gap: 40, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 48px' }}>
                {[['50+', 'APIs Available'], ['$20/mo', 'Starting Price'], ['MCP', 'AI Agent Ready']].map(([num, lbl]) => (
                    <div key={lbl} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#f97316' }}>{num}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{lbl}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>,

    // ── 2. Problem ────────────────────────────────────────────────────────────
    <div key="problem" style={{ background: '#f8fafc', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#f97316', marginBottom: 10 }}>The Problem</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>API Integration is<br />a Developer Nightmare</h2>
        <p style={{ fontSize: 18, color: '#64748b', marginBottom: 40, maxWidth: 640 }}>Every API has a different auth scheme, rate limit, and billing model. Teams waste weeks on boilerplate instead of building products.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
                ['🔑', 'Key management chaos', 'Developers juggle 10+ provider keys per project — OpenAI, Stripe, Twilio, Sendgrid — scattered across .env files and team Slack threads.'],
                ['📊', 'Zero unified visibility', 'Usage, costs, and errors are siloed per provider. Teams have no single dashboard to understand their API spend or failure rates.'],
                ['🤖', 'AI agents need APIs — but can\'t handle auth', 'LLM-powered agents need to call real APIs, but managing credentials and rate limits inside an agent is fragile and insecure.'],
            ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ display: 'flex', gap: 16, padding: '20px 24px', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{title}</div>
                        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>,

    // ── 3. Solution ───────────────────────────────────────────────────────────
    <div key="solution" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>The Solution</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Callio — One Unified<br />API Gateway</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 40, maxWidth: 640 }}>One Callio key. Behind it, every integrated API is authenticated, rate-limited, and usage-tracked automatically.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
                ['🔐', 'BYOK Credentials', 'Save your provider keys once. Callio encrypts them (AES-256-GCM) and injects them on every proxied request. No more key sprawl.'],
                ['🤖', 'MCP + AI Agent Ready', 'Built-in Model Context Protocol support. AI agents call any API with one key — no per-provider auth, rate limits handled automatically.'],
                ['📈', 'Unified Analytics', 'Every request logged. Latency, error rates, and usage per API — all in one dashboard.'],
                ['⚡', 'Zapier & Make', 'Polling trigger endpoint — non-developers automate workflows using any Callio API. No code required.'],
            ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28 }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{desc}</div>
                </div>
            ))}
        </div>
    </div>,

    // ── 4. Business Model ─────────────────────────────────────────────────────
    <div key="biz" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Business Model</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 12 }}>SaaS + Usage-Based Pricing</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>Predictable subscription MRR with a built-in usage lever — as customers grow, revenue grows automatically.</p>
        <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
            {[
                { name: 'Free', price: '$0', period: '/mo', features: ['50 requests/month', '3 API keys', 'MCP integration'], featured: false },
                { name: 'Pro', price: '$20', period: '/mo', features: ['5,000 requests/month', '10 API keys', 'Full analytics', 'Webhook forwarding'], featured: true },
                { name: 'Team', price: '$99', period: '/mo', features: ['50,000 requests/month', 'Unlimited keys & agents', 'Advanced analytics', 'Dedicated support'], featured: false },
            ].map((plan) => (
                <div key={plan.name} style={{ flex: 1, background: plan.featured ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.06)', border: plan.featured ? '2px solid #f97316' : '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, position: 'relative' }}>
                    {plan.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#f97316', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 1 }}>Most Popular</div>}
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 16 }}>{plan.price}<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{plan.period}</span></div>
                    {plan.features.map(f => <div key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6, display: 'flex', gap: 8 }}><span style={{ color: '#f97316', fontWeight: 700 }}>✓</span>{f}</div>)}
                </div>
            ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            {['Subscription MRR', 'Usage overage fees', 'Provider revenue share', 'Enterprise custom plans'].map(r => (
                <div key={r} style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, textAlign: 'center' }}>✦ {r}</div>
            ))}
        </div>
    </div>,

    // ── 5. Founder ───────────────────────────────────────────────────────────
    <div key="founder" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>The Founder</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 40 }}>Built by a builder,<br />for builders</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 56, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', border: '4px solid #f97316', flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/founder.jpg" alt="Founder" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>H. Hassan</div>
                    <div style={{ fontSize: 14, color: '#f97316', fontWeight: 600, marginTop: 4 }}>Founder & CEO, Callio</div>
                </div>
                <a
                    href="https://www.linkedin.com/in/h-hassan-sde/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0a66c2', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    linkedin.com/in/h-hassan-sde
                </a>
            </div>
            <div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
                    {['Software Engineer', 'Builder', 'Intl. Conference Speaker'].map(tag => (
                        <span key={tag} style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', color: '#fb923c', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 99 }}>{tag}</span>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                    {[
                        { icon: '🛠️', title: 'Full-Stack Engineer', desc: 'Built Callio end-to-end — from the API proxy and encryption layer to the billing system, team management, and AI agent integrations.' },
                        { icon: '🌍', title: 'International Conference Speaker', desc: 'Spoken at developer and tech conferences internationally, evangelising AI, APIs and modern software engineering.' },
                        { icon: '🚀', title: 'Shipped. Fast.', desc: 'Took Callio from idea to a production-ready platform with 50+ API integrations, Stripe billing, and an AI agent marketplace — solo.' },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} style={{ display: 'flex', gap: 16 }}>
                            <div style={{ fontSize: 26, flexShrink: 0 }}>{icon}</div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{title}</div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>,

    // ── 6. The Ask ────────────────────────────────────────────────────────────
    <div key="ask" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>The Ask</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
                <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>We&apos;re raising a<br />Pre-Seed Round</h2>
                <div style={{ fontSize: 72, fontWeight: 900, background: 'linear-gradient(135deg, #fb923c, #f97316, #c2410c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>$500K</div>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 36 }}>18-month runway to hit $50K MRR and raise a Seed</p>
                {[
                    ['40%', 'Engineering — API integrations, enterprise features'],
                    ['30%', 'Growth & GTM — developer marketing, content, events'],
                    ['20%', 'Sales — first enterprise AEs, outbound to dev teams'],
                    ['10%', 'Infrastructure & ops — Supabase scale, reliability'],
                ].map(([pct, desc]) => (
                    <div key={pct as string} style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', marginBottom: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#f97316', minWidth: 44 }}>{pct}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{desc}</div>
                    </div>
                ))}
            </div>
            <div>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, marginBottom: 20 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>🎯 12-Month Targets</div>
                    {[
                        ['📈', '$50K MRR from 500 paying teams'],
                        ['🤝', '3 enterprise contracts @ $20K+ ACV'],
                        ['🌐', '200+ APIs in marketplace'],
                        ['🤖', '#1 API gateway for AI agent builders'],
                    ].map(([icon, text]) => (
                        <div key={text as string} style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 14, lineHeight: 1.5 }}>{icon} &nbsp;{text}</div>
                    ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '20px 28px', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Contact</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>callio.dev</div>
                    <div style={{ fontSize: 15, color: '#f97316', marginTop: 4 }}>hello@callio.dev</div>
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
        setTimeout(() => {
            setCurrent(idx);
            setAnimating(false);
        }, 200);
    }, [current, animating]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [current, goTo]);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a', fontFamily: "'Inter', -apple-system, sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

            {/* Slide area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                {/* Slide label */}
                <div style={{ position: 'absolute', top: 16, right: 18, fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 10px', letterSpacing: 1, textTransform: 'uppercase', zIndex: 10 }}>
                    {SLIDE_LABELS[current]} &nbsp;·&nbsp; ← → keys
                </div>

                {/* Animated slide */}
                <div style={{
                    width: '100%', height: '100%',
                    opacity: animating ? 0 : 1,
                    transform: animating ? `translateX(${direction === 'forward' ? '20px' : '-20px'})` : 'none',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}>
                    {slides[current]}
                </div>
            </div>

            {/* Nav bar — in flow, never overlaps */}
            <div style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                background: 'rgba(15,23,42,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '12px 24px',
            }}>
                <button onClick={() => goTo(current - 1)} disabled={current === 0} style={{ background: 'none', border: 'none', cursor: current === 0 ? 'default' : 'pointer', color: current === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', fontSize: 18, padding: '2px 8px' }}>←</button>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {slides.map((_, i) => (
                        <div key={i} onClick={() => goTo(i)} title={SLIDE_LABELS[i]} style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 99, background: i === current ? '#f97316' : 'rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'all 0.25s ease' }} />
                    ))}
                </div>
                <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} style={{ background: 'none', border: 'none', cursor: current === slides.length - 1 ? 'default' : 'pointer', color: current === slides.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', fontSize: 18, padding: '2px 8px' }}>→</button>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, minWidth: 44, textAlign: 'center' }}>{current + 1} / {slides.length}</span>
            </div>
        </div>
    );
}
