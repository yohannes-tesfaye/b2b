"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError, FieldSeparator } from "../ui/field";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import LocaleField from "../i18n/LocaleField";
import { logIn } from "@/utils/auth/log-in-action";

function LogInForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState(logIn, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <LocaleField />
      <h1 className="text-2xl font-semibold">{t("logIn")}</h1>
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
      <Field className="gap-2">
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <FieldContent>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("passwordPlaceholder")}
            autoComplete="current-password"
            required
          />
        </FieldContent>
      </Field>
      <FieldError
        errors={
          state.error ? [{ message: state.error }] : undefined
        }
      />
      <FieldSeparator>{t("orContinueWith")}</FieldSeparator>
      <OAuthButtons />
      <Button type="submit" className="w-full">{t("logIn")}</Button>
      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          {t("signUpLink")}
        </Link>
      </p>
    </form>
  );
}

export default LogInForm;
