import { requireAdmin } from "@/lib/dashboard-access";
import {
  ADMIN_USER_PAGE_SIZES,
  getAdminUserCounts,
  getAdminUsers,
  normaliseAdminUserFilters,
} from "@/lib/admin-users";
import type { AdminUserQuery } from "@/lib/admin-users-query";
import { AdminUsersFilters } from "@/components/dashboard/admin-users-filters";
import { AdminUsersStats } from "@/components/dashboard/admin-users-stats";
import { AdminUsersTable } from "@/components/dashboard/admin-users-table";

type SearchParams = Promise<{
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
  role?: string;
  sort?: string;
}>;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const admin = await requireAdmin();
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = ADMIN_USER_PAGE_SIZES.includes(
    Number(sp.pageSize) as (typeof ADMIN_USER_PAGE_SIZES)[number]
  )
    ? Number(sp.pageSize)
    : 10;
  const filters = normaliseAdminUserFilters({
    q: sp.q,
    status: sp.status,
    role: sp.role,
    sort: sp.sort,
  });

  const [counts, { users, total }] = await Promise.all([
    getAdminUserCounts(),
    getAdminUsers({ filters, page, pageSize }),
  ]);

  const query: AdminUserQuery = {
    ...filters,
    page,
    pageSize,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-sm text-muted-foreground">
          Manage platform users, bans, and access.
        </p>
      </div>

      <AdminUsersStats counts={counts} query={query} />
      <AdminUsersFilters query={query} />
      <AdminUsersTable
        key={[
          filters.q,
          filters.status,
          filters.role,
          filters.sort,
          page,
          pageSize,
        ].join("|")}
        users={users}
        total={total}
        query={query}
        currentUserId={admin.id}
      />
    </div>
  );
}
