import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/permissions";
import { UserList } from "@/components/dashboard/user-list";

export default async function UsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string | null } | undefined)?.role ?? null;
  if (!session || !role || !adminRoles.includes(role)) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-sm text-muted-foreground">Manage platform users, bans, and access.</p>
      </div>
      <UserList users={users} />
    </div>
  );
}
