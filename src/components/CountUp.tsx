"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Counts a stat like "1000×", "~200" or "4+" up from zero when it scrolls into view, keeping its prefix and suffix.
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const m = value.match(/^([^0-9]*)([0-9]+)(.*)$/);

  useEffect(() => {
    if (!m || !inView || reduce || !ref.current) return;
    const [, pre, num, post] = m;
    const el = ref.current;
    const controls = animate(0, Number(num), {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = `${pre}${Math.round(v).toLocaleString("en-US")}${post}`),
    });
    return () => controls.stop();
  }, [inView, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{value}</span>;
}
