"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GlassCard } from "@/components/GlassCard";
import {
  tones,
  type DiagramBox,
  type DiagramEdge,
  type FlowDiagramSpec,
  type Side,
} from "@/lib/diagrams";

function anchor(box: DiagramBox, side: Side) {
  switch (side) {
    case "right":
      return { x: box.x + box.w, y: box.y + box.h / 2 };
    case "left":
      return { x: box.x, y: box.y + box.h / 2 };
    case "top":
      return { x: box.x + box.w / 2, y: box.y };
    case "bottom":
      return { x: box.x + box.w / 2, y: box.y + box.h };
  }
}

function edgeD(spec: FlowDiagramSpec, edge: DiagramEdge) {
  if (edge.path) return edge.path;
  const boxes = Object.fromEntries(spec.boxes.map((b) => [b.id, b]));
  const from = edge.from ? boxes[edge.from] : undefined;
  const to = edge.to ? boxes[edge.to] : undefined;
  if (!from || !to) return "";
  const a = anchor(from, edge.fromSide ?? "right");
  const b = anchor(to, edge.toSide ?? "left");
  const dx = Math.max(24, Math.abs(b.x - a.x) * 0.42);
  return `M ${a.x} ${a.y} C ${a.x + (b.x >= a.x ? dx : -dx)} ${a.y}, ${b.x - (b.x >= a.x ? dx : -dx)} ${b.y}, ${b.x} ${b.y}`;
}

function diamondPoints(box: DiagramBox) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return `${cx},${box.y} ${box.x + box.w},${cy} ${cx},${box.y + box.h} ${box.x},${cy}`;
}

function BoxShape({
  box,
  active,
  delay,
  reduce,
}: {
  box: DiagramBox;
  active: boolean;
  delay: number;
  reduce: boolean;
}) {
  const t = tones[box.tone ?? "process"];
  const common = {
    fill: t.fill,
    stroke: active ? "var(--accent)" : t.stroke,
    strokeWidth: active ? 2.4 : box.group ? 1.8 : 1.4,
    filter: active ? undefined : undefined,
  };

  if (box.shape === "diamond") {
    return (
      <motion.polygon
        points={diamondPoints(box)}
        {...common}
        initial={reduce ? false : { opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px` }}
      />
    );
  }

  return (
    <motion.rect
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      rx={box.group ? 16 : 12}
      {...common}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export function AnimatedDiagram({ spec }: { spec: FlowDiagramSpec }) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion() ?? false;
  const [play, setPlay] = useState(0);
  const [step, setStep] = useState(0);
  const particleEdges = spec.edges.filter((ed) => edgeD(spec, ed));
  const activeTo = particleEdges[step % Math.max(particleEdges.length, 1)]?.to;

  useEffect(() => {
    if (reduce || particleEdges.length === 0) return;
    const id = window.setInterval(() => {
      setStep((n) => (n + 1) % particleEdges.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [particleEdges.length, reduce, play]);

  return (
    <GlassCard className="overflow-hidden p-5 md:p-7" hover={false}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
            {spec.kind === "model" ? "The model" : "Live flow"}
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{spec.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setPlay((n) => n + 1);
            setStep(0);
          }}
          className="rounded-full border border-ink/15 bg-ink/10 px-3.5 py-1.5 text-[12px] text-ink/80 transition hover:border-ink/35 hover:bg-ink/20"
        >
          Replay animation
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.svg
          key={play}
          viewBox={`0 0 ${spec.width} ${spec.height}`}
          className="h-auto w-full"
          role="img"
          aria-label={spec.title}
        >
          <defs>
            <marker
              id={`${uid}-arr`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="rgba(23,23,23,0.45)" />
            </marker>
            <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {spec.edges.map((edge, i) => {
            const d = edgeD(spec, edge);
            if (!d) return null;
            const pid = `${uid}-${edge.id}`;
            return (
              <g key={edge.id}>
                <motion.path
                  id={pid}
                  d={d}
                  fill="none"
                  stroke="rgba(23,23,23,0.28)"
                  strokeWidth={1.6}
                  strokeDasharray={edge.dashed ? "6 5" : undefined}
                  markerEnd={`url(#${uid}-arr)`}
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.7, ease: "easeInOut" }}
                />
                {edge.label ? (
                  <text
                    x={edge.lx ?? 0}
                    y={edge.ly ?? 0}
                    textAnchor="middle"
                    fill="rgba(23,23,23,0.5)"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {edge.label}
                  </text>
                ) : null}
                {!reduce ? (
                  <circle r="4.5" fill="var(--accent)" filter={`url(#${uid}-glow)`}>
                    <animateMotion
                      dur={`${1.8 + (i % 3) * 0.35}s`}
                      repeatCount="indefinite"
                      begin={`${0.8 + i * 0.22}s`}
                      rotate="auto"
                    >
                      <mpath href={`#${pid}`} />
                    </animateMotion>
                  </circle>
                ) : null}
              </g>
            );
          })}

          {spec.boxes.map((box, i) => {
            const t = tones[box.tone ?? "process"];
            const cx = box.x + box.w / 2;
            const active = box.id === activeTo;
            return (
              <g key={box.id}>
                <BoxShape box={box} active={active} delay={i * 0.07} reduce={reduce} />
                {box.kicker ? (
                  <text
                    x={cx}
                    y={box.y + 18}
                    textAnchor="middle"
                    fill={t.text}
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="0.12em"
                  >
                    {box.kicker.toUpperCase()}
                  </text>
                ) : null}
                <text
                  x={cx}
                  y={
                    box.group
                      ? box.y + (box.kicker ? 38 : 22)
                      : box.y + (box.kicker ? 38 : box.lines?.length ? 28 : box.h / 2 + 5)
                  }
                  textAnchor="middle"
                  fill="#171717"
                  fontSize={box.group ? 14 : 13}
                  fontWeight="600"
                >
                  {box.label}
                </text>
                {box.lines?.map((line, li) => (
                  <text
                    key={line}
                    x={cx}
                    y={box.y + (box.kicker ? 56 : 46) + li * 15}
                    textAnchor="middle"
                    fill="rgba(23,23,23,0.58)"
                    fontSize="11"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {spec.notes?.map((n) => (
            <text key={n.text} x={n.x} y={n.y} fill="rgba(23,23,23,0.45)" fontSize="11">
              {n.text}
            </text>
          ))}
        </motion.svg>
      </AnimatePresence>

      {spec.caption ? (
        <p className="mt-4 text-[14px] leading-6 text-ink/60">{spec.caption}</p>
      ) : null}
    </GlassCard>
  );
}
