// Three blueprint-style cards (corner crosshairs). The big title fades on hover, tap or focus and a small
// animated illustration takes its place. Animations live in globals.css.
const P = "var(--accent-2)";
const O = "var(--accent)";

function IngestArt() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      {[20, 60, 100].map((y) => (
        <g key={y}>
          <circle cx="24" cy={y} r="7" fill={P} opacity="0.85" />
          <path d={`M32 ${y} C 90 ${y}, 100 60, 150 60`} fill="none" stroke={P} strokeWidth="2" className="flow-dash" />
        </g>
      ))}
      <rect x="150" y="42" width="36" height="36" rx="8" fill="white" stroke={O} strokeWidth="2" />
      <path d="M160 60 h16 M168 52 v16" stroke={O} strokeWidth="2" />
    </svg>
  );
}

function ModelArt() {
  const around: [number, number][] = [[100, 18], [170, 60], [100, 102], [30, 60]];
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      {around.map(([x, y]) => (
        <line key={`${x}${y}`} x1="100" y1="60" x2={x} y2={y} stroke={P} strokeWidth="1.6" opacity="0.6" />
      ))}
      {around.map(([x, y], i) => (
        <circle key={`n${x}${y}`} cx={x} cy={y} r="6" fill={P} className="pulse-node" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <rect x="82" y="46" width="36" height="28" rx="6" fill="white" stroke={O} strokeWidth="2" />
      <text x="100" y="64" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={O}>fact</text>
    </svg>
  );
}

function ServeArt() {
  const bars = [44, 70, 52, 88, 64, 96];
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <line x1="20" y1="104" x2="184" y2="104" stroke="rgba(23,23,23,0.2)" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={28 + i * 26}
          y={104 - h}
          width="16"
          height={h}
          rx="3"
          fill={i === bars.length - 1 ? O : P}
          opacity={i === bars.length - 1 ? 1 : 0.75}
          className="bar-grow"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </svg>
  );
}

const cards = [
  { title: "Ingest", head: "Bring data in from anywhere.", body: "APIs, databases, files and event streams, landed reliably with schema evolution and data contracts.", Art: IngestArt },
  { title: "Model", head: "Make it mean one thing.", body: "Dimensional models, SCD history and tested dbt marts that reconcile with the source.", Art: ModelArt },
  { title: "Serve", head: "Put it where decisions happen.", body: "Fast OLAP marts, dashboards, APIs and AI agents, behind read-only access.", Art: ServeArt },
];

export function HowIWork() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map(({ title, head, body, Art }) => (
        <div key={title} tabIndex={0} className="work-card relative flex min-h-[340px] flex-col bg-white/60 p-6 outline-none ring-[var(--accent-2)] focus-visible:ring-2">
          <span className="crosshair -left-[6px] -top-[6px]" aria-hidden />
          <span className="crosshair -right-[6px] -top-[6px]" aria-hidden />
          <span className="crosshair -bottom-[6px] -left-[6px]" aria-hidden />
          <span className="crosshair -bottom-[6px] -right-[6px]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 border border-[var(--border)]" aria-hidden />
          <div className="relative grid flex-1 place-items-center">
            <p className="work-title text-[2.2rem] font-semibold tracking-tight">{title}</p>
            <div className="reveal-art absolute inset-x-4 inset-y-2" aria-hidden>
              <Art />
            </div>
          </div>
          <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{head}</h3>
          <p className="mt-1.5 text-[14px] leading-6 text-ink/60">{body}</p>
          <span className="mt-4 self-start rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11.5px] text-ink/50">
            Hover, tap, or focus to explore
          </span>
        </div>
      ))}
    </div>
  );
}
