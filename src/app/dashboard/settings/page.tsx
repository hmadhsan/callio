import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Settings, User, CreditCard, Shield } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import UserNav from '@/components/UserNav';
import ProfileSettingsForm from '@/components/ProfileSettingsForm';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId: user.id }
    });

    return (
        <div className="min-h-screen bg-[var(--page-bg)]">
            <nav className="border-b border-[var(--line)] bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <CallioLogo size={30} />
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
                        <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
                        <Link href="/keys" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Keys</Link>
                        <UserNav />
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-6 h-6" />
                    <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
                </div>
                <p className="text-[var(--muted)] mb-8">
                    Manage your account profile, preferences, and billing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-1">
                        <div className="p-3 bg-[var(--soft)] text-[var(--ink)] rounded-lg font-medium text-sm flex items-center gap-2">
                            <User className="w-4 h-4" /> Profile
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl border border-[var(--line)] p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                Personal Information
                            </h2>
                            <ProfileSettingsForm user={user} />
                        </div>

                        <div className="bg-white rounded-xl border border-[var(--line)] p-6 shadow-sm mt-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" /> Billing & Plan
                            </h2>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Free'} Plan
                                    </p>
                                    <p className="text-sm text-gray-500">Manage your subscription via Stripe</p>
                                </div>
                                {subscription?.plan ? (
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">Active</span>
                                ) : (
                                    <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-md">Free</span>
                                )}
                            </div>
                            <form action="/api/stripe/create-portal" method="POST">
                                <button type="submit" className="px-5 py-2.5 bg-white text-gray-900 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto text-center inline-block">
                                    Manage Billing
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm mt-6">
                            <h2 className="text-lg font-semibold mb-2 text-red-600 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Danger Zone
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button disabled className="px-5 py-2.5 bg-red-50 text-red-600 text-sm font-medium border border-red-200 rounded-lg opacity-50 cursor-not-allowed transition w-full sm:w-auto text-center inline-block">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
