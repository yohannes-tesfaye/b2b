import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ListingRow } from "@/types/listing";
import type { AdminUserRow } from "@/types/user";

export const ADMIN_USER_PAGE_SIZES = [10, 20] as const;

export const ADMIN_USER_STATUS_FILTERS = ["all", "active", "banned"] as const;

export const ADMIN_USER_SORTS = ["newest", "oldest", "name", "listings"] as const;

export type AdminUserSort = (typeof ADMIN_USER_SORTS)[number];

export type AdminUserFilters = {
  q?: string;
  status?: string;
  role?: string;
  sort?: string;
};

export function normaliseAdminUserFilters(
  filters: AdminUserFilters
): Required<AdminUserFilters> {
  const status = ADMIN_USER_STATUS_FILTERS.includes(
    (filters.status ?? "") as (typeof ADMIN_USER_STATUS_FILTERS)[number]
  )
    ? (filters.status as string)
    : "all";
  const sort = ADMIN_USER_SORTS.includes(filters.sort as AdminUserSort)
    ? (filters.sort as string)
    : "newest";

  return {
    q: (filters.q ?? "").trim(),
    status,
    role: (filters.role ?? "").trim() || "all",
    sort,
  };
}

export function buildAdminUserWhere(
  filters: ReturnType<typeof normaliseAdminUserFilters>
): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (filters.status === "active") where.banned = { not: true };
  if (filters.status === "banned") where.banned = true;
  if (filters.role !== "all") {
    // Roles are stored as a comma-separated list, so a contains match keeps
    // users with multiple roles visible under each of them.
    where.role = { contains: filters.role };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { companyName: { contains: filters.q, mode: "insensitive" } },
      { country: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return where;
}

function adminUserOrderBy(
  sort: string
): Prisma.UserOrderByWithRelationInput[] {
  if (sort === "oldest") return [{ createdAt: "asc" }];
  if (sort === "name") return [{ name: "asc" }];
  if (sort === "listings") {
    return [{ listings: { _count: "desc" } }, { createdAt: "desc" }];
  }
  return [{ createdAt: "desc" }];
}

export async function getAdminUsers({
  filters,
  page,
  pageSize,
}: {
  filters: ReturnType<typeof normaliseAdminUserFilters>;
  page: number;
  pageSize: number;
}) {
  const where = buildAdminUserWhere(filters);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { listings: true } } },
      orderBy: adminUserOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users as AdminUserRow[],
    total,
  };
}

export type AdminUserDetail = AdminUserRow & {
  phone: string | null;
  website: string | null;
  updatedAt: Date;
  _count: { listings: number; sessions: number };
  sessions: { id: string; createdAt: Date }[];
  listings: ListingRow[];
};

/**
 * Loads one user for the admin detail page: role/company fields, session
 * count plus the most recent session, and up-to-date listing rows so the
 * page can show activity and a recent-listings summary.
 */
export async function getAdminUserDetail(
  id: string
): Promise<AdminUserDetail | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { listings: true, sessions: true } },
      sessions: { orderBy: { createdAt: "desc" }, take: 1 },
      listings: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  return user as AdminUserDetail | null;
}

export async function getAdminUserCounts() {
  const [total, active, banned, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { banned: { not: true } } }),
    prisma.user.count({ where: { banned: true } }),
    prisma.user.count({ where: { role: { contains: "admin" } } }),
  ]);

  return { total, active, banned, admins };
}
