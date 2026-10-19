"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LocaleField from "@/components/i18n/LocaleField";
import { changePassword } from "@/utils/auth/password-action";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import {
  changePasswordSchema,
  initialFormState,
  zodIssuesToFieldErrors,
  type Translate,
} from "@/lib/validation/auth";

function PasswordForm() {
  const t = useTranslations("auth");
  const translate = t as unknown as Translate;

  const [v, setV] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialFormState
  );
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useActionFeedback(state);

  const errors = { ...state.fieldErrors, ...clientErrors };
  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const update =
    (key: keyof typeof v) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setV((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = changePasswordSchema.safeParse(v);
    if (!parsed.success) {
      event.preventDefault();
      const fieldErrors = zodIssuesToFieldErrors(parsed.error, translate);
      setClientErrors(fieldErrors);
      toast.error(translate("validation.formError"));
      return;
    }
    setClientErrors({});
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <Field className="gap-2" data-invalid={Boolean(errors.currentPassword)}>
        <FieldLabel htmlFor="currentPassword">
          {t("profile.currentPassword")}
        </FieldLabel>
        <FieldContent>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={v.currentPassword}
            onChange={update("currentPassword")}
            aria-invalid={Boolean(errors.currentPassword)}
          />
          <FieldError errors={fieldError("currentPassword")} />
        </FieldContent>
      </Field>

      <Field className="gap-2" data-invalid={Boolean(errors.password)}>
        <FieldLabel htmlFor="password">{t("newPassword")}</FieldLabel>
        <FieldContent>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={t("newPasswordPlaceholder")}
            value={v.password}
            onChange={update("password")}
            aria-invalid={Boolean(errors.password)}
          />
          <FieldError errors={fieldError("password")} />
        </FieldContent>
      </Field>

      <Field className="gap-2" data-invalid={Boolean(errors.confirmPassword)}>
        <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
        <FieldContent>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder={t("confirmPasswordPlaceholder")}
            value={v.confirmPassword}
            onChange={update("confirmPassword")}
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          <FieldError errors={fieldError("confirmPassword")} />
        </FieldContent>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={revokeOtherSessions}
          onChange={(event) => setRevokeOtherSessions(event.target.checked)}
          className="size-4 rounded border-input"
        />
        {t("profile.revokeOtherSessions")}
      </label>

      <input
        type="hidden"
        name="revokeOtherSessions"
        value={revokeOtherSessions ? "true" : "false"}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {t("profile.updatePassword")}
        </Button>
      </div>

      <LocaleField />
    </form>
  );
}

export default PasswordForm;
