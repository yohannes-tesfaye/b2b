import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dashboard-access";
import { AdminListingsTable } from "@/components/dashboard/admin-listings-table";
import type { AdminListing } from "@/components/dashboard/admin-listings-table";

type SearchParams = Promise<{
  status?: string;
  type?: string;
}>;

const ALLOWED_STATUSES = ["pending", "active", "rejected", "expired", "closed"];
const ALLOWED_TYPES = ["wanted", "available"];

export default async function CreatedListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const status = ALLOWED_STATUSES.includes(sp.status ?? "")
    ? (sp.status as string)
    : "all";
  const type = ALLOWED_TYPES.includes(sp.type ?? "") ? (sp.type as string) : "all";

  const listings = await prisma.listing.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows: AdminListing[] = listings.map((listing) => ({
    ...listing,
    userName: listing.user?.name,
    userEmail: listing.user?.email,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Created Listings</h2>
        <p className="text-sm text-muted-foreground">
          Review, approve, and manage every listing created on the platform.
        </p>
      </div>
      <AdminListingsTable listings={rows} status={status} type={type} />
    </div>
  );
}
