import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { GlassCard } from "@/components/GlassCard";
import { getArchitecture } from "@/lib/architecture";
import { getExplanation } from "@/lib/explanations";
import { splitMarkdownSections } from "@/lib/markdown";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} — Muhammad Zahid` : "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const explanation = getExplanation(slug);
  const sections = explanation ? splitMarkdownSections(explanation.content) : [];
  const architecture = getArchitecture(slug);

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-16 pt-20">
      <Link
        href="/projects"
        className="text-[13px] text-white/45 transition hover:text-white"
      >
        ← All projects
      </Link>
      <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
        {project.kicker}
      </p>
      <h1 className="mt-3 max-w-4xl text-balance text-5xl font-semibold tracking-tight">
        {project.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{project.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70"
          >
            {s}
          </span>
        ))}
      </div>

      {sections.length ? (
        <div className="mt-12 space-y-5">
          {sections.map((section) => (
            <GlassCard key={section.title} className="p-8 md:p-10" hover={false}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
              <div className="prose-glass mt-4">
                <Markdown>{section.body}</Markdown>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : null}

      {architecture ? <ArchitectureFlow flow={architecture} slug={slug} /> : null}
    </main>
  );
}
