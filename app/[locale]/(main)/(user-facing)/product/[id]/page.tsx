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
import Image from "next/image";
import { Globe, Package, Calendar, MapPin } from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();

  const image = listing.images?.[0];
  const isWanted = listing.type === "wanted";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Breadcrumb-ish header */}
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
        </div>
      </div>

      {/* Hero image */}
      {image ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
          <Image src={image} alt={listing.title} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          No image available
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Description + specs */}
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
                  <Spec label="Technical document" value={listing.technicalDocument} />
                </>
              ) : (
                <>
                  <Spec label="Price" value={listing.price} />
                  <Spec label="Delivery options" value={listing.deliveryOptions} />
                  <Spec label="Technical specs" value={listing.technicalSpecs} />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar summary */}
        <div className="space-y-6">
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
              <button className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Contact {isWanted ? "buyer" : "supplier"}
              </button>
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

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="whitespace-pre-line font-medium">{value}</p>
    </div>
  );
}