import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Package,
  Plus,
} from "lucide-react";
import { RoleBadges } from "@/components/dashboard/role-badges";
import { ListingStatusBadge } from "@/components/dashboard/listing-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import {
  categoryLabel,
  daysLeftLabel,
  effectiveStatus,
  formatListingDate,
  isExpiringSoon,
  typeLabel,
} from "@/lib/listings";

export default async function UserDashboardPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await requireOwnDashboard(userId);
  const base = userDashboardPath(user.id);

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const active = listings.filter(
    (listing) => effectiveStatus(listing) === "active"
  ).length;
  const pending = listings.filter(
    (listing) => effectiveStatus(listing) === "pending"
  ).length;
  const expiringSoon = listings.filter(isExpiringSoon).length;
  const recent = listings.slice(0, 5);

  const stats = [
    {
      label: "Total listings",
      value: listings.length,
      icon: Package,
      hint: "All listings you have created",
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
      hint: "Live and visible to buyers",
    },
    {
      label: "Pending approval",
      value: pending,
      icon: Clock,
      hint: "Waiting for an admin review",
    },
    {
      label: "Expiring soon",
      value: expiringSoon,
      icon: CalendarClock,
      hint: "Active and ending in 7 days",
    },
  ];

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome back, {firstName}</h2>
          <p className="text-sm text-muted-foreground">
            Track your listings and keep your marketplace activity up to date.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Your role:</span>
            <RoleBadges role={user.role} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            render={<Link href={`${base}/listings`} />}
            variant="outline"
            nativeButton={false}
          >
            My listings
          </Button>
          <Button render={<Link href={`${base}/listings/new`} />} nativeButton={false}>
            <Plus />
            Post new listing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-1">
                <div className="space-y-1">
                  <CardDescription>{stat.label}</CardDescription>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Recent listings</CardTitle>
            <CardDescription>Your last 5 listings.</CardDescription>
          </div>
          <Button
            render={<Link href={`${base}/listings`} />}
            variant="outline"
            size="sm"
            nativeButton={false}
          >
            View all
            <ArrowRight />
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length ? (
            <div className="divide-y">
              {recent.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`${base}/listings/${listing.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{typeLabel(listing.type)}</span>
                      <span>·</span>
                      <span>{categoryLabel(listing.category)}</span>
                      <span>·</span>
                      <span>{formatListingDate(listing.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {daysLeftLabel(listing.expiresAt)}
                    </span>
                    <ListingStatusBadge
                      status={listing.status}
                      expiresAt={listing.expiresAt}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-10 text-center">
              <Package className="size-8 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">No listings yet</p>
                <p className="text-xs text-muted-foreground">
                  Create your first wanted or available listing to get started.
                </p>
              </div>
              <Button
                render={<Link href={`${base}/listings/new`} />}
                size="sm"
                nativeButton={false}
              >
                <Plus />
                Post new listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
