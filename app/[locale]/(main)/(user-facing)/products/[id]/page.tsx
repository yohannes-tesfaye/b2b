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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Globe,
  Package,
  Calendar,
  MapPin,
  Eye,
  MessageSquare,
  Star,
  ShieldCheck,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

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
        },
      },
    },
  });
  if (!listing) notFound();

  // best-effort view counter
  void prisma.listing
    .update({ where: { id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const images = listing.images?.length ? listing.images : [];
  const isWanted = listing.type === "wanted";
  const owner = listing.user;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={
              isWanted
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }
          >
            {typeLabel(listing.type)}
          </Badge>
          <Badge variant="outline">{categoryLabel(listing.category)}</Badge>
          <Badge variant="outline" className="capitalize">
            {effectiveStatus(listing)}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {listing.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-4 w-4" /> {listing.quantity}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatListingDate(listing.createdAt)}
          </span>
          <span className="font-medium text-foreground">
            {daysLeftLabel(listing.expiresAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4" /> {listing.views} views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> {listing.inquiries} inquiries
          </span>
        </div>
      </div>

      {/* Image gallery */}
      {images.length ? (
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
            <Image src={images[0]} alt={listing.title} fill className="object-cover" unoptimized />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={img} alt={`${listing.title} ${i + 2}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          No image available
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <h2 className="text-lg font-semibold">Description</h2>
          </CardHeader>
          <CardContent className="space-y-5 p-6 text-sm leading-relaxed">
            <p className="whitespace-pre-line">{listing.description}</p>

            <div className="grid grid-cols-2 gap-4 rounded-xl border bg-muted/20 p-4">
              <Spec label="Quantity" value={listing.quantity} />
              <Spec label="Location" value={listing.location} />
              {isWanted ? (
                <>
                  <Spec label="Quality standard" value={listing.qualityStandard} />
                  <Spec label="Delivery timeline" value={listing.deliveryTimeline} />
                  <Spec label="Preferred region" value={listing.preferredRegion} />
                  <Spec label="Budget range" value={listing.budgetRange} />
                  <Spec
                    label="Technical document"
                    value={listing.technicalDocument}
                    link
                  />
                </>
              ) : (
                <>
                  <Spec label="Price" value={listing.price} />
                  <Spec label="Currency" value={listing.currency} />
                  <Spec label="Min. order qty" value={listing.moq} />
                  <Spec label="Incoterms" value={listing.incoterms} />
                  <Spec label="Country of origin" value={listing.originCountry} />
                  <Spec label="Delivery options" value={listing.deliveryOptions} />
                  <Spec label="Certifications" value={listing.certifications} />
                  <Spec label="Technical specs" value={listing.technicalSpecs} />
                </>
              )}
            </div>

            {listing.technicalDocument ? (
              <a
                href={listing.technicalDocument}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <LinkIcon className="h-4 w-4" /> Open technical document
              </a>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Owner card */}
          {owner ? (
            <Card>
              <CardHeader className="border-b bg-muted/30">
                <h2 className="text-lg font-semibold">
                  {isWanted ? "Buyer" : "Supplier"}
                </h2>
              </CardHeader>
              <CardContent className="space-y-3 p-6 text-sm">
                <div className="flex items-center gap-3">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                      {(owner.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{owner.name || "Unnamed"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {owner.companyName || "—"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 border-t pt-3">
                  <Row label="Country" value={owner.country} />
                  <Row label="Industry" value={owner.industry} />
                  <Row label="Role" value={owner.role} />
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600">
                  <ShieldCheck className="h-4 w-4" /> Verified trader
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="border-b bg-muted/30">
              <h2 className="text-lg font-semibold">Summary</h2>
            </CardHeader>
            <CardContent className="space-y-3 p-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{typeLabel(listing.type)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{categoryLabel(listing.category)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{effectiveStatus(listing)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{listing.durationDays} days</span>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground">Price / Budget</p>
                <p className="text-xl font-bold text-foreground">
                  {isWanted ? listing.budgetRange || "—" : listing.price || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3 p-6">
              <a
                href={owner?.email ? `mailto:${owner.email}` : "#"}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Contact {isWanted ? "buyer" : "supplier"}
              </a>
              <button className="inline-flex h-11 w-full items-center justify-center rounded-lg border text-sm font-semibold transition-colors hover:bg-muted">
                Save listing
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value, link }: { label: string; value: string | null; link?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="whitespace-pre-line font-medium">{value}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}