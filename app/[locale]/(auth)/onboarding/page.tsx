"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";
import OnboardingForm, {
  type OnboardingStep,
} from "@/components/Auth/OnboardingForm";

const TOTAL_STEPS = 4;

function OnboardingPage() {
  const t = useTranslations("auth");
  const [step, setStep] = useState<OnboardingStep>(1);

  const steps = [
    { title: t("stepWelcome"), description: t("stepWelcomeDesc") },
    { title: t("stepRole"), description: t("stepRoleDesc") },
    { title: t("stepBusiness"), description: t("stepBusinessDesc") },
    { title: t("stepReview"), description: t("stepReviewDesc") },
  ];

  return (
    <main className="flex flex-1">
      <aside className="relative hidden w-95 shrink-0 flex-col justify-between overflow-hidden border-r border-border bg-muted/30 p-10 lg:flex">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              G
            </span>
            <span className="text-base font-semibold tracking-tight">
              GlobalTradeHUB
            </span>
          </div>

          <ol className="flex flex-col gap-6">
            {steps.map((item, index) => {
              const number = index + 1;
              const active = step === number;
              const complete = step > number;
              return (
                <li key={item.title} className="flex gap-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                      complete
                        ? "border-primary bg-primary text-primary-foreground"
                        : active
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {complete ? <Check className="size-4" /> : number}
                  </span>
                  <span className="flex flex-col gap-0.5 pt-1">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        active || complete
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("onboardingSidebarTagline")}
        </p>
      </aside>

      <section className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {step === 1 ? (
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t("backToSignUp")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((step - 1) as OnboardingStep)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t("back")}
            </button>
          )}

          <div className="mt-4 mb-3 flex items-center gap-3 lg:hidden">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              {t("stepOf", { step, total: TOTAL_STEPS })}
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <OnboardingForm step={step} onStepChange={setStep} />
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t("onboardingFooterNote")}
          </p>
        </div>
      </section>
    </main>
  );
}

export default OnboardingPage;
