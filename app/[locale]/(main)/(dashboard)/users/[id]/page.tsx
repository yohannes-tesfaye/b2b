import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Building2,
  CalendarClock,
  Eye,
  Globe,
  Mail,
  MessageSquare,
  Package,
  Phone,
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
  const totalViews = user.listings.reduce((sum, listing) => sum + listing.views, 0);
  const totalInquiries = user.listings.reduce(
    (sum, listing) => sum + listing.inquiries,
    0
  );
  const effectiveCount = user._count.listings;
  const industryLabel = user.industry ? roleLabel(user.industry) : null;
  const sizeLabel = user.companySize ? roleLabel(user.companySize) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          render={<Link href="/users" />}
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="mb-2 -ml-2"
        >
          <ArrowLeft />
          Back to users
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar className="size-14">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name || user.email} />
              ) : null}
              <AvatarFallback className="text-base">
                {initialsFrom(user.name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold break-words">
                  {user.name || "Unnamed"}
                </h2>
                {user.emailVerified ? (
                  <BadgeCheck
                    className="size-5 shrink-0 text-primary"
                    aria-label="Verified account"
                  />
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground break-words">
                {user.email}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <AccountStatusBadge user={user} />
                <RoleBadges role={user.role} />
              </div>
            </div>
          </div>
          <AdminUserActions
            user={{
              id: user.id,
              name: user.name || "Unnamed",
              email: user.email,
              banned: user.banned,
            }}
            isSelf={isSelf}
          />
        </div>
      </div>

      {isSelf ? (
        <p className="text-xs text-muted-foreground">
          This is your own account. Ban and delete actions are disabled here.
        </p>
      ) : null}

      {user.banned ? (
        <Card className="ring-destructive/30">
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
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
                          <a
                            href={`tel:${user.phone}`}
                            className="inline-flex items-center gap-1.5 text-primary hover:underline"
                          >
                            <Phone className="size-3.5" />
                            {user.phone}
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailRow
                      label="Email"
                      value={
                        <a
                          href={`mailto:${user.email}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Mail className="size-3.5" />
                          {user.email}
                        </a>
                      }
                    />
                    <DetailRow
                      label="Website"
                      value={
                        user.website ? (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                          >
                            <Globe className="size-3.5" aria-hidden="true" />
                            {user.website.replace(/^https?:\/\//, "")}
                          </a>
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

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">Recent listings</CardTitle>
                <CardDescription>
                  Their 5 most recent listings.
                </CardDescription>
              </div>
              <Button
                render={<Link href={`/listings?q=${encodeURIComponent(user.email)}`} />}
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
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0 space-y-1">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {listing.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{typeLabel(listing.type)}</span>
                          <span>·</span>
                          <span>{formatListingDate(listing.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden text-xs text-muted-foreground sm:inline">
                          {listing.views} views
                        </span>
                        <ListingStatusBadge
                          status={listing.status}
                          expiresAt={listing.expiresAt}
                        />
                      </div>
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
                  <p className="mt-1 text-xl font-semibold">{totalViews}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="size-3.5" aria-hidden="true" />
                    Inquiries
                  </div>
                  <p className="mt-1 text-xl font-semibold">{totalInquiries}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
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
                <DetailRow label="Total listings" value={effectiveCount} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-muted-foreground" />
                Account &amp; security
              </CardTitle>
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
              <DetailRow label="Role" value={user.role || "buyer"} />
              <DetailRow
                label="Last updated"
                value={
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    {new Date(user.updatedAt).toLocaleString()}
                  </span>
                }
              />
              <DetailRow
                label="User ID"
                value={<span className="font-mono text-xs">{user.id}</span>}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}