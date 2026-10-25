# Plan: Dashboard header/sidebar rework + User management route

## Goal
Rework the `/dashboard` header/sidebar for admin UX, add a breadcrumb under the header, show the logged-in user at the sidebar bottom, and add a `User` section (list + dynamic detail) with view/ban/delete, backed by real (seeded) database users.

## Constraints
- Plan mode only: no source edits or mutating commands in this turn.
- No new chart dependency (use cards/badges/progress bars; charts optional later).
- Keep locale-safe links (relative hrefs within `(dashboard)` group).
- Admin actions (ban/delete) gated to `admin`/`superadmin` via `better-auth` access control.
- Dummy users must come from a clean idempotent Prisma seed, not hardcoded arrays.

## Affected files (boundaries)
- `app\[locale]\(main)\(dashboard)\layout.tsx` — shell (sidebar + header + breadcrumb outlet)
- `app\[locale]\(main)\(dashboard)\dashboard\page.tsx` — dashboard content only
- `app\[locale]\(main)\(dashboard)\users\page.tsx` — users list (NEW)
- `app\[locale]\(main)\(dashboard)\users\[id]\page.tsx` — user detail (NEW)
- `app\[locale]\(main)\(dashboard)\users\actions.ts` — ban/delete Server Actions (NEW)
- `components\dashboard\sidebar-footer.tsx` — logged-in user footer (NEW)
- `components\dashboard\user-list.tsx` — users list table/cards (NEW)
- `components\dashboard\user-card.tsx` — user detail card (NEW)
- `components\dashboard\breadcrumbs.tsx` — route breadcrumb (NEW)
- `prisma\seed.ts` — idempotent dummy users (NEW)
- `package.json` — add `seed` script

## Design decisions
1. **Shell in layout**: Move `SidebarProvider`/`Sidebar`/`SidebarInset` header out of `dashboard/page.tsx` into `(dashboard)\layout.tsx` so all dashboard routes share one sidebar/header/breadcrumb. Pages render route content only.
2. **Header**: `SidebarTrigger` stays leftmost but as a visible icon button with aria-label + tooltip; page title center; right side = search (keep), Quick Create, user avatar. Breadcrumb rendered immediately under the header.
3. **Sidebar bottom**: `SidebarFooter` shows logged-in user (avatar, name, email, role badge). Fetched server-side in layout via `auth.api.getSession`.
4. **User tab**: New `USERS` group in sidebar linking to `/users` (relative). List page shows users in card/table style with role + banned badges.
5. **User detail**: `/users/[id]` shows full user card (all fields, avatar/initials, role, banned status, ban reason, createdAt, profile-completion progress). Actions: Ban/Unban toggle, Delete (confirmation dialog via `alert-dialog`). Admin-only.
6. **Authz**: Server actions read session via `auth.api.getSession({headers})`; if `session.user.role` not in `adminRoles` → 403. Detail page server-side redirects non-admins.
7. **Seed data**: `prisma/seed.ts` creates ~8 users (buyer/supplier/admin mix, 1–2 banned) idempotently by email. `npm run seed` via new `seed` script. Users list/detail read from `prisma` client (`lib/prisma.ts`).
8. **Charts**: None for v1; use `Badge`, `Progress`, status chips. Documented as optional.

## Failure modes / rollout
- If seed not run, `/users` shows empty state ("No users"). Not an error.
- Non-admin accessing `/users` → redirected to `/dashboard`.
- Ban self-protection: server action prevents banning/deleting your own id.
- Rollback: remove new route files + revert `layout.tsx`; seed data can be left (idempotent) or cleaned via DB.

## Validation plan
- `npx tsc --noEmit` passes.
- `npm run lint` — no new errors introduced (pre-existing `use-mobile.ts` error remains).
- `npm run seed` creates users; `/users` lists them; `/users/[id]` renders detail; Ban/Delete Server Actions return 403 for non-admin (verify by role).
- Breadcrumb shows `Dashboard > Users` / `Dashboard > Users > <name>`.
- Sidebar footer shows logged-in user name/email/role.

## Progress tracker (implementation)
- [ ] Refactor shell into `(dashboard)\layout.tsx` + breadcrumb bar
- [ ] Add `SidebarFooter` with logged-in user to dashboard sidebar
- [ ] Add `USERS` tab + relative links to sidebar
- [ ] Create `prisma/seed.ts` + `seed` script; seed dummy users
- [ ] Create `users\page.tsx` list + `user-list.tsx`
- [ ] Create `users\actions.ts` ban/delete (admin-gated)
- [ ] Create `users\[id]\page.tsx` detail + `user-card.tsx`
- [ ] Review new code for mistakes/improvements; run tsc + lint

## Open questions (none blocking)
- None. If product wants charts later, add `recharts` separately.
