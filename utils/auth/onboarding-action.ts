"use server";

import { redirect } from "@/i18n/navigation";
import { getActionI18n } from "@/utils/i18n/action";

export async function finishOnboarding(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const { locale, t } = await getActionI18n(formData, "auth");

  const roles = formData.getAll("roles").map(String).filter(Boolean);
  const companyName = String(formData.get("companyName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const companySize = String(formData.get("companySize") ?? "").trim();

  if (!roles.length || !companyName || !phone || !country || !industry) {
    return { error: t("onboardingError") };
  }

  // TODO: save the user's onboarding details
  // (roles, companyName, phone, website, country, industry, companySize)
  void website;
  void companySize;

  return redirect({ href: "/", locale });
}
