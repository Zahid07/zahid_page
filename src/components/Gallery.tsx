"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// Main screenshot with thumbnails; click opens a lightbox (Esc / arrow keys to navigate).
export function Gallery({ shots, captions = [], title }: { shots: string[]; captions?: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const caption = (i: number) => captions[i] ?? `${title} screenshot ${i + 1}`;
  const step = useCallback((d: number) => setActive((i) => (i + d + shots.length) % shots.length), [shots.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  if (!shots.length) return null;

  return (
    <section className="mt-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass group relative block aspect-[16/10] w-full overflow-hidden rounded-[18px]"
        aria-label={`Enlarge: ${caption(active)}`}
      >
        <Image
          src={shots[active]}
          alt={caption(active)}
          fill
          priority
          sizes="(min-width: 1120px) 1120px, 100vw"
          className="object-cover object-top"
        />
      </button>
      <p className="mt-3 text-[13px] text-white/50">{caption(active)}</p>

      {shots.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {shots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show: ${caption(i)}`}
              aria-current={i === active}
              className={`relative aspect-[16/10] overflow-hidden rounded-[10px] border transition ${
                i === active ? "border-[var(--accent)]" : "border-white/10 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="260px" className="object-cover object-top" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption(active)}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div className="relative h-[85vh] w-[min(1400px,96vw)]" onClick={(e) => e.stopPropagation()}>
            <Image src={shots[active]} alt={caption(active)} fill sizes="96vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 rounded-full border border-white/20 px-3 py-1 font-mono text-xs text-white/80 hover:bg-white/10"
          >
            Close · Esc
          </button>
        </div>
      ) : null}
    </section>
  );
}
