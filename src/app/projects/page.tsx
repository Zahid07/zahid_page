import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-10 pt-20">
      <p className="eyebrow">Case studies</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-4 max-w-2xl text-ink/60">
        Each project has its own page with screenshots, a write-up grounded in the code, and, where there is one, the
        interactive architecture flow.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </main>
  );
}
