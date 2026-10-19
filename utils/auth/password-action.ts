"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";
import { resolveAuthErrorMessage } from "@/utils/auth/errors";
import {
  changePasswordSchema,
  zodIssuesToFieldErrors,
  type FormState,
  type Translate,
} from "@/lib/validation/auth";

export async function changePassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = changePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: translate("validation.formError"),
      fieldErrors: zodIssuesToFieldErrors(parsed.error, translate),
    };
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      status: "error",
      message: translate("errors.sessionExpired"),
      redirectTo: "/log-in",
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        newPassword: parsed.data.password,
        currentPassword: parsed.data.currentPassword,
        revokeOtherSessions: formData.get("revokeOtherSessions") === "true",
      },
      headers: await headers(),
    });
  } catch (error) {
    return { status: "error", message: resolveAuthErrorMessage(error, translate) };
  }

  return {
    status: "success",
    message: translate("profile.passwordUpdated"),
  };
}
