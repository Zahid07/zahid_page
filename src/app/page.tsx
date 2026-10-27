import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const stats = [
  { k: "4 yrs", v: "Owning production data systems" },
  { k: "1000×", v: "Kafka consumer throughput, root-caused and fixed" },
  { k: "~200", v: "Airflow DAGs on an on-prem lakehouse" },
  { k: "2 live", v: "Products I built and run alone on GCP" },
];

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-8 pt-16">
      <section className="pb-16 pt-10">
        <p className="eyebrow">
          {site.title} · {site.location}
        </p>
        <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.5rem,6.5vw,4.9rem)] font-semibold leading-[1] tracking-[-0.04em]">
          Data platforms and AI agents you can trace to the last table.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{site.summary}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            See the work
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/85 transition hover:bg-white/[0.06]"
          >
            {site.email}
          </a>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.k} className="px-6 py-6" hover={false}>
            <p className="text-[2rem] font-semibold tracking-tight">{s.k}</p>
            <p className="mt-1 text-[13.5px] leading-5 text-white/55">{s.v}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Products, platforms and agents</h2>
          </div>
          <Link href="/projects" className="shrink-0 text-sm text-white/55 hover:text-white">
            All {projects.length} projects →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
