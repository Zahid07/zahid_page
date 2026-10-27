import fs from "fs";
import path from "path";

// Server-only: screenshot URLs for a project, in file-name order (1.png, 2.png, ...).
export function getShots(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "shots", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `/shots/${slug}/${f}`);
}
