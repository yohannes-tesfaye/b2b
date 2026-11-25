"use client";

import type { ListingDraftValues } from "@/lib/listing-draft";

/** Keeps every value in the FormData even when its step is unmounted. */
export function HiddenFields({ values }: { values: ListingDraftValues }) {
  return (
    <>
      <input type="hidden" name="type" value={values.type} />
      {Object.entries(values).map(([key, value]) =>
        key === "type" ? null : (
          <input key={key} type="hidden" name={key} value={value} />
        )
      )}
    </>
  );
}
