"""Algorithmic X post generator for Cypherpunk Code."""

from __future__ import annotations

import hashlib
import json
import random
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class GeneratedPost:
    text: str
    post_type: str
    headline: str
    subline: str
    media_kind: str  # "gif" or "video"


PRIVACY_TIPS = [
    "Run your own node. Trust your own verification, not a third-party API.",
    "Separate identities: one wallet, one persona. Compartmentalization is opsec 101.",
    "Tor is not suspicious — mass surveillance is.",
    "Your keys, your coins. Your keys, your privacy.",
    "Selective revelation beats total transparency. Privacy is power.",
    "Encrypt by default. Decrypt only when necessary.",
    "Threat model first. Tools second.",
    "Free open-source education beats paid signal groups every time.",
]

MANIFESTO_LINES = [
    "Privacy is necessary for an open society in the electronic age.",
    "We cannot expect governments, corporations, or other large organizations to grant us privacy out of beneficence.",
    "Cypherpunks write code. We know that someone has to write software to defend privacy.",
    "Code is speech. Cryptography is liberation.",
]

HASHTAG_POOL = ["#cypherpunk", "#privacy", "#bitcoin", "#monero", "#opsec", "#cryptography"]


def _seed_for_today(extra: str = "") -> int:
    token = f"{date.today().isoformat()}-{extra}"
    return int(hashlib.sha256(token.encode()).hexdigest()[:8], 16)


def _load_json(path: Path) -> list[dict[str, Any]]:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def _trim(text: str, limit: int = 280) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def _pick_hashtags(rng: random.Random, count: int = 2) -> str:
    tags = rng.sample(HASHTAG_POOL, k=min(count, len(HASHTAG_POOL)))
    return " ".join(tags)


def _resource_spotlight(resource: dict[str, Any], rng: random.Random) -> GeneratedPost:
    score = resource.get("cypherpunkScore", "?")
    title = resource["title"]
    url = resource["url"]
    hook = resource.get("description", "").split(".")[0]
    tags = _pick_hashtags(rng)
    text = _trim(
        f"📚 {title} (CP {score})\n{hook}.\n→ {url}\n{tags}\nCurated. No trading noise."
    )
    return GeneratedPost(
        text=text,
        post_type="resource_spotlight",
        headline=title[:48],
        subline=f"CP Score {score}",
        media_kind="gif",
    )


def _path_promo(path_entry: dict[str, Any], rng: random.Random) -> GeneratedPost:
    title = path_entry["title"]
    desc = path_entry["description"]
    site = "https://www.cypherpunk-code.com/paths"
    tags = _pick_hashtags(rng)
    text = _trim(
        f"🛤 {title}\n{desc}\n→ {site}\n{tags}"
    )
    return GeneratedPost(
        text=text,
        post_type="path_promo",
        headline=title[:48],
        subline="Learning path",
        media_kind="gif",
    )


def _privacy_tip(rng: random.Random) -> GeneratedPost:
    tip = rng.choice(PRIVACY_TIPS)
    site = "https://www.cypherpunk-code.com"
    tags = _pick_hashtags(rng)
    text = _trim(f"🔐 {tip}\n→ {site}\n{tags}")
    return GeneratedPost(
        text=text,
        post_type="privacy_tip",
        headline="Privacy signal",
        subline=tip[:72],
        media_kind="gif",
    )


def _manifesto_line(rng: random.Random) -> GeneratedPost:
    line = rng.choice(MANIFESTO_LINES)
    site = "https://www.cypherpunk-code.com/catalog"
    tags = _pick_hashtags(rng, count=1)
    text = _trim(f'"{line}"\n— Cypherpunk canon\n→ {site}\n{tags}')
    return GeneratedPost(
        text=text,
        post_type="manifesto_line",
        headline="Cypherpunk canon",
        subline=line[:72],
        media_kind="video",
    )


def _site_cta(rng: random.Random) -> GeneratedPost:
    ctas = [
        (
            "Freedom education index",
            "Courses, papers, guides — Bitcoin, Monero, cypherpunk sovereignty.",
            "https://www.cypherpunk-code.com",
        ),
        (
            "Filter by CP Score",
            "Cut the trading noise. Keep resources scored 7+.",
            "https://www.cypherpunk-code.com/catalog",
        ),
        (
            "Topic deep-dives",
            "Privacy, nodes, wallets, cryptography — curated paths.",
            "https://www.cypherpunk-code.com/topics",
        ),
    ]
    title, body, url = rng.choice(ctas)
    tags = _pick_hashtags(rng)
    text = _trim(f"⚡ {title}\n{body}\n→ {url}\n{tags}")
    return GeneratedPost(
        text=text,
        post_type="site_cta",
        headline=title[:48],
        subline=body[:72],
        media_kind="gif",
    )


def generate_posts(
    data_dir: Path,
    count: int = 2,
    seed_extra: str = "",
) -> list[GeneratedPost]:
    """Generate `count` distinct algorithmic posts for today."""
    rng = random.Random(_seed_for_today(seed_extra))

    resources = _load_json(data_dir / "resources.json")
    paths = _load_json(data_dir / "paths.json")
    high_signal = [r for r in resources if r.get("cypherpunkScore", 0) >= 7]
    featured = [r for r in high_signal if r.get("featured")] or high_signal

    builders = [
        lambda: _resource_spotlight(rng.choice(featured), rng),
        lambda: _resource_spotlight(rng.choice(high_signal), rng),
        lambda: _path_promo(rng.choice(paths), rng),
        lambda: _privacy_tip(rng),
        lambda: _manifesto_line(rng),
        lambda: _site_cta(rng),
    ]

    posts: list[GeneratedPost] = []
    seen_types: set[str] = set()
    attempts = 0

    while len(posts) < count and attempts < 40:
        attempts += 1
        post = rng.choice(builders)()
        if post.post_type in seen_types:
            continue
        seen_types.add(post.post_type)
        posts.append(post)

    while len(posts) < count:
        posts.append(_privacy_tip(rng))

    return posts[:count]