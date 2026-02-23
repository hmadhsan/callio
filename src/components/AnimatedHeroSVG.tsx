'use client';

import React, { useEffect, useState } from 'react';

export default function AnimatedHeroSVG() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-[320px]" />;

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl bg-[#09090b] border border-[#27272a] shadow-2xl overflow-hidden my-12 hidden lg:block" style={{ aspectRatio: '840/320' }}>

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-500/10 blur-[100px] pointer-events-none" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 840 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.4" floodColor="#000" />
          </filter>

          {/* Gradients */}
          <linearGradient id="window-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          <linearGradient id="hub-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          <linearGradient id="btn-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="btn-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="1" opacity="0.4" />
          </pattern>

          <style>
            {`
              @keyframes cursor {
                0% { transform: translate(150px, 350px); opacity: 0; }
                5% { opacity: 1; transform: translate(300px, 200px); }
                15% { transform: translate(440px, 160px); }
                18% { transform: translate(440px, 160px) scale(0.9); }
                23% { transform: translate(440px, 160px) scale(1); }
                28% { transform: translate(420px, 205px); }
                30% { transform: translate(420px, 205px) scale(0.9); }
                34% { transform: translate(420px, 205px) scale(1); }
                42% { transform: translate(185px, 107px); }
                45% { transform: translate(185px, 107px) scale(0.9); }
                48% { transform: translate(185px, 107px) scale(1); }
                55% { transform: translate(70px, 245px); }
                58% { transform: translate(70px, 245px) scale(0.9); }
                61% { transform: translate(70px, 245px) scale(1); }
                70%, 100% { opacity: 0; transform: translate(70px, 245px); }
              }
              .cursor { animation: cursor 10s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: top left; }

              @keyframes btnGen {
                0%, 17% { transform: scale(1); }
                18%, 21% { transform: scale(0.95); opacity: 0.8; }
                22%, 100% { transform: scale(1); }
              }
              .btn-gen { animation: btnGen 10s ease-out infinite; transform-origin: center; transform-box: fill-box; }

              @keyframes callioKey {
                0%, 23% { opacity: 0; transform: translateY(8px); }
                26%, 95% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; }
              }
              .callio-key { animation: callioKey 10s ease-out infinite; transform-origin: center; transform-box: fill-box; }

              @keyframes agentKey {
                0%, 45% { opacity: 0; }
                46%, 95% { opacity: 1; }
                100% { opacity: 0; }
              }
              .agent-key-actual { animation: agentKey 10s linear infinite; }

              @keyframes agentKeyPlaceholder {
                0%, 45% { opacity: 1; }
                46%, 100% { opacity: 0; }
              }
              .agent-key-placeholder { animation: agentKeyPlaceholder 10s linear infinite; }

              @keyframes btnRun {
                0%, 57% { transform: scale(1); }
                58%, 60% { transform: scale(0.95); opacity: 0.8; }
                61%, 100% { transform: scale(1); }
              }
              .btn-run { animation: btnRun 10s ease-out infinite; transform-origin: center; transform-box: fill-box; }

              @keyframes p1 {
                0%, 61% { cx: 270; opacity: 0; filter: none; }
                62% { opacity: 1; cx: 270; filter: url(#glow); }
                65% { cx: 330; opacity: 1; }
                66%, 100% { cx: 330; opacity: 0; filter: none; }
              }
              .p1 { animation: p1 10s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

              @keyframes callioLock {
                0%, 65% { stroke: #52525b; transform: scale(1); }
                66%, 74% { stroke: #10b981; transform: scale(1.1); filter: url(#glow); }
                75%, 100% { stroke: #52525b; transform: scale(1); }
              }
              .callio-lock { animation: callioLock 10s ease-out infinite; transform-origin: 420px 234px; } /* Center of the lock */

              @keyframes p2 {
                0%, 67% { cx: 510; opacity: 0; filter: none; }
                68% { opacity: 1; cx: 510; filter: url(#glow); }
                71% { cx: 570; opacity: 1; }
                72%, 100% { cx: 570; opacity: 0; filter: none; }
              }
              .p2 { animation: p2 10s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

              @keyframes apiPulse {
                0%, 70% { transform: scale(1); opacity: 0.5; }
                72%, 76% { transform: scale(1.1); opacity: 1; stroke: #3b82f6; filter: url(#glow); }
                78%, 100% { transform: scale(1); opacity: 0.5; stroke: currentColor; }
              }
              .api-pulse { animation: apiPulse 10s ease-out infinite; transform-origin: center; transform-box: fill-box; }

              @keyframes p3 {
                0%, 75% { cx: 570; opacity: 0; filter: none; }
                76% { opacity: 1; cx: 570; filter: url(#glow); }
                79% { cx: 510; opacity: 1; }
                80%, 100% { cx: 510; opacity: 0; filter: none; }
              }
              .p3 { animation: p3 10s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

              @keyframes p4 {
                0%, 80% { cx: 330; opacity: 0; filter: none; }
                81% { opacity: 1; cx: 330; filter: url(#glow); }
                84% { cx: 270; opacity: 1; }
                85%, 100% { cx: 270; opacity: 0; filter: none; }
              }
              .p4 { animation: p4 10s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

              @keyframes agentOutput {
                0%, 84% { opacity: 0; transform: translateY(12px); }
                86%, 95% { opacity: 1; transform: translateY(0); }
                98%, 100% { opacity: 0; }
              }
              .agent-output { animation: agentOutput 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }

              @keyframes hubBorderGlow {
                0%, 100% { stroke: #a855f7; stroke-opacity: 0.5; }
                50% { stroke: #c084fc; stroke-opacity: 1; filter: drop-shadow(0 0 8px rgba(168,85,247,0.5)); }
              }
              .hub-border { animation: hubBorderGlow 3s ease-in-out infinite; }
            `}
          </style>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* --- Window 1: Agent App --- */}
        <g>
          <rect x="20" y="40" width="250" height="240" rx="16" fill="url(#window-bg)" stroke="#3f3f46" strokeWidth="1" filter="url(#shadow)" />
          {/* Mac window dots */}
          <circle cx="40" cy="56" r="4" fill="#ef4444" />
          <circle cx="56" cy="56" r="4" fill="#f59e0b" />
          <circle cx="72" cy="56" r="4" fill="#10b981" />
          <text x="145" y="60" fill="#71717a" fontFamily="sans-serif" fontSize="11" fontWeight="500" textAnchor="middle">agent.ts</text>

          <g className="agent-key-placeholder">
            <text x="40" y="100" fill="#a1a1aa" fontFamily="monospace" fontSize="12">
              <tspan fill="#c084fc">const</tspan> API_KEY = "<tspan fill="#52525b">paste_key</tspan>";
            </text>
          </g>
          <g className="agent-key-actual">
            <text x="40" y="100" fill="#a1a1aa" fontFamily="monospace" fontSize="12">
              <tspan fill="#c084fc">const</tspan> API_KEY = "<tspan fill="#10b981">callio_sk_xyz</tspan>";
            </text>
          </g>

          <text x="40" y="125" fill="#a1a1aa" fontFamily="monospace" fontSize="12">
            <tspan fill="#60a5fa">const</tspan> resp = <tspan fill="#60a5fa">await</tspan> fetch(
          </text>
          <text x="40" y="145" fill="#34d399" fontFamily="monospace" fontSize="12">
            'callio/any_api'
          </text>
          <text x="40" y="165" fill="#a1a1aa" fontFamily="monospace" fontSize="12">
            auth: API_KEY
          </text>
          <text x="40" y="185" fill="#a1a1aa" fontFamily="monospace" fontSize="12">
            );
          </text>

          <rect x="40" y="220" width="60" height="28" rx="6" fill="url(#btn-blue)" className="btn-run" />
          <text x="70" y="238" fill="#fff" fontFamily="sans-serif" fontSize="12" fontWeight="600" textAnchor="middle">Run</text>

          <g className="agent-output">
            <rect x="110" y="200" width="140" height="60" rx="8" fill="#18181b" stroke="#3f3f46" filter="url(#shadow)" />
            <text x="120" y="220" fill="#10b981" fontFamily="monospace" fontSize="11" fontWeight="bold">200 OK</text>
            <text x="120" y="240" fill="#e4e4e7" fontFamily="monospace" fontSize="11">{"{"}</text>
            <text x="130" y="252" fill="#e4e4e7" fontFamily="monospace" fontSize="11">"content": "Hi!"</text>
            <text x="120" y="252" fill="#e4e4e7" fontFamily="monospace" fontSize="11">{"}"}</text>
          </g>
        </g>

        {/* --- Lines & Particles --- */}
        <line x1="270" y1="130" x2="330" y2="130" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="510" y1="130" x2="570" y2="130" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

        <line x1="330" y1="210" x2="270" y2="210" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="570" y1="210" x2="510" y2="210" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

        <circle cy="130" r="4" fill="#3b82f6" className="p1" />
        <circle cy="130" r="4" fill="#a855f7" className="p2" />
        <circle cy="210" r="4" fill="#10b981" className="p3" />
        <circle cy="210" r="4" fill="#10b981" className="p4" />

        {/* --- Window 2: Callio Hub --- */}
        <g>
          {/* Glow behind the hub */}
          <rect x="330" y="50" width="180" height="220" rx="16" fill="#a855f7" opacity="0.05" filter="url(#glow)" />
          <rect x="340" y="60" width="160" height="200" rx="12" fill="url(#hub-bg)" strokeWidth="2" className="hub-border" filter="url(#shadow)" />

          {/* Header */}
          <text x="420" y="90" fill="#fff" fontFamily="sans-serif" fontSize="15" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">Callio Proxy</text>
          <text x="420" y="110" fill="#a78bfa" fontFamily="sans-serif" fontSize="11" textAnchor="middle" opacity="0.8">Target: Any API</text>

          {/* Connect Button */}
          <rect x="360" y="130" width="120" height="32" rx="6" fill="url(#btn-purple)" className="btn-gen shadow-sm" />
          <text x="420" y="150" fill="#fff" fontFamily="sans-serif" fontSize="12" fontWeight="600" textAnchor="middle">Add to Agent</text>

          {/* Key Output Box */}
          <g className="callio-key">
            <rect x="360" y="180" width="120" height="28" rx="6" fill="#18181b" stroke="#3f3f46" />
            <text x="420" y="198" fill="#34d399" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">callio_sk_xyz</text>
          </g>

          {/* Auth Validate Icon */}
          <svg x="408" y="222" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" className="callio-lock">
            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
        </g>

        {/* --- Window 3: Any API Provider --- */}
        <g>
          <rect x="570" y="40" width="250" height="240" rx="16" fill="url(#window-bg)" stroke="#3f3f46" strokeWidth="1" filter="url(#shadow)" />

          {/* Mac window dots (decorative only here to balance) */}
          <circle cx="590" cy="56" r="4" fill="#ef4444" opacity="0.5" />
          <circle cx="606" cy="56" r="4" fill="#f59e0b" opacity="0.5" />
          <circle cx="622" cy="56" r="4" fill="#10b981" opacity="0.5" />

          <text x="695" y="60" fill="#71717a" fontFamily="sans-serif" fontSize="11" fontWeight="500" textAnchor="middle">api.provider.com</text>

          <text x="695" y="100" fill="#fff" fontFamily="sans-serif" fontSize="15" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">Any API Provider</text>

          {/* Abstract API Data Blocks */}
          <g transform="translate(605, 120)">
            <g transform="translate(0, 0)">
              <rect width="180" height="30" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
              <circle cx="15" cy="15" r="4" fill="#3b82f6" filter="url(#glow)" className="api-pulse" style={{ animationDelay: '0s' }} />
              <rect x="30" y="13" width="80" height="4" rx="2" fill="#52525b" />
              <rect x="140" y="13" width="24" height="4" rx="2" fill="#3f3f46" />
            </g>
            <g transform="translate(0, 42)">
              <rect width="180" height="30" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
              <circle cx="15" cy="15" r="4" fill="#10b981" filter="url(#glow)" className="api-pulse" style={{ animationDelay: '0.3s' }} />
              <rect x="30" y="13" width="50" height="4" rx="2" fill="#52525b" />
              <rect x="140" y="13" width="24" height="4" rx="2" fill="#3f3f46" />
            </g>
            <g transform="translate(0, 84)">
              <rect width="180" height="30" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
              <circle cx="15" cy="15" r="4" fill="#a855f7" filter="url(#glow)" className="api-pulse" style={{ animationDelay: '0.6s' }} />
              <rect x="30" y="13" width="100" height="4" rx="2" fill="#52525b" />
              <rect x="140" y="13" width="24" height="4" rx="2" fill="#3f3f46" />
            </g>
          </g>
        </g>

        {/* Cursor Graphic */}
        <g className="cursor drop-shadow-xl">
          <path d="M0 0L14 14L8.5 15.5L13 22L10 23L5.5 16.5L0 20.5Z" fill="white" stroke="#18181b" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
