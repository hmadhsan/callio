"""
Generate a looping explainer GIF: how MCP connects an AI agent to Callio.

Requires: pip install Pillow

Usage:
  python scripts/generate-mcp-explainer-gif.py

Output:
  public/explainers/callio-mcp-explainer.gif
"""

from __future__ import annotations

import math
import os
import platform
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "explainers" / "callio-mcp-explainer.gif"

W, H = 920, 520
BG = "#0b1020"
CARD = "#111827"
CARD_BORDER = "#334155"
ACCENT = "#7c3aed"
TEXT = "#f8fafc"
MUTED = "#94a3b8"
ARROW = "#38bdf8"
GREEN = "#22c55e"


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates: list[str] = []
    if platform.system() == "Windows":
        candidates = [
            r"C:\Windows\Fonts\segoeuib.ttf",
            r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arial.ttf",
        ]
    else:
        candidates = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
        ]
    for path in candidates:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int, int, int],
    radius: int,
    fill: str,
    outline: str | None = None,
    width: int = 1,
) -> None:
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=fill, outline=outline, width=width)


def draw_arrow(
    draw: ImageDraw.ImageDraw,
    start: tuple[float, float],
    end: tuple[float, float],
    color: str,
    width: int,
    head: int = 12,
) -> None:
    x0, y0 = start
    x1, y1 = end
    draw.line((x0, y0, x1, y1), fill=color, width=width)
    ang = math.atan2(y1 - y0, x1 - x0)
    for da in (math.pi * 5 / 6, -math.pi * 5 / 6):
        ax = x1 + head * math.cos(ang + da)
        ay = y1 + head * math.sin(ang + da)
        draw.line((x1, y1, ax, ay), fill=color, width=width)


def ease(t: float) -> float:
    return t * t * (3 - 2 * t)


def frame(i: int, n: int) -> Image.Image:
    t = i / max(n - 1, 1)
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    title = load_font(28)
    body = load_font(18)
    small = load_font(15)
    mono = load_font(14)

    # Title
    d.text((40, 28), "How MCP works with Callio", fill=TEXT, font=title)
    d.text((40, 68), "One MCP server in your agent. One Callio key. Real upstream APIs.", fill=MUTED, font=small)

    # Layout boxes
    agent = (40, 130, 280, 240)
    mcp = (320, 130, 600, 260)
    gateway = (640, 130, 880, 220)
    upstream = (640, 250, 880, 380)

    # Phase visibility
    p1 = ease(min(1.0, max(0.0, (t - 0.05) / 0.2)))
    p2 = ease(min(1.0, max(0.0, (t - 0.25) / 0.2)))
    p3 = ease(min(1.0, max(0.0, (t - 0.45) / 0.2)))
    p4 = ease(min(1.0, max(0.0, (t - 0.65) / 0.2)))

    # Agent
    if p1 > 0:
        rounded_rect(d, agent, 14, CARD, CARD_BORDER, 2)
        d.text((agent[0] + 16, agent[1] + 16), "AI agent", fill=TEXT, font=body)
        d.text((agent[0] + 16, agent[1] + 48), "Cursor · Claude Code · etc.", fill=MUTED, font=small)
        d.text((agent[0] + 16, agent[1] + 78), "Runs an MCP client", fill=MUTED, font=small)

    # Arrow agent -> MCP
    if p2 > 0:
        aw = max(1, int(3 * p2))
        ax0 = agent[2] - 4
        ay0 = (agent[1] + agent[3]) / 2
        ax1 = mcp[0] + 8
        ay1 = (mcp[1] + mcp[3]) / 2
        draw_arrow(d, (ax0, ay0), (ax1, ay1), ARROW, aw)
        d.text((int((ax0 + ax1) / 2) - 18, int((ay0 + ay1) / 2) - 22), "MCP", fill=ARROW, font=small)

    # Callio MCP server
    if p2 > 0:
        rounded_rect(d, mcp, 14, CARD, ACCENT if p3 > 0.5 else CARD_BORDER, 2)
        d.text((mcp[0] + 16, mcp[1] + 14), "Callio MCP server", fill=TEXT, font=body)
        d.text((mcp[0] + 16, mcp[1] + 46), "Discovers tools from your catalog", fill=MUTED, font=small)
        d.text((mcp[0] + 16, mcp[1] + 72), "e.g. restcountries.search · openai.chat", fill=MUTED, font=mono)

    # Arrow MCP -> Gateway
    if p3 > 0:
        aw = max(1, int(3 * p3))
        bx0 = mcp[2] - 4
        by0 = (mcp[1] + mcp[3]) / 2
        bx1 = gateway[0] + 8
        by1 = (gateway[1] + gateway[3]) / 2
        draw_arrow(d, (bx0, by0), (bx1, by1), ARROW, aw)

    # Gateway
    if p3 > 0:
        rounded_rect(d, gateway, 14, CARD, GREEN if p4 > 0.5 else CARD_BORDER, 2)
        d.text((gateway[0] + 14, gateway[1] + 14), "Callio API gateway", fill=TEXT, font=body)
        d.text((gateway[0] + 14, gateway[1] + 46), "Validates your Callio key", fill=MUTED, font=small)
        d.text((gateway[0] + 14, gateway[1] + 72), "Injects BYOK provider keys", fill=MUTED, font=small)

    # Arrow gateway -> upstream
    if p4 > 0:
        aw = max(1, int(3 * p4))
        cx0 = (gateway[0] + gateway[2]) / 2
        cy0 = gateway[3] - 4
        cx1 = (upstream[0] + upstream[2]) / 2
        cy1 = upstream[1] + 8
        draw_arrow(d, (cx0, cy0), (cx1, cy1), GREEN, aw)

    # Upstream
    if p4 > 0:
        rounded_rect(d, upstream, 14, CARD, CARD_BORDER, 2)
        d.text((upstream[0] + 14, upstream[1] + 14), "Real APIs", fill=TEXT, font=body)
        d.text((upstream[0] + 14, upstream[1] + 46), "OpenAI · Stripe · Wikipedia · …", fill=MUTED, font=small)

    # Footer callout
    foot_y = 420
    d.text((40, foot_y), "You configure:", fill=MUTED, font=small)
    d.text((40, foot_y + 22), "1) MCP server in the agent  2) CALLIO_API_KEY  3) Provider keys (when needed)", fill=TEXT, font=mono)

    return img


def main() -> None:
    n_frames = 36
    duration_ms = 90
    frames = [frame(i, n_frames) for i in range(n_frames)]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
    )
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
