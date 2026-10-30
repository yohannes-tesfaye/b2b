import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import {
  categoryLabel,
  daysLeftLabel,
  effectiveStatus,
  formatListingDate,
  typeLabel,
} from "@/lib/listings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListingStatusBadge } from "@/components/dashboard/listing-status-badge";
import { ListingActions } from "@/components/dashboard/listing-actions";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>;
}) {
  const { id, userId } = await params;
  const user = await requireOwnDashboard(userId);
  const base = userDashboardPath(user.id);

  const listing = await prisma.listing.findFirst({
    where: { id, userId: user.id },
  });

  if (!listing) notFound();

  const effective = effectiveStatus(listing);
  const wanted = listing.type === "wanted";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          render={<Link href={`${base}/listings`} />}
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="mb-2 -ml-2"
        >
          <ArrowLeft />
          Back to listings
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <ListingStatusBadge
                status={listing.status}
                expiresAt={listing.expiresAt}
              />
              <Badge variant={wanted ? "secondary" : "outline"}>
                {typeLabel(listing.type)}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold">{listing.title}</h2>
            <p className="text-sm text-muted-foreground">
              {categoryLabel(listing.category)} · {listing.location}
            </p>
          </div>
          <ListingActions
            id={listing.id}
            title={listing.title}
            status={listing.status}
            expiresAt={listing.expiresAt}
            durationDays={listing.durationDays}
            basePath={`${base}/listings`}
          />
        </div>
      </div>

      {effective === "rejected" && listing.rejectionReason ? (
        <Card className="ring-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Rejection reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{listing.rejectionReason}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {listing.description}
              </p>

              <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
                <DetailRow label="Quantity" value={listing.quantity} />
                <DetailRow label="Location" value={listing.location} />
                <DetailRow
                  label="Listing duration"
                  value={`${listing.durationDays} days`}
                />
                <DetailRow
                  label="Posted"
                  value={formatListingDate(listing.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {wanted ? "Buyer requirements" : "Seller details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wanted ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailRow
                    label="Quality standard"
                    value={listing.qualityStandard || "—"}
                  />
                  <DetailRow
                    label="Delivery timeline"
                    value={listing.deliveryTimeline || "—"}
                  />
                  <DetailRow
                    label="Preferred region"
                    value={listing.preferredRegion || "—"}
                  />
                  <DetailRow
                    label="Budget range"
                    value={listing.budgetRange || "—"}
                  />
                  <DetailRow
                    label="Technical document"
                    value={
                      listing.technicalDocument ? (
                        <a
                          href={listing.technicalDocument}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Open document
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailRow label="Price" value={listing.price || "—"} />
                    <DetailRow
                      label="Delivery options"
                      value={listing.deliveryOptions || "—"}
                    />
                  </div>
                  <DetailRow
                    label="Technical specifications"
                    value={
                      <span className="whitespace-pre-wrap">
                        {listing.technicalSpecs || "—"}
                      </span>
                    }
                  />
                  {listing.images.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {listing.images.map((image) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={image}
                          src={image}
                          alt={listing.title}
                          className="h-28 w-full rounded-lg border object-cover"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <DetailRow
                label="Posted"
                value={formatListingDate(listing.createdAt)}
              />
              <DetailRow
                label="Expires"
                value={formatListingDate(listing.expiresAt)}
              />
              <DetailRow
                label="Days left"
                value={daysLeftLabel(listing.expiresAt)}
              />
              <DetailRow
                label="Approval status"
                value={
                  <ListingStatusBadge
                    status={listing.status}
                    expiresAt={listing.expiresAt}
                  />
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="size-3.5" aria-hidden="true" />
                  Views
                </div>
                <div className="mt-1 text-xl font-semibold">{listing.views}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  Inquiries
                </div>
                <div className="mt-1 text-xl font-semibold">
                  {listing.inquiries}
                </div>
              </div>
              {/* TODO: increment these counters from the public listing page
                  once Marketplace listings are backed by the database. */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
