"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError, FieldSeparator } from "../ui/field";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import LocaleField from "../i18n/LocaleField";
import { signUp } from "@/utils/auth/sign-up-action";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import {
  initialFormState,
  signUpSchema,
  zodIssuesToFieldErrors,
  type Translate,
} from "@/lib/validation/auth";

function SignUpForm() {
  const t = useTranslations("auth");
  const translate = t as unknown as Translate;
  const [state, formAction] = useActionState(signUp, initialFormState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useActionFeedback(state);

  const errors = { ...state.fieldErrors, ...clientErrors };
  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const parsed = signUpSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
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
      <h1 className="text-2xl font-semibold">{t("signUp")}</h1>
      <Field className="gap-2" data-invalid={Boolean(errors.name)}>
        <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
        <FieldContent>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder={t("namePlaceholder")}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            required
          />
          <FieldError errors={fieldError("name")} />
        </FieldContent>
      </Field>
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
      <Field className="gap-2" data-invalid={Boolean(errors.password)}>
        <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("createPasswordPlaceholder")}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            required
          />
          <FieldError errors={fieldError("password")} />
        </FieldContent>
      </Field>
      <FieldSeparator>{t("orContinueWith")}</FieldSeparator>
      <OAuthButtons />
      <Button type="submit" className="w-full">{t("signUp")}</Button>
      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}
        <Link href="/log-in" className="font-medium text-primary hover:underline">
          {t("logInLink")}
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
