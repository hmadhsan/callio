'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

const SECTIONS = [
    { id: 'hero', label: 'Hero' },
    { id: 'stats', label: 'Stats' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'code-snippet', label: 'Code Snippet' },
    { id: 'security', label: 'Security' },
    { id: 'mcp-setup', label: 'MCP Setup' },
    { id: 'demo', label: 'Book a Demo' },
    { id: 'contact', label: 'Contact' },
    { id: 'faq', label: 'FAQ' },
    { id: 'footer', label: 'Footer' },
];

export default function AnalyticsTracker() {
    useEffect(() => {
        if (typeof window === 'undefined' || !window.gtag) return;

        const seen = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !seen.has(entry.target.id)) {
                        seen.add(entry.target.id);
                        const section = SECTIONS.find((s) => s.id === entry.target.id);
                        if (section && window.gtag) {
                            window.gtag('event', 'section_view', {
                                event_category: 'engagement',
                                event_label: section.label,
                                section_name: section.label,
                            });
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        // Observe all sections
        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // Track CTA clicks
        const trackClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a, button');
            if (!link) return;

            const text = link.textContent?.trim() || '';
            const href = link.getAttribute('href') || '';

            // Track key CTAs
            if (
                text.includes('Get Started') ||
                text.includes('Sign Up') ||
                text.includes('Upgrade') ||
                text.includes('View Demo') ||
                text.includes('Book a demo') ||
                text.includes('View integrations') ||
                text.includes('Integrations') ||
                href === '/signup' ||
                href === '/pricing' ||
                href === '/browse' ||
                href.includes('calendly.com')
            ) {
                window.gtag?.('event', 'cta_click', {
                    event_category: 'conversion',
                    event_label: text,
                    link_url: href,
                });
            }
        };

        document.addEventListener('click', trackClick);

        return () => {
            observer.disconnect();
            document.removeEventListener('click', trackClick);
        };
    }, []);

    return null;
}
