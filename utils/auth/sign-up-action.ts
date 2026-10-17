"use server";

import { redirect } from "@/i18n/navigation";
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

  // TODO: real account creation
  return redirect({ href: "/onboarding", locale });
}
