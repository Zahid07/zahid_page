import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import type { ProjectMeta } from "@/lib/projects";
import { getShots } from "@/lib/shots";

// Card layout: number · kicker · context, title, then problem → my role → outcome, tags and links.
export function ProjectCard({ project, index }: { project: ProjectMeta; index: number }) {
  const cover = getShots(project.slug)[0];
  const href = `/projects/${project.slug}`;

  return (
    <GlassCard className="flex h-full flex-col overflow-hidden">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden border-b border-ink/10 bg-[var(--bg-soft)]" tabIndex={-1} aria-hidden>
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 768px) 540px, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          // No screenshot yet: a terminal-style preview of the stack instead of an empty box.
          <div className="flex h-full flex-col justify-end gap-1.5 p-6 font-mono text-[12px] text-ink/45">
            <span className="text-[var(--accent)]">$ {project.slug}</span>
            {project.stack.slice(0, 6).map((s) => (
              <span key={s}>→ {s}</span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink/50">
          <span className="text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
          <span>{project.kicker}</span>
          {project.context ? <span className="text-ink/35">· {project.context}</span> : null}
          {project.status ? <StatusPill status={project.status} /> : null}
        </div>
        <h3 className="mt-3 text-[1.4rem] font-semibold tracking-tight">
          <Link href={href} className="hover:text-[var(--accent)]">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-ink/80">{project.problem}</p>
        <dl className="mt-3 space-y-1.5 text-[14px] leading-6 text-ink/60">
          {project.role ? (
            <div>
              <dt className="inline font-medium text-ink/85">My role: </dt>
              <dd className="inline">{project.role}</dd>
            </div>
          ) : null}
          <div>
            <dt className="inline font-medium text-ink/85">Outcome: </dt>
            <dd className="inline">{project.outcome}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((s) => (
            <span key={s} className="rounded-full border border-ink/10 bg-ink/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-ink/60">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-[13.5px] font-medium">
          <Link href={href} className="text-ink hover:text-[var(--accent)]">
            Case study →
          </Link>
          {project.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-ink/60 hover:text-[var(--accent)]">
              Live ↗
            </a>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
