'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { THEME_STORAGE_KEY, type ThemeMode } from '@/lib/theme-storage';

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode);
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored === 'dark' || stored === 'light') {
        setMode(stored);
        applyTheme(stored);
        return;
      }
    } catch {
      /* ignore */
    }
    setMode('light');
    applyTheme('light');
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--soft)] p-2 text-[var(--ink)] transition hover:bg-[var(--line)] ${className}`}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mode === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
