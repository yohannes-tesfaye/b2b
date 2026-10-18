"use client";

import { useLocale } from "next-intl";

/**
 * Hidden input that carries the active locale into a Server Action.
 *
 * Server Actions run outside the `[locale]` route context, so next-intl there
 * cannot resolve the locale via `next/root-params` (it throws). Dropping this
 * field inside any `<form>` lets the action read a valid locale from the
 * submitted FormData — use it together with `getActionI18n` from
 * `@/utils/i18n/action`.
 */
function LocaleField() {
  const locale = useLocale();
  return <input type="hidden" name="locale" value={locale} />;
}

export default LocaleField;
