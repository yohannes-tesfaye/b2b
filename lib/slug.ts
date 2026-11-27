/**
 * Client-safe slug helpers shared by the listing form, server actions and the
 * taxonomy seeds. Slugs are the stable natural keys stored on listings.
 */

const DIACRITICS = /[\u0300-\u036f]/g;

const SLUG_ALIASES: Record<string, string> = {
  "&": "and",
  "+": "plus",
};

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[&+]/g, (match) => ` ${SLUG_ALIASES[match]} `)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** "ISO 9001, organic ,bulk" -> ["iso-9001", "organic", "bulk"] (deduped, max). */
export function parseTagSlugs(value: string | null | undefined, max = 8): string[] {
  if (!value) return [];
  const seen = new Set<string>();
  for (const raw of value.split(",")) {
    const slug = slugify(raw);
    if (!slug || slug.length < 2) continue;
    seen.add(slug);
    if (seen.size >= max) break;
  }
  return Array.from(seen);
}

/** Human label for a tag slug when no tag row is available. */
export function tagSlugToLabel(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) =>
      part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}
