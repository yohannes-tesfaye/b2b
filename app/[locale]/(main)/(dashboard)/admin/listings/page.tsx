import { requireAdmin } from "@/lib/dashboard-access";
import {
  ADMIN_LISTING_PAGE_SIZES,
  getAdminListingCounts,
  getAdminListings,
  normaliseAdminListingFilters,
} from "@/lib/admin-listings";
import type { AdminListingQuery } from "@/lib/admin-listings-query";
import { AdminListingsFilters } from "@/components/dashboard/admin-listings-filters";
import { AdminListingsStats } from "@/components/dashboard/admin-listings-stats";
import { AdminListingsModerationTable } from "@/components/dashboard/admin-listings-moderation-table";

type SearchParams = Promise<{
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
  type?: string;
  category?: string;
  sort?: string;
  expiring?: string;
}>;

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = ADMIN_LISTING_PAGE_SIZES.includes(
    Number(sp.pageSize) as (typeof ADMIN_LISTING_PAGE_SIZES)[number]
  )
    ? Number(sp.pageSize)
    : 10;
  const filters = normaliseAdminListingFilters({
    q: sp.q,
    status: sp.status,
    type: sp.type,
    category: sp.category,
    sort: sp.sort,
    expiring: sp.expiring === "1",
  });

  const [counts, { listings, total }] = await Promise.all([
    getAdminListingCounts(),
    getAdminListings({ filters, page, pageSize }),
  ]);

  const query: AdminListingQuery = {
    q: filters.q,
    status: filters.status,
    type: filters.type,
    category: filters.category,
    sort: filters.sort,
    expiring: filters.expiring,
    page,
    pageSize,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Listings</h2>
        <p className="text-sm text-muted-foreground">
          Review, approve, and manage every listing posted by users.
        </p>
      </div>

      <AdminListingsStats counts={counts} query={query} />
      <AdminListingsFilters query={query} />
      <AdminListingsModerationTable
        key={[
          filters.q,
          filters.status,
          filters.type,
          filters.category,
          filters.sort,
          filters.expiring ? "expiring" : "",
          page,
          pageSize,
        ].join("|")}
        listings={listings}
        total={total}
        query={query}
      />
    </div>
  );
}
