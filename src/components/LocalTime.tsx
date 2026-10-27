"use client";

import { useEffect, useState } from "react";

// "Turku, Finland · 12:54 local time", ticking each minute. Renders "--:--" until mounted (no hydration mismatch).
export function LocalTime({ place, timeZone }: { place: string; timeZone: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[13px] text-ink/70 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-[var(--good)]" aria-hidden />
      {place} · <span className="tabular-nums">{time}</span> local time
    </span>
  );
}
