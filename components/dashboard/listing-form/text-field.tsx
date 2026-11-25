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
    ) => onChange(event.target.value),
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
          className={cn(softFieldChrome, softTextareaClass)}
        />
      ) : (
        <Input
          {...shared}
          type={type}
          min={min}
          max={max}
          className={cn(softFieldChrome, softInputClass)}
        />
      )}
    </FormField>
  );
}
