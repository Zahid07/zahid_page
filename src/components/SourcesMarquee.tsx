// "Data in from anywhere": an endless strip of the sources I've ingested from (all from the master CV).
const sources = ["PostgreSQL", "Kafka", "Oracle 19c", "MySQL", "SQL Server", "NetSuite ERP", "REST APIs", "S3", "ADLS Gen2", "Event streams", "PDFs", "Web scraping", "Sensors (RPi 5)", "RabbitMQ"];

export function SourcesMarquee() {
  return (
    <div className="flex items-center gap-6">
      <p className="shrink-0 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink/50">Data in from anywhere</p>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max gap-2.5">
          {[...sources, ...sources].map((s, i) => (
            <span
              key={`${s}-${i}`}
              aria-hidden={i >= sources.length}
              className="whitespace-nowrap rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[13px] text-ink/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
