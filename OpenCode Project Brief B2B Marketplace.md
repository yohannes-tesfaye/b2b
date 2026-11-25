# OpenCode Project Brief: B2B Marketplace

Save this file in the repo root as `PROJECT_BRIEF.md` (and keep a short `AGENTS.md` pointing to it). Read it fully at the start of every session, then work only on the task I give you.

## 1. What we are building

A B2B marketplace for Ethiopia (currency ETB) that connects manufacturers with raw-material suppliers. Members post two kinds of listings:

- **Wanted goods**: a buyer posts requirements (material, quantity, quality, delivery timeline, preferred region, budget range).
- **Available goods**: a supplier posts goods for sale (description, specs, quantity, price, delivery options).

One person can be a buyer, a supplier, or both. Buyers and suppliers share ONE dashboard. Clear labeling shows who posted what.

Team: two developers. Founder/client: Mikiyas Yakob. Delivery is in three milestones: MVP foundation, core marketplace (features, administration, listing management), and launch.

## 2. Tech stack (from the audit)

Next.js 16 App Router, React 19, Tailwind v4, shadcn/base-ui, Better Auth, Prisma 7 with the pg adapter on PostgreSQL, next-intl (English and Amharic), Zod 4, sonner, lucide. No form library: native FormData with `useActionState`. Working branch: `post-listing`.

## 3. Hard rules

1. Additive only. Do not break existing routes, auth, models, or data. Prisma changes are additive migrations only: no drops, no renames, no touching legacy columns (`category`, `quantity`, `price`, `images`, `description`, `location`, `durationDays`), which are dual-written for the admin screens.
2. Prisma 7 does not run `prisma generate` after `migrate dev`. Run `npx prisma generate` yourself after any schema change, and restart the dev server.
3. All user-facing strings go through next-intl in BOTH `en` and `am` message files. Give best-effort Amharic and list new keys in your report.
4. Small steps. One task per session. Separate commit per step. Never push.
5. Token discipline: do not read `node_modules`, `.next`, lockfiles, or generated files. Do not paste code back in reports. Keep reports short.
6. If something does not match this brief, ask me. Do not improvise.
7. The `requireAdmin()` role check is currently commented out in places. Do not change it unless the task says so.

## 4. Current state

Done and committed on `post-listing`:

- Prisma: `Listing`, `Category`, `ListingImage`, `ListingStatusHistory`, migration `20261113000000_add_marketplace_listing_fields`, index migration `20261113010000_add_listing_category_id_index`, and an idempotent seed of 9 categories in `prisma/seed-categories.ts`.
- Validation: `features/listings/schemas.ts` with 27 tests. An older `lib/validation/listing.ts` also exists, so watch for duplication.
- Listing UI: owner pages and the public detail page `/listings/[slug]`.
- Partly done: homepage and dashboard wiring. Queries exist in `features/listings/queries.ts` but pages are not wired.
- Not started: global polish (font, spacing, overflow, light footer, B2B placeholders, `TruncatedText`).

Known bugs to fix:

- `/en/listings` returned 500 "Unknown argument `publishedAt`" in `getPublicListings`. Probably a stale Prisma client: run `npx prisma generate` first.
- Choosing Available or Wanted on the new-listing form and clicking Publish says "select a listing type". Check that the switch submits a real form field and that the value case matches the schema (`available` vs `AVAILABLE`).

## 5. Dashboard decision (most important)

There are currently two dashboard trees and it is messy:

- `app/[locale]/(main)/(dashboard)/dashboard/` gated by `requireAdmin()`, rendered by `components/dashboard/dashboard-shell.tsx` (the sidebar). It holds admin moderation: `/dashboard/created`, `/dashboard/listing`, `/dashboard/user`.
- `app/[locale]/(main)/(user-facing)/[userId]/dashboard/` with `requireOwnDashboard` and `DashboardNav` (no sidebar). It holds user listings, new, edit, and profile.

**Decision:** one dashboard for everyone. Any signed-in user lands on `/en/dashboard` with the sidebar. Listings (list, new, edit) and profile live inside it: `/en/dashboard/listings`, `/en/dashboard/listings/new`, `/en/dashboard/listings/[id]`, `/en/dashboard/listings/[id]/edit`, `/en/dashboard/profile`. No `userId` in any URL: the user comes from the session, and every listing mutation must verify the signed-in user owns the listing. Admin moderation moves to a separate gated section at `/en/admin` (the existing `/dashboard/listing` moderation page clashes with the new plural `/dashboard/listings`). The `[userId]/dashboard` tree is deleted after everything is moved. Update links in `components/shared/Header.tsx`, `features/listings/actions.ts`, `features/listings/constants.ts` (`ownerListingsPath`), and `lib/dashboard-paths.ts`.
