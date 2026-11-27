import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dashboard-access";
import { ProductCard } from "@/components/shared/ProductCard";

export default async function FavoritesPage() {
  const user = await requireUser();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              companyName: true,
              country: true,
              industry: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Favorites</h2>
          <p className="text-sm text-muted-foreground">
            Listings you&apos;ve saved for later.
          </p>
        </div>
        <span className="self-start rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {favorites.length} saved
        </span>
      </div>

      {favorites.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((favorite) => (
            <ProductCard key={favorite.id} listing={favorite.listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No favorites yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Save listings you&apos;re interested in by clicking the heart icon.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Browse listings
          </Link>
        </div>
      )}
    </div>
  );
}
