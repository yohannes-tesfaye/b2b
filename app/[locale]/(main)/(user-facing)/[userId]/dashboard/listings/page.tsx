import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/listings";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { Button } from "@/components/ui/button";
import { RoleBadges } from "@/components/dashboard/role-badges";
import { ListingsTable } from "@/components/dashboard/listings-table";
import type { ListingRow } from "@/types/listing";

type SearchParams = Promise<{
  status?: string;
  type?: string;
}>;

const ALLOWED_STATUSES = ["pending", "active", "rejected", "expired", "closed"];
const ALLOWED_TYPES = ["wanted", "available"];

export default async function ListingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const { userId } = await params;
  const user = await requireOwnDashboard(userId);
  const base = userDashboardPath(user.id);

  const status = ALLOWED_STATUSES.includes(sp.status ?? "")
    ? (sp.status as string)
    : "all";
  const type = ALLOWED_TYPES.includes(sp.type ?? "") ? (sp.type as string) : "all";

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const filtered = listings.filter((listing) => {
    if (type !== "all" && listing.type !== type) return false;
    if (status !== "all" && effectiveStatus(listing) !== status) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">My Listings</h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, and track your wanted and available listings.
          </p>
          <RoleBadges role={user.role} />
        </div>
        <Button render={<Link href={`${base}/listings/new`} />} nativeButton={false}>
          <Plus />
          Post new listing
        </Button>
      </div>

      <ListingsTable
        basePath={`${base}/listings`}
        listings={filtered as ListingRow[]}
        status={status}
        type={type}
      />
    </div>
  );
}
