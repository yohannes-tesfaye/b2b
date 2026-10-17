"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import LocaleField from "../i18n/LocaleField";
import { forgotPassword } from "@/utils/auth/forgot-password-action";

function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState(forgotPassword, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <LocaleField />
      <h1 className="text-2xl font-semibold">{t("forgotPasswordTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("forgotPasswordSubtitle")}</p>
      <Field className="gap-2">
        <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
        <FieldContent>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            required
          />
        </FieldContent>
      </Field>
      {state.success ? (
        <p role="status" className="text-sm text-muted-foreground">
          {t("resetLinkSent")}
        </p>
      ) : null}
      <FieldError errors={state.error ? [{ message: state.error }] : undefined} />
      <Button type="submit" className="w-full">
        {t("sendResetLink")}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/log-in" className="font-medium text-primary hover:underline">
          {t("backToLogIn")}
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
