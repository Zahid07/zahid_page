"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; base: number; speed: number; phase: number; drift: number };

// Twinkling, slowly drifting stars on a fixed canvas behind the page.
// Density scales with viewport area; it holds still when the user prefers reduced motion.
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 4200); // ~340 on a 1440x1000 screen
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.92 ? Math.random() * 0.9 + 0.25 : Math.random() * 1.1 + 1,
        base: Math.random() * 0.55 + 0.25,
        speed: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.06 + 0.01,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const alpha = still ? s.base : s.base * (0.65 + 0.35 * Math.sin(t * 0.001 * s.speed + s.phase));
        if (!still) {
          s.y -= s.drift;
          if (s.y < -2) {
            s.y = h + 2;
            s.x = Math.random() * w;
          }
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // Light theme: faint grey stars, a few in the orange accent.
        ctx.fillStyle = s.r > 1.2 ? `rgba(234, 88, 12, ${alpha * 0.55})` : `rgba(64, 64, 64, ${alpha * 0.4})`;
        ctx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden />;
}
