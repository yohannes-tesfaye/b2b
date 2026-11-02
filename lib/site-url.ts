const DEFAULT_DEV_URL = "http://localhost:3000";

/** Ensures the value has a scheme (defaults to https) and no trailing slash. */
function withScheme(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  return /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Resolves the publicly reachable URL of this app.
 *
 * Resolution order (first match wins):
 *   1. `NEXT_PUBLIC_SITE_URL`        – canonical URL, set per environment
 *   2. `NEXT_PUBLIC_BETTER_AUTH_URL` – Better Auth's native public env var
 *   3. `NEXT_PUBLIC_VERCEL_URL`      – auto-injected by Vercel (incl. previews)
 *   4. `VERCEL_URL`                  – Vercel deployment domain (server only)
 *   5. `http://localhost:3000`       – local development fallback
 *
 * `NEXT_PUBLIC_*` variables are inlined at build time, so the value compiled
 * into the client bundle always matches the environment the app was built
 * for. Explicitly passing the result to Better Auth's `baseURL` also makes
 * it take precedence over a stale `BETTER_AUTH_URL` in the environment.
 */
export function getSiteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_DEV_URL;
  return withScheme(candidate);
}

/** Origin (scheme + host) of the site URL, e.g. for trusted origins. */
export function getSiteOrigin(): string {
  return new URL(getSiteUrl()).origin;
}