"""Branded GIF / short video frame generator for social posts."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


BG = (10, 10, 10)
ACCENT = (255, 107, 53)
TEXT = (230, 230, 230)
MUTED = (140, 140, 140)

CANVAS = (1200, 675)  # 16:9 — works on X


def _load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates.extend(
            [
                "/System/Library/Fonts/Menlo.ttc",
                "/System/Library/Fonts/Supplemental/Andale Mono.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
            ]
        )
    else:
        candidates.extend(
            [
                "/System/Library/Fonts/Menlo.ttc",
                "/System/Library/Fonts/Supplemental/Andale Mono.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
            ]
        )
    for path in candidates:
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def _wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        trial = " ".join(current + [word])
        bbox = draw.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines[:4]


def _render_frame(
    logo_path: Path | None,
    headline: str,
    subline: str,
    progress: float,
) -> Image.Image:
    img = Image.new("RGB", CANVAS, BG)
    draw = ImageDraw.Draw(img)

    # Accent bar
    bar_width = int(CANVAS[0] * progress)
    draw.rectangle([0, 0, bar_width, 6], fill=ACCENT)

    logo_bottom = 80
    if logo_path and logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        target_h = 96
        ratio = target_h / logo.height
        logo = logo.resize((int(logo.width * ratio), target_h), Image.Resampling.LANCZOS)
        img.paste(logo, (80, 60), logo)
        logo_bottom = 60 + target_h

    title_font = _load_font(42, bold=True)
    sub_font = _load_font(24)
    brand_font = _load_font(20)

    y = max(logo_bottom + 24, 180)
    for line in _wrap(draw, headline, title_font, CANVAS[0] - 160):
        draw.text((80, y), line, font=title_font, fill=ACCENT)
        y += 52

    y += 8
    for line in _wrap(draw, subline, sub_font, CANVAS[0] - 160):
        draw.text((80, y), line, font=sub_font, fill=TEXT)
        y += 34

    draw.text((80, CANVAS[1] - 56), "cypherpunk-code.com", font=brand_font, fill=MUTED)
    draw.text((CANVAS[0] - 280, CANVAS[1] - 56), "Curated. No trading noise.", font=brand_font, fill=MUTED)

    return img


def create_gif(
    output_path: Path,
    headline: str,
    subline: str,
    logo_path: Path | None = None,
    frames: int = 12,
    duration_ms: int = 120,
) -> Path:
    """Animated branded GIF with progress bar sweep."""
    images = [
        _render_frame(logo_path, headline, subline, progress=(i + 1) / frames)
        for i in range(frames)
    ]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
    )
    return output_path


def create_video_frames(
    output_dir: Path,
    headline: str,
    subline: str,
    logo_path: Path | None = None,
    frames: int = 24,
) -> list[Path]:
    """PNG frame sequence — ffmpeg can stitch to MP4 if desired."""
    output_dir.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []
    for i in range(frames):
        progress = (i + 1) / frames
        frame = _render_frame(logo_path, headline, subline, progress)
        path = output_dir / f"frame_{i:03d}.png"
        frame.save(path, optimize=True)
        paths.append(path)
    return paths