import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { Gallery } from "@/components/Gallery";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import { getArchitecture } from "@/lib/architecture";
import { getExplanation } from "@/lib/explanations";
import { splitMarkdownSections } from "@/lib/markdown";
import { getProject, projects } from "@/lib/projects";
import { getShots } from "@/lib/shots";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  const cover = getShots(slug)[0];
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: cover ? [cover] : undefined },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const explanation = getExplanation(slug);
  const sections = explanation ? splitMarkdownSections(explanation.content) : [];
  const architecture = getArchitecture(slug);
  const shots = getShots(slug);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-16 pt-14">
      <Link href="/projects" className="text-[13px] text-ink/45 transition hover:text-ink">
        ← All projects
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <p className="eyebrow">{project.kicker}</p>
        {project.status ? <StatusPill status={project.status} /> : null}
      </div>
      <h1 className="mt-3 max-w-4xl text-balance text-5xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/65">{project.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13.5px]">
        {project.context ? (
          <p className="text-ink/50">
            {/* Employers read "Built at Salla"; labels like "Personal project" stand on their own. */}
            {/project|venture|thesis|assignment|lab/i.test(project.context) ? null : "Built at "}
            <span className="text-ink/80">{project.context}</span>
          </p>
        ) : null}
        {project.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-ink px-3.5 py-1.5 font-medium text-white transition hover:bg-ink/85"
          >
            Visit {l.label} ↗
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1 font-mono text-[12px] text-ink/65"
          >
            {s}
          </span>
        ))}
      </div>

      <Gallery shots={shots} captions={project.captions} title={project.title} />

      {sections.length ? (
        <div className="mt-12 space-y-4">
          {sections.map((section) => (
            <GlassCard key={section.title} className="p-7 md:p-9" hover={false}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
              <div className="prose-glass mt-4">
                <Markdown>{section.body}</Markdown>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : null}

      {architecture ? <ArchitectureFlow flow={architecture} slug={slug} /> : null}

      {next && next.slug !== slug ? (
        <Link href={`/projects/${next.slug}`} className="glass glass-hover mt-16 flex items-center justify-between rounded-[18px] p-6">
          <span>
            <span className="eyebrow">Next project</span>
            <span className="mt-1 block text-xl font-semibold tracking-tight">{next.title}</span>
          </span>
          <span className="text-2xl text-ink/40">→</span>
        </Link>
      ) : null}
    </main>
  );
}
