import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarClock,
  Eye,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { requireAdmin } from "@/lib/dashboard-access";
import { getAdminListingDetail } from "@/lib/admin-listings";
import {
  categoryLabel,
  daysLeft,
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
import {
  AdminListingActionsProvider,
  AdminListingActionButtons,
} from "@/components/dashboard/admin-listing-actions";
import { AdminListingNotes } from "@/components/dashboard/admin-listing-notes";
import { DetailRow, Kpi } from "@/components/dashboard/detail-blocks";
import { CopyButton } from "@/components/dashboard/copy-button";

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
  const days = daysLeft(listing.expiresAt);

  const actionData = {
    id: listing.id,
    title: listing.title,
    status: listing.status,
    expiresAt: listing.expiresAt,
  };

  return (
    <AdminListingActionsProvider listing={actionData}>
      <div className="flex flex-col gap-4 pb-24 sm:gap-6 lg:pb-0">
        <div className="flex items-center justify-between gap-2">
          <Button
            render={<Link href="/admin/listings" />}
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="-ml-2"
          >
            <ArrowLeft />
            Back to listings
          </Button>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {listing.id}
          </span>
        </div>

        {listing.status === "rejected" && listing.rejectionReason ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <ShieldAlert className="size-4" aria-hidden="true" />
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

        {/* Hero */}
        <Card className="relative">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-background shadow-sm sm:size-20">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      {wanted ? (
                        <Search className="size-6" aria-hidden="true" />
                      ) : (
                        <Package className="size-6" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
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
                  <h1 className="text-xl font-bold break-words sm:text-2xl lg:text-3xl">
                    {listing.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-mono text-xs">{listing.id}</span>
                    {" · "}
                    {categoryLabel(listing.category)}
                    {" · "}
                    {listing.location}
                  </p>
                  {owner ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        {owner.image ? (
                          <AvatarImage
                            src={owner.image}
                            alt={owner.name || owner.email}
                          />
                        ) : null}
                        <AvatarFallback className="text-[10px]">
                          {initialsFrom(owner.name || owner.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-xs text-muted-foreground">
                        {owner.name || "Unnamed"}
                        {" · "}
                        {owner.email}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarClock className="size-3.5 shrink-0" />
                      Posted {formatListingDate(listing.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3.5 shrink-0" />
                      {listing.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="size-3.5 shrink-0" />
                      {listing.inquiries} inquiries
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <AdminListingActionButtons className="flex flex-wrap items-center gap-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi icon={Eye} label="Views" value={listing.views} />
          <Kpi icon={MessageSquare} label="Inquiries" value={listing.inquiries} />
          <Kpi
            icon={ShieldCheck}
            label="Conversations"
            value={listing._count.conversations}
          />
          <Kpi
            icon={CalendarClock}
            label="Days left"
            value={days !== null ? Math.max(days, 0) : "—"}
          />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-2">
            {/* Overview */}
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
                  <DetailRow label="Type" value={typeLabel(listing.type)} />
                  <DetailRow label="Quantity" value={listing.quantity || "—"} />
                  <DetailRow label="Location" value={listing.location || "—"} />
                  <DetailRow
                    label="Post duration"
                    value={`${listing.durationDays} days`}
                  />
                  <DetailRow
                    label="Expiry date"
                    value={formatListingDate(listing.expiresAt)}
                  />
                  <DetailRow
                    label={wanted ? "Budget range" : "Price"}
                    value={
                      (wanted ? listing.budgetRange : listing.price) || "—"
                    }
                  />
                  {!wanted && listing.currency ? (
                    <DetailRow label="Currency" value={listing.currency} />
                  ) : null}
                </div>

                {/* Commercial & specs */}
                {!wanted ? (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailRow label="MOQ" value={listing.moq || "—"} />
                      <DetailRow
                        label="Certifications"
                        value={listing.certifications || "—"}
                      />
                      <DetailRow
                        label="Incoterms"
                        value={listing.incoterms || "—"}
                      />
                      <DetailRow
                        label="Origin country"
                        value={listing.originCountry || "—"}
                      />
                      <DetailRow
                        label="Delivery options"
                        value={listing.deliveryOptions || "—"}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Separator />
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
                    </div>
                  </>
                )}

                {!wanted && listing.technicalSpecs ? (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Technical specifications
                      </p>
                      <p className="text-sm whitespace-pre-wrap">
                        {listing.technicalSpecs}
                      </p>
                    </div>
                  </>
                ) : null}

                {wanted && listing.technicalDocument ? (
                  <>
                    <Separator />
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
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Images */}
            {!wanted && listing.images.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Images ({listing.images.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {listing.images.map((image) => (
                      <a
                        key={image}
                        href={image}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={image}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Owner */}
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
                            <AvatarImage
                              src={owner.image}
                              alt={owner.name || owner.email}
                            />
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
                        render={<Link href={`/admin/users/${owner.id}`} />}
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
                          <span className="flex items-center gap-1.5">
                            <a
                              href={`mailto:${owner.email}`}
                              className="inline-flex items-center gap-1.5 text-primary hover:underline"
                            >
                              <Mail className="size-3.5" />
                              {owner.email}
                            </a>
                            <CopyButton value={owner.email} label="Email" />
                          </span>
                        }
                      />
                      <DetailRow
                        label="Phone"
                        value={
                          owner.phone ? (
                            <span className="flex items-center gap-1.5">
                              <a
                                href={`tel:${owner.phone}`}
                                className="inline-flex items-center gap-1.5 text-primary hover:underline"
                              >
                                <Phone className="size-3.5" />
                                {owner.phone}
                              </a>
                              <CopyButton value={owner.phone} label="Phone" />
                            </span>
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

            {/* Moderation history */}
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

          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Activity */}
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
                    <p className="mt-1 text-xl font-semibold">
                      {listing.views}
                    </p>
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
                  <DetailRow
                    label="Conversations"
                    value={listing._count.conversations}
                  />
                  <DetailRow label="Listing ID" value={<span className="font-mono text-xs break-all">{listing.id}</span>} />
                </div>
              </CardContent>
            </Card>

            {/* Moderation notes */}
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

        {/* Sticky mobile action bar */}
        <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
          <div className="mx-auto max-w-lg">
            <AdminListingActionButtons className="grid grid-cols-4 gap-1.5 [&_button]:px-1 [&_button]:text-xs" />
          </div>
        </div>
      </div>
    </AdminListingActionsProvider>
  );
}
