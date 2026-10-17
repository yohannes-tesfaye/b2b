"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";

type ForgotPasswordState = { error: string | null; success: boolean };

export async function forgotPassword(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const { locale, t } = await getActionI18n(formData, "auth");

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: t("forgotPasswordError"), success: false };
  }

  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${baseUrl}/${locale}/reset-password`,
      },
      headers: await headers(),
    });
  } catch {
    // Swallow errors so we never reveal whether an account exists.
  }

  return { error: null, success: true };
}
