"""Send generated posts to Telegram for manual X publishing."""

from __future__ import annotations

import os
from pathlib import Path

import requests
from requests.exceptions import ConnectionError, ConnectTimeout, RequestException


class TelegramNotifier:
    def __init__(self, bot_token: str, chat_id: str) -> None:
        self.bot_token = bot_token
        self.chat_id = chat_id
        self.base = f"https://api.telegram.org/bot{bot_token}"
        self.session = requests.Session()
        proxy = os.getenv("HTTPS_PROXY") or os.getenv("https_proxy")
        if proxy:
            self.session.proxies = {"https": proxy, "http": proxy}

    def _post(self, method: str, payload: dict | None = None, files: dict | None = None) -> dict:
        try:
            response = self.session.post(
                f"{self.base}/{method}",
                data=payload or {},
                files=files,
                timeout=30,
            )
            response.raise_for_status()
        except (ConnectTimeout, ConnectionError) as exc:
            raise RuntimeError(
                "Cannot reach api.telegram.org from this network. "
                "Turn on VPN, or set HTTPS_PROXY in .env if Telegram is blocked."
            ) from exc
        except RequestException as exc:
            raise RuntimeError(f"Telegram request failed: {exc}") from exc

        data = response.json()
        if not data.get("ok"):
            description = data.get("description", data)
            if "chat not found" in str(description).lower():
                raise RuntimeError(
                    "Telegram chat not found. Open your bot in Telegram, tap Start, "
                    "then re-check TELEGRAM_CHAT_ID."
                )
            if "unauthorized" in str(description).lower():
                raise RuntimeError("Invalid TELEGRAM_BOT_TOKEN. Get a fresh token from @BotFather.")
            raise RuntimeError(f"Telegram API error: {description}")
        return data

    def verify(self) -> str:
        data = self._post("getMe")
        return data["result"]["username"]

    def send_text(self, text: str) -> None:
        self._post(
            "sendMessage",
            {
                "chat_id": self.chat_id,
                "text": text,
                "disable_web_page_preview": False,
            },
        )

    def send_animation(self, caption: str, gif_path: Path) -> None:
        with gif_path.open("rb") as f:
            self._post(
                "sendAnimation",
                {"chat_id": self.chat_id, "caption": caption},
                files={"animation": (gif_path.name, f, "image/gif")},
            )

    def send_photo(self, caption: str, image_path: Path) -> None:
        with image_path.open("rb") as f:
            self._post(
                "sendPhoto",
                {"chat_id": self.chat_id, "caption": caption},
                files={"photo": (image_path.name, f, "image/png")},
            )

    def send_post_bundle(self, post_index: int, post_text: str, media_path: Path, media_kind: str) -> None:
        header = (
            f"🟠 Cypherpunk Code — Post {post_index}/2\n"
            f"Copy the text below → paste on @sapherpunk\n"
            f"{'─' * 28}"
        )
        self.send_text(header)

        caption = f"📋 POST TEXT (copy this):\n\n{post_text}"

        if media_kind == "gif" and media_path.suffix.lower() == ".gif":
            self.send_animation(caption, media_path)
        elif media_path.exists():
            self.send_photo(caption, media_path)
        else:
            self.send_text(caption)