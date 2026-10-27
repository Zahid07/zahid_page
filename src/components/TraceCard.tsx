// A terminal-style card tracing one dashboard number back to its source: the site's thesis in five lines.
const rows: [string, string][] = [
  ["trace", "dashboard · net revenue, month to date"],
  ["source", "orders · ERP + events → Kafka"],
  ["model", "dbt staging → fact_orders + SCD2 dims"],
  ["check", "dbt tests ✓ · reconciled with bank ✓"],
  ["serve", "ClickHouse mart · read-only"],
];

export function TraceCard() {
  return (
    <div className="glass w-full max-w-[400px] rounded-[14px] p-4 font-mono text-[11.5px]">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-ink/45">lineage --trace</span>
      </div>
      <dl className="space-y-1.5">
        {rows.map(([k, v], i) => (
          <div key={k} className="trace-row flex gap-3" style={{ animationDelay: `${0.4 + i * 0.35}s` }}>
            <dt className="w-12 shrink-0 text-[var(--accent)]">{k}</dt>
            <dd className={k === "check" ? "text-[var(--good)]" : "text-ink/70"}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
