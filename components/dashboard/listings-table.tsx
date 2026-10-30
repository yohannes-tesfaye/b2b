"use client";

import { useTransition } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  categoryLabel,
  daysLeftLabel,
  effectiveStatus,
  formatListingDate,
  typeLabel,
} from "@/lib/listings";
import type { ListingRow } from "@/types/listing";
import {
  closeListing,
  deleteListing,
  renewListing,
} from "@/utils/listings/actions";

type Props = {
  listings: ListingRow[];
  status: string;
  type: string;
  basePath: string;
};

export function ListingsTable({ listings, status, type, basePath }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const update = (patch: { status?: string; type?: string }) => {
    const nextStatus = patch.status ?? status;
    const nextType = patch.type ?? type;
    const params = new URLSearchParams();
    if (nextStatus !== "all") params.set("status", nextStatus);
    if (nextType !== "all") params.set("type", nextType);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const run = (
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => {
    startTransition(async () => {
      try {
        await action();
        toast.success(successMessage);
      } catch {
        toast.error(errorMessage);
      }
      router.refresh();
    });
  };

  const handleClose = (listing: ListingRow) => {
    if (!window.confirm(`Close "${listing.title}"? It will no longer be visible to buyers.`)) {
      return;
    }
    run(
      () => closeListing(listing.id),
      "Listing closed",
      "Failed to close listing"
    );
  };

  const handleDelete = (listing: ListingRow) => {
    if (!window.confirm(`Delete "${listing.title}"? This cannot be undone.`)) {
      return;
    }
    run(
      () => deleteListing(listing.id),
      "Listing deleted",
      "Failed to delete listing"
    );
  };

  const handleRenew = (listing: ListingRow) => {
    if (
      !window.confirm(
        `Renew "${listing.title}" for another ${listing.durationDays} days? It will be submitted for approval again.`
      )
    ) {
      return;
    }
    run(
      () => renewListing(listing.id),
      "Listing submitted for renewal",
      "Failed to renew listing"
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {listings.length} listing{listings.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={(value) => value && update({ type: value })}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="wanted">Wanted</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => value && update({ status: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Days left</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length ? (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="max-w-64">
                    <Link
                      href={`${basePath}/${listing.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <span className="block truncate text-xs text-muted-foreground">
                      {listing.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={listing.type === "wanted" ? "secondary" : "outline"}>
                      {typeLabel(listing.type)}
                    </Badge>
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
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        render={<Link href={`${basePath}/${listing.id}`} />}
                        size="xs"
                        variant="ghost"
                        nativeButton={false}
                      >
                        View
                      </Button>
                      <Button
                        render={<Link href={`${basePath}/${listing.id}/edit`} />}
                        size="xs"
                        variant="ghost"
                        nativeButton={false}
                      >
                        Edit
                      </Button>
                      {effectiveStatus(listing) === "expired" ? (
                        <Button
                          size="xs"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleRenew(listing)}
                        >
                          Renew
                        </Button>
                      ) : null}
                      {effectiveStatus(listing) !== "closed" ? (
                        <Button
                          size="xs"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleClose(listing)}
                        >
                          Close
                        </Button>
                      ) : null}
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-destructive"
                        disabled={isPending}
                        onClick={() => handleDelete(listing)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No listings match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
