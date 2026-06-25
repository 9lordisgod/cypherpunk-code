"""Local fallback when api.telegram.org is blocked on your network."""

from __future__ import annotations

import subprocess
from datetime import datetime
from pathlib import Path

from content.generator import GeneratedPost


def deliver_locally(posts: list[GeneratedPost], media_paths: list[Path], output_dir: Path) -> Path:
    summary = output_dir / "posts.txt"
    lines = [
        f"Cypherpunk Code — {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"{len(posts)} posts ready for @sapherpunk on X",
        "",
    ]

    for i, (post, media_path) in enumerate(zip(posts, media_paths), start=1):
        lines.extend(
            [
                f"{'=' * 40}",
                f"POST {i}/2 ({post.post_type})",
                f"Media: {media_path}",
                "",
                post.text,
                "",
            ]
        )

    summary.write_text("\n".join(lines), encoding="utf-8")

    subprocess.run(
        [
            "osascript",
            "-e",
            f'display notification "2 posts saved in output folder" with title "Cypherpunk Code"',
        ],
        check=False,
    )
    subprocess.run(["open", str(output_dir)], check=False)
    return summary