import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Callio - The API Gateway for AI Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(130deg, #091a2b 0%, #11263d 45%, #1a3553 100%)",
          fontFamily: "Segoe UI, Helvetica Neue, Arial, sans-serif",
          position: "relative",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(255,133,51,0.5) 0%, rgba(255,133,51,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(35,183,232,0.38) 0%, rgba(35,183,232,0) 72%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            opacity: 0.24,
          }}
        />

        <div
          style={{
            width: "100%",
            padding: "56px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  border: "2px solid rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 900,
                  background: "rgba(0,0,0,0.24)",
                }}
              >
                C
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                callio
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              MCP + REST
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: "-0.04em",
                textWrap: "balance",
              }}
            >
              One API Gateway for AI Agents
            </div>
            <div
              style={{
                fontSize: 28,
                color: "rgba(233,244,255,0.92)",
                marginTop: 20,
                lineHeight: 1.34,
              }}
            >
              Discover, authenticate, and call the full API catalog through one unified interface.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { value: "MCP", label: "Agent-native" },
                { value: "BYOK", label: "Secure keys" },
                { value: "One", label: "Gateway" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "14px 18px",
                    minWidth: 168,
                    borderRadius: 14,
                    background: "rgba(8,12,20,0.45)",
                    border: "1px solid rgba(255,255,255,0.24)",
                  }}
                >
                  <span style={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>{item.value}</span>
                  <span style={{ fontSize: 16, marginTop: 4, color: "rgba(236,244,251,0.9)" }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ffd0af",
              }}
            >
              callio.dev
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
