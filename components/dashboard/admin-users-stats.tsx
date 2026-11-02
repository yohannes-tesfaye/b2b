import { Link } from "@/i18n/navigation";
import { Ban, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminUsersHref, type AdminUserQuery } from "@/lib/admin-users-query";

type Counts = {
  total: number;
  active: number;
  banned: number;
  admins: number;
};

export function AdminUsersStats({
  counts,
  query,
}: {
  counts: Counts;
  query: AdminUserQuery;
}) {
  const cards = [
    {
      key: "all",
      label: "All users",
      value: counts.total,
      icon: Users,
      href: adminUsersHref({ ...query, status: "all", role: "all", page: 1 }),
      active: query.status === "all" && query.role === "all",
      highlight: true,
      hint: "Everyone on the platform",
    },
    {
      key: "active",
      label: "Active",
      value: counts.active,
      icon: UserCheck,
      href: adminUsersHref({ ...query, status: "active", page: 1 }),
      active: query.status === "active",
      highlight: false,
      hint: "Can sign in normally",
    },
    {
      key: "banned",
      label: "Banned",
      value: counts.banned,
      icon: Ban,
      href: adminUsersHref({ ...query, status: "banned", page: 1 }),
      active: query.status === "banned",
      highlight: false,
      hint: "Access is blocked",
    },
    {
      key: "admins",
      label: "Admins",
      value: counts.admins,
      icon: ShieldCheck,
      href: adminUsersHref({
        ...query,
        status: "all",
        role: "admin",
        page: 1,
      }),
      active: query.role === "admin",
      highlight: false,
      hint: "Admin & superadmin",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card
            className={
              card.active
                ? "h-full ring-2 ring-primary/50 transition-colors"
                : "h-full transition-colors hover:bg-muted/40"
            }
          >
            <CardContent className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {card.label}
                </p>
                <p
                  className={
                    card.highlight
                      ? "text-3xl font-semibold text-primary"
                      : "text-3xl font-semibold"
                  }
                >
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              </div>
              <div
                className={
                  card.highlight
                    ? "rounded-lg bg-primary/10 p-2 text-primary"
                    : "rounded-lg bg-muted p-2 text-muted-foreground"
                }
              >
                <card.icon className="size-4" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
