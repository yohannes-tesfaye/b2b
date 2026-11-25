"use client";

import type { ListingRow, ListingType } from "@/types/listing";
import { FormNav } from "./listing-form/form-nav";
import { HiddenFields } from "./listing-form/hidden-fields";
import { StepIndicator } from "./listing-form/step-indicator";
import { WizardStep } from "./listing-form/wizard-step";
import { useListingWizard } from "./listing-form/use-listing-wizard";

const TOTAL_STEPS = 4;

/** Four-step create/edit listing wizard with per-step validation and a draft. */
export function ListingForm({
  mode,
  defaultType,
  listing,
  basePath,
}: {
  mode: "create" | "edit";
  defaultType: ListingType;
  listing?: ListingRow | null;
  basePath: string;
}) {
  const {
    values,
    step,
    errors,
    isPending,
    formAction,
    canContinue,
    change,
    setType,
    touch,
    goNext,
    goBack,
    handleSubmit,
    handleCancel,
  } = useListingWizard({ mode, defaultType, listing, basePath });

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col gap-(--spacing-6)"
    >
      <HiddenFields values={values} />
      {mode === "edit" && listing ? (
        <input type="hidden" name="id" value={listing.id} />
      ) : null}

      <StepIndicator step={step} />
      <WizardStep
        step={step}
        values={values}
        errors={errors}
        type={values.type}
        onTypeChange={setType}
        onChange={change}
        onTouch={touch}
      />
      <FormNav
        step={step}
        total={TOTAL_STEPS}
        canContinue={canContinue}
        isPending={isPending}
        mode={mode}
        onBack={goBack}
        onNext={goNext}
        onCancel={handleCancel}
      />
    </form>
  );
}
