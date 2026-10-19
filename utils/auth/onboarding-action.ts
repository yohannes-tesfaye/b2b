"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActionI18n } from "@/utils/i18n/action";
import {
  onboardingSchema,
  zodIssuesToFieldErrors,
  type FormState,
  type Translate,
} from "@/lib/validation/auth";

export async function finishOnboarding(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = onboardingSchema.safeParse({
    roles: formData.getAll("roles").map(String).filter(Boolean),
    companyName: String(formData.get("companyName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    website: String(formData.get("website") ?? "").trim(),
    country: String(formData.get("country") ?? ""),
    industry: String(formData.get("industry") ?? ""),
    companySize: String(formData.get("companySize") ?? ""),
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

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: parsed.data.roles.join(","),
      companyName: parsed.data.companyName,
      phone: parsed.data.phone,
      website: parsed.data.website || null,
      country: parsed.data.country,
      industry: parsed.data.industry,
      companySize: parsed.data.companySize || null,
    },
  });

  return {
    status: "success",
    message: translate("onboardingSuccess"),
    redirectTo: "/",
  };
}
