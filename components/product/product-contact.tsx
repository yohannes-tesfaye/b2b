"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Copy,
  Mail,
  MessageSquare,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useActionState } from "react";
import { startConversation } from "@/utils/inquiries/actions";
import { initialInquiryFormState } from "@/lib/validation/inquiry";

export function ContactActions({
  email,
  title,
  listingId,
  isWanted,
  variant = "drawer",
}: {
  email?: string | null;
  title: string;
  listingId: string;
  isWanted: boolean;
  variant?: "drawer" | "dialog";
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");

  const [state, formAction, isPending] = useActionState(
    startConversation,
    initialInquiryFormState
  );
  const router = useRouter();

  // On success (or when sign-in is required) leave the form and continue.
  useEffect(() => {
    if (!state.redirectTo) return;
    if (state.status === "success") {
      toast.success("Message sent");
    }
    router.replace(state.redirectTo);
  }, [state.redirectTo, state.status, router]);

  // Coming back from sign-in with `?contact=1` reopens the inquiry form.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("contact") !== "1") return;
    params.delete("contact");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
    queueMicrotask(() => setOpen(true));
  }, []);

  const role = isWanted ? "buyer" : "supplier";

  const directEmail = () => {
    if (!email) {
      toast.error("Contact email is not available");
      return;
    }
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `Inquiry about "${title}"`
    )}`;
  };

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied");
    } catch {
      toast.error("Could not copy email");
    }
  };

  const fields = (
    <>
      {email ? (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
            <Mail className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </p>
            <p className="truncate text-sm font-medium">{email}</p>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground active:bg-muted"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="inquiry-name"
          className="text-xs font-semibold text-foreground"
        >
          Your name
        </label>
        <Input
          id="inquiry-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          autoComplete="name"
          required
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="inquiry-email"
          className="text-xs font-semibold text-foreground"
        >
          Your email
        </label>
        <Input
          id="inquiry-email"
          type="email"
          name="buyerEmail"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="inquiry-message"
          className="text-xs font-semibold text-foreground"
        >
          Message
        </label>
        <Textarea
          id="inquiry-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hello, I'm interested in "${title}". Please share your best price and lead time.`}
          rows={4}
          className="min-h-24 rounded-xl"
          required
        />
      </div>

      <input type="hidden" name="listingId" value={listingId} />

      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        Your message is sent securely. No account required.
      </p>
    </>
  );

  return (
    <>
      {/* Inline actions (desktop + mobile seller card) */}
      <div className="flex flex-col gap-2">
        <Button className="h-11 w-full" onClick={() => setOpen(true)}>
          <MessageSquare className="h-4 w-4" /> Message {role}
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full"
          onClick={directEmail}
        >
          <Mail className="h-4 w-4" /> Email {role}
        </Button>
      </div>

      {variant === "dialog" ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Message {role}</DialogTitle>
              <DialogDescription className="line-clamp-2">
                Send an inquiry about “{title}”.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="flex flex-col gap-4">
              {fields}
              {state.status === "error" && state.message ? (
                <p className="text-sm text-destructive">{state.message}</p>
              ) : null}
              <Button
                type="submit"
                className="h-11 w-full rounded-xl text-sm font-semibold"
                disabled={isPending}
              >
                <Send className="h-4 w-4" />{" "}
                {isPending ? "Sending…" : "Send message"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="flex flex-row items-start justify-between">
              <div>
                <DrawerTitle>Message {role}</DrawerTitle>
                <DrawerDescription className="line-clamp-2">
                  Send an inquiry about “{title}”.
                </DrawerDescription>
              </div>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="h-11 w-11 rounded-full"
                    aria-label="Close contact form"
                  />
                }
              >
                <X className="h-4 w-4" />
              </DrawerClose>
            </DrawerHeader>

            <form action={formAction} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
                {fields}
                {state.status === "error" && state.message ? (
                  <p className="text-sm text-destructive">{state.message}</p>
                ) : null}
              </div>

              <DrawerFooter className="border-t pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl text-sm font-semibold"
                  disabled={isPending}
                >
                  <Send className="h-4 w-4" />{" "}
                  {isPending ? "Sending…" : "Send message"}
                </Button>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
