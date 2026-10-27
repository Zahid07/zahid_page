"use client";

import Link from "next/link";
import { useCallback, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
};

export function GlassCard({ children, className = "", href, hover = true }: Props) {
  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  const style = { "--spot-x": "28%", "--spot-y": "18%" } as CSSProperties;
  const cls = `glass specular group rounded-[18px] ${hover ? "glass-hover" : ""} ${href ? "block" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} onMouseMove={onMove} style={style} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <div onMouseMove={onMove} style={style} className={cls}>
      {children}
    </div>
  );
}
