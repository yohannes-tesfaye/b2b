"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";
import {
  forgotPasswordSchema,
  zodIssuesToFieldErrors,
  type FormState,
  type Translate,
} from "@/lib/validation/auth";

export async function forgotPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { locale, t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = forgotPasswordSchema.safeParse({
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: translate("validation.formError"),
      fieldErrors: zodIssuesToFieldErrors(parsed.error, translate),
    };
  }

  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: `${baseUrl}/${locale}/reset-password`,
      },
      headers: await headers(),
    });
  } catch {
    // Swallow errors so we never reveal whether an account exists.
  }

  return { status: "success", message: translate("resetLinkSent") };
}
