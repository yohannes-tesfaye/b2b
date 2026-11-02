import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";
import { requireAdmin } from "@/lib/dashboard-access";
import { getAdminListingDetail } from "@/lib/admin-listings";
import {
  categoryLabel,
  daysLeftLabel,
  formatListingDate,
  LISTING_STATUS_META,
  typeLabel,
} from "@/lib/listings";
import { initialsFrom } from "@/lib/profile";
import type { ListingStatus } from "@/types/listing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListingStatusBadge } from "@/components/dashboard/listing-status-badge";
import { RoleBadges } from "@/components/dashboard/role-badges";
import { AdminListingActions } from "@/components/dashboard/admin-listing-actions";
import { AdminListingNotes } from "@/components/dashboard/admin-listing-notes";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm break-words">{value}</span>
    </div>
  );
}

function statusLabel(value: string) {
  return LISTING_STATUS_META[value as ListingStatus]?.label ?? value;
}

function timestamp(value: Date | string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const listing = await getAdminListingDetail(id);
  if (!listing) notFound();

  const wanted = listing.type === "wanted";
  const owner = listing.user;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          render={<Link href="/dashboard/listing" />}
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="mb-2 -ml-2"
        >
          <ArrowLeft />
          Back to listings
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <ListingStatusBadge
                status={listing.status}
                expiresAt={listing.expiresAt}
              />
              <Badge variant={wanted ? "secondary" : "outline"}>
                {typeLabel(listing.type)}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold break-words">{listing.title}</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-xs">{listing.id}</span>
              {" · "}
              {categoryLabel(listing.category)}
              {" · "}
              {listing.location}
            </p>
          </div>
          <AdminListingActions
            listing={{
              id: listing.id,
              title: listing.title,
              status: listing.status,
              expiresAt: listing.expiresAt,
            }}
          />
        </div>
      </div>

      {listing.status === "rejected" && listing.rejectionReason ? (
        <Card className="ring-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Rejection reason
            </CardTitle>
            <CardDescription>
              This is shown to the listing owner on their dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {listing.rejectionReason}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Listing details</CardTitle>
              <CardDescription>
                Everything the user submitted for this listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {listing.description}
              </p>

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Category"
                  value={categoryLabel(listing.category)}
                />
                <DetailRow label="Quantity" value={listing.quantity} />
                <DetailRow label="Location" value={listing.location} />
                <DetailRow
                  label="Post duration"
                  value={`${listing.durationDays} days`}
                />
                <DetailRow
                  label={wanted ? "Budget range" : "Price"}
                  value={(wanted ? listing.budgetRange : listing.price) || "—"}
                />
                <DetailRow
                  label="Expiry date"
                  value={formatListingDate(listing.expiresAt)}
                />
                {wanted ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <DetailRow
                      label="Delivery options"
                      value={listing.deliveryOptions || "—"}
                    />
                  </>
                )}
              </div>

              {!wanted && listing.technicalSpecs ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Technical specifications
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {listing.technicalSpecs}
                  </p>
                </div>
              ) : null}

              {wanted && listing.technicalDocument ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Technical document
                  </p>
                  <a
                    href={listing.technicalDocument}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Open document
                  </a>
                </div>
              ) : null}

              {!wanted && listing.images.length ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Images ({listing.images.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {listing.images.map((image) => (
                      <a
                        key={image}
                        href={image}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group block overflow-hidden rounded-lg border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={listing.title}
                          className="h-28 w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Owner</CardTitle>
              <CardDescription>
                The account that submitted this listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {owner ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        {owner.image ? (
                          <AvatarImage src={owner.image} alt={owner.name || owner.email} />
                        ) : null}
                        <AvatarFallback>
                          {initialsFrom(owner.name || owner.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium">
                            {owner.name || "Unnamed"}
                          </p>
                          {owner.emailVerified ? (
                            <BadgeCheck
                              className="size-4 shrink-0 text-primary"
                              aria-label="Verified account"
                            />
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {owner.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      render={<Link href={`/dashboard/user/${owner.id}`} />}
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                    >
                      <UserRound />
                      View user
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailRow
                      label="Email"
                      value={
                        <a
                          href={`mailto:${owner.email}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Mail className="size-3.5" />
                          {owner.email}
                        </a>
                      }
                    />
                    <DetailRow
                      label="Phone"
                      value={
                        owner.phone ? (
                          <a
                            href={`tel:${owner.phone}`}
                            className="inline-flex items-center gap-1.5 text-primary hover:underline"
                          >
                            <Phone className="size-3.5" />
                            {owner.phone}
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailRow
                      label="Company"
                      value={
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          {owner.companyName || "—"}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Account status"
                      value={
                        owner.banned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )
                      }
                    />
                    <DetailRow
                      label="Verified"
                      value={
                        owner.emailVerified ? (
                          <Badge>Verified</Badge>
                        ) : (
                          <Badge variant="outline">Not verified</Badge>
                        )
                      }
                    />
                    <DetailRow
                      label="Member since"
                      value={formatListingDate(owner.createdAt)}
                    />
                    <DetailRow
                      label="Total listings"
                      value={owner._count.listings}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Role(s)</p>
                    <RoleBadges role={owner.role} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Owner account no longer exists.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation history</CardTitle>
              <CardDescription>
                Review decisions and past status changes for this listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Reviewed by"
                  value={
                    listing.reviewedBy
                      ? listing.reviewedBy.name || listing.reviewedBy.email
                      : "Not reviewed yet"
                  }
                />
                <DetailRow
                  label="Reviewed at"
                  value={timestamp(listing.reviewedAt)}
                />
                <DetailRow
                  label="Decision"
                  value={
                    <ListingStatusBadge
                      status={listing.status}
                      expiresAt={listing.expiresAt}
                    />
                  }
                />
                <DetailRow
                  label="Rejection reason"
                  value={listing.rejectionReason || "—"}
                />
              </div>

              {listing.statusHistory.length ? (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Status changes
                    </p>
                    <ol className="space-y-3">
                      {listing.statusHistory.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex flex-col gap-1 border-l-2 border-border pl-3"
                        >
                          <div className="flex flex-wrap items-center gap-1.5 text-sm">
                            <span className="text-muted-foreground">
                              {entry.fromStatus
                                ? statusLabel(entry.fromStatus)
                                : "New"}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">
                              {statusLabel(entry.toStatus)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {entry.changedBy
                              ? entry.changedBy.name || entry.changedBy.email
                              : "System"}{" "}
                            · {timestamp(entry.createdAt)}
                          </p>
                          {entry.reason ? (
                            <p className="text-xs">{entry.reason}</p>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye className="size-3.5" aria-hidden="true" />
                    Views
                  </div>
                  <p className="mt-1 text-xl font-semibold">{listing.views}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="size-3.5" aria-hidden="true" />
                    Inquiries
                  </div>
                  <p className="mt-1 text-xl font-semibold">
                    {listing.inquiries}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <DetailRow
                  label="Posted"
                  value={formatListingDate(listing.createdAt)}
                />
                <DetailRow
                  label="Last edited"
                  value={timestamp(listing.updatedAt)}
                />
                <DetailRow
                  label="Expires"
                  value={formatListingDate(listing.expiresAt)}
                />
                <DetailRow
                  label="Days left"
                  value={daysLeftLabel(listing.expiresAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation notes</CardTitle>
              <CardDescription>Visible to admins only.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminListingNotes
                listingId={listing.id}
                initialNotes={listing.moderationNotes ?? ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
