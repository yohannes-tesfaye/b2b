"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/** Wizard footer: Back and Cancel always available, Next gated by the step. */
export function FormNav({
  step,
  total,
  canContinue,
  isPending,
  mode,
  onBack,
  onNext,
  onCancel,
}: {
  step: number;
  total: number;
  canContinue: boolean;
  isPending: boolean;
  mode: "create" | "edit";
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("listingForm");
  const last = step >= total - 1;

  return (
    <div className="flex flex-wrap items-start justify-between gap-(--spacing-3) border-t border-border pt-(--spacing-4)">
      <Button type="button" variant="outline" onClick={onBack}>
        <ChevronLeft className="size-(--spacing-4)" /> {t("back")}
      </Button>
      <div className="flex flex-col items-end gap-(--spacing-1)">
        <div className="flex flex-wrap items-center gap-(--spacing-2)">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("cancel")}
          </Button>
          {last ? (
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("saving")
                : mode === "create"
                ? t("submitCreate")
                : t("submitEdit")}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              disabled={!canContinue || isPending}
            >
              {t("next")} <ChevronRight className="size-(--spacing-4)" />
            </Button>
          )}
        </div>
        {!last && !canContinue ? (
          <p className="text-xs text-muted-foreground">{t("disabledHint")}</p>
        ) : null}
      </div>
    </div>
  );
}
