import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListingType } from "@/types/listing";

export const MAX_SEARCH_LENGTH = 100;
export const DEFAULT_PAGE_SIZE = 6;

export type PublishedListingSort = "newest" | "oldest" | "expiring";

export type GetPublishedListingsParams = {
  q?: string;
  type?: ListingType;
  categories?: string[];
  sort?: PublishedListingSort;
  page?: number;
  pageSize?: number;
};

/** Trim user input and cap it so an oversized query cannot reach the database. */
export function normalizeSearchQuery(value?: string) {
  return value?.trim().slice(0, MAX_SEARCH_LENGTH) ?? "";
}

/**
 * Published (= admin-approved, non-expired) listings, optionally filtered by a
 * case-insensitive search across title, description and category.
 */
export async function getPublishedListings({
  q,
  type,
  categories = [],
  sort = "newest",
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: GetPublishedListingsParams = {}) {
  const query = normalizeSearchQuery(q);

  const and: Prisma.ListingWhereInput[] = [
    { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  ];

  if (type) and.push({ type });
  if (categories.length) and.push({ category: { in: categories } });
  if (query) {
    and.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.ListingWhereInput = { status: "active", AND: and };
  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "expiring"
        ? { expiresAt: "asc" as const }
        : { createdAt: "desc" as const };

  const total = await prisma.listing.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const items = await prisma.listing.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return { items, total, totalPages, currentPage };
}
