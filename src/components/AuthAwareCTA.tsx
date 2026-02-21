'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

export default function AuthAwareCTA({
  loggedOutHref = '/signup',
  loggedOutLabel = 'Get Started Free',
  loggedInHref = '/dashboard',
  loggedInLabel = 'Go to Dashboard',
  className = '',
  variant = 'primary',
}: {
  loggedOutHref?: string;
  loggedOutLabel?: string;
  loggedInHref?: string;
  loggedInLabel?: string;
  className?: string;
  variant?: 'primary' | 'outline-white';
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setLoggedIn(!!data?.user);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const href = loggedIn ? loggedInHref : loggedOutHref;
  const label = loggedIn ? loggedInLabel : loggedOutLabel;
  const icon = loggedIn ? <LayoutDashboard className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />;

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 transition ${className} ${!loaded ? 'opacity-80' : ''}`}
    >
      {label} {icon}
    </Link>
  );
}
