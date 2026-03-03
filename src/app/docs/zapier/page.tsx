import Link from 'next/link';
import { ExternalLink, Key, Zap, ArrowRight, Code2, Webhook } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import UserNav from '@/components/UserNav';

export const metadata = {
    title: 'Zapier & Make Integration — Callio',
    description:
        'Connect any Callio API to Zapier or Make (Integromat) without writing a single line of code.',
};

const STEP_BASE_URL = 'https://callio.dev/api/zapier/trigger';

export default function ZapierDocsPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Nav */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <CallioLogo size={30} />
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/browse" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">APIs</Link>
                            <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Docs</Link>
                        </div>
                    </div>
                    <UserNav />
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">⚡</span>
                        <span className="text-4xl">🔗</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Zapier &amp; Make Integration</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Connect any Callio API to 6,000+ apps in Zapier or Make — no code required. Use your
                        Callio API key to authenticate and automate workflows in minutes.
                    </p>
                </div>

                {/* Prerequisites */}
                <section className="mb-12 p-6 bg-orange-50 border border-orange-200 rounded-xl">
                    <h2 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                        <Key className="w-5 h-5" /> Before You Start
                    </h2>
                    <p className="text-orange-800 text-sm mb-3">
                        You need a <strong>Callio API key</strong> to authenticate requests. Generate one for free:
                    </p>
                    <Link
                        href="/keys"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                        Generate API Key <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>

                {/* Trigger endpoint reference */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-gray-400" /> Trigger Endpoint
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Callio exposes a polling trigger endpoint for each API. It returns the last 10 requests
                        your workspace made to that API — perfect as a Zapier "New Event" trigger.
                    </p>
                    <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-gray-100 overflow-x-auto">
                        <span className="text-green-400">GET</span>{' '}
                        <span className="text-orange-300">{STEP_BASE_URL}</span>
                        <span className="text-yellow-300">/:apiSlug</span>
                        <br /><br />
                        <span className="text-gray-400"># Headers</span>
                        <br />
                        Authorization: Bearer <span className="text-yellow-300">{'<your-callio-api-key>'}</span>
                    </div>
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm">
                        <p className="font-semibold text-gray-900 mb-2">Example response:</p>
                        <pre className="text-gray-700 overflow-x-auto">{`[
  {
    "id": "cm9abc...",
    "apiSlug": "openai",
    "method": "POST",
    "path": "chat/completions",
    "statusCode": 200,
    "latencyMs": 342,
    "triggeredAt": "2026-03-03T00:12:45.000Z"
  }
]`}</pre>
                    </div>
                </section>

                {/* Zapier Setup */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500" /> Zapier Setup
                    </h2>
                    <ol className="space-y-6">
                        {[
                            {
                                step: 1,
                                title: 'Create a new Zap',
                                body: 'Go to zapier.com → Create → New Zap.',
                            },
                            {
                                step: 2,
                                title: 'Choose "Webhooks by Zapier" as the Trigger',
                                body: 'Search for "Webhooks by Zapier" and select the Polling trigger type.',
                            },
                            {
                                step: 3,
                                title: 'Set the polling URL',
                                body: `Paste your trigger URL:\n${STEP_BASE_URL}/<your-api-slug>\n\nExample: ${STEP_BASE_URL}/openai`,
                                mono: true,
                            },
                            {
                                step: 4,
                                title: 'Add your Authorization header',
                                body: 'In the Headers section, add:\n  Key: Authorization\n  Value: Bearer <your-callio-api-key>',
                                mono: true,
                            },
                            {
                                step: 5,
                                title: 'Test & continue to your Action',
                                body: 'Click "Test trigger" — Zapier will fetch recent events. Then add any Action (e.g. send a Slack message, update a Google Sheet, etc.).',
                            },
                        ].map(({ step, title, body, mono }) => (
                            <li key={step} className="flex gap-5">
                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-yellow-100 text-yellow-700 font-bold flex items-center justify-center text-sm">
                                    {step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                                    {mono ? (
                                        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap">{body}</pre>
                                    ) : (
                                        <p className="text-gray-600 text-sm">{body}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-6">
                        <a
                            href="https://zapier.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Open Zapier <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </section>

                {/* Make Setup */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Webhook className="w-6 h-6 text-purple-500" /> Make (Integromat) Setup
                    </h2>
                    <ol className="space-y-6">
                        {[
                            {
                                step: 1,
                                title: 'Create a new Scenario',
                                body: 'In Make, click Create a new scenario.',
                            },
                            {
                                step: 2,
                                title: 'Add an HTTP → Make a Request module',
                                body: 'Search for the "HTTP" app and choose "Make a Request".',
                            },
                            {
                                step: 3,
                                title: 'Configure the request',
                                body: `URL: ${STEP_BASE_URL}/<your-api-slug>\nMethod: GET`,
                                mono: true,
                            },
                            {
                                step: 4,
                                title: 'Add the Authorization header',
                                body: 'Under Headers, click Add item:\n  Name: Authorization\n  Value: Bearer <your-callio-api-key>',
                                mono: true,
                            },
                            {
                                step: 5,
                                title: 'Parse the response & connect actions',
                                body: 'Enable "Parse response" → JSON. The response array feeds into any downstream module (Google Sheets, Slack, Notion, etc.).',
                            },
                            {
                                step: 6,
                                title: 'Schedule the scenario',
                                body: 'Set the scenario to run on a schedule (e.g. every 15 minutes) to poll for new events.',
                            },
                        ].map(({ step, title, body, mono }) => (
                            <li key={step} className="flex gap-5">
                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                                    {step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                                    {mono ? (
                                        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap">{body}</pre>
                                    ) : (
                                        <p className="text-gray-600 text-sm">{body}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-6">
                        <a
                            href="https://make.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Open Make <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </section>

                {/* Available API slugs hint */}
                <section className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                    <h2 className="font-semibold text-gray-900 mb-2">Available API Slugs</h2>
                    <p className="text-sm text-gray-600 mb-3">
                        Replace <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">&lt;your-api-slug&gt;</code> with any API slug from the Callio marketplace, e.g.:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['openai', 'stripe', 'sendgrid', 'github', 'slack', 'airtable'].map((slug) => (
                            <Link
                                key={slug}
                                href={`/apis/${slug}`}
                                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-mono text-gray-700 hover:border-orange-400 hover:text-orange-700 transition"
                            >
                                {slug}
                            </Link>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        <Link href="/browse" className="text-orange-600 hover:underline">Browse all APIs →</Link>
                    </p>
                </section>
            </div>
        </div>
    );
}
