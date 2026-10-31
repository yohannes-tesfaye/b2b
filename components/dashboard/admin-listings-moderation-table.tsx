"use client";

import { useMemo, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  BadgeCheck,
  MoreHorizontal,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListingStatusBadge } from "@/components/dashboard/listing-status-badge";
import {
  ApproveListingDialog,
  CloseListingDialog,
  DeleteListingDialog,
  RejectListingDialog,
  type ListingTarget,
} from "@/components/dashboard/admin-listing-dialogs";
import {
  categoryLabel,
  daysLeftLabel,
  effectiveStatus,
  formatListingDate,
  typeLabel,
} from "@/lib/listings";
import {
  adminListingsHref,
  type AdminListingQuery,
} from "@/lib/admin-listings-query";
import type { AdminListingRow } from "@/types/listing";

type DialogState =
  | { type: "approve" | "reject" | "close" | "delete"; listings: ListingTarget[] }
  | null;

function pageNumbers(current: number, total: number) {
  const pages = new Set<number>([1, total]);
  for (let page = current - 1; page <= current + 1; page += 1) {
    if (page > 1 && page < total) pages.add(page);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

function OwnerCell({ listing }: { listing: AdminListingRow }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1">
        <span className="truncate text-sm font-medium">
          {listing.user?.name || "Unknown owner"}
        </span>
        {listing.user?.emailVerified ? (
          <BadgeCheck
            className="size-3.5 shrink-0 text-primary"
            aria-label="Verified account"
          />
        ) : null}
      </div>
      <span className="block truncate text-xs text-muted-foreground">
        {listing.user?.companyName || listing.user?.email || "—"}
      </span>
    </div>
  );
}

function Thumbnail({ listing }: { listing: AdminListingRow }) {
  const image = listing.type === "available" ? listing.images[0] : null;

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        className="size-10 shrink-0 rounded-md border object-cover"
      />
    );
  }

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
      <Package className="size-4" aria-hidden="true" />
    </div>
  );
}

function ListingActions({
  listing,
  onAction,
}: {
  listing: AdminListingRow;
  onAction: (type: "approve" | "reject" | "close" | "delete") => void;
}) {
  const router = useRouter();
  const effective = effectiveStatus(listing);
  const canReview = listing.status === "pending";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${listing.title}`}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Listing</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/listings/${listing.id}`)}
        >
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!canReview}
          onClick={() => onAction("approve")}
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canReview}
          onClick={() => onAction("reject")}
        >
          Reject
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={effective === "closed"}
          onClick={() => onAction("close")}
        >
          Close
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onAction("delete")}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminListingsModerationTable({
  listings,
  total,
  query,
}: {
  listings: AdminListingRow[];
  total: number;
  query: AdminListingQuery;
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);

  const pendingOnPage = useMemo(
    () => listings.filter((listing) => listing.status === "pending"),
    [listings]
  );
  const selectedListings = useMemo(
    () =>
      listings
        .filter((listing) => selectedIds.includes(listing.id))
        .map((listing) => ({ id: listing.id, title: listing.title })),
    [listings, selectedIds]
  );

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, id]))
        : current.filter((value) => value !== id)
    );
  };

  const allPendingSelected =
    pendingOnPage.length > 0 &&
    pendingOnPage.every((listing) => selectedIds.includes(listing.id));
  const somePendingSelected =
    !allPendingSelected &&
    pendingOnPage.some((listing) => selectedIds.includes(listing.id));

  const goToPage = (page: number) => {
    router.replace(adminListingsHref({ ...query, page }));
  };

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const pages = pageNumbers(query.page, totalPages);
  const hasFilters = Boolean(
    query.q ||
      query.type !== "all" ||
      query.category !== "all" ||
      query.expiring
  );
  const emptyPending =
    total === 0 && query.status === "pending" && !query.expiring && !hasFilters;

  const openDialog = (
    type: "approve" | "reject" | "close" | "delete",
    target: AdminListingRow
  ) => {
    setDialog({ type, listings: [{ id: target.id, title: target.title }] });
  };

  const dialogOpen = Boolean(dialog);
  const dialogListings = dialog?.listings ?? [];

  return (
    <div className="space-y-4">
      {selectedIds.length ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/50 p-2">
          <p className="text-sm font-medium">
            {selectedIds.length} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setDialog({ type: "approve", listings: selectedListings })
              }
            >
              Approve selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setDialog({ type: "reject", listings: selectedListings })
              }
            >
              Reject selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      <div className="hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allPendingSelected}
                  indeterminate={somePendingSelected}
                  disabled={!pendingOnPage.length}
                  onCheckedChange={(checked) =>
                    setSelectedIds(
                      checked ? pendingOnPage.map((listing) => listing.id) : []
                    )
                  }
                  aria-label="Select all pending listings on this page"
                />
              </TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Days left</TableHead>
              <TableHead className="w-10 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length ? (
              listings.map((listing) => (
                <TableRow
                  key={listing.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/listings/${listing.id}`)}
                >
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    {listing.status === "pending" ? (
                      <Checkbox
                        checked={selectedIds.includes(listing.id)}
                        onCheckedChange={(checked) =>
                          toggleSelected(listing.id, checked)
                        }
                        aria-label={`Select ${listing.title}`}
                      />
                    ) : (
                      <span className="block size-4" />
                    )}
                  </TableCell>
                  <TableCell className="max-w-72">
                    <div className="flex items-center gap-2">
                      <Thumbnail listing={listing} />
                      <div className="min-w-0">
                        <Link
                          href={`/listings/${listing.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {listing.title}
                        </Link>
                        <span className="block truncate text-xs text-muted-foreground">
                          {listing.location}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={listing.type === "wanted" ? "secondary" : "outline"}
                    >
                      {typeLabel(listing.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-48">
                    <OwnerCell listing={listing} />
                  </TableCell>
                  <TableCell>{categoryLabel(listing.category)}</TableCell>
                  <TableCell>
                    <ListingStatusBadge
                      status={listing.status}
                      expiresAt={listing.expiresAt}
                    />
                  </TableCell>
                  <TableCell>{formatListingDate(listing.createdAt)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        effectiveStatus(listing) === "expired"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    >
                      {daysLeftLabel(listing.expiresAt)}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ListingActions
                      listing={listing}
                      onAction={(type) => openDialog(type, listing)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-40">
                  <EmptyState pending={emptyPending} hasFilters={hasFilters} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {listings.length ? (
          listings.map((listing) => (
            <Card
              key={listing.id}
              className="cursor-pointer"
              onClick={() => router.push(`/listings/${listing.id}`)}
            >
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  {listing.status === "pending" ? (
                    <div onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(listing.id)}
                        onCheckedChange={(checked) =>
                          toggleSelected(listing.id, checked)
                        }
                        aria-label={`Select ${listing.title}`}
                      />
                    </div>
                  ) : null}
                  <Thumbnail listing={listing} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {listing.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {listing.location}
                    </p>
                  </div>
                  <div onClick={(event) => event.stopPropagation()}>
                    <ListingActions
                      listing={listing}
                      onAction={(type) => openDialog(type, listing)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <ListingStatusBadge
                    status={listing.status}
                    expiresAt={listing.expiresAt}
                  />
                  <Badge
                    variant={listing.type === "wanted" ? "secondary" : "outline"}
                  >
                    {typeLabel(listing.type)}
                  </Badge>
                  <Badge variant="outline">
                    {categoryLabel(listing.category)}
                  </Badge>
                </div>

                <div className="flex items-end justify-between gap-3 text-xs text-muted-foreground">
                  <OwnerCell listing={listing} />
                  <div className="text-right">
                    <p>{formatListingDate(listing.createdAt)}</p>
                    <p>{daysLeftLabel(listing.expiresAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-xl border p-6">
            <EmptyState pending={emptyPending} hasFilters={hasFilters} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total} listing{total === 1 ? "" : "s"} total
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(query.pageSize)}
            onValueChange={(value) =>
              value &&
              router.replace(
                adminListingsHref({
                  ...query,
                  pageSize: Number(value),
                  page: 1,
                })
              )
            }
          >
            <SelectTrigger className="w-24" aria-label="Listings per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
            </SelectContent>
          </Select>

          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(Math.max(1, query.page - 1))}
                  disabled={query.page <= 1}
                >
                  Previous
                </Button>
              </PaginationItem>
              {pages.map((page, index) => {
                const previous = pages[index - 1];
                return (
                  <PaginationItem key={page} className="hidden sm:block">
                    {previous && page - previous > 1 ? (
                      <span className="px-1 text-xs text-muted-foreground">…</span>
                    ) : null}
                    <Button
                      variant={page === query.page ? "outline" : "ghost"}
                      size="icon-sm"
                      onClick={() => goToPage(page)}
                      aria-current={page === query.page ? "page" : undefined}
                      aria-label={`Page ${page}`}
                      className="hidden sm:inline-flex"
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(Math.min(totalPages, query.page + 1))}
                  disabled={query.page >= totalPages}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <ApproveListingDialog
        open={dialogOpen && dialog?.type === "approve"}
        onOpenChange={(open) => !open && setDialog(null)}
        listings={dialogListings}
        onSuccess={() => setSelectedIds([])}
      />
      <RejectListingDialog
        open={dialogOpen && dialog?.type === "reject"}
        onOpenChange={(open) => !open && setDialog(null)}
        listings={dialogListings}
        onSuccess={() => setSelectedIds([])}
      />
      <CloseListingDialog
        open={dialogOpen && dialog?.type === "close"}
        onOpenChange={(open) => !open && setDialog(null)}
        listings={dialogListings}
      />
      <DeleteListingDialog
        open={dialogOpen && dialog?.type === "delete"}
        onOpenChange={(open) => !open && setDialog(null)}
        listings={dialogListings}
      />
    </div>
  );
}

function EmptyState({
  pending,
  hasFilters,
}: {
  pending: boolean;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="rounded-full bg-muted p-2 text-muted-foreground">
        {pending ? (
          <ShieldCheck className="size-5" aria-hidden="true" />
        ) : (
          <Package className="size-5" aria-hidden="true" />
        )}
      </div>
      <p className="text-sm font-medium">
        {pending
          ? "No pending listings, you're all caught up."
          : "No listings match these filters."}
      </p>
      <p className="text-xs text-muted-foreground">
        {pending
          ? "New submissions will appear here for review."
          : hasFilters
            ? "Try clearing the search or filters."
            : "Nothing to show for this view."}
      </p>
      {!pending && hasFilters ? (
        <Button render={<Link href="/listings" />} variant="outline" size="sm" nativeButton={false}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
