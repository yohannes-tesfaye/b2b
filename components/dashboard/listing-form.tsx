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
    formMessage,
    change,
    setType,
    touch,
    goNext,
    goBack,
    goTo,
    handleSubmit,
    handleCancel,
  } = useListingWizard({ mode, defaultType, listing, basePath });

  const total = TOTAL_STEPS;

  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return;
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (event.defaultPrevented) return; // a child already handled it (e.g. "Add link")
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    if (target.tagName === "BUTTON") return; // let buttons do their own thing
    // On the review step, Enter in any field does NOT submit; only an
    // explicit click (or Enter on the focused Submit button) publishes.
    if (step >= total - 1) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    goNext();
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-(--spacing-6)"
    >
      <HiddenFields values={values} />
      {mode === "edit" && listing ? (
        <input type="hidden" name="id" value={listing.id} />
      ) : null}

      <StepIndicator step={step} onStepChange={goTo} />
      <WizardStep
        step={step}
        values={values}
        errors={errors}
        type={values.type}
        onTypeChange={setType}
        onChange={change}
        onTouch={touch}
        mode={mode}
        isPending={isPending}
      />
      {formMessage ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 px-(--spacing-4) py-(--spacing-3) text-sm text-destructive"
        >
          {formMessage}
        </div>
      ) : null}

      <FormNav
        step={step}
        total={total}
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
