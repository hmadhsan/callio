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
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 48, maxWidth: 640 }}>Developers and AI agents get a single Callio key. Behind it, every integrated API is authenticated, rate-limited, and usage-tracked automatically.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {[
                ['🔐', 'BYOK Credentials', 'Save your provider keys once. Callio encrypts them (AES-256-GCM) and injects them on every proxied request. No more key sprawl.'],
                ['🤖', 'MCP + AI Agent Ready', 'Built-in Model Context Protocol support. AI agents call any API with one key — no per-provider auth, rate limits handled automatically.'],
                ['📈', 'Unified Analytics', 'Every request logged. Latency, error rates, and usage per API — all in one dashboard. No third-party monitoring tool needed.'],
            ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{desc}</div>
                </div>
            ))}
        </div>
    </div>,

    // ── 4. Product ────────────────────────────────────────────────────────────
    <div key="product" style={{ background: '#fff', padding: '56px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#f97316', marginBottom: 10 }}>Product</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>What&apos;s Built Today</h2>
        <p style={{ fontSize: 17, color: '#64748b', marginBottom: 36 }}>A production-ready platform — not pitch-ware.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
                ['🌐', 'API Marketplace', '50+ integrated APIs (OpenAI, Stripe, GitHub, Slack…) with interactive playgrounds, OpenAPI spec viewers, and Postman export.'],
                ['🔑', 'API Key Management', 'Scoped keys with per-key monthly limits, last-4 display, and instant revoke. Full audit trail via usage records.'],
                ['⚡', 'Zapier & Make Integration', 'Polling trigger endpoint at /api/zapier/trigger/:slug. Non-developers automate workflows — no code required.'],
                ['💳', 'Stripe Billing Live', 'Free → Pro ($20/mo) → Team ($99/mo) tiers, metered by requests per month, fully integrated with Stripe.'],
                ['👥', 'Team Workspaces', 'Multi-member workspaces, invite flows, role-based access, and per-seat billing.'],
                ['🧩', 'Skills / Agent Modules', 'Pre-packaged skills bundle multiple APIs into agent-ready modules. One-click add via MCP protocol.'],
            ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ background: 'linear-gradient(135deg, #fff7ed, #fff)', border: '2px solid #fed7aa', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f97316', marginBottom: 6 }}>{icon} {title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
                </div>
            ))}
        </div>
    </div>,

    // ── 5. Market ─────────────────────────────────────────────────────────────
    <div key="market" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Market Opportunity</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Riding Two Mega-Trends</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 40 }}>API economy growth + AI agent explosion = a massive, underserved market for unified API infrastructure.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
            {[['$1.2T', 'Global API Economy by 2030'], ['$4.8B', 'API Management Market 2024'], ['$47B', 'AI Agents Market by 2030']].map(([num, lbl]) => (
                <div key={lbl} style={{ background: 'rgba(249,115,22,0.12)', border: '2px solid rgba(249,115,22,0.3)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
                    <div style={{ fontSize: 38, fontWeight: 900, color: '#f97316' }}>{num}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{lbl}</div>
                </div>
            ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
                ['🎯', 'ICP: Developer Teams', 'Startups and scale-ups with 2–50 engineers integrating 3+ third-party APIs. They have the pain and the budget.'],
                ['🤖', 'ICP: AI Agent Builders', 'The fastest-growing developer segment. Every agent builder needs real-world API access — Callio is their infrastructure layer.'],
            ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 24 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{icon} {title}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{desc}</div>
                </div>
            ))}
        </div>
    </div>,

    // ── 6. Business Model ─────────────────────────────────────────────────────
    <div key="biz" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Business Model</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 12 }}>SaaS + Usage-Based Pricing</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 40 }}>Predictable subscription MRR with a built-in usage lever — as customers grow, revenue grows automatically.</p>
        <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
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
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '16px 24px', fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
            ✦ Subscription MRR &nbsp;&nbsp;✦ Usage overage fees &nbsp;&nbsp;✦ API provider revenue share &nbsp;&nbsp;✦ Enterprise custom plans
        </div>
    </div>,

    // ── 7. Competitive ────────────────────────────────────────────────────────
    <div key="competitive" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Competitive Advantage</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Why Callio Wins</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>Existing tools solve one part of the problem. Callio unifies all of it — including AI agent support.</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
                <tr>
                    {['Platform', 'API Marketplace', 'AI Agent / MCP', 'BYOK Creds', 'Analytics', 'Zapier/Make'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Platform' ? 'left' : 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 13 }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[
                    { name: '🔶 Callio', vals: ['✓', '✓', '✓', '✓', '✓'], highlight: true },
                    { name: 'RapidAPI', vals: ['✓', '✗', '✗', '~', '✗'], highlight: false },
                    { name: 'Kong / Apigee', vals: ['✗', '✗', '✓', '✓', '✗'], highlight: false },
                    { name: 'Zapier', vals: ['~', '✗', '✗', '✗', '✓'], highlight: false },
                    { name: 'Postman', vals: ['✗', '✗', '✗', '~', '✗'], highlight: false },
                ].map(row => (
                    <tr key={row.name} style={{ background: row.highlight ? 'rgba(249,115,22,0.12)' : 'transparent' }}>
                        <td style={{ padding: '14px 16px', fontWeight: row.highlight ? 700 : 500, color: row.highlight ? '#f97316' : 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{row.name}</td>
                        {row.vals.map((v, i) => (
                            <td key={i} style={{ padding: '14px 16px', textAlign: 'center', color: v === '✓' ? '#4ade80' : v === '~' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', fontWeight: row.highlight ? 700 : 400, borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 18 }}>{v}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>,

    // ── 8. Traction ───────────────────────────────────────────────────────────
    <div key="traction" style={{ background: '#fff', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#f97316', marginBottom: 10 }}>Traction</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Built. Shipped. Live.</h2>
        <p style={{ fontSize: 18, color: '#64748b', marginBottom: 36 }}>Callio is in production at callio.dev — not a prototype.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 36 }}>
            {[['50+', 'APIs Integrated'], ['$0→$99', 'Paid Plans Live'], ['100%', 'Stripe Billing Active']].map(([num, lbl]) => (
                <div key={lbl} style={{ background: '#fff7ed', border: '2px solid #fed7aa', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#f97316' }}>{num}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{lbl}</div>
                </div>
            ))}
        </div>
        {([
            ['Core Proxy Infrastructure', 100],
            ['Auth, Teams & Billing', 100],
            ['Analytics & Usage Tracking', 100],
            ['Zapier / Make Integration', 100],
            ['Enterprise / Custom Plans', 20],
        ] as [string, number][]).map(([label, pct]) => (
            <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b', marginBottom: 6 }}>
                    <span>{label}</span>
                    <span style={{ color: '#f97316', fontWeight: 700 }}>{pct === 20 ? 'Q2 2026' : `${pct}%`}</span>
                </div>
                <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #f97316, #fb923c)', borderRadius: 99, opacity: pct < 100 ? 0.45 : 1 }} />
                </div>
            </div>
        ))}
    </div>,

    // ── 9. Roadmap ────────────────────────────────────────────────────────────
    <div key="roadmap" style={{ background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', padding: '64px 80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Roadmap</div>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 40 }}>What&apos;s Next</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
                {[
                    { done: true, title: 'API Proxy + Marketplace', desc: '50+ APIs, playground, credential storage, MCP. Live now.' },
                    { done: true, title: 'Teams + Billing', desc: 'Workspace invites, Stripe subscriptions, usage limits. Live now.' },
                    { done: true, title: 'Zapier / Make + Postman', desc: 'Automation trigger endpoint and developer tooling. Live now.' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0, fontSize: 14 }}>✓</div>
                        <div style={{ paddingTop: 6 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.title}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                {[
                    { tag: 'Q2', title: 'Usage-Based Billing', desc: 'Overage charges via Stripe Metered. Unlocks revenue growth beyond flat subscriptions.' },
                    { tag: 'Q2', title: 'Provider Marketplace', desc: 'API providers self-list with revenue share. Callio becomes a two-sided marketplace.' },
                    { tag: 'Q3', title: 'Enterprise Plan + SSO', desc: 'Custom contracts, dedicated infrastructure, SAML SSO, audit logs. ACV $20K+.' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 700, flexShrink: 0, fontSize: 11 }}>{item.tag}</div>
                        <div style={{ paddingTop: 6 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.title}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>,

    // ── 10. The Ask ───────────────────────────────────────────────────────────
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

const SLIDE_LABELS = [
    'Cover', 'Problem', 'Solution', 'Product', 'Market',
    'Business Model', 'Competitive', 'Traction', 'Roadmap', 'The Ask',
];

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
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f172a', fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative' }}>
            {/* Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

            {/* Slide */}
            <div style={{
                width: '100%', height: '100%',
                opacity: animating ? 0 : 1,
                transform: animating ? `translateX(${direction === 'forward' ? '20px' : '-20px'})` : 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}>
                {slides[current]}
            </div>

            {/* Bottom Nav */}
            <div style={{
                position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 14, zIndex: 100,
                background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
                padding: '10px 18px',
            }}>
                <button onClick={() => goTo(current - 1)} disabled={current === 0} style={{ background: 'none', border: 'none', cursor: current === 0 ? 'default' : 'pointer', color: current === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', fontSize: 18, transition: 'color 0.2s', padding: '2px 6px' }}>←</button>
                <div style={{ display: 'flex', gap: 6 }}>
                    {slides.map((_, i) => (
                        <div key={i} onClick={() => goTo(i)} title={SLIDE_LABELS[i]} style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 99, background: i === current ? '#f97316' : 'rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'all 0.25s ease' }} />
                    ))}
                </div>
                <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} style={{ background: 'none', border: 'none', cursor: current === slides.length - 1 ? 'default' : 'pointer', color: current === slides.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', fontSize: 18, transition: 'color 0.2s', padding: '2px 6px' }}>→</button>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, minWidth: 44, textAlign: 'center' }}>{current + 1} / {slides.length}</span>
            </div>

            {/* Slide label top-right */}
            <div style={{ position: 'fixed', top: 18, right: 20, fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 10px', letterSpacing: 1, textTransform: 'uppercase' }}>
                {SLIDE_LABELS[current]} &nbsp;·&nbsp; ← → to navigate
            </div>
        </div>
    );
}
