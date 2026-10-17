"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import LocaleField from "../i18n/LocaleField";
import { resetPassword } from "@/utils/auth/reset-password-action";

function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState(resetPassword, { error: null });

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{t("resetPasswordTitle")}</h1>
        <FieldError errors={[{ message: t("invalidTokenError") }]} />
        <Link
          href="/forgot-password"
          className="text-center text-sm font-medium text-primary hover:underline"
        >
          {t("sendResetLink")}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <LocaleField />
      <input type="hidden" name="token" value={token} />
      <h1 className="text-2xl font-semibold">{t("resetPasswordTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("resetPasswordSubtitle")}</p>
      <Field className="gap-2">
        <FieldLabel htmlFor="password">{t("newPassword")}</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("newPasswordPlaceholder")}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </FieldContent>
      </Field>
      <Field className="gap-2">
        <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </FieldContent>
      </Field>
      <FieldError errors={state.error ? [{ message: state.error }] : undefined} />
      <Button type="submit" className="w-full">
        {t("resetPassword")}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/log-in" className="font-medium text-primary hover:underline">
          {t("backToLogIn")}
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordForm;
