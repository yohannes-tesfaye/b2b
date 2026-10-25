import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/permissions";
import { UserCard } from "@/components/dashboard/user-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteUserButton } from "@/components/dashboard/delete-user-button";
import { banUser, unbanUser } from "../actions";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string | null } | undefined)?.role ?? null;
  if (!session || !role || !adminRoles.includes(role)) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const isSelf = session!.user.id === user.id;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <UserCard user={user} />
      <div className="flex flex-wrap gap-3">
        {user.banned ? (
          <form action={unbanUser.bind(null, user.id)}>
            <Button variant="outline" disabled={isSelf}>Unban user</Button>
          </form>
        ) : (
          <form
            action={async (formData: FormData) => {
              "use server";
              const reason = String(formData.get("reason") || "");
              await banUser(user.id, reason);
            }}
            className="flex items-center gap-2"
          >
            <Input name="reason" placeholder="Ban reason (optional)" className="w-64" />
            <Button variant="destructive" disabled={isSelf} type="submit">Ban user</Button>
          </form>
        )}
        <DeleteUserButton userId={user.id} disabled={isSelf} />
      </div>
      {isSelf ? (
        <p className="text-xs text-muted-foreground">You cannot ban or delete your own account.</p>
      ) : null}
    </div>
  );
}
