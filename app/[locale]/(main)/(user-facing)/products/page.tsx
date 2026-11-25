import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCategories, getIndustries, getPopularTags } from "@/lib/taxonomy";
import { normalizeSearchQuery } from "@/lib/search";
import { countryName, normalizeCountryCode } from "@/lib/countries";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductPagination } from "@/components/product/product-pagination";
import { Link } from "@/i18n/navigation";
import { Search } from "lucide-react";

const PAGE_SIZE = 6;

type SearchParams = Promise<{
  type?: string;
  category?: string;
  q?: string;
  sort?: string;
  country?: string;
  industry?: string;
  tag?: string;
  page?: string;
}>;

const SORTS = ["newest", "oldest", "expiring", "views"] as const;
type Sort = (typeof SORTS)[number];

export default async function ProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const [categories, industries, tags] = await Promise.all([
    getCategories(),
    getIndustries(),
    getPopularTags(),
  ]);

  const type = sp.type === "wanted" || sp.type === "available" ? sp.type : undefined;

  const allowedCategories = new Set(categories.map((category) => category.value));
  const selectedCategories = sp.category
    ? Array.from(new Set(sp.category.split(",").filter((c) => allowedCategories.has(c))))
    : [];

  const q = normalizeSearchQuery(sp.q);
  const sort: Sort = SORTS.includes(sp.sort as Sort) ? (sp.sort as Sort) : "newest";

  const allowedIndustries = new Set(industries.map((industry) => industry.value));
  const industry = sp.industry && allowedIndustries.has(sp.industry) ? sp.industry : undefined;

  const allowedTags = new Set(tags.map((tag) => tag.slug));
  const tag = sp.tag && allowedTags.has(sp.tag) ? sp.tag : undefined;

  const country = normalizeCountryCode(sp.country) ?? undefined;

  const requestedPage = Number.parseInt(sp.page ?? "1", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const and: Prisma.ListingWhereInput[] = [
    { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  ];

  if (type) and.push({ type });
  if (selectedCategories.length) and.push({ category: { in: selectedCategories } });
  if (country) and.push({ countryCode: country });
  if (industry) and.push({ user: { industry } });
  if (tag) and.push({ tags: { some: { tag: { slug: tag } } } });
  if (q) {
    // searchText already contains title, description, category and tag names,
    // company name and location (see lib/search.ts). ILIKE is served by the GIN
    // trigram index when pg_trgm is installed, and still correct without it.
    and.push({
      OR: [
        { searchText: { contains: q, mode: "insensitive" } },
        // Keep free-text columns searchable for rows written before the
        // searchText backfill ran (or if the backfill ever fails).
        { title: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.ListingWhereInput = { status: "active", AND: and };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "expiring"
      ? { expiresAt: "asc" as const }
      : sort === "views"
      ? { views: "desc" as const }
      : { createdAt: "desc" as const };

  const total = await prisma.listing.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const [listings, countryRows] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.listing.groupBy({
      by: ["countryCode"],
      where: { status: "active", countryCode: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const countries = countryRows
    .filter((row): row is typeof row & { countryCode: string } => Boolean(row.countryCode))
    .map((row) => ({
      value: row.countryCode,
      label: countryName(row.countryCode),
      count: row._count._all,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const from = total ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div className=" mx-auto w-full min-w-0 max-w-7xl space-y-4 px-4 py-5 lg:space-y-6 lg:py-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Products
          </h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {total}
          </span>
        </div>
        <p className="text-sm text-muted-foreground lg:text-base">
          Browse wanted and available listings from verified traders worldwide.
        </p>
      </div>

      <ProductFilters
        categories={categories}
        industries={industries}
        tags={tags}
        countries={countries}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground lg:text-sm">
        <span>
          {total === 0
            ? "No listings found"
            : `Showing ${from}–${to} of ${total} listing${total === 1 ? "" : "s"}`}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live listings
        </span>
      </div>

      {listings.length ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>

          <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            query={{
              type,
              category: selectedCategories.join(",") || undefined,
              q: q || undefined,
              sort: sort !== "newest" ? sort : undefined,
              country,
              industry,
              tag,
            }}
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No listings match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different category or clear the filters to see everything.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
