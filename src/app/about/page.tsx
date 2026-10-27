import { GlassCard } from "@/components/GlassCard";
import { experience, site, skills } from "@/lib/site";

export const metadata = {
  title: "About — Muhammad Zahid",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-16 pt-20">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/50">
        About
      </p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">{site.summary}</p>
      <p className="mt-3 text-ink/55">
        MSc Computer Science, Åbo Akademi University (expected May 2027) · BSc Computer Science, FAST NUCES
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {Object.entries(skills).map(([group, items]) => (
          <GlassCard key={group} className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/50">
              {group}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-ink/75">{items.join(" · ")}</p>
          </GlassCard>
        ))}
      </div>

      <section className="mt-16 space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">Experience</h2>
        {experience.map((job) => (
          <GlassCard key={job.company} className="p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold">
                {job.role} · {job.company}
              </h3>
              <p className="text-sm text-ink/50">{job.dates}</p>
            </div>
            <p className="mt-1 text-sm text-ink/45">{job.place}</p>
            {job.did ? (
              <p className="mt-4 text-[16px] leading-7 text-ink/80">{job.did}</p>
            ) : null}
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-6 text-ink/70">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
