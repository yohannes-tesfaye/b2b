"use client";

import { useEffect, useState, useActionState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import {
  clearListingDraft,
  initialListingValues,
  loadListingDraft,
  saveListingDraft,
  type ListingDraftValues,
} from "@/lib/listing-draft";
import {
  initialListingFormState,
  LISTING_STEP_SCHEMAS,
  listingIssuesToFieldErrors,
  listingSchema,
} from "@/lib/validation/listing";
import type { ListingRow, ListingType } from "@/types/listing";
import { createListing, updateListing } from "@/utils/listings/actions";

/** State, draft persistence and per-step validation for the listing wizard. */
export function useListingWizard({
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
  const t = useTranslations("listingForm");
  const router = useRouter();
  const [values, setValues] = useState<ListingDraftValues>(() =>
    initialListingValues(defaultType, listing)
  );
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const [showAll, setShowAll] = useState(false);
  const [edited, setEdited] = useState(false);
  const [hydrated, setHydrated] = useState(mode !== "create");
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createListing : updateListing,
    initialListingFormState
  );

  useActionFeedback(state);

  useEffect(() => {
    if (mode !== "create") return;
    const draft = loadListingDraft();
    if (draft) {
      // Restoring a saved draft is a one-time read from external storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues((prev) => ({ ...prev, ...draft.values }));
      setStep(draft.step);
    }
    setHydrated(true);
  }, [mode]);

  useEffect(() => {
    if (mode !== "create" || !hydrated) return;
    saveListingDraft(values, step);
  }, [values, step, hydrated, mode]);

  useEffect(() => {
    if (mode === "create" && state.status === "success") clearListingDraft();
  }, [state.status, mode]);

  const parsedStep = LISTING_STEP_SCHEMAS[step].safeParse(values);
  const stepErrors = parsedStep.success
    ? {}
    : listingIssuesToFieldErrors(parsedStep.error);
  const errors: Record<string, string> = {
    ...(edited ? {} : state.fieldErrors),
  };
  for (const [field, message] of Object.entries(stepErrors)) {
    if (showAll || touched.has(field)) errors[field] = message;
  }

  const change = (
    key: Exclude<keyof ListingDraftValues, "type">,
    value: string
  ) => {
    setEdited(true);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setType = (type: ListingType) => {
    setEdited(true);
    setValues((prev) => ({ ...prev, type }));
  };

  const touch = (key: keyof ListingDraftValues) =>
    setTouched((prev) => new Set(prev).add(key));

  const goNext = () => {
    if (!parsedStep.success) {
      setShowAll(true);
      return;
    }
    setShowAll(false);
    setStep((current) =>
      Math.min(current + 1, LISTING_STEP_SCHEMAS.length - 1)
    );
  };

  const goBack = () => {
    setShowAll(false);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = listingSchema.safeParse(values);
    if (parsed.success) return;
    event.preventDefault();
    const firstInvalid = LISTING_STEP_SCHEMAS.findIndex(
      (schema) => !schema.safeParse(values).success
    );
    setStep(firstInvalid === -1 ? 0 : firstInvalid);
    setShowAll(true);
    toast.error(t("invalidToast"));
  };

  const handleCancel = () => {
    if (mode === "create") {
      if (!window.confirm(t("cancelConfirm"))) return;
      clearListingDraft();
    }
    router.push(basePath);
  };

  return {
    values,
    step,
    errors,
    isPending,
    formAction,
    canContinue: parsedStep.success,
    change,
    setType,
    touch,
    goNext,
    goBack,
    handleSubmit,
    handleCancel,
  };
}
