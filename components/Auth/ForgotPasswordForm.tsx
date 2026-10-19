"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import LocaleField from "../i18n/LocaleField";
import { forgotPassword } from "@/utils/auth/forgot-password-action";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import {
  forgotPasswordSchema,
  initialFormState,
  zodIssuesToFieldErrors,
  type Translate,
} from "@/lib/validation/auth";

function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const translate = t as unknown as Translate;
  const [state, formAction] = useActionState(forgotPassword, initialFormState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useActionFeedback(state);

  const errors = { ...state.fieldErrors, ...clientErrors };
  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const parsed = forgotPasswordSchema.safeParse({
      email: String(data.get("email") ?? ""),
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
      <h1 className="text-2xl font-semibold">{t("forgotPasswordTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("forgotPasswordSubtitle")}</p>
      <Field className="gap-2" data-invalid={Boolean(errors.email)}>
        <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
        <FieldContent>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            required
          />
          <FieldError errors={fieldError("email")} />
        </FieldContent>
      </Field>
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
