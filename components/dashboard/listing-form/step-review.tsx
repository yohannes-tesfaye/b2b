"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LISTING_TYPE_META } from "@/lib/listings";
import type { ListingDraftValues } from "@/lib/listing-draft";

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function orDash(value: string | null | undefined): string {
  const trimmed = (value ?? "").trim();
  return trimmed ? trimmed : "—";
}

/**
 * Step 4: full review of everything entered, then an explicit Submit.
 * Nothing is published until the submit button below is clicked.
 */
export function StepReview({
  values,
  mode,
  isPending,
}: {
  values: ListingDraftValues;
  mode: "create" | "edit";
  isPending: boolean;
}) {
  const t = useTranslations("listingForm");
  const wanted = values.type === "wanted";
  const type =
    LISTING_TYPE_META.find((item) => item.value === values.type)?.label ??
    values.type;
  const images = lines(values.images);

  const common: { label: string; value: ReactNode }[] = [
    { label: "Category", value: orDash(values.category) },
    { label: "Quantity", value: orDash(values.quantity) },
    { label: "Location", value: orDash(values.location) },
    {
      label: "Listing period",
      value: values.durationDays
        ? `${values.durationDays} days`
        : "—",
    },
  ];

  const typeRows = wanted
    ? [
        { label: "Quality standard", value: orDash(values.qualityStandard) },
        { label: "Delivery timeline", value: orDash(values.deliveryTimeline) },
        { label: "Preferred region", value: orDash(values.preferredRegion) },
        { label: "Budget range", value: orDash(values.budgetRange) },
        {
          label: "Technical document",
          value: values.technicalDocument.trim() ? (
            <a
              href={values.technicalDocument.trim()}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline-offset-4 hover:underline"
            >
              Open document
            </a>
          ) : (
            "—"
          ),
        },
      ]
    : [
        {
          label: "Price",
          value: values.price.trim()
            ? `${values.price.trim()}${values.currency ? ` ${values.currency}` : ""}`
            : "—",
        },
        { label: "MOQ", value: orDash(values.moq) },
        { label: "Delivery options", value: orDash(values.deliveryOptions) },
        { label: "Certifications", value: orDash(values.certifications) },
        { label: "Incoterms", value: orDash(values.incoterms) },
        { label: "Origin country", value: orDash(values.originCountry) },
        { label: "Technical specs", value: orDash(values.technicalSpecs) },
      ];

  return (
    <section className="flex flex-col gap-(--spacing-4)">
      <header>
        <h2 className="text-base font-semibold">{t("reviewTitle")}</h2>
        <p className="text-xs text-muted-foreground">
          Check every detail below. Nothing is saved until you submit.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-(--spacing-4) text-sm">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="font-medium">
            {values.title.trim() ? values.title.trim() : t("untitled")}
          </p>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {type}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-muted-foreground">
          {orDash(values.description)}
        </p>

        <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {[...common, ...typeRows].map((row) => (
            <div
              key={row.label}
              className="flex justify-between gap-3 border-b border-border/60 pb-1 last:border-0 sm:block"
            >
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="text-right sm:text-left">{row.value}</dd>
            </div>
          ))}
        </dl>

        {images.length ? (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Images ({images.length})
            </p>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {images.map((image, index) => (
                <li
                  key={`${index}-${image.length}`}
                  className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-background/80 px-1 text-[10px] font-medium text-muted-foreground">
                    {image.startsWith("data:") ? "Uploaded" : "Link"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">{t("reviewNotice")}</p>

      <div className="pt-(--spacing-1)">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending
            ? t("saving")
            : mode === "create"
              ? t("submitCreate")
              : t("submitEdit")}
        </Button>
      </div>
    </section>
  );
}
