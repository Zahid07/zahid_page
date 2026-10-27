import type { ProjectMeta } from "@/lib/projects";

export function StatusPill({ status }: { status: NonNullable<ProjectMeta["status"]> }) {
  return <span className={`pill ${status === "live" ? "pill-good" : ""}`}>{status}</span>;
}
