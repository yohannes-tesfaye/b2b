"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";

export async function signUp(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const { locale, t } = await getActionI18n(formData, "auth");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: t("signUpError") };
  }

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: t("signUpError") };
  }

  return redirect({ href: "/onboarding", locale });
}
