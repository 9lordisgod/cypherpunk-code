#!/usr/bin/env python3
"""Cypherpunk Code marketing manager — exactly 2 X posts per day → Telegram."""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

from content import generate_posts
from local import deliver_locally
from media import create_gif, create_video_frames
from state import POSTS_PER_DAY, already_delivered_today, record_delivery
from telegram import TelegramNotifier

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent.parent


def _resolve_path(env_key: str, default: Path) -> Path:
    override = os.getenv(env_key)
    return Path(override) if override else default


def _generate_bundle() -> tuple[list, list[Path], Path]:
    data_dir = _resolve_path("CYPHERPUNK_DATA_DIR", REPO_ROOT / "src" / "data")
    logo_path = _resolve_path("CYPHERPUNK_LOGO_PATH", REPO_ROOT / "public" / "logo.png")
    output_dir = ROOT / "output" / datetime.now().strftime("%Y-%m-%d")
    output_dir.mkdir(parents=True, exist_ok=True)

    posts = generate_posts(data_dir, count=POSTS_PER_DAY)
    print(f"Generated {len(posts)}/{POSTS_PER_DAY} daily posts for {datetime.now().date()}\n")

    media_paths: list[Path] = []
    for i, post in enumerate(posts, start=1):
        print(f"--- Post {i} ({post.post_type}) ---")
        print(post.text)
        print()

        if post.media_kind == "video":
            frames = create_video_frames(
                output_dir / f"post-{i}-frames",
                headline=post.headline,
                subline=post.subline,
                logo_path=logo_path,
            )
            media_path = frames[-1]
        else:
            media_path = output_dir / f"post-{i}.gif"
            create_gif(
                media_path,
                headline=post.headline,
                subline=post.subline,
                logo_path=logo_path,
            )
        media_paths.append(media_path)
        print(f"Media: {media_path}\n")

    return posts, media_paths, output_dir


def _deliver_telegram(posts: list, media_paths: list[Path]) -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        raise RuntimeError(
            "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env"
        )

    notifier = TelegramNotifier(token, chat_id)
    notifier.send_text(
        f"🤖 Cypherpunk Code Marketing Manager\n"
        f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        f"{len(posts)} posts ready — copy each to @sapherpunk on X."
    )

    for i, (post, media_path) in enumerate(zip(posts, media_paths), start=1):
        notifier.send_post_bundle(i, post.text, media_path, post.media_kind)

    notifier.send_text("✅ Done. 2 posts for today — review, edit if needed, then post on X.")


def run(*, dry_run: bool = False, force: bool = False, local: bool = False) -> int:
    load_dotenv(ROOT / ".env")

    if not dry_run and not local and not force and already_delivered_today():
        print(f"Already delivered {POSTS_PER_DAY} posts today. Skipping.")
        print("Use --force to regenerate and resend.")
        return 0

    posts, media_paths, output_dir = _generate_bundle()

    if dry_run:
        print("Dry run — skipping delivery.")
        return 0

    if local:
        summary = deliver_locally(posts, media_paths, output_dir)
        record_delivery(len(posts))
        print(f"Saved locally: {summary}")
        print("Opened output folder + macOS notification.")
        return 0

    try:
        _deliver_telegram(posts, media_paths)
    except RuntimeError as exc:
        print(f"Telegram failed: {exc}", file=sys.stderr)
        print("Tip: use --local now, or run via GitHub Actions (see below).", file=sys.stderr)
        return 1

    record_delivery(len(posts))
    print("Delivered to Telegram.")
    return 0


def test_telegram() -> int:
    load_dotenv(ROOT / ".env")
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env", file=sys.stderr)
        return 1

    notifier = TelegramNotifier(token, chat_id)
    try:
        username = notifier.verify()
        notifier.send_text(
            "✅ Cypherpunk Code bot is connected.\n"
            "This bot only pushes posts when you run: python main.py\n"
            "It does not reply to /start or other messages."
        )
    except RuntimeError as exc:
        print(f"Telegram test failed: {exc}", file=sys.stderr)
        return 1

    print(f"OK — test message sent via @{username} to chat {chat_id}")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Cypherpunk Code X content → Telegram (2 posts/day)")
    parser.add_argument("--dry-run", action="store_true", help="Generate only, no delivery")
    parser.add_argument("--local", action="store_true", help="Save posts + GIFs locally (no Telegram)")
    parser.add_argument("--force", action="store_true", help="Ignore daily limit and resend")
    parser.add_argument("--test", action="store_true", help="Send one test message to Telegram")
    args = parser.parse_args()
    if args.test:
        raise SystemExit(test_telegram())
    raise SystemExit(run(dry_run=args.dry_run, force=args.force, local=args.local))


if __name__ == "__main__":
    main()