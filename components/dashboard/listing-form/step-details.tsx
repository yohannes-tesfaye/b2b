"use client";

import { StepDetailsAvailable } from "./step-details-available";
import { StepDetailsWanted } from "./step-details-wanted";
import type { StepProps } from "./types";

/** Step 3: type-specific details, split to keep each form light. */
export function StepDetails(props: StepProps) {
  return props.values.type === "wanted" ? (
    <StepDetailsWanted {...props} />
  ) : (
    <StepDetailsAvailable {...props} />
  );
}
