import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Projects — Muhammad Zahid",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-10 pt-20">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
        Case studies
      </p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Each write-up is grounded in the repo. Open a project for the explanation, then the
        interactive flow.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </main>
  );
}
