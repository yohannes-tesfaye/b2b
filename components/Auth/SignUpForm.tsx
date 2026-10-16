"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldContent, FieldError, FieldSeparator } from "../ui/field";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import LocaleField from "../i18n/LocaleField";
import { signUp } from "@/utils/auth/sign-up-action";

function SignUpForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState(signUp, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <LocaleField />
      <h1 className="text-2xl font-semibold">{t("signUp")}</h1>
      <Field className="gap-2">
        <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
        <FieldContent>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder={t("namePlaceholder")}
            autoComplete="name"
            required
          />
        </FieldContent>
      </Field>
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
        <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder={t("createPasswordPlaceholder")}
            autoComplete="new-password"
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
