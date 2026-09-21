"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { FieldSet, FieldSeparator } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import { logIn } from "@/utils/auth/log-in-action";

function LogInForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState(logIn, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t("logIn")}</h1>
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
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
        {t("logIn")}
      </Button>
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