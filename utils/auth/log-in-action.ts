"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActionI18n } from "@/utils/i18n/action";
import { resolveAuthErrorMessage } from "@/utils/auth/errors";
import { dashboardLandingPath } from "@/lib/dashboard-paths";
import { safeInternalPath } from "@/lib/safe-redirect";
import {
  logInSchema,
  zodIssuesToFieldErrors,
  type FormState,
  type Translate,
} from "@/lib/validation/auth";

export async function logIn(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = logInSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: translate("validation.formError"),
      fieldErrors: zodIssuesToFieldErrors(parsed.error, translate),
    };
  }

  let redirectTo = "/";

  // Pages that need the user signed in (e.g. "Message supplier" on a listing)
  // pass an internal `next` path so the user returns where they came from.
  const next = safeInternalPath(formData.get("next"));

  try {
    const result = await auth.api.signInEmail({
      body: parsed.data,
      headers: await headers(),
    });

    redirectTo =
      next ??
      dashboardLandingPath({
        id: result.user.id,
        role: (result.user as { role?: string | null }).role ?? null,
      });
  } catch (error) {
    return { status: "error", message: resolveAuthErrorMessage(error, translate) };
  }

  return {
    status: "success",
    message: translate("logInSuccess"),
    redirectTo,
  };
}
