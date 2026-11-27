"use client";

import { useTransition } from "react";
import { sendMessage } from "@/utils/inquiries/actions";
import { toast } from "sonner";
import { ChatInput } from "./ChatInput";

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSend = (body: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("conversationId", conversationId);
        formData.set("body", body);
        const result = await sendMessage(
          { status: "idle" },
          formData
        );
        if (result.status === "success") {
          toast.success(result.message ?? "Message sent");
        } else if (result.status === "error" && result.message) {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to send message");
      }
    });
  };

  return (
    <ChatInput
      conversationId={conversationId}
      onSend={handleSend}
      isPending={isPending}
    />
  );
}
