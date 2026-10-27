"use client";

import { useEffect, useState } from "react";

// Types each word, pauses, deletes, moves on. Shows the full first word without motion when reduced motion is set.
export function Typer({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(words[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (still) return;
    const word = words[i];
    const done = !deleting && n === word.length;
    const empty = deleting && n === 0;
    const id = window.setTimeout(
      () => {
        if (done) setDeleting(true);
        else if (empty) {
          setDeleting(false);
          setI((i + 1) % words.length);
        } else setN(n + (deleting ? -1 : 1));
      },
      done ? 1600 : empty ? 300 : deleting ? 35 : 70,
    );
    return () => window.clearTimeout(id);
  }, [n, deleting, i, words, still]);

  return (
    <span className="font-mono text-[15px] text-ink/60">
      Building <span aria-hidden>→</span>{" "}
      <span className="text-[var(--accent)]">{words[i].slice(0, n)}</span>
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--accent)]" style={{ height: "1em", verticalAlign: "-2px" }} aria-hidden />
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
