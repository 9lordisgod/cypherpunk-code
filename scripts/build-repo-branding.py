#!/usr/bin/env python3
"""Build GitHub repo branding: app-icon box with logo centered inside."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
LOGO_SRC = ROOT / "public" / "logo.png"
OUT_ICON = ROOT / ".github" / "app-icon-box.png"
OUT_BANNER = ROOT / ".github" / "repo-banner.png"

SIZE = 512
RADIUS = 96
BG = (13, 17, 23, 255)          # #0d1117
BORDER = (0, 200, 83, 255)      # #00c853
GLOW = (0, 200, 83, 60)
INNER = (22, 27, 34, 255)        # #161b22
GRID = (0, 200, 83, 28)


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius: int, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def build_app_icon_box() -> None:
    base = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(base)

    # Outer glow
    glow_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    rounded_rect(glow_draw, (24, 24, SIZE - 24, SIZE - 24), RADIUS + 8, GLOW)
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(12))
    base = Image.alpha_composite(base, glow_layer)

    draw = ImageDraw.Draw(base)
    rounded_rect(draw, (32, 32, SIZE - 32, SIZE - 32), RADIUS, BG)
    rounded_rect(draw, (40, 40, SIZE - 40, SIZE - 40), RADIUS - 8, INNER)

    # Subtle tech grid
    for i in range(56, SIZE - 56, 32):
        draw.line([(i, 56), (i, SIZE - 56)], fill=GRID, width=1)
        draw.line([(56, i), (SIZE - 56, i)], fill=GRID, width=1)

    rounded_rect(draw, (32, 32, SIZE - 32, SIZE - 32), RADIUS, outline=BORDER, width=3)

    logo = Image.open(LOGO_SRC).convert("RGBA")
    target = int(SIZE * 0.52)
    logo.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (SIZE - logo.width) // 2
    y = (SIZE - logo.height) // 2
    base.paste(logo, (x, y), logo)

    OUT_ICON.parent.mkdir(parents=True, exist_ok=True)
    base.save(OUT_ICON, format="PNG", optimize=True)
    print(f"wrote {OUT_ICON}")


def build_banner() -> None:
    width, height = 1280, 320
    banner = Image.new("RGBA", (width, height), BG)
    draw = ImageDraw.Draw(banner)

    # Accent lines
    draw.rectangle([(0, 0), (width, 4)], fill=BORDER)
    draw.rectangle([(0, height - 4), (width, height)], fill=BORDER)

    for x in range(0, width, 48):
        draw.line([(x, 0), (x, height)], fill=GRID, width=1)

    icon = Image.open(OUT_ICON).convert("RGBA")
    icon_size = 180
    icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    banner.paste(icon, (80, (height - icon_size) // 2), icon)

    # Decorative terminal dots
    for idx, alpha in enumerate([220, 160, 120]):
        draw.ellipse([(1010 + idx * 28, 42), (1024 + idx * 28, 56)], fill=(alpha, alpha, alpha, 255))

    banner.save(OUT_BANNER, format="PNG", optimize=True)
    print(f"wrote {OUT_BANNER}")


if __name__ == "__main__":
    build_app_icon_box()
    build_banner()