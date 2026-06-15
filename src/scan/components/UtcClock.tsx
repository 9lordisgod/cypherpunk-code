"use client";

import { useEffect, useState } from "react";

function formatEastern(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const zone = parts.find((p) => p.type === "timeZoneName")?.value ?? "ET";

  return `${hour}:${minute} ${zone}`;
}

export function UtcClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(formatEastern(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tac-mono text-[11px] text-[var(--text-bright)] tabular-nums">
      {time || "--:-- ET"}
    </span>
  );
}