#!/usr/bin/env python3
"""Generate an elegant high-resolution Cypherpunk Code logo (v2)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 2048
OUTPUT_DIR = Path(__file__).resolve().parent

# Monero orange palette (#FF6600 from official logo — not Bitcoin #F7931A)
ORANGE = (255, 102, 0, 255)        # #ff6600
ORANGE_DEEP = (204, 72, 0, 255)    # #cc4800
ORANGE_LIGHT = (255, 153, 77, 255)  # #ff994d

# C glyph geometry (normalized radius in [-1, 1] space)
OUTER_R = 0.78
INNER_R = 0.36  # smaller inner hole = thicker C stroke


def inside_c(x: float, y: float) -> float:
    """Return fill strength (0-1) for a refined open C glyph."""
    cx, cy = 0.0, 0.0
    dx, dy = x - cx, y - cy
    r = math.hypot(dx, dy)
    if r < 1e-6:
        return 0.0

    angle = math.atan2(dy, dx)
    if angle < 0:
        angle += 2 * math.pi

    # Open C: gap on the right — narrow gap so arms sweep further right
    gap_start = math.radians(322)
    gap_end = math.radians(38)
    in_gap = gap_start <= angle or angle <= gap_end
    if in_gap:
        return 0.0

    if r > OUTER_R or r < INNER_R:
        return 0.0

    # Tighter tip fade keeps the extended right curve solid longer
    arm_softness = 0.085
    dist_to_gap_edge = min(
        abs(angle - gap_end),
        abs(angle - gap_start) if angle >= gap_start else abs(angle + 2 * math.pi - gap_start),
    )
    edge_fade = min(1.0, dist_to_gap_edge / arm_softness)

    # Radial falloff for smoother inner/outer edges
    mid_r = (OUTER_R + INNER_R) / 2
    radial = 1.0 - abs(r - mid_r) / ((OUTER_R - INNER_R) / 2)
    radial = max(0.0, min(1.0, radial))

    return edge_fade * (0.35 + 0.65 * radial)


def dot_color(strength: float, depth: float) -> tuple[int, int, int, int]:
    """Pick dot color with subtle depth variation."""
    if depth > 0.65:
        base = ORANGE_LIGHT
    elif depth < 0.35:
        base = ORANGE_DEEP
    else:
        base = ORANGE

    alpha = int(255 * min(1.0, strength * 1.05))
    return (*base[:3], alpha)


def render_logo(size: int = SIZE) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = size * 0.14
    drawable = size - 2 * margin
    spacing = drawable / 34  # refined grid density
    dot_base = spacing * 0.36

    cols = int(drawable / spacing) + 1
    rows = int(drawable / spacing) + 1

    for row in range(rows):
        for col in range(cols):
            px = margin + col * spacing + spacing / 2
            py = margin + row * spacing + spacing / 2

            # Normalize to [-1, 1]
            nx = (px / size - 0.5) * 2
            ny = (py / size - 0.5) * 2

            strength = inside_c(nx, ny)
            if strength < 0.12:
                continue

            depth = (math.hypot(nx, ny) - INNER_R) / (OUTER_R - INNER_R)
            depth = max(0.0, min(1.0, depth))

            # Halftone fade toward outer boundary for an elegant vignette
            r = math.hypot(nx, ny)
            edge_dist = min(r - INNER_R, OUTER_R - r) / (OUTER_R - INNER_R)
            vignette = max(0.0, min(1.0, edge_dist * 2.8))
            presence = strength * (0.55 + 0.45 * vignette)

            # Elegant size variation: larger on outer arc, finer inside
            radius = dot_base * (0.78 + 0.32 * depth) * (0.65 + 0.35 * presence)
            color = dot_color(presence, depth)

            draw.ellipse(
                (px - radius, py - radius, px + radius, py + radius),
                fill=color,
            )

    return img


def render_svg(size: int = SIZE) -> str:
    """SVG version for infinite scalability."""
    spacing = (size * 0.72) / 34
    margin = size * 0.14
    dot_base = spacing * 0.36
    cols = int((size - 2 * margin) / spacing) + 1
    rows = int((size - 2 * margin) / spacing) + 1

    circles: list[str] = []
    for row in range(rows):
        for col in range(cols):
            px = margin + col * spacing + spacing / 2
            py = margin + row * spacing + spacing / 2
            nx = (px / size - 0.5) * 2
            ny = (py / size - 0.5) * 2
            strength = inside_c(nx, ny)
            if strength < 0.18:
                continue
            depth = max(0.0, min(1.0, (math.hypot(nx, ny) - INNER_R) / (OUTER_R - INNER_R)))
            radius = dot_base * (0.78 + 0.32 * depth) * (0.65 + 0.35 * strength)
            if depth > 0.65:
                fill = "#ff994d"
            elif depth < 0.35:
                fill = "#cc4800"
            else:
                fill = "#ff6600"
            opacity = min(1.0, strength * 1.05)
            circles.append(
                f'  <circle cx="{px:.2f}" cy="{py:.2f}" r="{radius:.2f}" '
                f'fill="{fill}" opacity="{opacity:.3f}"/>'
            )

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}">\n'
        + "\n".join(circles)
        + "\n</svg>\n"
    )


def make_dark_preview(logo: Image.Image, path: Path, size: int = 1200) -> None:
    bg = Image.new("RGBA", (size, size), (12, 20, 8, 255))
    bg.alpha_composite(logo.resize((size, size), Image.Resampling.LANCZOS))
    bg.convert("RGB").save(path, "PNG")


def make_checker_preview(logo: Image.Image, path: Path, size: int = 1200) -> None:
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile = 36
    for y in range(0, size, tile):
        for x in range(0, size, tile):
            shade = 210 if ((x // tile) + (y // tile)) % 2 == 0 else 168
            bg.paste(Image.new("RGBA", (tile, tile), (shade, shade, shade, 255)), (x, y))
    bg.alpha_composite(logo.resize((size, size), Image.Resampling.LANCZOS))
    bg.convert("RGB").save(path, "PNG")


def main() -> None:
    png_path = OUTPUT_DIR / "cypherpunk-code-logo-v2.png"
    svg_path = OUTPUT_DIR / "cypherpunk-code-logo-v2.svg"
    orange_preview = OUTPUT_DIR / "cypherpunk-code-logo-v2-orange-preview.png"
    checker_preview = OUTPUT_DIR / "cypherpunk-code-logo-v2-orange-transparent.png"

    logo = render_logo()
    logo.save(png_path, "PNG", optimize=True)

    svg_path.write_text(render_svg())

    preview_path = OUTPUT_DIR / "cypherpunk-code-logo-v2-512.png"
    logo.resize((512, 512), Image.Resampling.LANCZOS).save(preview_path, "PNG")
    make_dark_preview(logo, orange_preview)
    make_checker_preview(logo, checker_preview)

    print(f"Wrote {png_path} ({png_path.stat().st_size} bytes)")
    print(f"Wrote {svg_path}")
    print(f"Wrote {preview_path}")
    print(f"Wrote {orange_preview}")
    print(f"Wrote {checker_preview}")


if __name__ == "__main__":
    main()