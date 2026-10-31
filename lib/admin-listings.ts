import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { addDays } from "@/lib/listings";
import type {
  AdminListingDetail,
  AdminListingRow,
  ListingStatus,
} from "@/types/listing";

export const ADMIN_LISTING_PAGE_SIZES = [10, 20] as const;

export const ADMIN_LISTING_STATUS_FILTERS: Array<
  ListingStatus | "all"
> = ["all", "pending", "active", "rejected", "expired", "closed"];

export const ADMIN_LISTING_SORTS = ["newest", "oldest", "expiring"] as const;

export type AdminListingSort = (typeof ADMIN_LISTING_SORTS)[number];

export type AdminListingFilters = {
  q?: string;
  status?: string;
  type?: string;
  category?: string;
  sort?: string;
  expiring?: boolean;
};

const ownerSelect = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  companyName: true,
  phone: true,
  role: true,
  banned: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export function normaliseAdminListingFilters(
  filters: AdminListingFilters
): Required<Omit<AdminListingFilters, "expiring">> & { expiring: boolean } {
  const status = ADMIN_LISTING_STATUS_FILTERS.includes(
    (filters.status ?? "") as ListingStatus | "all"
  )
    ? (filters.status as string)
    : "pending";
  const type = ["wanted", "available"].includes(filters.type ?? "")
    ? (filters.type as string)
    : "all";
  const sort = ADMIN_LISTING_SORTS.includes(filters.sort as AdminListingSort)
    ? (filters.sort as string)
    : "newest";

  return {
    q: (filters.q ?? "").trim(),
    status,
    type,
    category: (filters.category ?? "").trim() || "all",
    sort,
    expiring: Boolean(filters.expiring),
  };
}

function effectiveStatusWhere(
  status: string,
  now: Date
): Prisma.ListingWhereInput | null {
  if (status === "all") return null;

  if (status === "expired") {
    return {
      OR: [
        { status: "expired" },
        { status: "active", expiresAt: { lte: now } },
      ],
    };
  }

  if (status === "active") {
    return {
      status: "active",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    };
  }

  return { status };
}

export function buildAdminListingWhere(
  filters: ReturnType<typeof normaliseAdminListingFilters>,
  now = new Date()
): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {};
  const and: Prisma.ListingWhereInput[] = [];
  const statusWhere = effectiveStatusWhere(
    filters.expiring ? "active" : filters.status,
    now
  );

  if (statusWhere) and.push(statusWhere);
  if (filters.type !== "all") where.type = filters.type;
  if (filters.category !== "all") where.category = filters.category;
  if (filters.expiring) {
    where.expiresAt = {
      gt: now,
      lte: addDays(now, 7),
    };
  }
  if (filters.q) {
    and.push({
      OR: [
        { id: { contains: filters.q, mode: "insensitive" } },
        { title: { contains: filters.q, mode: "insensitive" } },
        {
          user: {
            is: {
              OR: [
                { name: { contains: filters.q, mode: "insensitive" } },
                { email: { contains: filters.q, mode: "insensitive" } },
                { companyName: { contains: filters.q, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    });
  }
  if (and.length) where.AND = and;

  return where;
}

function adminListingOrderBy(
  sort: string
): Prisma.ListingOrderByWithRelationInput[] {
  if (sort === "oldest") return [{ createdAt: "asc" }];
  if (sort === "expiring") {
    return [{ expiresAt: "asc" }, { createdAt: "desc" }];
  }
  return [{ createdAt: "desc" }];
}

export async function getAdminListings({
  filters,
  page,
  pageSize,
}: {
  filters: ReturnType<typeof normaliseAdminListingFilters>;
  page: number;
  pageSize: number;
}) {
  const where = buildAdminListingWhere(filters);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { user: { select: ownerSelect } },
      orderBy: adminListingOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings: listings as AdminListingRow[],
    total,
  };
}

export async function getAdminListingCounts() {
  const now = new Date();
  const expiringBy = addDays(now, 7);

  const [pending, active, rejected, expiring] = await Promise.all([
    prisma.listing.count({ where: { status: "pending" } }),
    prisma.listing.count({
      where: {
        status: "active",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
    prisma.listing.count({ where: { status: "rejected" } }),
    prisma.listing.count({
      where: {
        status: "active",
        expiresAt: { gt: now, lte: expiringBy },
      },
    }),
  ]);

  return { pending, active, rejected, expiring };
}

export async function getAdminListingDetail(
  id: string
): Promise<AdminListingDetail | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          ...ownerSelect,
          _count: { select: { listings: true } },
        },
      },
      reviewedBy: { select: { id: true, name: true, email: true } },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        include: {
          changedBy: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  return listing as AdminListingDetail | null;
}
