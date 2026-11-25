import "server-only";

import { prisma } from "@/lib/prisma";
import {
  buildAdminListingWhere,
  normaliseAdminListingFilters,
} from "@/lib/admin-listings";

/** Published, non-expired listings for the public homepage sections. */
export async function getPublishedListings(
  type: "available" | "wanted",
  limit = 4
) {
  const filters = normaliseAdminListingFilters({
    status: "active",
    type,
  });

  return prisma.listing.findMany({
    where: buildAdminListingWhere(filters),
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
