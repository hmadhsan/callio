import Link from 'next/link';

export function CallioMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0a0a0a" />
      <path
        d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12c2.1 0 4.08-.54 5.8-1.49"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="28" cy="14" r="3" fill="white" />
    </svg>
  );
}

export default function CallioLogo({ size = 34 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
      <CallioMark size={size} />
      <span className="text-lg font-semibold tracking-tight">Callio</span>
    </Link>
  );
}
