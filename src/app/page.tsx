import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { GlassCard } from "@/components/GlassCard";
import { HeroName } from "@/components/HeroName";
import { HowIWork } from "@/components/HowIWork";
import { LocalTime } from "@/components/LocalTime";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SourcesMarquee } from "@/components/SourcesMarquee";
import { TechOrbit } from "@/components/TechOrbit";
import { TraceCard } from "@/components/TraceCard";
import { Typer } from "@/components/Typer";
import { projects } from "@/lib/projects";
import { building, experience, expertise, hiring, learning, site } from "@/lib/site";

const stats = [
  { k: "4+", v: "years owning production data systems" },
  { k: "1000×", v: "Kafka consumer throughput, root-caused and fixed" },
  { k: "~200", v: "Airflow DAGs on an on-prem lakehouse" },
  { k: "2", v: "live products I built and run on GCP" },
];

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-tight">{title}</h2>
      {intro ? <p className="mt-3 text-[16px] leading-7 text-ink/60">{intro}</p> : null}
    </div>
  );
}

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const firstName = site.name.split(" ")[1] ?? site.name;

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-8">
      {/* Hero */}
      <section className="grid items-center gap-10 pb-14 pt-16 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-20">
        <div>
          <Reveal onLoad>
            <LocalTime place={site.location} timeZone="Europe/Helsinki" />
          </Reveal>
          <h1 className="mt-6 text-[clamp(3rem,7.5vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            Hey, I&apos;m <HeroName text={`${firstName}.`} />
          </h1>
          <Reveal onLoad delay={0.25}>
            <p className="mt-5 max-w-xl text-[clamp(1.35rem,2.6vw,1.9rem)] font-medium leading-snug tracking-tight text-ink/85">
              I build data platforms and AI agents you can trace to the last table.
            </p>
            <p className="mt-4">
              <Typer words={building} />
            </p>
          </Reveal>
          <Reveal onLoad delay={0.4}>
            <p className="mt-6 max-w-xl text-[16.5px] leading-7 text-ink/65">{site.summary}</p>
          </Reveal>
          <Reveal onLoad delay={0.55} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#work" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_oklch(0.646_0.222_41.116/0.7)] transition hover:brightness-110">
              Explore my work ↓
            </Link>
            <Link href="#contact" className="rounded-full border border-[var(--border-strong)] bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink/30">
              Let&apos;s connect →
            </Link>
            <span className="ml-1 flex items-center gap-4 text-[13.5px] text-ink/55">
              <a href={site.resume} className="hover:text-ink">CV</a>
              <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">LinkedIn</a>
            </span>
          </Reveal>
        </div>
        <Reveal onLoad delay={0.3} className="relative hidden lg:block">
          <TechOrbit />
          <div className="absolute -bottom-24 -left-6">
            <TraceCard />
          </div>
        </Reveal>
      </section>

      {/* A product window rising into place over the hero as you scroll */}
      <section className="pb-10">
        <ProductShowcase src="/shots/plainjoin/1.png" href="/projects/plainjoin" label="Plainjoin · AI self-service BI" />
      </section>

      {/* Stats */}
      <section className="relative mt-10 grid gap-3 border-y border-[var(--border)] py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="halftone pointer-events-none absolute inset-0 -z-10" aria-hidden />
        {stats.map((s) => (
          <div key={s.v} className="px-1">
            <p className="text-[2.2rem] font-semibold tracking-tight">
              <CountUp value={s.k} />
            </p>
            <p className="mt-0.5 text-[13.5px] leading-5 text-ink/55">{s.v}</p>
          </div>
        ))}
      </section>

      <Reveal className="pt-12">
        <SourcesMarquee />
      </Reveal>

      {/* How I work */}
      <section className="pt-24">
        <Reveal>
          <SectionHead eyebrow="How I work" title="Ingest, model, serve." intro="Every system I build follows the same three moves. Hover a card to see each one move." />
        </Reveal>
        <Reveal delay={0.1}>
          <HowIWork />
        </Reveal>
      </section>

      {/* Work */}
      <section id="work" className="scroll-mt-20 pt-24">
        <Reveal>
        <SectionHead
          eyebrow="Selected work"
          title="Products I've built, and why."
          intro="Platforms from my jobs, products I run myself, and the agents I'm building now. Each one has a case study with screenshots and an animated architecture flow."
        />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <p className="mt-8 text-[14.5px] text-ink/60">
          More in <Link href="/projects" className="font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">all {projects.length} projects</Link>, and on{" "}
          <a href={site.github} target="_blank" rel="noreferrer" className="font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">GitHub</a>.
        </p>
      </section>

      {/* Experience */}
      <section id="experience" className="scroll-mt-20 pt-24">
        <Reveal>
        <SectionHead eyebrow="Experience" title="Where I've done it." />
        <ol className="relative space-y-5 border-l border-[var(--border-strong)] pl-6 sm:pl-8">
          {experience.map((job) => (
            <li key={job.company} className="relative">
              <span className="absolute -left-[31px] top-7 h-3 w-3 rounded-full border-2 border-white bg-[var(--accent)] shadow sm:-left-[39px]" aria-hidden />
              <GlassCard className="p-6 md:p-7" hover={false}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {job.role} · {job.company}
                  </h3>
                  <p className="font-mono text-[12.5px] text-ink/50">{job.dates}</p>
                </div>
                <p className="mt-0.5 text-[13px] text-ink/45">{job.place}</p>
                {job.did ? <p className="mt-3 text-[15.5px] leading-7 text-ink/80">{job.did}</p> : null}
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14.5px] leading-6 text-ink/65">
                  {job.points.slice(0, 4).map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </GlassCard>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[14.5px] text-ink/60">
          Full detail on the <Link href="/about" className="font-medium text-ink underline decoration-ink/25 underline-offset-4">about page</Link>. MSc Computer Science, Åbo Akademi University (expected May 2027) · BSc Computer Science, FAST NUCES.
        </p>
        </Reveal>
      </section>

      {/* Expertise */}
      <section id="expertise" className="scroll-mt-20 pt-24">
        <Reveal>
        <SectionHead eyebrow="Technical expertise" title="Tools I've shipped with, not just tried." />
        <div className="grid gap-4 md:grid-cols-2">
          {expertise.map((g) => (
            <GlassCard key={g.group} className="p-6" hover={false}>
              <h3 className="text-[17px] font-semibold tracking-tight">{g.group}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span key={s} className="rounded-full border border-ink/10 bg-ink/[0.03] px-2.5 py-0.5 font-mono text-[11.5px] text-ink/70">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[14px] leading-6 text-ink/65">
                <span className="font-medium text-ink/85">In practice: </span>
                {g.practice}
              </p>
            </GlassCard>
          ))}
          <GlassCard className="border-dashed p-6" hover={false}>
            <p className="eyebrow">Currently learning</p>
            {learning.map((l) => (
              <div key={l.title} className="mt-3">
                <h3 className="text-[17px] font-semibold tracking-tight">{l.title}</h3>
                <p className="mt-2 text-[14px] leading-6 text-ink/65">{l.body}</p>
              </div>
            ))}
          </GlassCard>
        </div>
        </Reveal>
      </section>

      {/* Hiring */}
      <section id="hiring" className="scroll-mt-20 pt-24">
        <Reveal>
        <GlassCard className="overflow-hidden p-8 md:p-10" hover={false}>
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow">Hiring?</p>
              <h2 className="mt-2 text-[clamp(1.7rem,3vw,2.3rem)] font-semibold leading-tight tracking-tight">
                Here&apos;s what you&apos;d get.
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-ink/70">{hiring.pitch}</p>
              <p className="mt-4 text-[14.5px] leading-6 text-ink/60">{hiring.where}</p>
            </div>
            <div>
              <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink/50">Good fit for</p>
              <ul className="mt-3 space-y-2">
                {hiring.fits.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[15px] text-ink/80">
                    <span className="text-[var(--accent)]" aria-hidden>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={site.resume} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/85">
                  Download CV
                </a>
                <a href={`mailto:${site.email}`} className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-ink hover:border-ink/30">
                  Email me
                </a>
              </div>
            </div>
          </div>
        </GlassCard>
        </Reveal>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 pt-24">
        <Reveal>
        <SectionHead eyebrow="Contact" title="Let's talk about your data." intro="Email or call. I reply within a day." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Email", v: site.email, href: `mailto:${site.email}` },
            { k: "Phone", v: site.phone, href: `tel:${site.phone.replace(/s/g, "")}` },
            { k: "LinkedIn", v: "linkedin.com/in/zahidmu", href: site.linkedin },
            { k: "GitHub", v: "github.com/Zahid07", href: site.github },
          ].map((c) => (
            <a key={c.k} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glass glass-hover rounded-[18px] p-5">
              <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink/50">{c.k}</p>
              <p className="mt-1.5 break-words text-[14.5px] font-medium text-ink">{c.v}</p>
            </a>
          ))}
        </div>
        </Reveal>
      </section>
    </main>
  );
}
