"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";

export async function logIn(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const { locale, t } = await getActionI18n(formData, "auth");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: t("logInError") };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: t("logInError") };
  }

  return redirect({ href: "/", locale });
}
