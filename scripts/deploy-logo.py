#!/usr/bin/env python3
"""Deploy the v2 logo across public assets, favicons, and GitHub branding."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logo-review" / "cypherpunk-code-logo-v2.png"

PUBLIC_LOGO = ROOT / "public" / "logo.png"
FAVICON_16 = ROOT / "public" / "favicon-16x16.png"
FAVICON_32 = ROOT / "public" / "favicon-32x32.png"
FAVICON = ROOT / "public" / "favicon.png"
GITHUB_LOGO = ROOT / ".github" / "logo.png"
GITHUB_APP_ICON = ROOT / ".github" / "app-icon.png"


def resize_logo(src: Image.Image, size: int) -> Image.Image:
    return src.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    if not SRC.exists():
        print(f"Missing source logo: {SRC}", file=sys.stderr)
        sys.exit(1)

    logo = Image.open(SRC).convert("RGBA")

    resize_logo(logo, 512).save(PUBLIC_LOGO, "PNG", optimize=True)
    resize_logo(logo, 512).save(GITHUB_LOGO, "PNG", optimize=True)
    resize_logo(logo, 512).save(GITHUB_APP_ICON, "PNG", optimize=True)
    resize_logo(logo, 180).save(FAVICON, "PNG", optimize=True)
    resize_logo(logo, 32).save(FAVICON_32, "PNG", optimize=True)
    resize_logo(logo, 16).save(FAVICON_16, "PNG", optimize=True)

    print(f"wrote {PUBLIC_LOGO}")
    print(f"wrote {FAVICON}, {FAVICON_32}, {FAVICON_16}")
    print(f"wrote {GITHUB_LOGO}, {GITHUB_APP_ICON}")

    subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build-repo-branding.py")],
        check=True,
    )


if __name__ == "__main__":
    main()