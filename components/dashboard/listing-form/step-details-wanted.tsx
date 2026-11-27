"use client";

import { useTranslations } from "next-intl";
import { LISTING_LIMITS } from "@/lib/validation/listing";
import { TextField } from "./text-field";
import type { StepProps } from "./types";

const FIELDS = [
  {
    id: "qualityStandard",
    label: "Quality standard",
    placeholder: "e.g. Grade 1, organic certified",
    maxLength: LISTING_LIMITS.qualityStandard,
  },
  {
    id: "deliveryTimeline",
    label: "Delivery timeline",
    placeholder: "e.g. Within 30 days",
    maxLength: LISTING_LIMITS.deliveryTimeline,
  },
  {
    id: "preferredRegion",
    label: "Preferred region",
    placeholder: "e.g. East Africa",
    maxLength: LISTING_LIMITS.preferredRegion,
  },
  {
    id: "budgetRange",
    label: "Budget range",
    placeholder: "e.g. USD 10,000 – 25,000",
    maxLength: LISTING_LIMITS.budgetRange,
  },
] as const;

/** Step 3 (wanted): buyer requirements suppliers need to respond. */
export function StepDetailsWanted({
  values,
  errors,
  onChange,
  onTouch,
}: StepProps) {
  const t = useTranslations("listingForm");

  return (
    <section className="flex flex-col gap-(--spacing-6)">
      <header>
        <h2 className="text-base font-semibold">{t("wantedTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("wantedHint")}</p>
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
        id="technicalDocument"
        label="Technical document"
        value={values.technicalDocument}
        error={errors.technicalDocument}
        hint="Paste a link to a PDF or document."
        placeholder="https://example.com/specification.pdf"
        optional
        type="url"
        inputMode="url"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={LISTING_LIMITS.technicalDocument}
        onChange={(value) => onChange("technicalDocument", value)}
        onTouch={() => onTouch("technicalDocument")}
      />
    </section>
  );
}
