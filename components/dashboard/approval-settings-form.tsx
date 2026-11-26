"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateApprovalSettings } from "@/app/[locale]/(main)/(dashboard)/dashboard/settings/actions";

export function ApprovalSettingsForm({
  initial,
}: {
  initial: { listingApprovalEnabled: boolean; autoApproveVerified: boolean };
}) {
  const [approval, setApproval] = useState(initial.listingApprovalEnabled);
  const [autoApprove, setAutoApprove] = useState(initial.autoApproveVerified);
  const [pending, startTransition] = useTransition();

  const toggle = (key: "listingApprovalEnabled" | "autoApproveVerified", value: boolean) => {
    if (key === "listingApprovalEnabled") setApproval(value);
    else setAutoApprove(value);

    startTransition(async () => {
      await updateApprovalSettings({
        listingApprovalEnabled: key === "listingApprovalEnabled" ? value : approval,
        autoApproveVerified: key === "autoApproveVerified" ? value : autoApprove,
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="approval"
          checked={approval}
          onCheckedChange={(v) => toggle("listingApprovalEnabled", v === true)}
          disabled={pending}
        />
        <Label htmlFor="approval">Require admin approval for new listings</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="autoApprove"
          checked={autoApprove}
          onCheckedChange={(v) => toggle("autoApproveVerified", v === true)}
          disabled={pending}
        />
        <Label htmlFor="autoApprove">Auto-approve verified users</Label>
      </div>
    </div>
  );
}
