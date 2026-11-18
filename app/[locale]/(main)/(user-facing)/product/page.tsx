import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/listings";
import { ProductListingCard } from "@/components/product/product-listing-card";
import { ProductFilters } from "@/components/product/product-filters";

type SearchParams = Promise<{
  type?: string;
  category?: string;
  q?: string;
  sort?: string;
}>;

export default async function ProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const type = sp.type === "wanted" || sp.type === "available" ? sp.type : undefined;
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;
  const q = sp.q?.trim();
  const sort = sp.sort ?? "newest";

  const where: Record<string, unknown> = { status: "active" };
  if (type) where.type = type;
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "expiring"
      ? { expiresAt: "asc" as const }
      : { createdAt: "desc" as const };

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
  });

  const active = listings.filter((l) => effectiveStatus(l) === "active");

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Browse wanted and available listings from verified traders worldwide.
        </p>
      </div>

      <ProductFilters />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {active.length} listing{active.length === 1 ? "" : "s"} found
        </span>
      </div>

      {active.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {active.map((listing) => (
            <ProductListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">
          No listings match your filters.
        </div>
      )}
    </div>
  );
}