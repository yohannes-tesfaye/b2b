/**
 * Search index helpers for listings.
 *
 * `Listing.searchText` is a denormalised, lower-cased blob of everything a
 * buyer might type. Filtering uses a plain `contains` (ILIKE) so Prisma stays
 * in charge of the query; a GIN trigram index (created by the migration, when
 * pg_trgm is available) makes that fast. If the extension is not installed the
 * same query still works through a sequential scan.
 *
 * Every write path must go through `buildListingSearchText()` so the blob never
 * drifts from the listing (there is also a rebuild script).
 */

export type SearchTextSource = {
  title: string;
  description: string;
  category?: string | null;
  categoryLabel?: string | null;
  location?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  quantity?: string | null;
  moq?: string | null;
  certifications?: string | null;
  incoterms?: string | null;
  originCountry?: string | null;
  technicalSpecs?: string | null;
  tags?: Array<string | null | undefined>;
  companyName?: string | null;
};

const MAX_LENGTH = 6000;

function normalize(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildListingSearchText(source: SearchTextSource): string {
  const parts = [
    source.title,
    source.description,
    source.category,
    source.categoryLabel,
    source.location,
    source.countryCode,
    source.countryName,
    source.quantity,
    source.moq,
    source.certifications,
    source.incoterms,
    source.originCountry,
    source.technicalSpecs,
    source.companyName,
    ...(source.tags ?? []),
  ]
    .map(normalize)
    .filter(Boolean);

  const missing = new Set<string>();
  const unique = parts.filter((part) => {
    if (missing.has(part)) return false;
    missing.add(part);
    return true;
  });

  return unique.join(" ").slice(0, MAX_LENGTH);
}

/** Collapses a user query into something safe for `contains` filtering. */
export function normalizeSearchQuery(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
}
