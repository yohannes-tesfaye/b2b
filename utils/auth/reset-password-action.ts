"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";
import { resolveAuthErrorMessage } from "@/utils/auth/errors";
import {
  resetPasswordSchema,
  zodIssuesToFieldErrors,
  type FormState,
  type Translate,
} from "@/lib/validation/auth";

export async function resetPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = resetPasswordSchema.safeParse({
    token: String(formData.get("token") ?? ""),
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

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: parsed.data.password,
        token: parsed.data.token,
      },
      headers: await headers(),
    });
  } catch (error) {
    return { status: "error", message: resolveAuthErrorMessage(error, translate) };
  }

  return {
    status: "success",
    message: translate("resetPasswordSuccess"),
    redirectTo: "/log-in",
  };
}
