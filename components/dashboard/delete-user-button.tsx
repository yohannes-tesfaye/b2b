"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/app/[locale]/(main)/(dashboard)/users/actions";

export function DeleteUserButton({ userId, disabled }: { userId: string; disabled?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" disabled={disabled} />}>
        Delete user
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The user and their data will be permanently removed.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2 pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={pending}
              onClick={async () => {
                setPending(true);
                try {
                  await deleteUser(userId);
                  router.push("/users");
                  router.refresh();
                } finally {
                  setPending(false);
                }
              }}
            >
              {pending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
