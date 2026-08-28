import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-8 pt-16">
      <section className="pb-20 pt-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
          {site.title} · {site.location}
        </p>
        <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          Pipelines you can open in a browser and follow to the last table.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">{site.summary}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            See the work
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="glass rounded-full px-5 py-2.5 text-sm text-white/90 transition hover:bg-white/10"
          >
            {site.email}
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { k: "4 yrs", v: "Production data systems" },
          { k: "1000×", v: "Kafka consumer throughput" },
          { k: "200+", v: "Airflow DAGs on a lakehouse" },
        ].map((s) => (
          <GlassCard key={s.k} className="px-7 py-8">
            <p className="text-4xl font-semibold tracking-tight">{s.k}</p>
            <p className="mt-2 text-sm text-white/60">{s.v}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">Selected systems</h2>
          <Link href="/projects" className="text-sm text-white/60 hover:text-white">
            All projects →
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
