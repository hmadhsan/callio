'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Key, LayoutDashboard, ChevronDown, Settings, Users, Star } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

interface UserNavProps {
  /** Variant for different page styles */
  variant?: 'default' | 'landing';
}

export default function UserNav({ variant = 'default' }: UserNavProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    // Broadcast auth change so all auth-aware components update instantly
    window.dispatchEvent(new CustomEvent('callio:auth-change', { detail: { user: null } }));
    router.push('/');
    router.refresh();
  };

  // Show nothing while loading to prevent flash
  if (loading) {
    return <div className="w-24 h-8" />;
  }

  // Not logged in — show sign in / get started
  if (!user) {
    if (variant === 'landing') {
      return (
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] transition"
          >
            Get Started
          </Link>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">
          Sign in
        </Link>
        <Link
          href="/signup"
          className="text-sm px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition font-medium"
        >
          Get started
        </Link>
      </div>
    );
  }

  // Logged in — show avatar dropdown
  const initials = (user.name || user.email)
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0].toUpperCase())
    .join('');

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--soft)] px-3 py-1.5 transition"
      >
        <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <span className="text-sm font-medium text-[var(--ink)] hidden sm:inline max-w-[120px] truncate">
          {user.name || user.email.split('@')[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--line)] bg-white shadow-lg z-50 py-1">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--line)]">
            <p className="text-sm font-semibold text-[var(--ink)] truncate">{user.name || 'User'}</p>
            <p className="text-xs text-[var(--muted)] truncate">{user.email}</p>
          </div>

          {/* Links */}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--soft)] transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[var(--muted)]" />
            Dashboard
          </Link>
          <Link
            href="/keys"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--soft)] transition"
          >
            <Key className="w-4 h-4 text-[var(--muted)]" />
            API Keys
          </Link>
          <Link
            href="/browse"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--soft)] transition"
          >
            <User className="w-4 h-4 text-[var(--muted)]" />
            Browse APIs
          </Link>
          <Link
            href="/dashboard/team"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--soft)] transition"
          >
            <Users className="w-4 h-4 text-[var(--muted)]" />
            Team Workspace
          </Link>
          <Link
            href="/dashboard/favorites"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--soft)] transition"
          >
            <Star className="w-4 h-4 text-[var(--muted)]" />
            Favorite APIs
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--soft)] transition"
          >
            <Settings className="w-4 h-4 text-[var(--muted)]" />
            Settings
          </Link>

          {/* Logout */}
          <div className="border-t border-[var(--line)] mt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
