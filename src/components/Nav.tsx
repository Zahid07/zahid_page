import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
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
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[oklch(0.145_0_0/0.72)] backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-[min(1120px,calc(100%-2rem))] items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold tracking-tight">
          <Mark />
          {site.name}
          <span className="pill ml-1 hidden md:inline-flex">data · platform · ai</span>
        </Link>
        <div className="flex items-center gap-0.5 text-[13.5px] text-white/65 sm:gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-2 py-1.5 transition hover:bg-white/[0.06] hover:text-white sm:px-3 ${
                l.href === "/" ? "hidden sm:block" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={site.resume}
            className="ml-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-black transition hover:bg-white/90"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
