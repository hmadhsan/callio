import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Callio — The API Gateway for AI Agents';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#111111',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 80px',
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              C
            </div>
            <span
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: '#111111',
                letterSpacing: '-0.03em',
              }}
            >
              callio
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#111111',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: 24,
            }}
          >
            The API Gateway for AI Agents
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 20,
              color: '#6b7280',
              textAlign: 'center',
              maxWidth: 700,
              lineHeight: 1.5,
              marginBottom: 40,
            }}
          >
            90+ APIs. One key. Works with Claude Code, Cursor & Antigravity.
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 48,
            }}
          >
            {[
              { num: '90+', label: 'APIs' },
              { num: '399', label: 'Endpoints' },
              { num: 'MCP', label: 'Ready' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#111111',
                  }}
                >
                  {stat.num}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    color: '#9ca3af',
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18, color: '#9ca3af' }}>callio.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
