"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateListingModerationNotes } from "@/utils/listings/admin-actions";

export function AdminListingNotes({
  listingId,
  initialNotes,
}: {
  listingId: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const dirty = notes !== savedNotes;

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateListingModerationNotes(listingId, notes);
        setSavedNotes(notes);
        toast.success("Moderation note saved");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save note"
        );
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="moderation-notes">Internal note</Label>
        <Textarea
          id="moderation-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add context for other admins. This is never shown to the listing owner."
          rows={5}
          maxLength={2000}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Admin-only. {notes.length}/2000 characters.
        </p>
      </div>
      <Button
        size="sm"
        onClick={handleSave}
        disabled={isPending || !dirty}
      >
        {isPending ? "Saving..." : "Save note"}
      </Button>
    </div>
  );
}
