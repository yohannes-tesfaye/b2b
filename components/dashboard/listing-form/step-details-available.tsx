"use client";

import { useTranslations } from "next-intl";
import { LISTING_LIMITS } from "@/lib/validation/listing";
import { ListingImageInput } from "./listing-image-input";
import { TextField } from "./text-field";
import type { StepProps } from "./types";

const FIELDS = [
  { id: "price", label: "Price", placeholder: "e.g. USD 4.50 per kg", maxLength: LISTING_LIMITS.price },
  { id: "currency", label: "Currency", placeholder: "e.g. USD, EUR", optional: true, maxLength: LISTING_LIMITS.currency },
  { id: "moq", label: "Min. order qty", placeholder: "e.g. 300 kg", optional: true, maxLength: LISTING_LIMITS.moq },
  { id: "incoterms", label: "Incoterms", placeholder: "e.g. FOB, CIF, DDP", optional: true, maxLength: LISTING_LIMITS.incoterms },
  { id: "originCountry", label: "Country of origin", placeholder: "e.g. Ethiopia", optional: true, maxLength: LISTING_LIMITS.originCountry },
  { id: "deliveryOptions", label: "Delivery options", placeholder: "e.g. FOB Djibouti, 2–3 weeks", maxLength: LISTING_LIMITS.deliveryOptions },
] as const;

/** Step 3 (available): seller offer details and optional media. */
export function StepDetailsAvailable({
  values,
  errors,
  onChange,
  onTouch,
}: StepProps) {
  const t = useTranslations("listingForm");

  return (
    <section className="flex flex-col gap-(--spacing-6)">
      <header>
        <h2 className="text-base font-semibold">{t("availableTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("availableHint")}</p>
      </header>
      <div className="grid gap-(--spacing-4) sm:grid-cols-2">
        {FIELDS.map((field) => (
          <TextField
            key={field.id}
            {...field}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={(value) => onChange(field.id, value)}
            onTouch={() => onTouch(field.id)}
          />
        ))}
      </div>
      <TextField
        id="certifications"
        label="Certifications"
        value={values.certifications}
        error={errors.certifications}
        hint="Comma-separated, e.g. GOTS, ISO 9001, Organic."
        placeholder="e.g. GOTS, ISO 9001"
        optional
        maxLength={LISTING_LIMITS.certifications}
        onChange={(value) => onChange("certifications", value)}
        onTouch={() => onTouch("certifications")}
      />
      <TextField
        id="technicalSpecs"
        label="Technical specifications"
        value={values.technicalSpecs}
        error={errors.technicalSpecs}
        placeholder="Packaging, dimensions, or other specs."
        optional
        multiline
        maxLength={LISTING_LIMITS.technicalSpecs}
        onChange={(value) => onChange("technicalSpecs", value)}
        onTouch={() => onTouch("technicalSpecs")}
      />
      <ListingImageInput
        value={values.images}
        error={errors.images}
        onChange={(value) => onChange("images", value)}
        onTouch={() => onTouch("images")}
      />
    </section>
  );
}
