import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ArrowLeft, Users, ShieldAlert, Mail } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import UserNav from '@/components/UserNav';
import TeamInviteForm from '@/components/TeamInviteForm';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
    const { user, workspace } = await getCurrentUserWithWorkspace();

    if (!user || !workspace) {
        redirect('/login');
    }

    // Fetch all members of this workspace
    const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: workspace.id },
        include: { user: true },
        orderBy: { role: 'asc' }, // OWNER first, then ADMIN, then MEMBER
    });

    // Fetch pending invites
    const invites = await prisma.workspaceInvite.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: 'desc' },
    });

    const isOwner = members.find(m => m.userId === user.id)?.role === 'OWNER';

    return (
        <div className="min-h-screen bg-[var(--page-bg)]">
            {/* Nav */}
            <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <CallioLogo size={30} />
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
                        <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
                        <Link href="/keys" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Keys</Link>
                        <Link href="/dashboard/logs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Logs</Link>
                        <UserNav />
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/dashboard" className="p-2 -ml-2 hover:bg-black/5 rounded-lg transition text-[var(--muted)] hover:text-[var(--ink)]">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            Team Workspace
                        </h1>
                        <p className="text-[var(--muted)] text-sm mt-1">Manage members and invites for <span className="font-semibold text-[var(--ink)]">{workspace.name}</span>.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-[var(--line)] bg-[var(--soft)] flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                                    <Users className="w-4 h-4 text-[var(--accent)]" />
                                    Active Members
                                </div>
                                <span className="text-xs bg-[var(--line)] px-2 py-0.5 rounded-full font-medium">{members.length}</span>
                            </div>
                            <ul className="divide-y divide-[var(--line)]">
                                {members.map((member) => (
                                    <li key={member.id} className="p-4 flex items-center justify-between hover:bg-[var(--soft)]/30 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent)] to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                                                {member.user.name?.charAt(0) || member.user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--ink)]">{member.user.name || 'Unknown User'}</p>
                                                <p className="text-xs text-[var(--muted)]">{member.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${member.role === 'OWNER' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}>
                                                {member.role === 'OWNER' && <ShieldAlert className="w-3 h-3 inline mr-1 -mt-0.5" />}
                                                {member.role}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {invites.length > 0 && (
                            <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-[var(--line)] bg-[var(--soft)] flex items-center justify-between text-sm font-medium text-[var(--ink)]">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        Pending Invites
                                    </div>
                                </div>
                                <ul className="divide-y divide-[var(--line)]">
                                    {invites.map((invite) => (
                                        <li key={invite.id} className="p-4 flex items-center justify-between opacity-80">
                                            <div>
                                                <p className="text-sm font-medium text-[var(--ink)]">{invite.email}</p>
                                                <p className="text-xs text-[var(--muted)]">Invited on {new Date(invite.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200 uppercase tracking-wider">
                                                Pending
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-5">
                            <h3 className="font-semibold text-sm mb-4">Invite new member</h3>
                            {isOwner ? (
                                <TeamInviteForm workspaceId={workspace.id} />
                            ) : (
                                <div className="text-sm text-[var(--muted)] bg-[var(--soft)] p-4 rounded-lg border border-[var(--line)]">
                                    Only the workspace owner can invite new members.
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 text-sm text-blue-800">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Workspace Security
                            </h4>
                            <p className="mb-2">Members of this workspace have full access to view API Keys and usage logs.</p>
                            <p>They <b>cannot</b> access your personal billing information or delete the workspace.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
