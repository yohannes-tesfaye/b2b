"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

interface ChatInputProps {
  conversationId: string;
  onSend: (body: string, attachment?: string) => void;
  isPending?: boolean;
}

export function ChatInput({ conversationId, onSend, isPending = false }: ChatInputProps) {
  const t = useTranslations();
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, store as base64 data URL (local, like profile pictures)
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result as string);
      setAttachmentName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if (!body.trim() && !attachment) return;
    onSend(body.trim(), attachment ?? undefined);
    setBody("");
    setAttachment(null);
    setAttachmentName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 z-10 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {attachment ? (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 truncate text-xs">{attachmentName}</span>
          <button
            type="button"
            onClick={() => {
              setAttachment(null);
              setAttachmentName(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          aria-label={t("inbox.input.attach")}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inbox.input.placeholder")}
          rows={1}
          className="min-h-[40px] max-h-[120px] flex-1 resize-none rounded-2xl px-4 py-2 text-sm"
        />

        <Button
          type="button"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-full"
          onClick={handleSend}
          disabled={isPending || (!body.trim() && !attachment)}
          aria-label={t("inbox.input.send")}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
