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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductListingCard } from "@/components/product/product-listing-card";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Globe2,
  Mail,
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
    where: { status: "active", category: listing.category, id: { not: listing.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const priceValue = isWanted
    ? listing.budgetRange || "Budget on request"
    : listing.price || "Price on request";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-foreground">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <div className="relative aspect-[4/3] w-full">
              {images.length ? (
                <Image
                  src={images[0]}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
              <Badge
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
                  isWanted ? "bg-blue-600" : "bg-emerald-600"
                }`}
              >
                {typeLabel(listing.type)}
              </Badge>
            </div>
          </div>

          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl border bg-muted"
                >
                  <Image
                    src={img}
                    alt={`${listing.title} ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}

          {/* Description */}
          <Card className="mt-6 rounded-2xl">
            <CardContent className="space-y-6 p-6">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Product description</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>
              </section>

              <Separator />

              <section className="space-y-3">
                <h2 className="text-lg font-semibold">
                  {isWanted ? "Buyer requirements" : "Specifications"}
                </h2>
                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <Spec label="Category" value={categoryLabel(listing.category)} />
                  <Spec label="Quantity" value={listing.quantity} />
                  <Spec label="Location" value={listing.location} />
                  <Spec label="Posted" value={formatListingDate(listing.createdAt)} />
                  {isWanted ? (
                    <>
                      <Spec label="Quality standard" value={listing.qualityStandard} />
                      <Spec label="Delivery timeline" value={listing.deliveryTimeline} />
                      <Spec label="Preferred region" value={listing.preferredRegion} />
                      <Spec label="Budget range" value={listing.budgetRange} />
                    </>
                  ) : (
                    <>
                      <Spec label="Price" value={listing.price} />
                      <Spec label="Currency" value={listing.currency} />
                      <Spec label="Minimum order" value={listing.moq} />
                      <Spec label="Incoterms" value={listing.incoterms} />
                      <Spec label="Country of origin" value={listing.originCountry} />
                      <Spec label="Delivery options" value={listing.deliveryOptions} />
                      <Spec label="Certifications" value={listing.certifications} />
                    </>
                  )}
                </dl>

                {listing.technicalSpecs ? (
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Technical specs
                    </p>
                    <p className="whitespace-pre-line text-sm">{listing.technicalSpecs}</p>
                  </div>
                ) : null}

                {listing.technicalDocument ? (
                  <a
                    href={listing.technicalDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                  >
                    <FileText className="h-4 w-4" /> Open technical document
                  </a>
                ) : null}
              </section>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="mt-6 rounded-2xl">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
              <InfoTile
                icon={<Truck className="h-5 w-5" />}
                title="Delivery"
                text={listing.deliveryOptions || "Contact seller for delivery terms"}
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
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <div className="space-y-5 lg:sticky lg:top-6">
            <Card className="rounded-2xl">
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{categoryLabel(listing.category)}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {effectiveStatus(listing)}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold leading-tight tracking-tight">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </span>
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground">
                      ({listing.inquiries} inquiries)
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {isWanted ? "Budget" : "Price"}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{priceValue}</p>
                  {!isWanted && listing.moq ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Minimum order: {listing.moq}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Fact icon={<Package className="h-4 w-4" />} label="Quantity" value={listing.quantity} />
                  <Fact icon={<MapPin className="h-4 w-4" />} label="Location" value={listing.location} />
                  <Fact icon={<CalendarDays className="h-4 w-4" />} label="Posted" value={formatListingDate(listing.createdAt)} />
                  <Fact icon={<Eye className="h-4 w-4" />} label="Views" value={String(listing.views)} />
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={owner?.email ? `mailto:${owner.email}` : "#"}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Mail className="h-4 w-4" />
                    Contact {isWanted ? "buyer" : "supplier"}
                  </a>
                  <Button variant="outline" className="h-11 w-full">
                    <MessageSquare className="h-4 w-4" /> Send inquiry
                  </Button>
                </div>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified trader · Response within 24h
                </p>
              </CardContent>
            </Card>

            {/* Seller */}
            {owner ? (
              <Card className="rounded-2xl">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    {owner.image ? (
                      <Image
                        src={owner.image}
                        alt={owner.name ?? ""}
                        width={52}
                        height={52}
                        className="h-12 w-12 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {(owner.name ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{owner.name || "Unnamed"}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {owner.companyName || "Independent trader"}
                      </p>
                    </div>
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <SideRow icon={<Building2 className="h-4 w-4" />} label="Industry" value={owner.industry} />
                    <SideRow icon={<Globe2 className="h-4 w-4" />} label="Country" value={owner.country} />
                    <SideRow icon={<Star className="h-4 w-4" />} label="Role" value={owner.role} />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    render={<Link href={`/${owner.id}/dashboard`} />}
                    nativeButton={false}
                  >
                    View profile
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length ? (
        <section className="mt-14 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Related listings</h2>
              <p className="text-sm text-muted-foreground">
                More in {categoryLabel(listing.category)}
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" /> Browse all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b pb-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium">{value}</dd>
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
    <div className="rounded-lg border bg-card p-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

function SideRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        {icon} {label}
      </span>
      <span className="truncate font-medium capitalize">{value}</span>
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
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}