import { APIError } from "better-auth";

/**
 * Better Auth error codes → `auth.*` i18n keys.
 * Codes we do not map fall back to Better Auth's own message.
 */
const AUTH_ERROR_KEYS: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "errors.invalidCredentials",
  USER_ALREADY_EXISTS: "errors.userExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "errors.userExists",
  INVALID_EMAIL: "errors.invalidEmail",
  PASSWORD_TOO_SHORT: "errors.passwordTooShort",
  PASSWORD_TOO_LONG: "errors.passwordTooLong",
  INVALID_TOKEN: "errors.invalidToken",
  TOKEN_EXPIRED: "errors.tokenExpired",
  SESSION_EXPIRED: "errors.sessionExpired",
};

function errorCode(error: APIError): string {
  const body = error.body as { code?: unknown } | undefined;
  return body && typeof body.code === "string" ? body.code : "";
}

/**
 * Turn an error thrown by `auth.api.*` into a translated, user-facing message.
 * Better Auth supplies the message; known codes get a localized override.
 */
export function resolveAuthErrorMessage(
  error: unknown,
  t: (key: string) => string
): string {
  if (error instanceof APIError) {
    const key = AUTH_ERROR_KEYS[errorCode(error)];
    if (key) return t(key);
    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return t("errors.generic");
}
