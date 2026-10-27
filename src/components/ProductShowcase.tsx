"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// A product window that tilts up and settles into place as it scrolls in, like a dashboard rising over the hero.
export function ProductShowcase({ src, href, label }: { src: string; href: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div ref={ref} className="[perspective:1600px]">
      <motion.div
        style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}
        className="overflow-hidden rounded-[18px] border border-[var(--border-strong)] bg-white shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 rounded-md border border-[var(--border)] bg-white px-2.5 py-0.5 font-mono text-[11px] text-ink/50">{label}</span>
          <Link href={href} className="ml-auto text-[12.5px] font-medium text-ink/60 hover:text-[var(--accent)]">
            See the case study →
          </Link>
        </div>
        <div className="relative aspect-[16/10]">
          <Image src={src} alt={`${label} screenshot`} fill sizes="(min-width: 1120px) 1120px, 100vw" className="object-cover object-top" />
        </div>
      </motion.div>
    </div>
  );
}
