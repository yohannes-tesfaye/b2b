"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { FieldSet, FieldSeparator } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import { signUp } from "@/utils/auth/sign-up-action";

function SignUpForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState(signUp, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t("signUp")}</h1>
      <FieldSet className="gap-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          required
        />
      </FieldSet>
      <FieldSet className="gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
        />
      </FieldSet>
      <FieldSet className="gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder={t("createPasswordPlaceholder")}
          autoComplete="new-password"
          required
        />
      </FieldSet>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <FieldSeparator>{t("orContinueWith")}</FieldSeparator>
      <OAuthButtons />
      <Button type="submit" className="w-full">
        {t("signUp")}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}
        <Link
          href="/log-in"
          className="font-medium text-primary hover:underline"
        >
          {t("logInLink")}
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
