"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { setUserRequiresReview } from "@/app/[locale]/(main)/(dashboard)/dashboard/settings/actions";

export function UserReviewToggle({
  userId,
  initial,
}: {
  userId: string;
  initial: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id="requiresReview"
        checked={value}
        onCheckedChange={(v) => {
          const next = v === true;
          setValue(next);
          startTransition(async () => {
            await setUserRequiresReview(userId, next);
          });
        }}
        disabled={pending}
      />
      <Label htmlFor="requiresReview">Require review for new listings</Label>
    </div>
  );
}
