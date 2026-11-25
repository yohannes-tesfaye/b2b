"use client";

import { useTranslations } from "next-intl";
import { StepNode } from "./step-node";

/** Four-step wizard progress with a translated "Step X of Y" caption. */
export function StepIndicator({ step }: { step: number }) {
  const t = useTranslations("listingForm");
  const labels = [
    t("steps.type"),
    t("steps.basics"),
    t("steps.details"),
    t("steps.review"),
  ];
  const currentLabel = labels[step] ?? labels[0];

  return (
    <div>
      <ol aria-label={t("progressLabel")} className="flex items-center">
        {labels.map((label, index) => (
          <StepNode
            key={label}
            index={index}
            step={step}
            label={label}
            last={index === labels.length - 1}
          />
        ))}
      </ol>
      <p
        aria-live="polite"
        className="mt-(--spacing-3) text-xs text-muted-foreground"
      >
        {t("stepCaption", {
          current: step + 1,
          total: labels.length,
          label: currentLabel,
        })}
      </p>
    </div>
  );
}
