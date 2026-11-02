"use client";

import { useTransition } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { effectiveStatus } from "@/lib/listings";
import {
  closeListing,
  renewListing,
} from "@/utils/listings/actions";

type Props = {
  id: string;
  title: string;
  status: string;
  expiresAt: Date | string | null;
  durationDays: number;
  basePath: string;
};

export function ListingActions({
  id,
  title,
  status,
  expiresAt,
  durationDays,
  basePath,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const effective = effectiveStatus({ status, expiresAt });

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

  const handleClose = () => {
    if (!window.confirm(`Close "${title}"? It will no longer be visible to buyers.`)) {
      return;
    }
    run(() => closeListing(id), "Listing closed", "Failed to close listing");
  };

  const handleRenew = () => {
    if (
      !window.confirm(
        `Renew "${title}" for another ${durationDays} days? It will be submitted for approval again.`
      )
    ) {
      return;
    }
    run(
      () => renewListing(id),
      "Listing submitted for renewal",
      "Failed to renew listing"
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        render={<Link href={`${basePath}/${id}/edit`} />}
        variant="outline"
        nativeButton={false}
      >
        Edit listing
      </Button>
      {effective === "expired" ? (
        <Button disabled={isPending} onClick={handleRenew}>
          Renew listing
        </Button>
      ) : effective !== "closed" ? (
        <Button variant="outline" disabled={isPending} onClick={handleClose}>
          Close listing
        </Button>
      ) : null}
    </div>
  );
}
