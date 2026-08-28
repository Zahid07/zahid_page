export type MdSection = { title: string; body: string };

export function splitMarkdownSections(markdown: string): MdSection[] {
  const chunks = markdown.split(/^## /m).map((c) => c.trim()).filter(Boolean);
  return chunks.map((chunk) => {
    const nl = chunk.indexOf("\n");
    if (nl === -1) return { title: chunk.trim(), body: "" };
    return { title: chunk.slice(0, nl).trim(), body: chunk.slice(nl + 1).trim() };
  });
}
