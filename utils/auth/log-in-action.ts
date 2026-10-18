"use server";

import { redirect } from "@/i18n/navigation";
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

  // TODO: real authentication
  return redirect({ href: "/", locale });
}
