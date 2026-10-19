"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import LocaleField from "../i18n/LocaleField";
import { resetPassword } from "@/utils/auth/reset-password-action";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import {
  initialFormState,
  resetPasswordSchema,
  zodIssuesToFieldErrors,
  type Translate,
} from "@/lib/validation/auth";

function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const translate = t as unknown as Translate;
  const [state, formAction] = useActionState(resetPassword, initialFormState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useActionFeedback(state);

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

  const errors = { ...state.fieldErrors, ...clientErrors };
  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      token: String(data.get("token") ?? ""),
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(zodIssuesToFieldErrors(parsed.error, translate));
      toast.error(translate("validation.formError"));
      return;
    }

    setClientErrors({});
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <LocaleField />
      <input type="hidden" name="token" value={token} />
      <h1 className="text-2xl font-semibold">{t("resetPasswordTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("resetPasswordSubtitle")}</p>
      <Field className="gap-2" data-invalid={Boolean(errors.password)}>
        <FieldLabel htmlFor="password">{t("newPassword")}</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("newPasswordPlaceholder")}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            required
          />
          <FieldError errors={fieldError("password")} />
        </FieldContent>
      </Field>
      <Field className="gap-2" data-invalid={Boolean(errors.confirmPassword)}>
        <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            required
          />
          <FieldError errors={fieldError("confirmPassword")} />
        </FieldContent>
      </Field>
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

