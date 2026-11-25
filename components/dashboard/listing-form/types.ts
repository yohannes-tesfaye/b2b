import type { ListingDraftValues } from "@/lib/listing-draft";
import type { ListingType } from "@/types/listing";

export type StepProps = {
  values: ListingDraftValues;
  errors: Record<string, string>;
  onChange: (
    key: Exclude<keyof ListingDraftValues, "type">,
    value: string
  ) => void;
  onTouch: (key: keyof ListingDraftValues) => void;
};

export type TypeStepProps = {
  value: ListingType;
  onChange: (type: ListingType) => void;
};
