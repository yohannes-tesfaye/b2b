"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  adminCloseListing,
  adminDeleteListing,
  approveListing,
  bulkApproveListings,
  bulkRejectListings,
  rejectListing,
} from "@/utils/listings/admin-actions";

export type ListingTarget = { id: string; title: string };

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: ListingTarget[];
  onSuccess?: () => void;
};

const REJECTION_PRESETS = [
  "Incomplete information",
  "Duplicate listing",
  "Prohibited item",
  "Spam or misleading",
];

function plural(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function actionError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function ApproveListingDialog({
  open,
  onOpenChange,
  listings,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const count = listings.length;

  const handleApprove = () => {
    startTransition(async () => {
      try {
        let updated = count;
        if (count === 1) {
          await approveListing(listings[0].id);
        } else {
          updated = (
            await bulkApproveListings(listings.map((listing) => listing.id))
          ).updated;
        }
        if (updated === 0) {
          toast.info("No pending listings were updated");
        } else {
          toast.success(
            updated === 1
              ? "Listing approved"
              : `${plural(updated, "listing")} approved`
          );
        }
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(actionError(error, "Failed to approve listing"));
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>
          Approve {count === 1 ? "this listing" : `${count} listings`}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          {count === 1
            ? `"${listings[0]?.title}" will go live on the public listings pages.`
            : `${count} selected listings will go live on the public listings pages.`}
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} disabled={isPending}>
            {isPending ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

export function RejectListingDialog({
  open,
  onOpenChange,
  listings,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const count = listings.length;

  const reset = () => {
    setReason("");
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleReject = () => {
    if (reason.trim().length < 5) {
      setError("Give the user a clear reason (at least 5 characters).");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        let updated = count;
        if (count === 1) {
          await rejectListing(listings[0].id, reason.trim());
        } else {
          updated = (
            await bulkRejectListings(
              listings.map((listing) => listing.id),
              reason.trim()
            )
          ).updated;
        }
        if (updated === 0) {
          toast.info("No pending listings were updated");
        } else {
          toast.success(
            updated === 1
              ? "Listing rejected"
              : `${plural(updated, "listing")} rejected`
          );
        }
        reset();
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (actionFailure) {
        toast.error(actionError(actionFailure, "Failed to reject listing"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Reject {count === 1 ? "listing" : `${count} listings`}
          </DialogTitle>
          <DialogDescription>
            The reason is shown to the owner on their dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {REJECTION_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              size="xs"
              variant={reason === preset ? "secondary" : "outline"}
              onClick={() => {
                setReason(preset);
                setError(null);
              }}
              disabled={isPending}
            >
              {preset}
            </Button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Textarea
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Explain what needs to change before this listing can be approved..."
            rows={4}
            maxLength={1000}
            aria-invalid={Boolean(error)}
            disabled={isPending}
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isPending}>
            Cancel
          </DialogClose>
          <Button variant="destructive" onClick={handleReject} disabled={isPending}>
            {isPending ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CloseListingDialog({
  open,
  onOpenChange,
  listings,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const listing = listings[0];

  const handleClose = () => {
    if (!listing) return;
    startTransition(async () => {
      try {
        await adminCloseListing(listing.id);
        toast.success("Listing closed");
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(actionError(error, "Failed to close listing"));
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>Close this listing?</AlertDialogTitle>
        <AlertDialogDescription>
          {listing
            ? `"${listing.title}" will no longer be visible on the public listings pages.`
            : "This listing will no longer be visible on the public listings pages."}
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClose} disabled={isPending}>
            {isPending ? "Closing..." : "Close listing"}
          </AlertDialogAction>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

export function DeleteListingDialog({
  open,
  onOpenChange,
  listings,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const listing = listings[0];

  const handleDelete = () => {
    if (!listing) return;
    startTransition(async () => {
      try {
        await adminDeleteListing(listing.id);
        toast.success("Listing deleted");
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(actionError(error, "Failed to delete listing"));
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
        <AlertDialogDescription>
          {listing
            ? `"${listing.title}" and its moderation history will be permanently deleted. This cannot be undone.`
            : "This listing will be permanently deleted. This cannot be undone."}
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
