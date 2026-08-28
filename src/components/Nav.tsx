import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 w-[min(1120px,calc(100%-1.5rem))]">
      <nav className="glass flex items-center justify-between rounded-full px-3 py-2 pl-5">
        <Link href="/" className="text-[13px] font-semibold tracking-wide">
          {site.name}
        </Link>
        <div className="flex items-center gap-1 text-[13px] text-white/70">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={site.resume}
            className="ml-1 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-black transition hover:bg-white/90"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
