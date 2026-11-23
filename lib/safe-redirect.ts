import { routing } from "@/i18n/routing";

const LOCALE_PREFIX = new RegExp(
  `^/(?:${routing.locales.join("|")})(?=/|$)`,
  "i"
);

/**
 * Normalises a user-supplied `next` value into a safe, locale-less path.
 *
 * Returns `undefined` for anything that is not a same-origin absolute path, so
 * a crafted link can never redirect the user off-site. A `/en/...` or `/am/...`
 * prefix is stripped because `next-intl`'s router adds the active locale itself
 * (otherwise `/en/en/products` would be produced).
 *
 * Server actions can receive arbitrary form data, so callers must always pass
 * the raw value through this helper before using it as a redirect target.
 */
export function safeInternalPath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return undefined;
  // Protocol-relative (`//evil.com`) and backslash tricks (`/\evil.com`).
  if (trimmed.startsWith("//") || trimmed.includes("\\")) return undefined;
  // Reject control characters and whitespace that browsers trim differently.
  if (/[\u0000-\u001f\u007f]/.test(trimmed) || /\s/.test(trimmed)) return undefined;

  const stripped = trimmed.replace(LOCALE_PREFIX, "");
  return stripped === "" ? "/" : stripped;
}
