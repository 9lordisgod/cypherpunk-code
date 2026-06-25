"""Track daily delivery so we never exceed the per-day post limit."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import date, datetime
from pathlib import Path

POSTS_PER_DAY = 2
STATE_PATH = Path(__file__).resolve().parent / "state" / "daily.json"


@dataclass
class DailyState:
    date: str
    posts_delivered: int
    last_run_at: str


def _today() -> str:
    return date.today().isoformat()


def load_state() -> DailyState:
    if not STATE_PATH.exists():
        return DailyState(date=_today(), posts_delivered=0, last_run_at="")
    with STATE_PATH.open(encoding="utf-8") as f:
        data = json.load(f)
    if data.get("date") != _today():
        return DailyState(date=_today(), posts_delivered=0, last_run_at="")
    return DailyState(**data)


def save_state(state: DailyState) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with STATE_PATH.open("w", encoding="utf-8") as f:
        json.dump(asdict(state), f, indent=2)


def already_delivered_today() -> bool:
    return load_state().posts_delivered >= POSTS_PER_DAY


def record_delivery(count: int) -> None:
    state = load_state()
    state.posts_delivered = min(POSTS_PER_DAY, state.posts_delivered + count)
    state.last_run_at = datetime.now().isoformat(timespec="seconds")
    save_state(state)