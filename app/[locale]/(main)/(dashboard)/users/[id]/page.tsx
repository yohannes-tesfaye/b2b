import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/permissions";
import { UserCard } from "@/components/dashboard/user-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteUserButton } from "@/components/dashboard/delete-user-button";
import { banUser, unbanUser } from "../actions";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const role =
    (session?.user as { role?: string | null } | undefined)?.role ?? null;
  if (!session || !role || !adminRoles.includes(role)) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { sessions: true } },
      sessions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!user) notFound();

  const isSelf = session!.user.id === user.id;
  const lastSession = user.sessions[0];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{user.name || "Unnamed"}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {isSelf ? (
        <p className="text-xs text-muted-foreground">
          You cannot ban or delete your own account.
        </p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <UserCard user={user} />
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="px-(--card-spacing)">
              <CardTitle className="text-base">Company</CardTitle>
            </CardHeader>
            <CardContent className="px-(--card-spacing) grid grid-cols-1 gap-3 text-sm">
              {user.companyName ? (
                <>
                  <div>
                    <span className="text-muted-foreground">Company:</span>{" "}
                    {user.companyName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Industry:</span>{" "}
                    {user.industry || "—"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Company size:</span>{" "}
                    {user.companySize || "—"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Country:</span>{" "}
                    {user.country || "—"}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">
                  No company information
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Phone:</span>{" "}
                {user.phone || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Website:</span>{" "}
                {user.website || "—"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="px-(--card-spacing)">
              <CardTitle className="text-base">
                Account &amp; Security
              </CardTitle>
            </CardHeader>
            <CardContent className="px-(--card-spacing) grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Role:</span>{" "}
                {user.role || "buyer"}
              </div>
              <div>
                <span className="text-muted-foreground">Email verified:</span>{" "}
                {user.emailVerified ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-muted-foreground">Joined:</span>{" "}
                {user.createdAt.toLocaleDateString()}
              </div>
              <div>
                <span className="text-muted-foreground">Sessions:</span>{" "}
                {user._count?.sessions ?? 0}
              </div>
              <div>
                <span className="text-muted-foreground">Last active:</span>{" "}
                {lastSession
                  ? new Date(lastSession.createdAt).toLocaleString()
                  : "—"}
              </div>
              {user.banned ? (
                <div className="text-destructive">
                  <span className="text-muted-foreground">Ban reason:</span>{" "}
                  {user.banReason || "—"}
                  {user.banExpires
                    ? ` (expires ${new Date(user.banExpires).toLocaleDateString()})`
                    : ""}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.banned ? (
            <form action={unbanUser.bind(null, user.id)}>
              <Button variant="outline" disabled={isSelf}>
                Unban user
              </Button>
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
              <Input
                name="reason"
                placeholder="Ban reason (optional)"
                className="w-64"
              />
              <Button variant="destructive" disabled={isSelf} type="submit">
                Ban user
              </Button>
            </form>
          )}
          <DeleteUserButton userId={user.id} disabled={isSelf} />
        </div>
      </div>
    </div>
  );
}
