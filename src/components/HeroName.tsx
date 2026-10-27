// The hero name plays a design-tool "edit" on every page load: outline draws, a selection box with handles
// appears, a cursor clicks it, then the text fills and the box fades (CSS only; see globals.css).
export function HeroName({ text }: { text: string }) {
  const handles = ["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"];
  return (
    <span className="relative inline-block">
      <span className="name-draw font-serif font-normal italic tracking-[-0.02em]">{text}</span>
      <span className="sel-box pointer-events-none absolute -inset-x-3 -inset-y-1 border border-[var(--accent-2)]" aria-hidden>
        {handles.map((h) => (
          <span key={h} className={`absolute ${h} h-2 w-2 border border-[var(--accent-2)] bg-white`} />
        ))}
        <span className="absolute -top-6 left-0 rounded bg-[var(--accent-2)] px-1.5 py-0.5 font-mono text-[10px] not-italic leading-none tracking-normal text-white">
          name · serif italic
        </span>
      </span>
      <svg className="sel-cursor pointer-events-none absolute -bottom-4 right-0 h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.7 L17.5 13.4 Z" fill="var(--accent-2)" stroke="white" strokeWidth="1.2" />
      </svg>
    </span>
  );
}
