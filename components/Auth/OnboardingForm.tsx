"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  Check,
  ChevronRight,
  Handshake,
  Package,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError, FieldSeparator } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { finishOnboarding } from "@/utils/auth/onboarding-action";
import LocaleField from "../i18n/LocaleField";

export type OnboardingStep = 1 | 2 | 3 | 4;

type Role = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

function StepHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right text-sm font-medium break-words">
        {value}
      </dd>
    </div>
  );
}

function OnboardingForm({
  step,
  onStepChange,
}: {
  step: OnboardingStep;
  onStepChange: (step: OnboardingStep) => void;
}) {
  const t = useTranslations("auth");

  const ROLES: Role[] = [
    {
      value: "supplier",
      label: t("roleSupplier"),
      description: t("roleSupplierDesc"),
      icon: Package,
    },
    {
      value: "buyer",
      label: t("roleBuyer"),
      description: t("roleBuyerDesc"),
      icon: ShoppingCart,
    },
    {
      value: "trade-service-provider",
      label: t("roleTradeServiceProvider"),
      description: t("roleTradeServiceProviderDesc"),
      icon: Handshake,
    },
  ];
  const INDUSTRIES = [
    { value: "agriculture", label: t("industryAgriculture") },
    { value: "automotive", label: t("industryAutomotive") },
    { value: "electronics", label: t("industryElectronics") },
    { value: "machinery", label: t("industryMachinery") },
    { value: "textiles", label: t("industryTextiles") },
    { value: "other", label: t("industryOther") },
  ];
  const SIZES = [
    { value: "1-10", label: t("size1to10") },
    { value: "11-50", label: t("size11to50") },
    { value: "51-200", label: t("size51to200") },
    { value: "201-500", label: t("size201to500") },
    { value: "500+", label: t("size500plus") },
  ];

  const [roles, setRoles] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [state, formAction] = useActionState(finishOnboarding, { error: null });

  const toggleRole = (value: string) => {
    setRoles((prev) =>
      prev.includes(value)
        ? prev.filter((role) => role !== value)
        : [...prev, value]
    );
  };

  const canContinueBusiness =
    companyName.trim().length > 0 &&
    phone.trim().length > 0 &&
    country.trim().length > 0 &&
    industry.length > 0;

  const selectedRoleLabels = ROLES.filter((role) =>
    roles.includes(role.value)
  ).map((role) => role.label);

  const reviewRows = [
    { label: t("companyName"), value: companyName || t("notProvided") },
    { label: t("phoneNumber"), value: phone || t("notProvided") },
    { label: t("companyWebsite"), value: website || t("notProvided") },
    { label: t("country"), value: country || t("notProvided") },
    {
      label: t("businessCategory"),
      value:
        INDUSTRIES.find((item) => item.value === industry)?.label ??
        t("notProvided"),
    },
    {
      label: t("companySize"),
      value:
        SIZES.find((item) => item.value === companySize)?.label ??
        t("notProvided"),
    },
  ];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <StepHeader
            title={t("welcomeHeading")}
            description={t("welcomeSubtitle")}
          />
          <ul className="flex flex-col gap-3">
            {[
              t("welcomeBulletRole"),
              t("welcomeBulletDetails"),
              t("welcomeBulletStart"),
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" />
                </span>
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            className="w-full"
            onClick={() => onStepChange(2)}
          >
            {t("getStarted")}
            <ChevronRight />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <StepHeader
            title={t("selectRole")}
            description={t("describeBusiness")}
          />
          <div className="flex flex-col gap-3">
            {ROLES.map((role) => {
              const selected = roles.includes(role.value);
              const Icon = role.icon;
              return (
                <button
                  key={role.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleRole(role.value)}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-transparent hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-md",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{role.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {role.description}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {selected && <Check className="size-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onStepChange(1)}
            >
              {t("back")}
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!roles.length}
              onClick={() => onStepChange(3)}
            >
              {t("next")}
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <StepHeader
            title={t("businessInformation")}
            description={t("businessDetailsSubtitle")}
          />
          <div className="flex flex-col gap-4">
            <Field className="gap-2">
              <FieldLabel htmlFor="companyName">{t("companyName")}</FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t("companyNamePlaceholder")}
                  autoComplete="organization"
                />
              </FieldContent>
            </Field>
            <Field className="gap-2">
              <FieldLabel htmlFor="phone">{t("phoneNumber")}</FieldLabel>
              <FieldContent>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  autoComplete="tel"
                />
              </FieldContent>
            </Field>
            <Field className="gap-2">
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="website">{t("companyWebsite")}</FieldLabel>
                <span className="text-xs text-muted-foreground">{t("optional")}</span>
              </div>
              <FieldContent>
                <Input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={t("websitePlaceholder")}
                  autoComplete="url"
                />
              </FieldContent>
            </Field>
            <Field className="gap-2">
              <FieldLabel htmlFor="country">{t("country")}</FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={t("countryPlaceholder")}
                  autoComplete="country-name"
                />
              </FieldContent>
            </Field>
            <Field className="gap-2">
              <FieldLabel htmlFor="industry">{t("businessCategory")}</FieldLabel>
              <FieldContent>
                <Select
                  value={industry}
                  onValueChange={(value) => setIndustry(String(value ?? ""))}
                >
                  <SelectTrigger id="industry" className="w-full">
                    <SelectValue placeholder={t("selectIndustry")} />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field className="gap-2">
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="companySize">{t("companySize")}</FieldLabel>
                <span className="text-xs text-muted-foreground">{t("optional")}</span>
              </div>
              <FieldContent>
                <Select
                  value={companySize}
                  onValueChange={(value) => setCompanySize(String(value ?? ""))}
                >
                  <SelectTrigger id="companySize" className="w-full">
                    <SelectValue placeholder={t("selectCompanySize")} />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>

          <FieldError
            errors={
              state.error ? [{ message: state.error }] : undefined
            }
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onStepChange(2)}
            >
              {t("back")}
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!canContinueBusiness}
              onClick={() => onStepChange(4)}
            >
              {t("next")}
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          <StepHeader
            title={t("reviewTitle")}
            description={t("reviewSubtitle")}
          />

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t("reviewRoles")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedRoleLabels.length ? (
                  selectedRoleLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium"
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t("reviewNoRoles")}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t("reviewBusiness")}
              </p>
              <dl className="mt-2 divide-y divide-border">
                {reviewRows.map((row) => (
                  <ReviewRow
                    key={row.label}
                    label={row.label}
                    value={row.value}
                  />
                ))}
              </dl>
            </div>
          </div>

          <FieldError
            errors={
              state.error ? [{ message: state.error }] : undefined
            }
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onStepChange(3)}
            >
              {t("back")}
            </Button>
            <Button type="submit" className="flex-1">
              {t("confirmAndContinue")}
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <LocaleField />
      {roles.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}
      <input type="hidden" name="companyName" value={companyName} />
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="website" value={website} />
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="industry" value={industry} />
      <input type="hidden" name="companySize" value={companySize} />
    </form>
  );
}

export default OnboardingForm;
