"use client";

import { Package, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { LISTING_TYPE_META } from "@/lib/listings";
import type { TypeStepProps } from "./types";

/** Step 1: pick wanted or available listing type. */
export function StepType({ value, onChange }: TypeStepProps) {
  const t = useTranslations("listingForm");

  return (
    <section className="flex flex-col gap-(--spacing-4)">
      <header>
        <h2 className="text-base font-semibold">{t("typeTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("typeHint")}</p>
      </header>
      <div className="grid gap-(--spacing-3) sm:grid-cols-2">
        {LISTING_TYPE_META.map((item) => {
          const selected = value === item.value;
          const Icon = item.value === "wanted" ? ShoppingCart : Package;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.value)}
              className={cn(
                "flex items-start gap-(--spacing-3) rounded-xl border p-(--spacing-4) text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-muted/50"
              )}
            >
              <span
                className={cn(
                  "flex size-(--spacing-10) shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-(--spacing-4)" aria-hidden />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
