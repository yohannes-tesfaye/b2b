"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
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

export type AdminListingActionData = {
  id: string;
  title: string;
  status: string;
  expiresAt: Date | string | null;
};

type ListingCtx = {
  listing: AdminListingActionData;
  open: (action: Action) => void;
};

const Ctx = createContext<ListingCtx | null>(null);

export function AdminListingActionsProvider({
  listing,
  children,
}: {
  listing: AdminListingActionData;
  children: ReactNode;
}) {
  const [action, setAction] = useState<Action | null>(null);
  const target: ListingTarget[] = [{ id: listing.id, title: listing.title }];

  return (
    <Ctx.Provider value={{ listing, open: setAction }}>
      {children}
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
    </Ctx.Provider>
  );
}

export function AdminListingActionButtons({
  className,
}: {
  className?: string;
}) {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  const listing = ctx.listing;
  const canReview = listing.status === "pending";
  const effective = effectiveStatus(listing);

  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      <Button
        size="sm"
        onClick={() => ctx.open("approve")}
        disabled={!canReview}
      >
        <Check />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => ctx.open("reject")}
        disabled={!canReview}
      >
        <X />
        Reject
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => ctx.open("close")}
        disabled={effective === "closed"}
      >
        <Archive />
        Close
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => ctx.open("delete")}
      >
        <Trash2 />
        Delete
      </Button>
    </div>
  );
}

export function AdminListingActions({
  listing,
  className,
}: {
  listing: AdminListingActionData;
  className?: string;
}) {
  return (
    <AdminListingActionsProvider listing={listing}>
      <AdminListingActionButtons className={className} />
    </AdminListingActionsProvider>
  );
}
