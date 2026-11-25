"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/**
 * Newsletter signup. UI-only for now — the success state is local until the
 * subscription endpoint exists.
 */
export function NewsletterForm() {
  const t = useTranslations("footer.newsletter");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {t("placeholder")}
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t("placeholder")}
          className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25 focus:ring-2 focus:ring-ring/15"
        />
        <Button
          type="submit"
          className="group h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/85"
        >
          {t("button")}
          {submitted ? (
            <Check className="size-4" />
          ) : (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
      </div>
      <p className="mt-2.5 text-xs text-muted-foreground" aria-live="polite">
        {submitted ? t("success") : t("note")}
      </p>
    </form>
  );
}
