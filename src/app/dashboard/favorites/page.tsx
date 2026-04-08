import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';
import { Star, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
    const { user, workspace } = await getCurrentUserWithWorkspace();

    if (!user || !workspace) {
        redirect('/login');
    }

    // Fetch Favorite APIs
    const favoriteApis = await prisma.favoriteApi.findMany({
        where: { userId: user.id },
        include: { api: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-[var(--page-bg)]">
            {/* Nav */}
            <nav className="border-b border-[var(--line)] bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <CallioLogo size={30} />
                    <div className="flex items-center gap-4">
                        <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
                        <Link href="/keys" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Keys</Link>
                        <Link href="/dashboard/logs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Logs</Link>
                        <UserNav />
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                            Favorite APIs
                        </h1>
                        <p className="text-[var(--muted)]">Your tailored collection of saved APIs for quick access.</p>
                    </div>
                </div>

                {/* Favorite APIs Grid */}
                <div className="mb-10">
                    {favoriteApis.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favoriteApis.map(({ api }) => (
                                <Link
                                    key={api.id}
                                    href={`/skills/callio/${api.slug}`}
                                    className="group bg-white rounded-xl border border-[var(--line)] p-4 hover:border-[var(--accent)] hover:shadow-md transition-all relative"
                                >
                                    <div className="flex items-start gap-3 mb-2 pr-8">
                                        <span className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[var(--soft)] rounded-lg">
                                            {api.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm group-hover:text-[var(--accent)] transition truncate">{api.name}</h3>
                                            <p className="text-[10px] text-[var(--muted)] font-mono truncate">callio/{api.slug}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[var(--muted)] line-clamp-2">{api.shortDescription}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-[var(--line)] p-12 flex flex-col items-center justify-center text-center mt-8">
                            <div className="w-12 h-12 bg-[var(--soft)] rounded-full flex items-center justify-center mb-4">
                                <Star className="w-6 h-6 text-[var(--muted)]" />
                            </div>
                            <h3 className="text-[var(--ink)] font-medium mb-1">No favorite APIs are available</h3>
                            <p className="text-[var(--muted)] text-sm mb-6">You have the option to save favorite apis</p>
                            <Link
                                href="/browse"
                                className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-strong)] transition shadow-sm"
                            >
                                Discover APIs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
