"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { sendMessage } from "@/utils/inquiries/actions";
import { initialInquiryFormState } from "@/lib/validation/inquiry";
import { toast } from "sonner";
import { useEffect } from "react";

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, isPending] = useActionState(
    sendMessage,
    initialInquiryFormState
  );

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="conversationId" value={conversationId} />
      <Textarea
        name="body"
        placeholder="Type your reply..."
        rows={3}
        className="min-h-20 rounded-xl"
        required
      />
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-xl" disabled={isPending}>
          <Send className="h-4 w-4" />
          {isPending ? "Sending…" : "Send reply"}
        </Button>
      </div>
    </form>
  );
}
