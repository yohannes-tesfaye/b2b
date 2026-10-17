"use server";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect({ href: "/log-in", locale });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: roles.join(","),
      companyName,
      phone,
      website: website || null,
      country,
      industry,
      companySize: companySize || null,
    },
  });

  return redirect({ href: "/", locale });
}
