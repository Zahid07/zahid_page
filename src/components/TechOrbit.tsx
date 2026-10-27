// Two slowly counter-rotating rings of tech chips around a "ship data" core (pure CSS animation, no JS).
const inner = ["Kafka", "ClickHouse", "dbt", "Airflow", "Spark", "PostgreSQL"];
const outer = ["AWS", "GCP", "Azure", "Kubernetes", "LangGraph", "RAG", "Trino", "Python"];

function Ring({ items, radius, duration, reverse }: { items: string[]; radius: number; duration: number; reverse?: boolean }) {
  return (
    <div
      className="orbit-ring absolute inset-0"
      style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
    >
      <div
        className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-ink/[0.12]"
        style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      />
      {items.map((label, k) => {
        const a = (k / items.length) * Math.PI * 2;
        return (
          <span
            key={label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(${Math.cos(a) * radius}px, ${Math.sin(a) * radius}px)` }}
          >
            {/* A zero-size pivot counter-rotates so the label stays upright; the label centres itself on it. */}
            <span
              className="orbit-ring absolute h-0 w-0"
              style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "normal" : "reverse" }}
            >
              <span className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--border)] bg-white px-2.5 py-0.5 font-mono text-[11.5px] text-ink/70 shadow-sm">
                {label}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function TechOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden>
      <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,oklch(0.646_0.222_41.116/0.28),transparent_70%)] blur-xl" />
      <Ring items={outer} radius={200} duration={90} reverse />
      <Ring items={inner} radius={118} duration={60} />
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--border)] bg-white shadow-[var(--shadow)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">ship</span>
        <span className="text-[17px] font-semibold text-[var(--accent)]">data</span>
      </div>
    </div>
  );
}
