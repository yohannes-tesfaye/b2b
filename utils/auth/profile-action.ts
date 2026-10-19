"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActionI18n } from "@/utils/i18n/action";
import { resolveAuthErrorMessage } from "@/utils/auth/errors";
import {
  deleteAccountSchema,
  profileSchema,
  zodIssuesToFieldErrors,
  type FormState,
  type Translate,
} from "@/lib/validation/auth";

const MAX_AVATAR_BYTES = 600_000;

function isAllowedAvatar(value: string): boolean {
  return (
    /^data:image\/(png|jpe?g|webp);base64,/.test(value) ||
    /^https?:\/\//.test(value)
  );
}

export async function updateProfile(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
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

  try {
    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: await headers(),
    });
  } catch (error) {
    return { status: "error", message: resolveAuthErrorMessage(error, translate) };
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
    message: translate("profile.profileUpdated"),
  };
}

export async function uploadAvatar(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const image = String(formData.get("image") ?? "");

  if (!image) {
    return {
      status: "error",
      message: translate("profile.avatarRequired"),
    };
  }

  if (!isAllowedAvatar(image)) {
    return {
      status: "error",
      message: translate("profile.avatarInvalid"),
    };
  }

  if (image.length > MAX_AVATAR_BYTES) {
    return {
      status: "error",
      message: translate("profile.avatarTooLarge"),
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

  try {
    await auth.api.updateUser({
      body: { image },
      headers: await headers(),
    });
  } catch (error) {
    return { status: "error", message: resolveAuthErrorMessage(error, translate) };
  }

  return {
    status: "success",
    message: translate("profile.avatarUpdated"),
  };
}

export async function deleteAccount(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { t } = await getActionI18n(formData, "auth");
  const translate = t as unknown as Translate;

  const parsed = deleteAccountSchema.safeParse({
    confirmation: String(formData.get("confirmation") ?? ""),
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

  if (
    parsed.data.confirmation.toLowerCase() !== session.user.email.toLowerCase()
  ) {
    return {
      status: "error",
      message: translate("validation.formError"),
      fieldErrors: {
        confirmation: translate("profile.deleteConfirmMismatch"),
      },
    };
  }

  try {
    await auth.api.deleteUser({
      body: {},
      headers: await headers(),
    });
  } catch (error) {
    return { status: "error", message: resolveAuthErrorMessage(error, translate) };
  }

  return {
    status: "success",
    message: translate("profile.accountDeleted"),
    redirectTo: "/",
  };
}
