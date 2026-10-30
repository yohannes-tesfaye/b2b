"use client";

import { useTransition } from "react";
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
  effectiveStatus,
  formatListingDate,
  typeLabel,
} from "@/lib/listings";
import type { ListingRow } from "@/types/listing";
import {
  approveListing,
  rejectListing,
  adminDeleteListing,
  adminCloseListing,
} from "@/utils/listings/admin-actions";

export type AdminListing = ListingRow & { userName?: string | null; userEmail?: string | null };

type Props = {
  listings: AdminListing[];
  status: string;
  type: string;
};

export function AdminListingsTable({ listings, status, type }: Props) {
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

  const run = (action: () => Promise<void>, success: string, error: string) => {
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
      } catch {
        toast.error(error);
      }
      router.refresh();
    });
  };

  const filtered = listings.filter((listing) => {
    if (type !== "all" && listing.type !== type) return false;
    if (status !== "all" && effectiveStatus(listing) !== status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length} listing{filtered.length === 1 ? "" : "s"}
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
              <TableHead>Creator</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="max-w-48">
                    <span className="block truncate font-medium">{listing.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {listing.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{listing.userName || "—"}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {listing.userEmail || ""}
                      </span>
                    </div>
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
                    <div className="flex items-center justify-end gap-1">
                      {listing.status === "pending" ? (
                        <>
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={isPending}
                            onClick={() =>
                              run(
                                () => approveListing(listing.id),
                                "Listing approved",
                                "Failed to approve"
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => {
                              const reason = window.prompt("Rejection reason (optional):") ?? "";
                              run(
                                () => rejectListing(listing.id, reason),
                                "Listing rejected",
                                "Failed to reject"
                              );
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}
                      {effectiveStatus(listing) !== "closed" ? (
                        <Button
                          size="xs"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            run(
                              () => adminCloseListing(listing.id),
                              "Listing closed",
                              "Failed to close"
                            )
                          }
                        >
                          Close
                        </Button>
                      ) : null}
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-destructive"
                        disabled={isPending}
                        onClick={() => {
                          if (
                            !window.confirm(`Delete "${listing.title}"? This cannot be undone.`)
                          )
                            return;
                          run(
                            () => adminDeleteListing(listing.id),
                            "Listing deleted",
                            "Failed to delete"
                          );
                        }}
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
