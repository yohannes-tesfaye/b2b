import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import type { Messages } from "@/i18n/request";

// Set by the next-intl proxy on every matched request (including Server Action
// POSTs). Kept in sync with `HEADER_LOCALE_NAME` from next-intl.
const LOCALE_HEADER = "x-next-intl-locale";

function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && hasLocale(routing.locales, value);
}

async function localeFromHeader(): Promise<Locale | undefined> {
  try {
    const value = (await headers()).get(LOCALE_HEADER);
    return isValidLocale(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolve the active locale inside a Server Action.
 *
 * Server Actions can't use `next/root-params`, so the locale is taken from the
 * submitted form first (see `LocaleField`), then from the next-intl request
 * header, and finally falls back to the default locale.
 */
export async function resolveActionLocale(
  formData?: FormData
): Promise<Locale> {
  const fromForm = formData?.get("locale");
  if (isValidLocale(fromForm)) {
    return fromForm;
  }

  const fromHeader = await localeFromHeader();
  if (fromHeader) {
    return fromHeader;
  }

  return routing.defaultLocale;
}

/**
 * Locale-aware translator for Server Actions.
 *
 * Passing an explicit locale to `getTranslations` avoids next-intl's request
 * context (and `next/root-params`), which is unavailable inside Server Actions.
 *
 * @example
 * const { locale, t } = await getActionI18n(formData, "auth");
 * if (!value) return { error: t("someError") };
 * return redirect({ href: "/", locale });
 */
export async function getActionI18n(
  formData: FormData,
  namespace: keyof Messages
) {
  const locale = await resolveActionLocale(formData);
  const t = await getTranslations({ locale, namespace });
  return { locale, t };
}
