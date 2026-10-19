"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocaleField from "@/components/i18n/LocaleField";
import { updateProfile } from "@/utils/auth/profile-action";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import {
  initialFormState,
  profileSchema,
  zodIssuesToFieldErrors,
  type Translate,
} from "@/lib/validation/auth";
import {
  COMPANY_SIZE_META,
  INDUSTRY_META,
  ROLE_META,
  parseRoles,
} from "@/lib/profile";
import type { ProfileUser } from "./types";

function ProfileForm({
  user,
  onSaved,
}: {
  user: ProfileUser;
  onSaved?: () => void;
}) {
  const t = useTranslations("auth");
  const translate = t as unknown as Translate;
  const tr = translate as unknown as (key: string) => string;

  const [v, setV] = useState({
    name: user.name ?? "",
    companyName: user.companyName ?? "",
    phone: user.phone ?? "",
    website: user.website ?? "",
    country: user.country ?? "",
    industry: user.industry ?? "",
    companySize: user.companySize ?? "",
    roles: parseRoles(user.role),
  });
  const [state, formAction] = useActionState(updateProfile, initialFormState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useActionFeedback(state);

  const errors = { ...state.fieldErrors, ...clientErrors };
  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const update =
    (key: keyof typeof v) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setV((prev) => ({ ...prev, [key]: event.target.value }));

  const toggleRole = (value: string) =>
    setV((prev) => ({
      ...prev,
      roles: prev.roles.includes(value)
        ? prev.roles.filter((role) => role !== value)
        : [...prev.roles, value],
    }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = profileSchema.safeParse(v);
    if (!parsed.success) {
      event.preventDefault();
      const fieldErrors = zodIssuesToFieldErrors(parsed.error, translate);
      setClientErrors(fieldErrors);
      toast.error(translate("validation.formError"));
      return;
    }
    setClientErrors({});
  };

  if (state.status === "success" && onSaved) {
    onSaved();
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">{t("profile.personalTitle")}</h2>
        <Field className="gap-2" data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              name="name"
              value={v.name}
              onChange={update("name")}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
            <FieldError errors={fieldError("name")} />
          </FieldContent>
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
          <FieldContent>
            <Input id="email" value={user.email} readOnly disabled />
            <p className="text-xs text-muted-foreground">
              {t("profile.emailLocked")}
            </p>
          </FieldContent>
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">{t("profile.rolesTitle")}</h2>
        <div className="flex flex-col gap-3">
          {ROLE_META.map((role) => {
            const selected = v.roles.includes(role.value);
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
                  <span className="text-sm font-medium">
                    {tr(role.labelKey)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {tr(role.descriptionKey)}
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
        <FieldError errors={fieldError("roles")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">{t("businessInformation")}</h2>
        <Field className="gap-2" data-invalid={Boolean(errors.companyName)}>
          <FieldLabel htmlFor="companyName">{t("companyName")}</FieldLabel>
          <FieldContent>
            <Input
              id="companyName"
              name="companyName"
              value={v.companyName}
              onChange={update("companyName")}
              placeholder={t("companyNamePlaceholder")}
              autoComplete="organization"
              aria-invalid={Boolean(errors.companyName)}
            />
            <FieldError errors={fieldError("companyName")} />
          </FieldContent>
        </Field>
        <Field className="gap-2" data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor="phone">{t("phoneNumber")}</FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={v.phone}
              onChange={update("phone")}
              placeholder={t("phonePlaceholder")}
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
            />
            <FieldError errors={fieldError("phone")} />
          </FieldContent>
        </Field>
        <Field className="gap-2" data-invalid={Boolean(errors.website)}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="website">{t("companyWebsite")}</FieldLabel>
            <span className="text-xs text-muted-foreground">
              {t("optional")}
            </span>
          </div>
          <FieldContent>
            <Input
              id="website"
              name="website"
              type="url"
              value={v.website}
              onChange={update("website")}
              placeholder={t("websitePlaceholder")}
              autoComplete="url"
              aria-invalid={Boolean(errors.website)}
            />
            <FieldError errors={fieldError("website")} />
          </FieldContent>
        </Field>
        <Field className="gap-2" data-invalid={Boolean(errors.country)}>
          <FieldLabel htmlFor="country">{t("country")}</FieldLabel>
          <FieldContent>
            <Input
              id="country"
              name="country"
              value={v.country}
              onChange={update("country")}
              placeholder={t("countryPlaceholder")}
              autoComplete="country-name"
              aria-invalid={Boolean(errors.country)}
            />
            <FieldError errors={fieldError("country")} />
          </FieldContent>
        </Field>
        <Field className="gap-2" data-invalid={Boolean(errors.industry)}>
          <FieldLabel htmlFor="industry">{t("businessCategory")}</FieldLabel>
          <FieldContent>
            <Select
              value={v.industry}
              onValueChange={(value) =>
                setV((prev) => ({ ...prev, industry: String(value ?? "") }))
              }
            >
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder={t("selectIndustry")} />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_META.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {tr(item.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={fieldError("industry")} />
          </FieldContent>
        </Field>
        <Field className="gap-2">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="companySize">{t("companySize")}</FieldLabel>
            <span className="text-xs text-muted-foreground">
              {t("optional")}
            </span>
          </div>
          <FieldContent>
            <Select
              value={v.companySize}
              onValueChange={(value) =>
                setV((prev) => ({ ...prev, companySize: String(value ?? "") }))
              }
            >
              <SelectTrigger id="companySize" className="w-full">
                <SelectValue placeholder={t("selectCompanySize")} />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZE_META.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {tr(item.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </section>

      <div className="flex justify-end">
        <Button type="submit">{t("profile.saveChanges")}</Button>
      </div>

      <LocaleField />
      {v.roles.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}
      <input type="hidden" name="companyName" value={v.companyName} />
      <input type="hidden" name="phone" value={v.phone} />
      <input type="hidden" name="website" value={v.website} />
      <input type="hidden" name="country" value={v.country} />
      <input type="hidden" name="industry" value={v.industry} />
      <input type="hidden" name="companySize" value={v.companySize} />
    </form>
  );
}

export default ProfileForm;
