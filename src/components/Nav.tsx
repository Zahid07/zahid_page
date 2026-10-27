import Link from "next/link";
import { site } from "@/lib/site";

// Home-page sections (anchors work from any page), plus the full project list.
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/#hiring", label: "Hiring?" },
  { href: "/#contact", label: "Contact" },
  { href: "/projects", label: "All projects" },
];

// Brand mark in the concept's style: two overlapping rings, one filled with the accent.
function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
      <circle cx="9" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="15" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 6.4a6.5 6.5 0 0 1 0 11.2a6.5 6.5 0 0 1 0-11.2z" fill="var(--accent)" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/[0.08] bg-[oklch(1_0_0/0.8)] backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-[min(1120px,calc(100%-2rem))] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold tracking-tight">
          <Mark />
          {site.name}
        </Link>
        <div className="hidden items-center gap-0.5 text-[13.5px] text-ink/65 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-md px-3 py-1.5 transition hover:bg-ink/[0.05] hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[13.5px] text-ink/65">
          <Link href="/projects" className="rounded-md px-2 py-1.5 hover:text-ink lg:hidden">
            Projects
          </Link>
          <a
            href={site.resume}
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition hover:border-ink/30"
          >
            <span aria-hidden>↓</span> CV
          </a>
        </div>
      </nav>
    </header>
  );
}
