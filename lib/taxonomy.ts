import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  LISTING_CATEGORIES,
  setCategoryNameMap,
  type CategoryOption,
} from "@/lib/listings";
import { INDUSTRY_META } from "@/lib/profile";

/**
 * Server-only taxonomy access.
 *
 * Categories and industries live in the database (see prisma/schema.prisma) but
 * `Listing.category` / `User.industry` keep storing the slug, so nothing that
 * reads those columns has to change. Every helper here degrades to the static
 * lists in `lib/listings.ts` / `lib/profile.ts` when the tables are empty or
 * unreachable — a taxonomy problem must never take the storefront down.
 */

export type TaxonomyEntry = {
  slug: string;
  name: string;
  sortOrder: number;
  parentId: string | null;
};

const FALLBACK_CATEGORIES: CategoryOption[] = LISTING_CATEGORIES.map(
  (category, index) => ({
    value: category.value,
    label: category.label,
    sortOrder: index,
  })
);

function toCategoryOptions(entries: TaxonomyEntry[]): CategoryOption[] {
  return entries.map((entry) => ({
    value: entry.slug,
    label: entry.name,
    sortOrder: entry.sortOrder,
  }));
}

/** Active categories, de-duplicated per request. */
export const getCategories = cache(async (): Promise<CategoryOption[]> => {
  try {
    const rows = await prisma.category.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { slug: true, name: true, sortOrder: true, parentId: true },
    });

    if (rows.length) {
      const options = toCategoryOptions(rows);
      // Keep the shared label registry in sync so `categoryLabel()` renders
      // renamed categories everywhere, including nested server components.
      setCategoryNameMap(
        Object.fromEntries(options.map((option) => [option.value, option.label]))
      );
      return options;
    }
  } catch (error) {
    console.warn("[taxonomy] categories unavailable, using fallback", error);
  }

  return FALLBACK_CATEGORIES;
});

/** Slug -> display name for server components that render listing labels. */
export const getCategoryNames = cache(
  async (): Promise<Record<string, string>> => {
    const categories = await getCategories();
    return Object.fromEntries(
      categories.map((category) => [category.value, category.label])
    );
  }
);

export const getIndustries = cache(async (): Promise<CategoryOption[]> => {
  try {
    const rows = await prisma.industry.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { slug: true, name: true, sortOrder: true },
    });

    if (rows.length) {
      return rows.map((row) => ({
        value: row.slug,
        label: row.name,
        sortOrder: row.sortOrder,
      }));
    }
  } catch (error) {
    console.warn("[taxonomy] industries unavailable, using fallback", error);
  }

  return INDUSTRY_META.map((industry, index) => ({
    value: industry.value,
    label: industry.labelKey,
    sortOrder: index,
  }));
});

/** Slugs that are allowed in a filter/query string. */
export async function getAllowedCategorySlugs(): Promise<Set<string>> {
  const categories = await getCategories();
  return new Set(categories.map((category) => category.value));
}

/** Tags already used on listings, most used first (for filter chips). */
export const getPopularTags = cache(
  async (limit = 20): Promise<Array<{ slug: string; name: string; count: number }>> => {
    try {
      const rows = await prisma.tag.findMany({
        orderBy: { listings: { _count: "desc" } },
        take: limit,
        select: {
          slug: true,
          name: true,
          _count: { select: { listings: true } },
        },
      });
      return rows
        .filter((row) => row._count.listings > 0)
        .map((row) => ({
          slug: row.slug,
          name: row.name,
          count: row._count.listings,
        }));
    } catch (error) {
      console.warn("[taxonomy] tags unavailable", error);
      return [];
    }
  }
);
