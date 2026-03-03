import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';
import ContactForm from '@/components/ContactForm';

export const metadata = {
    title: 'Contact Us | Callio',
    description: 'Get in touch with the Callio team for support, feedback, or API listings.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-white">
            {/* Nav */}
            <nav className="border-b border-[var(--line)] bg-[var(--page-bg)]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <CallioLogo size={30} />
                    <div className="flex items-center gap-4">
                        <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
                        <Link href="/docs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Docs</Link>
                        <UserNav />
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-12 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left Column: Heading and Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-color)] border border-[var(--line)] text-sm font-semibold text-[var(--muted)] mb-6">
                                <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                                <span>Contact Us</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                                Let&apos;s get in <span className="text-[var(--accent)]">touch.</span>
                            </h1>
                            <p className="text-lg text-[var(--muted)] leading-relaxed">
                                Have a question about Callio? Want to list your API on our marketplace? Or just want to say hi? We&apos;d love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Email Block */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white border border-[var(--line)] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-[var(--ink)]" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--ink)] font-bold mb-1">Email Us</h3>
                                    <p className="text-[var(--muted)] text-sm mb-2">For general inquiries and support.</p>
                                    <a href="mailto:hello@callio.dev" className="text-[var(--accent)] hover:underline font-medium">
                                        hello@callio.dev
                                    </a>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border border-[var(--line)] rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-[var(--ink)] mb-8">Send a Message</h2>
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer id="footer" className="py-12 bg-[#0a0a0a] text-[#a1a1aa] mt-auto">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center text-sm">
                    &copy; 2026 Callio. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
