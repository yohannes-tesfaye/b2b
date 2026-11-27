"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LISTING_CATEGORIES } from "@/lib/listings";
import { LISTING_LIMITS } from "@/lib/validation/listing";
import { FormField } from "./form-field";
import { TextField } from "./text-field";
import type { StepProps } from "./types";

/** Basics grid: category plus the measurable listing facts. */
export function StepBasicsGrid({
  values,
  errors,
  onChange,
  onTouch,
}: StepProps) {
  return (
    <div className="grid gap-(--spacing-4) sm:grid-cols-2">
      <FormField id="category" label="Category" error={errors.category}>
        <Select
          value={values.category}
          onValueChange={(value) => {
            onChange("category", String(value ?? ""));
            onTouch("category");
          }}
        >
          <SelectTrigger
            id="category"
            aria-invalid={Boolean(errors.category)}
            className="h-(--spacing-12) w-full rounded-xl border-border bg-card px-(--spacing-4) aria-invalid:border-warm aria-invalid:ring-warm/15"
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {LISTING_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <TextField
        id="quantity"
        label="Quantity"
        value={values.quantity}
        error={errors.quantity}
        hint="Amount and unit, e.g. 500 kg."
        placeholder="e.g. 500 kg"
        maxLength={LISTING_LIMITS.quantity}
        onChange={(value) => onChange("quantity", value)}
        onTouch={() => onTouch("quantity")}
      />
      <TextField
        id="location"
        label="Location"
        value={values.location}
        error={errors.location}
        placeholder="e.g. Addis Ababa, Ethiopia"
        maxLength={LISTING_LIMITS.location}
        onChange={(value) => onChange("location", value)}
        onTouch={() => onTouch("location")}
      />
      <TextField
        id="durationDays"
        label="Listing duration (days)"
        value={values.durationDays}
        error={errors.durationDays}
        hint="How long the listing stays live once approved. 1–365 days."
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={LISTING_LIMITS.durationDaysMaxLength}
        digitsOnly
        onChange={(value) => onChange("durationDays", value)}
        onTouch={() => onTouch("durationDays")}
      />
    </div>
  );
}
