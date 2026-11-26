import "server-only";

import { prisma } from "@/lib/prisma";
import { publicListingWhere } from "@/features/listings/filters";

/** Published, non-expired listings for the public homepage sections. */
export async function getPublishedListings(
  type: "available" | "wanted",
  limit = 4
) {
  return prisma.listing.findMany({
    where: { ...publicListingWhere(), type },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
