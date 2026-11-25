"use client";

import type { ListingType } from "@/types/listing";
import { StepBasics } from "./step-basics";
import { StepDetails } from "./step-details";
import { StepReview } from "./step-review";
import { StepType } from "./step-type";
import type { StepProps } from "./types";

/** Renders only the active step's fields from the shared wizard state. */
export function WizardStep({
  step,
  type,
  onTypeChange,
  ...stepProps
}: StepProps & {
  step: number;
  type: ListingType;
  onTypeChange: (type: ListingType) => void;
}) {
  if (step === 0) {
    return <StepType value={type} onChange={onTypeChange} />;
  }
  if (step === 1) return <StepBasics {...stepProps} />;
  if (step === 2) return <StepDetails {...stepProps} />;
  return <StepReview values={stepProps.values} />;
}
