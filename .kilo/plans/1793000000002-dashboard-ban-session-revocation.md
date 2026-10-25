# Plan: Make admin ban immediately effective + banned-user gating

## Goal
When an admin bans a user, immediately invalidate that user's existing session (not just flip a DB flag) and prevent banned users from using the app on subsequent requests. Unban restores access. Keep delete cascading sessions (already handled by schema `onDelete: Cascade`).

## Context / gap
- `app/[locale]/(main)/(dashboard)/users/actions.ts` `banUser`/`unbanUser` only set `User.banned`/`banReason` in Prisma; they never delete `Session` rows.
- Better Auth admin plugin's session-create hook blocks **new** sessions when `user.banned` (throws `BANNED_USER`) and auto-unbans if `banExpires` passed, but it does **not** revoke existing sessions on ban.
- `(main)/layout.tsx` and `(dashboard)/layout.tsx` read the session but never check `banned`, so a banned user with a live cookie stays usable until the session expires naturally.

## Affected files
1. `app/[locale]/(main)/(dashboard)/users/actions.ts` — `banUser`: after `prisma.user.update({ banned: true, ... })`, add `await prisma.session.deleteMany({ where: { userId } })`. Wrap user update + session delete in `$transaction` for atomicity.
2. `app/[locale]/(main)/layout.tsx` — if `session && session.user.banned`, redirect to sign-in with `?banned=1`; skip when the current path is already sign-in (avoid redirect loop).
3. `app/[locale]/(main)/(dashboard)/layout.tsx` — same banned guard (defense in depth).
4. `prisma/schema.prisma` — no change (`Session` model exists; user delete already cascades).

## Data flow
- Admin bans user → action sets `banned=true` + reason + deletes all the user's sessions → existing session cookie invalid on next request → user signed out.
- Banned user attempts sign-in → Better Auth session-create hook throws `BANNED_USER` → cannot create a session.
- Admin unbans → flag cleared → sign-in works again.
- Admin deletes user → `User` delete cascades to `Session` (schema), no action needed.

## Failure modes / rollout
- If session delete fails, action throws 500 and ban is not applied (transaction prevents partial state).
- Redirect loop avoided by excluding the sign-in path from the banned guard.
- Rollback: remove session delete + layout checks; DB flag changes are idempotent/reversible via unban.

## Validation plan
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass.
- Ban a seeded user → next dashboard request signs them out; sign-in attempt is rejected; non-banned users unaffected; unban restores access.

## Out of scope for this plan (optional follow-ups)
- Sign-in page banner when `?banned=1`; dedicated banned page; ban-expiry UI; per-user session list/revoke via Better Auth `/list-sessions` / `/revoke-session`.

## Other Better Auth user-related features worth considering (no decision needed now)
- **Session management** — Better Auth exposes `/list-sessions` and `/revoke-session`; useful to let users/admins view and kill active sessions per device.
- **Two-factor authentication** — `twoFactor` plugin: TOTP authenticator, OTP via email/SMS, backup codes, trusted devices.
- **Email verification** — `emailAndPassword.sendVerificationEmail` + `emailVerified` flow (seed currently forces `emailVerified: true`).
- **Organization plugin** — multi-tenant orgs, members, invitations, custom roles/permissions (B2B fit).
- **Social providers** — Google/Facebook/TikTok already wired in `auth.ts` but keys are empty in `.env`.
- **Passkeys / WebAuthn** — passwordless auth.
- **Impersonation** — admin impersonates a user for support (admin plugin).

## Next step
Switch to an implementation-capable agent to apply the source edits above, then run tsc/lint/build and verify ban/unban end-to-end.
