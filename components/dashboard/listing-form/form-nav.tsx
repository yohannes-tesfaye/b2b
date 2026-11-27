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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-t border-border pt-(--spacing-4)">
      <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
        <ChevronLeft className="size-(--spacing-4)" /> {t("back")}
      </Button>
      <div className="flex flex-col items-end gap-(--spacing-1)">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-(--spacing-2)">
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full sm:w-auto">
            {t("cancel")}
          </Button>
          {last ? (
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
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
              className="w-full sm:w-auto"
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
