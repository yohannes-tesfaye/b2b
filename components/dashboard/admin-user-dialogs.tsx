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
import { banUser, deleteUser, unbanUser } from "@/app/[locale]/(main)/(dashboard)/users/actions";

export type UserTarget = {
  id: string;
  name: string;
  email: string;
};

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserTarget | null;
  onSuccess?: () => void;
};

const BAN_PRESETS = [
  "Spam or fraudulent activity",
  "Abusive behaviour",
  "Fake or duplicate account",
  "Repeated policy violations",
];

function actionError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function displayName(user: UserTarget | null) {
  return user?.name || user?.email || "this user";
}

export function BanUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const reset = () => setReason("");

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleBan = () => {
    if (!user) return;
    startTransition(async () => {
      try {
        await banUser(user.id, reason.trim() || "Banned by admin");
        toast.success("User banned");
        reset();
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(actionError(error, "Failed to ban user"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ban {displayName(user)}</DialogTitle>
          <DialogDescription>
            Their active sessions are signed out and they will not be able to
            sign in until unbanned.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {BAN_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              size="xs"
              variant={reason === preset ? "secondary" : "outline"}
              onClick={() => setReason(preset)}
              disabled={isPending}
            >
              {preset}
            </Button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason for the ban (optional, visible to admins)..."
            rows={3}
            maxLength={500}
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use the default reason.
          </p>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isPending}>
            Cancel
          </DialogClose>
          <Button variant="destructive" onClick={handleBan} disabled={isPending}>
            {isPending ? "Banning..." : "Ban user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UnbanUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUnban = () => {
    if (!user) return;
    startTransition(async () => {
      try {
        await unbanUser(user.id);
        toast.success("User unbanned");
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(actionError(error, "Failed to unban user"));
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>Unban {displayName(user)}?</AlertDialogTitle>
        <AlertDialogDescription>
          They will be able to sign in and use the marketplace again.
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnban} disabled={isPending}>
            {isPending ? "Unbanning..." : "Unban user"}
          </AlertDialogAction>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: DialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!user) return;
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        toast.success("User deleted");
        onSuccess?.();
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(actionError(error, "Failed to delete user"));
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>Delete {displayName(user)}?</AlertDialogTitle>
        <AlertDialogDescription>
          This permanently deletes the account, their sessions, and all of their
          listings. This cannot be undone.
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {isPending ? "Deleting..." : "Delete user"}
          </AlertDialogAction>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
