import { Link } from "@/i18n/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminListingsHref, type AdminListingQuery } from "@/lib/admin-listings-query";

type Counts = {
  pending: number;
  active: number;
  rejected: number;
  expiring: number;
};

export function AdminListingsStats({
  counts,
  query,
}: {
  counts: Counts;
  query: AdminListingQuery;
}) {
  const cards = [
    {
      key: "pending",
      label: "Pending review",
      value: counts.pending,
      icon: Clock3,
      href: adminListingsHref({ ...query, status: "pending", expiring: false, page: 1 }),
      active: query.status === "pending" && !query.expiring,
      highlight: true,
    },
    {
      key: "active",
      label: "Active listings",
      value: counts.active,
      icon: CheckCircle2,
      href: adminListingsHref({ ...query, status: "active", expiring: false, page: 1 }),
      active: query.status === "active" && !query.expiring,
      highlight: false,
    },
    {
      key: "rejected",
      label: "Rejected",
      value: counts.rejected,
      icon: XCircle,
      href: adminListingsHref({ ...query, status: "rejected", expiring: false, page: 1 }),
      active: query.status === "rejected" && !query.expiring,
      highlight: false,
    },
    {
      key: "expiring",
      label: "Expiring in 7 days",
      value: counts.expiring,
      icon: CalendarClock,
      href: adminListingsHref({
        ...query,
        status: "active",
        expiring: true,
        sort: "expiring",
        page: 1,
      }),
      active: query.expiring,
      highlight: false,
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
                <p className="text-xs text-muted-foreground">
                  {card.highlight ? "Main review queue" : "View matching listings"}
                </p>
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
