import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Explanation = {
  slug: string;
  content: string;
  data: Record<string, unknown>;
};

export function getExplanation(slug: string): Explanation | null {
  const file = path.join(process.cwd(), "explanations", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  return { slug, content: parsed.content, data: parsed.data };
}
