import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categoryLabel, daysLeftLabel, effectiveStatus, formatListingDate, typeLabel } from "@/lib/listings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default async function MarketplaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();

  const image = listing.images?.[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={listing.type === "wanted" ? "secondary" : "outline"}>
            {typeLabel(listing.type)}
          </Badge>
          <Badge variant="outline">{categoryLabel(listing.category)}</Badge>
          <Badge variant="outline">{effectiveStatus(listing)}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
        <p className="text-muted-foreground">{listing.location}</p>
      </div>

      {image ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Image src={image} alt={listing.title} fill className="object-cover" unoptimized />
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold">Description</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="whitespace-pre-line">{listing.description}</p>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="font-medium">{listing.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="font-medium">{formatListingDate(listing.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Days left</p>
                <p className="font-medium">{daysLeftLabel(listing.expiresAt)}</p>
              </div>
              {listing.type === "available" ? (
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-medium">{listing.price || "—"}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-medium">{listing.budgetRange || "—"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Details</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {listing.type === "wanted" ? (
              <>
                <Detail label="Quality standard" value={listing.qualityStandard} />
                <Detail label="Delivery timeline" value={listing.deliveryTimeline} />
                <Detail label="Preferred region" value={listing.preferredRegion} />
                <Detail label="Technical document" value={listing.technicalDocument} />
              </>
            ) : (
              <>
                <Detail label="Delivery options" value={listing.deliveryOptions} />
                <Detail label="Technical specs" value={listing.technicalSpecs} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="whitespace-pre-line font-medium">{value}</p>
    </div>
  );
}