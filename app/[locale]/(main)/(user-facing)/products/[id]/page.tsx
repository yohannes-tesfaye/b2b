import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  categoryLabel,
  daysLeftLabel,
  effectiveStatus,
  formatListingDate,
  typeLabel,
} from "@/lib/listings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductShareSave } from "@/components/product/product-share-save";
import { ProductDescription } from "@/components/product/product-description";
import { ProductSpecifications } from "@/components/product/product-specs";
import { ContactActions } from "@/components/product/product-contact";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Globe2,
  MapPin,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          companyName: true,
          country: true,
          industry: true,
          image: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
  if (!listing) notFound();

  // best-effort view counter
  void prisma.listing
    .update({ where: { id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const isWanted = listing.type === "wanted";
  const images = listing.images?.length ? listing.images : [];
  const owner = listing.user;

  const related = await prisma.listing.findMany({
    where: {
      status: "active",
      category: listing.category,
      id: { not: listing.id },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const specs = [
    { label: "Category", value: categoryLabel(listing.category) },
    { label: "Quantity", value: listing.quantity },
    { label: "Location", value: listing.location },
    { label: "Posted", value: formatListingDate(listing.createdAt) },
    ...(isWanted
      ? [
          { label: "Quality standard", value: listing.qualityStandard },
          { label: "Delivery timeline", value: listing.deliveryTimeline },
          { label: "Preferred region", value: listing.preferredRegion },
        ]
      : [
          { label: "Minimum order", value: listing.moq },
          { label: "Incoterms", value: listing.incoterms },
          { label: "Country of origin", value: listing.originCountry },
          { label: "Delivery options", value: listing.deliveryOptions },
          { label: "Certifications", value: listing.certifications },
        ]),
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl pb-6 lg:px-4 lg:py-8 lg:pb-8">
      {/* Desktop breadcrumbs */}
      <nav className="mb-6 hidden flex-wrap items-center gap-1.5 text-sm text-muted-foreground lg:flex">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-foreground">
          {listing.title}
        </span>
      </nav>

      {/* Mobile back + actions */}
      <div className="flex items-center justify-between px-3 py-2 lg:hidden">
        <Link
          href="/products"
          className="-ml-1 inline-flex h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground active:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <ProductShareSave listingId={listing.id} title={listing.title} />
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        <div className="lg:order-1 lg:col-span-3">
          <ProductGallery
            images={images}
            title={listing.title}
            typeLabel={typeLabel(listing.type)}
            isWanted={isWanted}
          />
        </div>

        <div className="relative z-10 -mt-5 rounded-t-3xl bg-background px-4 pt-5 lg:order-2 lg:col-span-2 lg:row-span-2 lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:pt-0">
          <div className="space-y-5 lg:sticky lg:top-8">
              <section className="space-y-4 lg:rounded-2xl lg:border lg:bg-card lg:p-6">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="rounded-full">
                    {categoryLabel(listing.category)}
                  </Badge>
                  <Badge variant="outline" className="rounded-full capitalize">
                    {effectiveStatus(listing)}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                </div>

                <h1 className="text-[22px] font-bold leading-tight tracking-tight lg:text-2xl">
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {listing.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {listing.views} views
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />{" "}
                    {listing.inquiries} inquiries
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Fact
                    icon={<Package className="h-3.5 w-3.5" />}
                    label="Quantity"
                    value={listing.quantity}
                  />
                  <Fact
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    label="Location"
                    value={listing.location}
                  />
                  <Fact
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                    label="Posted"
                    value={formatListingDate(listing.createdAt)}
                  />
                  <Fact
                    icon={<Clock className="h-3.5 w-3.5" />}
                    label="Ends"
                    value={daysLeftLabel(listing.expiresAt)}
                  />
                </div>

                <div className="hidden lg:block">
                  <ContactActions
                    email={owner?.email}
                    title={listing.title}
                    isWanted={isWanted}
                    variant="dialog"
                  />
                </div>

                <p className="hidden items-center justify-center gap-1.5 text-xs text-muted-foreground lg:flex">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified trader · Response within 24h
                </p>
              </section>

              {owner ? (
                <section className="rounded-2xl border bg-card p-4 lg:p-6">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${owner.id}/dashboard`}
                      className="shrink-0 rounded-full ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`View ${owner.name ?? "trader"}'s profile`}
                    >
                      {owner.image ? (
                        <Image
                          src={owner.image}
                          alt={owner.name ?? ""}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                          {(owner.name ?? "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/${owner.id}/dashboard`}
                        className="flex min-h-10 items-center gap-1 py-1 hover:underline"
                      >
                        <p className="truncate font-semibold">
                          {owner.name || "Unnamed"}
                        </p>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {owner.companyName || "Independent trader"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Member since{" "}
                        {new Date(owner.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                    {owner.industry ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {owner.industry}
                      </span>
                    ) : null}
                    {owner.country ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {owner.country}
                      </span>
                    ) : null}
                  </div>

                  {/* Mobile: contact actions live here (replaces the floating bar) */}
                  <div className="mt-4 lg:hidden">
                    <ContactActions
                      email={owner?.email}
                      title={listing.title}
                      isWanted={isWanted}
                    />
                  </div>

                  {/* Desktop: keep a compact profile link */}
                  <Button
                    variant="ghost"
                    className="mt-3 hidden h-9 w-full rounded-xl text-xs font-medium text-muted-foreground lg:flex"
                    render={<Link href={`/${owner.id}/dashboard`} />}
                    nativeButton={false}
                  >
                    View full profile
                    <Star className="h-3.5 w-3.5" />
                  </Button>
                </section>
              ) : null}
          </div>
        </div>

        {/* Description, specs and delivery — after the summary on mobile */}
        <div className="mt-6 space-y-6 px-4 lg:order-3 lg:col-span-3 lg:mt-0 lg:px-0">
            <section className="border-t pt-5 lg:rounded-2xl lg:border lg:bg-card lg:p-6 lg:pt-6">
              <h2 className="mb-3 text-[15px] font-semibold lg:text-lg">
                Description
              </h2>
              <ProductDescription text={listing.description} />
            </section>

            <section className="border-t pt-5 lg:rounded-2xl lg:border lg:bg-card lg:p-6 lg:pt-6">
              <h2 className="mb-3 text-[15px] font-semibold lg:text-lg">
                {isWanted ? "Buyer requirements" : "Specifications"}
              </h2>
              <ProductSpecifications
                specs={specs}
                technicalSpecs={listing.technicalSpecs}
                documentUrl={listing.technicalDocument}
                isWanted={isWanted}
              />
            </section>

            <section className="border-t pt-5 lg:rounded-2xl lg:border lg:bg-card lg:p-5">
              <div className="grid gap-2.5 sm:grid-cols-3 lg:gap-3">
                <InfoTile
                  icon={<Truck className="h-5 w-5" />}
                  title="Delivery"
                  text={
                    listing.deliveryOptions ||
                    "Contact seller for delivery terms"
                  }
                />
                <InfoTile
                  icon={<Clock className="h-5 w-5" />}
                  title="Listing ends"
                  text={daysLeftLabel(listing.expiresAt)}
                />
                <InfoTile
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Trade assurance"
                  text="Verified trader · Secure communication"
                />
              </div>
            </section>
          </div>
        </div>

      {/* Related listings */}
      {related.length ? (
        <section className="mt-10 px-4 lg:mt-14 lg:px-0">
          <div className="mb-4 flex items-end justify-between lg:mb-5">
            <div>
              <h2 className="text-lg font-bold tracking-tight lg:text-xl">
                Related listings
              </h2>
              <p className="text-xs text-muted-foreground lg:text-sm">
                More in {categoryLabel(listing.category)}
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-1 px-2 text-sm font-medium text-primary active:opacity-70"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {related.map((item) => (
              <div
                key={item.id}
                className="w-[78%] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none"
              >
                <ProductCard listing={item} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-medium">{value}</p>
    </div>
  );
}

function InfoTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 lg:border-0 lg:bg-transparent lg:p-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold lg:text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
