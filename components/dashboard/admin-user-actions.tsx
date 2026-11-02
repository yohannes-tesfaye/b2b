"use client";

import { useState } from "react";
import { Ban, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BanUserDialog,
  DeleteUserDialog,
  UnbanUserDialog,
  type UserTarget,
} from "@/components/dashboard/admin-user-dialogs";

type Action = "ban" | "unban" | "delete";

export function AdminUserActions({
  user,
  isSelf,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    banned: boolean | null;
  };
  isSelf: boolean;
}) {
  const [action, setAction] = useState<Action | null>(null);
  const target: UserTarget | null = isSelf
    ? null
    : { id: user.id, name: user.name, email: user.email };
  const banned = Boolean(user.banned);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {banned ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAction("unban")}
          >
            <ShieldCheck />
            Unban
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAction("ban")}
            disabled={!target}
            title={isSelf ? "You cannot ban your own account" : undefined}
          >
            <Ban />
            Ban
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setAction("delete")}
          disabled={!target}
          title={isSelf ? "You cannot delete your own account" : undefined}
        >
          <Trash2 />
          Delete
        </Button>
      </div>

      <BanUserDialog
        open={action === "ban"}
        onOpenChange={(open) => !open && setAction(null)}
        user={target}
      />
      <UnbanUserDialog
        open={action === "unban"}
        onOpenChange={(open) => !open && setAction(null)}
        user={target}
      />
      <DeleteUserDialog
        open={action === "delete"}
        onOpenChange={(open) => !open && setAction(null)}
        user={target}
      />
    </>
  );
}