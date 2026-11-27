"use client";

import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { FormField } from "./form-field";
import {
  softFieldChrome,
  softInputClass,
  softTextareaClass,
} from "./styles";

/** Labelled input or textarea with soft styling and blur-based errors. */
export function TextField({
  id,
  label,
  value,
  error,
  hint,
  placeholder,
  optional,
  multiline,
  rows = 3,
  type = "text",
  min,
  max,
  inputMode,
  maxLength,
  pattern,
  digitsOnly,
  autoCapitalize,
  spellCheck,
  autoComplete,
  onChange,
  onTouch,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  min?: number;
  max?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  pattern?: string;
  digitsOnly?: boolean;
  autoCapitalize?: string;
  spellCheck?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
  onTouch: () => void;
}) {
  const shared = {
    id,
    value,
    placeholder,
    "aria-invalid": Boolean(error),
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const raw = event.target.value;
      onChange(digitsOnly ? raw.replace(/[^\d]/g, "") : raw);
    },
    onBlur: onTouch,
  };

  return (
    <FormField
      id={id}
      label={label}
      error={error}
      hint={hint}
      optional={optional}
    >
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          maxLength={maxLength}
          spellCheck={spellCheck}
          className={cn(softFieldChrome, softTextareaClass)}
        />
      ) : (
        <Input
          {...shared}
          type={type}
          min={min}
          max={max}
          inputMode={inputMode}
          maxLength={maxLength}
          pattern={pattern}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          autoComplete={autoComplete}
          className={cn(softFieldChrome, softInputClass)}
        />
      )}
    </FormField>
  );
}
