"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";

export async function resetPassword(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const { locale, t } = await getActionI18n(formData, "auth");

  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: t("invalidTokenError") };
  }

  if (password.length < 8) {
    return { error: t("passwordTooShort") };
  }

  if (password !== confirmPassword) {
    return { error: t("passwordMismatch") };
  }

  try {
    await auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: t("resetPasswordError") };
  }

  return redirect({ href: "/log-in", locale });
}
