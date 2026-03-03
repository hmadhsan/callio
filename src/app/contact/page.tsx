import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
    title: 'Contact Us | Callio',
    description: 'Get in touch with the Callio team for support, feedback, or API listings.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex flex-col text-white font-sans selection:bg-[var(--accent)] selection:text-black">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors mb-12 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left Column: Heading and Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-color)] border border-gray-800 text-sm font-semibold text-[var(--muted)] mb-6">
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
                                <div className="w-12 h-12 bg-[var(--surface-color)] border border-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Email Us</h3>
                                    <p className="text-[var(--muted)] text-sm mb-2">For general inquiries and support.</p>
                                    <a href="mailto:hello@callio.dev" className="text-[var(--accent)] hover:underline font-medium">
                                        hello@callio.dev
                                    </a>
                                </div>
                            </div>

                            {/* Discord / Community Block */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--surface-color)] border border-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Join the Community</h3>
                                    <p className="text-[var(--muted)] text-sm mb-2">Connect with other developers building AI agents.</p>
                                    <a href="#" className="text-[var(--accent)] hover:underline font-medium">
                                        Callio Discord Server →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-black/40 border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            {/* Subtle background glow effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-8">Send a Message</h2>
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
