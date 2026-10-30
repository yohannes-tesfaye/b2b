import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/permissions";
import { UsersDataTable } from "@/components/dashboard/users-data-table";

type SearchParams = Promise<{
  page?: string;
  pageSize?: string;
  q?: string;
  role?: string;
  status?: string;
  sort?: string;
  dir?: string;
}>;

const ALLOWED_PAGE_SIZES = [10, 20];

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string | null } | undefined)?.role ?? null;
  if (!session || !role || !adminRoles.includes(role)) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }

  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = ALLOWED_PAGE_SIZES.includes(Number(sp.pageSize)) ? Number(sp.pageSize) : 10;
  const q = (sp.q ?? "").trim();
  const roleFilter = sp.role ?? "all";
  const statusFilter = sp.status ?? "all";
  const sort = sp.sort ?? "createdAt";
  const dir = sp.dir === "asc" ? "asc" : "desc";

  const where: Record<string, unknown> = {};
  if (roleFilter !== "all") where.role = roleFilter;
  if (statusFilter === "banned") where.banned = true;
  if (statusFilter === "active") where.banned = false;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy = { [sort]: dir } as Record<string, "asc" | "desc">;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-sm text-muted-foreground">Manage platform users, bans, and access.</p>
      </div>
      <UsersDataTable
        users={users}
        total={total}
        page={page}
        pageSize={pageSize}
        q={q}
        role={roleFilter}
        status={statusFilter}
        sort={sort}
        dir={dir}
      />
    </div>
  );
}
