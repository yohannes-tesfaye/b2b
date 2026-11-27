import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Building2,
  CalendarClock,
  ExternalLink,
  Eye,
  Globe,
  Mail,
  MessageSquare,
  Package,
  Phone,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { requireAdmin } from "@/lib/dashboard-access";
import { getAdminUserDetail } from "@/lib/admin-users";
import { formatListingDate, roleLabel, typeLabel } from "@/lib/listings";
import { initialsFrom } from "@/lib/profile";
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
import { AdminUserActions } from "@/components/dashboard/admin-user-actions";
import { CopyButton } from "@/components/dashboard/copy-button";
import { DetailRow, Kpi } from "@/components/dashboard/detail-blocks";
import { toggleVerified } from "../actions";

function AccountStatusBadge({ user }: { user: { banned: boolean | null } }) {
  return user.banned ? (
    <Badge variant="destructive">Banned</Badge>
  ) : (
    <Badge variant="outline">Active</Badge>
  );
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await requireAdmin();
  const user = await getAdminUserDetail(id);
  if (!user) notFound();

  const isSelf = admin.id === user.id;
  const lastSession = user.sessions[0] ?? null;
  const effectiveCount = user._count.listings;
  const industryLabel = user.industry ? roleLabel(user.industry) : null;
  const sizeLabel = user.companySize ? roleLabel(user.companySize) : null;
  const name = user.name || "Unnamed";

  return (
    <div className="flex flex-col gap-4 pb-24 sm:gap-6 lg:pb-0">
      <div className="flex items-center justify-between gap-2">
        <Button
          render={<Link href="/admin/users" />}
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="-ml-2"
        >
          <ArrowLeft />
          Back to users
        </Button>
        <span className="hidden font-mono text-xs text-muted-foreground sm:block">
          {user.id}
        </span>
      </div>

      {isSelf ? (
        <p className="text-xs text-muted-foreground">
          This is your own account. Ban and delete actions are disabled here.
        </p>
      ) : null}

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <Avatar className="size-16 shrink-0 ring-2 ring-background shadow-sm sm:size-20">
                {user.image ? (
                  <AvatarImage src={user.image} alt={name} />
                ) : null}
                <AvatarFallback className="text-base sm:text-lg">
                  {initialsFrom(name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold break-words sm:text-2xl lg:text-3xl">
                    {name}
                  </h1>
                  {user.emailVerified ? (
                    <BadgeCheck
                      className="size-5 shrink-0 text-primary"
                      aria-label="Email verified"
                    />
                  ) : null}
                  {isSelf ? <Badge variant="outline">You</Badge> : null}
                </div>
                <p className="break-all text-sm text-muted-foreground">
                  {user.email}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <AccountStatusBadge user={user} />
                  {user.verified ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      Verified business
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Not verified
                    </Badge>
                  )}
                  <RoleBadges role={user.role} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {user.companyName ? (
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3.5 shrink-0" />
                      {user.companyName}
                    </span>
                  ) : null}
                  {user.country ? (
                    <span className="flex items-center gap-1">
                      <Globe className="size-3.5 shrink-0" />
                      {user.country}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <CalendarClock className="size-3.5 shrink-0" />
                    Joined {formatListingDate(user.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="size-3.5 shrink-0" />
                    {effectiveCount} listing{effectiveCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
              <form action={toggleVerified.bind(null, user.id)} className="hidden md:block">
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {user.verified ? "Unverify" : "Verify"}
                </Button>
              </form>
              <Button
                render={
                  <Link href={`/profile/${user.id}`} target="_blank" rel="noreferrer" />
                }
                variant="outline"
                size="sm"
                nativeButton={false}
                className="w-full sm:w-auto"
              >
                <ExternalLink className="h-4 w-4" />
                Public profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.banned ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <Ban className="size-4" aria-hidden="true" />
              Banned account
            </CardTitle>
            <CardDescription>
              This user cannot sign in until they are unbanned.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailRow label="Ban reason" value={user.banReason || "—"} />
            <DetailRow
              label="Ban expires"
              value={
                user.banExpires
                  ? new Date(user.banExpires).toLocaleString()
                  : "Never (permanent)"
              }
            />
          </CardContent>
        </Card>
      ) : null}

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Package} label="Listings" value={effectiveCount} />
        <Kpi icon={Eye} label="Views" value={user.totals.views} />
        <Kpi icon={MessageSquare} label="Inquiries" value={user.totals.inquiries} />
        <Kpi icon={ShieldCheck} label="Sessions" value={user._count.sessions} />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-2">
          {/* Company profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company profile</CardTitle>
              <CardDescription>
                Business information this user provided on their profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.companyName ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Building2 className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.companyName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {[industryLabel, sizeLabel].filter(Boolean).join(" · ") ||
                            "No industry or size set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.bio ? (
                    <>
                      <Separator />
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                          Bio
                        </p>
                        <p className="whitespace-pre-line text-sm">{user.bio}</p>
                      </div>
                    </>
                  ) : null}

                  <Separator />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailRow
                      label="Industry"
                      value={industryLabel || "—"}
                    />
                    <DetailRow label="Company size" value={sizeLabel || "—"} />
                    <DetailRow
                      label="Country"
                      value={
                        user.country ? (
                          <span className="flex items-center gap-1.5">
                            <Globe className="size-3.5 shrink-0 text-muted-foreground" />
                            {user.country}
                          </span>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailRow
                      label="Phone"
                      value={
                        user.phone ? (
                          <span className="flex items-center gap-1.5">
                            <a
                              href={`tel:${user.phone}`}
                              className="inline-flex items-center gap-1.5 text-primary hover:underline"
                            >
                              <Phone className="size-3.5" />
                              {user.phone}
                            </a>
                            <CopyButton value={user.phone} label="Phone" />
                          </span>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailRow
                      label="Email"
                      value={
                        <span className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${user.email}`}
                            className="inline-flex items-center gap-1.5 text-primary hover:underline"
                          >
                            <Mail className="size-3.5" />
                            {user.email}
                          </a>
                          <CopyButton value={user.email} label="Email" />
                        </span>
                      }
                    />
                    <DetailRow
                      label="Website"
                      value={
                        user.website ? (
                          <span className="flex items-center gap-1.5">
                            <a
                              href={user.website}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                            >
                              <Globe className="size-3.5" aria-hidden="true" />
                              {user.website.replace(/^https?:\/\//, "")}
                            </a>
                            <CopyButton value={user.website} label="Website" />
                          </span>
                        ) : (
                          "—"
                        )
                      }
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This user has not added any company information yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent listings */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">Recent listings</CardTitle>
                <CardDescription>
                  Their 5 most recent listings.
                </CardDescription>
              </div>
              <Button
                render={
                  <Link href={`/admin/listings?q=${encodeURIComponent(user.email)}`} />
                }
                variant="outline"
                size="sm"
                nativeButton={false}
              >
                <Package />
                View all
              </Button>
            </CardHeader>
            <CardContent>
              {user.listings.length ? (
                <div className="divide-y">
                  {user.listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <Link
                        href={`/admin/listings/${listing.id}`}
                        className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted"
                      >
                        {listing.images?.[0] ? (
                          <Image
                            src={listing.images[0]}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Package className="size-4" aria-hidden="true" />
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <Link
                          href={`/admin/listings/${listing.id}`}
                          className="block line-clamp-2 text-sm font-medium hover:underline"
                        >
                          {listing.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                          <span>{typeLabel(listing.type)}</span>
                          <span>·</span>
                          <span>{formatListingDate(listing.createdAt)}</span>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline">
                            {listing.views} views
                          </span>
                        </div>
                      </div>
                      <ListingStatusBadge
                        status={listing.status}
                        expiresAt={listing.expiresAt}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div className="rounded-full bg-muted p-2 text-muted-foreground">
                    <Package className="size-5" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium">No listings yet</p>
                  <p className="text-xs text-muted-foreground">
                    This user has not posted any listings.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account &amp; security</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <DetailRow
                label="Account status"
                value={<AccountStatusBadge user={user} />}
              />
              <DetailRow
                label="Email verified"
                value={
                  <Badge variant={user.emailVerified ? "default" : "outline"}>
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </Badge>
                }
              />
              <DetailRow
                label="Role"
                value={<RoleBadges role={user.role} />}
              />
              <DetailRow
                label="Joined"
                value={formatListingDate(user.createdAt)}
              />
              <DetailRow
                label="Last active"
                value={
                  lastSession
                    ? new Date(lastSession.createdAt).toLocaleString()
                    : "—"
                }
              />
              <DetailRow
                label="Active sessions"
                value={user._count.sessions}
              />
              <DetailRow
                label="Total listings"
                value={effectiveCount}
              />
              <DetailRow
                label="Last updated"
                value={
                  <span className="flex items-center gap-1.5">
                    <CalendarClock
                      className="size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {new Date(user.updatedAt).toLocaleString()}
                  </span>
                }
              />
              <DetailRow
                label="User ID"
                value={<span className="font-mono text-xs break-all">{user.id}</span>}
              />
            </CardContent>
          </Card>

          <Card id="danger-zone" className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <ShieldAlert className="size-4" aria-hidden="true" />
                Danger zone
              </CardTitle>
              <CardDescription>
                These actions are destructive and cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminUserActions
                user={{
                  id: user.id,
                  name: user.name || "Unnamed",
                  email: user.email,
                  banned: user.banned,
                }}
                isSelf={isSelf}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <form action={toggleVerified.bind(null, user.id)} className="flex-1">
            <Button type="submit" size="sm" variant="outline" className="w-full">
              <ShieldCheck className="h-4 w-4" />
              {user.verified ? "Unverify" : "Verify"}
            </Button>
          </form>
          <Button
            render={
              <Link href={`/profile/${user.id}`} target="_blank" rel="noreferrer" />
            }
            variant="outline"
            size="sm"
            nativeButton={false}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4" />
            Profile
          </Button>
          <Button
            render={<a href="#danger-zone" />}
            variant="outline"
            size="sm"
            nativeButton={false}
            className="flex-1"
          >
            <Ban className="h-4 w-4" />
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
}
