/* Inline SVG brand logos for AI tool integrations */

export function ClaudeLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#D97757" />
      <g transform="translate(50,50)">
        {/* Starburst rays */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1="0" y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * 28}
            y2={Math.sin((angle * Math.PI) / 180) * 28}
            stroke="#FAE8D4"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}

export function CursorLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

export function AntigravityLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#1A1A2E" />
      <defs>
        <linearGradient id="ag-grad" x1="30" y1="75" x2="55" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2B8CFF" />
          <stop offset="40%" stopColor="#00C853" />
          <stop offset="70%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#FF3D00" />
        </linearGradient>
      </defs>
      <path
        d="M50 18C50 18 38 45 28 70C26 75 29 78 33 76C37 74 42 68 50 68C58 68 63 74 67 76C71 78 74 75 72 70C62 45 50 18 50 18Z"
        fill="url(#ag-grad)"
      />
    </svg>
  );
}
