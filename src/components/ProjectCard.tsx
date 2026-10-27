import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import type { ProjectMeta } from "@/lib/projects";
import { getShots } from "@/lib/shots";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  const cover = getShots(project.slug)[0];

  return (
    <GlassCard href={`/projects/${project.slug}`} className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[var(--bg-soft)]">
        {cover ? (
          <Image
            src={cover}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 540px, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          // No screenshot yet: a terminal-style preview of the stack instead of an empty box.
          <div className="flex h-full flex-col justify-end gap-1.5 p-6 font-mono text-[12px] text-white/45">
            <span className="text-[var(--accent)]">$ {project.slug}</span>
            {project.stack.slice(0, 6).map((s) => (
              <span key={s}>→ {s}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{project.kicker}</p>
          {project.status ? <StatusPill status={project.status} /> : null}
        </div>
        <h3 className="mt-3 text-[1.35rem] font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-[14.5px] leading-6 text-white/65">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-white/60"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
