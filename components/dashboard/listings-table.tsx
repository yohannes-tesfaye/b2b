"use client";

import { useState, useTransition } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

type ConfirmAction =
  | { kind: "close" | "delete" | "renew"; listing: ListingRow }
  | null;

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
  { value: "closed", label: "Closed" },
];

export function ListingsTable({ listings, status, type, basePath }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<ConfirmAction>(null);

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

  const handleConfirm = () => {
    if (!confirm) return;
    const { kind, listing } = confirm;
    setConfirm(null);

    if (kind === "close") {
      run(
        () => closeListing(listing.id),
        "Listing closed",
        "Failed to close listing"
      );
    } else if (kind === "delete") {
      run(
        () => deleteListing(listing.id),
        "Listing deleted",
        "Failed to delete listing"
      );
    } else {
      run(
        () => renewListing(listing.id),
        "Listing submitted for renewal",
        "Failed to renew listing"
      );
    }
  };

  const hasFilters = status !== "all" || type !== "all";

  const confirmCopy = (() => {
    if (!confirm) return null;
    const { kind, listing } = confirm;
    if (kind === "close") {
      return {
        title: `Close "${listing.title}"?`,
        description:
          "It will no longer be visible to buyers or suppliers. You can post it again later.",
        action: "Close listing",
      };
    }
    if (kind === "delete") {
      return {
        title: `Delete "${listing.title}"?`,
        description: "This permanently removes the listing. This cannot be undone.",
        action: "Delete listing",
      };
    }
    return {
      title: `Renew "${listing.title}"?`,
      description: `It will be submitted for approval again for another ${listing.durationDays} days.`,
      action: "Renew listing",
    };
  })();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
        <Tabs value={status} onValueChange={(value) => update({ status: String(value) })}>
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-2.5">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {listings.length} listing{listings.length === 1 ? "" : "s"}
          </p>
          <Select value={type} onValueChange={(value) => value && update({ type: value })}>
            <SelectTrigger className="w-40" aria-label="Filter by listing type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="wanted">Wanted</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {listings.length ? (
        <>
          <div className="hidden rounded-xl border md:block">
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
                {listings.map((listing) => (
                  <TableRow key={listing.id} className="cursor-pointer" onClick={() => router.push(`${basePath}/${listing.id}`)}>
                    <TableCell className="max-w-64">
                      <Link
                        href={`${basePath}/${listing.id}`}
                        onClick={(event) => event.stopPropagation()}
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
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <RowActions
                        listing={listing}
                        isPending={isPending}
                        basePath={basePath}
                        onConfirm={setConfirm}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="cursor-pointer"
                onClick={() => router.push(`${basePath}/${listing.id}`)}
              >
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {listing.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {listing.location}
                      </p>
                    </div>
                    <div onClick={(event) => event.stopPropagation()}>
                      <RowActions
                        listing={listing}
                        isPending={isPending}
                        basePath={basePath}
                        onConfirm={setConfirm}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <ListingStatusBadge
                      status={listing.status}
                      expiresAt={listing.expiresAt}
                    />
                    <Badge variant={listing.type === "wanted" ? "secondary" : "outline"}>
                      {typeLabel(listing.type)}
                    </Badge>
                    <Badge variant="outline">
                      {categoryLabel(listing.category)}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {formatListingDate(listing.createdAt)} ·{" "}
                    {daysLeftLabel(listing.expiresAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border p-6">
          <EmptyState hasFilters={hasFilters} basePath={basePath} />
        </div>
      )}

      <AlertDialog open={Boolean(confirm)} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogPopup>
          {confirmCopy ? (
            <>
              <AlertDialogTitle>{confirmCopy.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmCopy.description}
              </AlertDialogDescription>
            </>
          ) : null}
          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {confirmCopy?.action}
            </AlertDialogAction>
          </div>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}

function RowActions({
  listing,
  isPending,
  basePath,
  onConfirm,
}: {
  listing: ListingRow;
  isPending: boolean;
  basePath: string;
  onConfirm: (action: NonNullable<ConfirmAction>) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-1">
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
          onClick={() => onConfirm({ kind: "renew", listing })}
        >
          Renew
        </Button>
      ) : null}
      {effectiveStatus(listing) !== "closed" ? (
        <Button
          size="xs"
          variant="outline"
          disabled={isPending}
          onClick={() => onConfirm({ kind: "close", listing })}
        >
          Close
        </Button>
      ) : null}
      <Button
        size="xs"
        variant="ghost"
        className="text-destructive"
        disabled={isPending}
        onClick={() => onConfirm({ kind: "delete", listing })}
      >
        Delete
      </Button>
    </div>
  );
}

function EmptyState({
  hasFilters,
  basePath,
}: {
  hasFilters: boolean;
  basePath: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="rounded-full bg-muted p-2 text-muted-foreground">
        <Package className="size-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium">
        {hasFilters ? "No listings match these filters." : "No listings yet"}
      </p>
      <p className="text-xs text-muted-foreground">
        {hasFilters
          ? "Try a different status or type."
          : "Create your first wanted or available listing to get started."}
      </p>
      {hasFilters ? (
        <Button render={<Link href={basePath} />} variant="outline" size="sm" nativeButton={false}>
          Clear filters
        </Button>
      ) : (
        <Button render={<Link href={`${basePath}/new`} />} size="sm" nativeButton={false}>
          Post new listing
        </Button>
      )}
    </div>
  );
}