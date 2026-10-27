import { AnimatedDiagram } from "@/components/AnimatedDiagram";
import { GlassCard } from "@/components/GlassCard";
import type { Architecture, Tone } from "@/lib/architecture";
import { getDiagrams } from "@/lib/diagrams";

const toneClass: Record<Tone, string> = {
  source: "border-amber-500/30 bg-amber-400/10",
  process: "border-sky-500/30 bg-sky-400/10",
  store: "border-cyan-600/30 bg-cyan-400/10",
  serve: "border-violet-500/30 bg-violet-400/10",
  gate: "border-ink/25 bg-ink/10",
};

export function ArchitectureFlow({
  flow,
  slug,
}: {
  flow: Architecture;
  slug: string;
}) {
  const viz = getDiagrams(slug);
  const flows = viz.filter((d) => d.kind !== "model");
  const models = viz.filter((d) => d.kind === "model");

  return (
    <section className="mt-16">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/50">
        Architecture
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">How it moves</h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-7 text-ink/65">{flow.caption}</p>

      {flows.length ? (
        <div className="mt-8 space-y-5">
          {flows.map((spec) => (
            <AnimatedDiagram key={spec.id} spec={spec} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
          {flow.map.map((node, i) => (
            <div key={node.label} className="flex flex-wrap items-center gap-2">
              <GlassCard
                className={`min-w-[9.5rem] px-4 py-3 ${toneClass[node.tone ?? "process"]}`}
              >
                {node.sub ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                    {node.sub}
                  </p>
                ) : null}
                <p className="mt-1 text-[14px] font-semibold tracking-tight">{node.label}</p>
              </GlassCard>
              {i < flow.map.length - 1 ? (
                <span className="px-0.5 text-ink/30" aria-hidden>
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {flow.timings?.length ? (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold tracking-tight">Measured on this machine</h3>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-6 text-ink/55">
            {flow.timingNote ?? "Measured on the machine that runs it."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {flow.timings.map((t) => (
              <GlassCard
                key={t.stage}
                className={`p-5 ${t.highlight ? "border-ink/30" : ""}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                  {t.stage}
                </p>
                <p className="mt-2 text-[1.65rem] font-semibold tabular-nums tracking-tight">
                  {t.cost}
                </p>
                <p className="mt-2 text-[13.5px] leading-6 text-ink/62">{t.note}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      ) : null}

      {models.length ? (
        <div className="mt-14">
          <h3 className="text-2xl font-semibold tracking-tight">The model</h3>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-6 text-ink/55">
            Tables, grains, and keys — the schema the pipeline is allowed to write.
          </p>
          <div className="mt-6 space-y-5">
            {models.map((spec) => (
              <AnimatedDiagram key={spec.id} spec={spec} />
            ))}
          </div>
        </div>
      ) : null}

      <ol className="mt-8 space-y-4">
        {flow.stages.map((stage) => (
          <li key={stage.n}>
            <GlassCard className="p-6 md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                <p className="shrink-0 font-semibold tabular-nums tracking-tight text-ink/40 md:w-14 md:text-2xl">
                  {stage.n}
                </p>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-tight">{stage.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-7 text-ink/72">{stage.body}</p>
                  {stage.systems?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.systems.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-ink/10 bg-ink/5 px-2.5 py-1 text-[11px] text-ink/65"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {stage.gate ? (
                    <p className="mt-4 rounded-2xl border border-ink/10 bg-ink/5 px-4 py-3 text-[13.5px] leading-6 text-ink/70">
                      <span className="font-semibold text-ink/90">Gate · </span>
                      {stage.gate}
                    </p>
                  ) : null}
                </div>
              </div>
            </GlassCard>
          </li>
        ))}
      </ol>

      <h3 className="mt-14 text-2xl font-semibold tracking-tight">Decisions that held</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {flow.decisions.map((d) => (
          <GlassCard key={d.title} className="p-6">
            <h4 className="text-[16px] font-semibold tracking-tight">{d.title}</h4>
            <p className="mt-2 text-[14.5px] leading-6 text-ink/68">{d.body}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
