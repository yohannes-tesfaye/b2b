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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className="rounded-xl outline-none active:scale-[0.99] transition-transform focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card
            className={
              card.active
                ? "h-full ring-2 ring-primary/50 transition-colors"
                : "h-full transition-colors hover:bg-muted/40"
            }
          >
            <CardContent className="flex items-start justify-between gap-2 p-3 sm:p-4">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {card.label}
                </p>
                <p
                  className={
                    card.highlight
                      ? "text-2xl font-semibold text-primary sm:text-3xl"
                      : "text-2xl font-semibold sm:text-3xl"
                  }
                >
                  {card.value}
                </p>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {card.highlight ? "Main review queue" : "View matching listings"}
                </p>
              </div>
              <div
                className={
                  card.highlight
                    ? "rounded-lg bg-primary/10 p-1.5 text-primary sm:p-2"
                    : "rounded-lg bg-muted p-1.5 text-muted-foreground sm:p-2"
                }
              >
                <card.icon className="size-3.5 sm:size-4" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
