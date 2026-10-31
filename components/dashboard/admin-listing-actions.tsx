"use client";

import { useState } from "react";
import { Archive, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ApproveListingDialog,
  CloseListingDialog,
  DeleteListingDialog,
  RejectListingDialog,
  type ListingTarget,
} from "@/components/dashboard/admin-listing-dialogs";
import { effectiveStatus } from "@/lib/listings";

type Action = "approve" | "reject" | "close" | "delete";

export function AdminListingActions({
  listing,
}: {
  listing: {
    id: string;
    title: string;
    status: string;
    expiresAt: Date | string | null;
  };
}) {
  const [action, setAction] = useState<Action | null>(null);
  const target: ListingTarget[] = [{ id: listing.id, title: listing.title }];
  const canReview = listing.status === "pending";
  const effective = effectiveStatus(listing);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => setAction("approve")}
          disabled={!canReview}
        >
          <Check />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAction("reject")}
          disabled={!canReview}
        >
          <X />
          Reject
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAction("close")}
          disabled={effective === "closed"}
        >
          <Archive />
          Close
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setAction("delete")}
        >
          <Trash2 />
          Delete
        </Button>
      </div>

      <ApproveListingDialog
        open={action === "approve"}
        onOpenChange={(open) => !open && setAction(null)}
        listings={target}
      />
      <RejectListingDialog
        open={action === "reject"}
        onOpenChange={(open) => !open && setAction(null)}
        listings={target}
      />
      <CloseListingDialog
        open={action === "close"}
        onOpenChange={(open) => !open && setAction(null)}
        listings={target}
      />
      <DeleteListingDialog
        open={action === "delete"}
        onOpenChange={(open) => !open && setAction(null)}
        listings={target}
      />
    </>
  );
}
