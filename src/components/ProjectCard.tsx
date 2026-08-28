import { GlassCard } from "@/components/GlassCard";
import type { ProjectMeta } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <GlassCard href={`/projects/${project.slug}`} className="h-full p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
        {project.kicker}
      </p>
      <h3 className="mt-3 text-[1.45rem] font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-3 text-[15px] leading-6 text-white/70">{project.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
          >
            {s}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
