"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import OnboardingForm from "@/components/Auth/OnboardingForm";

function OnboardingPage() {
  const t = useTranslations("auth");
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg">
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
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </button>
        )}
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <OnboardingForm step={step} onStepChange={setStep} />
        </div>
      </div>
    </main>
  );
}

export default OnboardingPage;