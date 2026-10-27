"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Fades and lifts its children in. `onLoad` plays immediately (hero, above the fold, replays on every refresh);
// otherwise it waits until the block scrolls into view.
export function Reveal({
  children,
  delay = 0,
  className,
  onLoad = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  onLoad?: boolean;
}) {
  const reduce = useReducedMotion();
  const shown = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      {...(onLoad ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: "-60px" } })}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
