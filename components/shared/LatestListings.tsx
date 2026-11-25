import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { categoryLabel, daysLeftLabel } from "@/lib/listings";
import { countryCodeFromName } from "@/lib/countries";
import { ProductCard } from "./ProductCard";

/** Latest marketplace listings, converted into the shared ProductCard prop shape. */
export default async function LatestListings() {
  const t = await getTranslations("home.latest");
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (!listings.length) return null;

  return (
    <section className="container-wide py-(--section-space)">
      <header className="mb-(--spacing-12) text-center">
        <p className="type-caption text-brand">{t("eyebrow")}</p>
        <h2 className="type-section mt-2">{t("title")}</h2>
        <p className="type-body mt-3 text-muted-foreground">
          {t("description")}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-(--spacing-4) [&>*]:min-w-0 max-sm:[&>a]:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => {
          const country =
            listing.originCountry?.trim() ||
            listing.location.split(",").pop()?.trim() ||
            listing.location;
          const timeLeft = daysLeftLabel(listing.expiresAt);

          return (
            <ProductCard
              key={listing.id}
              id={listing.id}
              type={listing.type === "wanted" ? "wanted" : "supplier"}
              title={listing.title}
              country={country}
              countryCode={countryCodeFromName(country)}
              imageUrl={listing.images?.[0]}
              category={categoryLabel(listing.category)}
              quantity={listing.quantity}
              timeLeft={timeLeft === "—" ? undefined : timeLeft}
            />
          );
        })}
      </div>
    </section>
  );
}
