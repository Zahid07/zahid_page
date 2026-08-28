import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-[min(1120px,calc(100%-1.5rem))] py-16 text-sm text-white/45">
      <div className="glass flex flex-col gap-4 rounded-[24px] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · {site.location}
        </p>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-white" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="hover:text-white" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="hover:text-white" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
