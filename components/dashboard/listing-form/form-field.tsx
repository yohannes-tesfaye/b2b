"use client";

import { useTranslations } from "next-intl";
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field";
import { FIX_KEY_BY_FIELD } from "./fix-hints";

/** Field shell with a calm invalid message plus a one-line suggested fix. */
export function FormField({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("listingForm");
  return (
    <Field
      className="gap-2 data-[invalid=true]:text-foreground"
      data-invalid={Boolean(error)}
    >
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {optional ? (
          <span className="text-xs text-muted-foreground">{t("optional")}</span>
        ) : null}
      </div>
      <FieldContent className="gap-1.5">
        {children}
        {error ? (
          <div role="alert" className="flex flex-col gap-0.5 text-xs">
            <span className="font-medium text-warm">{error}</span>
            <span className="text-muted-foreground">
              {t(`fix.${FIX_KEY_BY_FIELD[id] ?? "generic"}`)}
            </span>
          </div>
        ) : null}
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </FieldContent>
    </Field>
  );
}
