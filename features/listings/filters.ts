import type { Prisma } from "@prisma/client";

/**
 * Public listings are published (admin-approved) and not expired.
 * This is the single source of truth for what the public can see.
 */
export function publicListingWhere(): Prisma.ListingWhereInput {
  return {
    status: "active",
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };
}
