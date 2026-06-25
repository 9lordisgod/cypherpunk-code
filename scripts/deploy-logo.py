#!/usr/bin/env python3
"""Deploy a source logo across public assets, favicons, and GitHub branding."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SRC = ROOT / "public" / "logo-brand.png"

PUBLIC_LOGO = ROOT / "public" / "logo.png"
PUBLIC_BRAND = ROOT / "public" / "logo-brand.png"
FAVICON_16 = ROOT / "public" / "favicon-16x16.png"
FAVICON_32 = ROOT / "public" / "favicon-32x32.png"
FAVICON = ROOT / "public" / "favicon.png"
GITHUB_LOGO = ROOT / ".github" / "logo.png"
GITHUB_APP_ICON = ROOT / ".github" / "app-icon.png"


def resolve_source() -> Path:
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).expanduser().resolve()
    return DEFAULT_SRC


def resize_logo(src: Image.Image, size: int) -> Image.Image:
    return src.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    src_path = resolve_source()
    if not src_path.exists():
        print(f"Missing source logo: {src_path}", file=sys.stderr)
        print("Usage: python scripts/deploy-logo.py [path/to/logo.png]", file=sys.stderr)
        sys.exit(1)

    logo = Image.open(src_path).convert("RGBA")

    resize_logo(logo, 512).save(PUBLIC_BRAND, "PNG", optimize=True)
    resize_logo(logo, 512).save(PUBLIC_LOGO, "PNG", optimize=True)
    resize_logo(logo, 512).save(GITHUB_LOGO, "PNG", optimize=True)
    resize_logo(logo, 512).save(GITHUB_APP_ICON, "PNG", optimize=True)
    resize_logo(logo, 180).save(FAVICON, "PNG", optimize=True)
    resize_logo(logo, 32).save(FAVICON_32, "PNG", optimize=True)
    resize_logo(logo, 16).save(FAVICON_16, "PNG", optimize=True)

    print(f"source {src_path}")
    print(f"wrote {PUBLIC_BRAND}, {PUBLIC_LOGO}")
    print(f"wrote {FAVICON}, {FAVICON_32}, {FAVICON_16}")
    print(f"wrote {GITHUB_LOGO}, {GITHUB_APP_ICON}")

    subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build-repo-branding.py")],
        check=True,
    )


if __name__ == "__main__":
    main()