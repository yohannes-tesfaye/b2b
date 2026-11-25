"use client";

import { useTranslations } from "next-intl";
import { LISTING_TYPE_META } from "@/lib/listings";
import type { StepProps } from "./types";

/** Step 4: calm summary before the listing is sent for approval. */
export function StepReview({ values }: Pick<StepProps, "values">) {
  const t = useTranslations("listingForm");
  const type =
    LISTING_TYPE_META.find((item) => item.value === values.type)?.label ??
    values.type;

  return (
    <section className="flex flex-col gap-(--spacing-4)">
      <h2 className="text-base font-semibold">{t("reviewTitle")}</h2>
      <div className="rounded-xl border border-border bg-card p-(--spacing-4) text-sm">
        <p className="font-medium">{values.title || t("untitled")}</p>
        <p className="text-xs text-muted-foreground">
          {type} · {values.category || "—"} · {values.location || "—"}
        </p>
        <p className="mt-(--spacing-2) line-clamp-3 text-muted-foreground">
          {values.description}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">{t("reviewNotice")}</p>
    </section>
  );
}
