import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/[0.08]">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col gap-4 py-10 text-[13.5px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · {site.location}
        </p>
        <div className="flex flex-wrap gap-5">
          <a className="hover:text-white" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="hover:text-white" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="hover:text-white" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-white" href={site.resume}>
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
