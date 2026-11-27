# Branch `contact` — Inquiries/messaging + Search & taxonomy

Plan of record. Branch created from `main` (`git checkout -b contact`).

Two features:

1. **Inquiry / messaging system** — real, stored conversations with an inbox for sellers
   (replacing the `mailto:` form and the phantom `Listing.inquiries` counter).
2. **Search + category/industry taxonomy** — Postgres trigram search over listings and
   DB-backed Category / Industry / Tag tables instead of hardcoded lists.

---

## 1. What the codebase looks like today (grounded facts)

| Area | Current state | Consequence |
| --- | --- | --- |
| Contact | `components/product/product-contact.tsx` builds a `mailto:` link with name/email/body | Nothing is stored; no inbox, no reply, no tracking |
| Counter | `Listing.inquiries` is an `Int` never incremented anywhere | Listing page shows "0 inquiries" for everything |
| Seller side | User dashboard has Overview / Listings / New / Profile only (`components/dashboard/dashboard-nav.tsx`) | Sellers have nowhere to receive messages |
| Auth | `lib/current-user.ts` (`cache`d), `requireOwnDashboard()` guards `/[userId]/dashboard` | Clear place to gate messaging and scope inbox |
| Login | `utils/auth/log-in-action.ts` always redirects to `dashboardLandingPath()` | No `?next=` support → must add, so "Message supplier" → login → back |
| Actions | `"use server"` in `utils/<domain>/actions.ts`, return `{status,message,fieldErrors,redirectTo}` | Follow this shape for inquiry actions |
| Validation | zod schemas in `lib/validation/*` | New `lib/validation/inquiry.ts` |
| Email | `lib/email.ts` `sendEmail()` (Resend, dev console fallback) | Reuse for new-message notifications |
| Categories | Hardcoded `LISTING_CATEGORIES` in `lib/listings.ts`, duplicated in filters/form/pages; typed as free `String` in DB | Cannot add/rename categories without a deploy |
| Industry | `User.industry` free string, list in `lib/profile.ts` (6 values, out of sync with 9 categories) | Cannot filter traders by industry, no canonical list |
| Location | `Listing.location` free text; `User.country` free text (seed uses `"US"`, onboarding is a text input) | Cannot filter by country reliably |
| Search | `products/page.tsx` → `{ contains: q, mode: "insensitive" }` over title/location/description | Seq scans; no relevance; no tags |
| DB | Postgres **18.3**, schema `dev`, `pg_trgm` and `unaccent` **available** but not installed; 8 listings / 15 users | Trigram index is viable; needs `CREATE EXTENSION` |
| Migrations | `prisma/migrations/*` (3 applied), custom SQL is fine | Add migrations in the same style |
| Tests | No test runner configured | Verification = `npm run lint`, `npm run build`, manual flows + throwaway DB scripts |

---

## 2. Decisions (defaults I will implement unless you say otherwise)

| # | Decision | Choice | Why |
| --- | --- | --- | --- |
| D1 | Model shape | `Conversation` + `Message`, one thread per (listing, buyer) | Replies, unread state, email snippets; stops thread fragmentation |
| D2 | Guest inquiries | **Sign-in required** to send in-app. Guests keep the `mailto:` button and get "Sign in to message" (returns to the listing). Phase 7 optional: guest threads with email-only reply links | Without an account the guest cannot read the reply, so a "stored" guest inquiry is a dead end |
| D3 | Unread tracking | Denormalized `buyerUnread` / `sellerUnread` counters + `*LastReadAt` timestamps | Badge = two `aggregate` calls; no per-row field comparison hacks |
| D4 | `Listing.inquiries` | Stop trusting the column; show real counts from `Conversation` (`_count`). Keep column, stop writing it | No risky data migration, no phantom numbers |
| D5 | Taxonomy shape | `Category` / `Industry` tables keyed by **slug**; `Listing.category` and `User.industry` keep storing the slug | Zero-breakage migration; DB becomes the source of names/order/hierarchy; no FK churn across 10+ files |
| D6 | Hierarchy | `Category.parentId` self-relation (one level used in UI, deeper allowed) | Room for "Machinery → Food processing" without a redesign |
| D7 | Tags | `Tag` + `ListingTag` join, seller-typed (comma separated, deduped, max 8) | Cross-cutting attributes (ISO 9001, organic, bulk) that categories can't express |
| D8 | Search engine | Denormalized `Listing.searchText` + GIN `pg_trgm` index, queried with Prisma `contains` (ILIKE) | Prisma-native (no raw SQL in the hot path), fast at this scale, survives if the extension is missing |
| D9 | Relevance sort | Add `sort=relevance` using `similarity()` via one `$queryRaw` when a query is present; else newest | Good results without rewriting the whole products page in SQL |
| D10 | Country filter | Add `Listing.countryCode` (ISO-2), select in form, backfill from seed/`location`, filter by it; names via `Intl.DisplayNames` (no new dependency) | Makes "location" filterable and matches `country-flag-icons` already installed |
| D11 | Taxonomy admin | `/dashboard/categories` CRUD (create/rename/reorder/deactivate) + industry tab | The point of moving lists into the DB |
| D12 | Translations | Taxonomy `name` stays English for now; `name` is a single column, no per-locale rows | Current category labels are English hardcoded anyway; note as follow-up |

If any of D2 / D5 / D9 is wrong for you, say so before I start — those are the ones that change the shape of the work.

---

## 3. Data model (Prisma)

```prisma
model Conversation {
  id                 String   @id @default(cuid())
  listingId          String
  listing            Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  buyerId            String
  sellerId           String
  buyer              User     @relation("BuyerConversations", fields: [buyerId], references: [id], onDelete: Cascade)
  seller             User     @relation("SellerConversations", fields: [sellerId], references: [id], onDelete: Cascade)
  subject            String
  status             String   @default("open") // open | archived
  buyerUnread        Int      @default(0)
  sellerUnread       Int      @default(0)
  buyerLastReadAt    DateTime?
  sellerLastReadAt   DateTime?
  lastMessageAt      DateTime @default(now())
  lastMessagePreview String   @default("")
  messages           Message[]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([listingId, buyerId]) // one thread per buyer per listing
  @@index([buyerId, lastMessageAt])
  @@index([sellerId, lastMessageAt])
  @@map("conversation")
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation(fields: [senderId], references: [id], onDelete: Cascade)
  body           String
  createdAt      DateTime     @default(now())

  @@index([conversationId, createdAt])
  @@map("message")
}

model Category {
  id        String     @id @default(cuid())
  slug      String     @unique
  name      String
  parentId  String?
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id], onDelete: SetNull)
  children  Category[] @relation("CategoryTree")
  sortOrder Int        @default(0)
  active    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([parentId, sortOrder])
  @@map("category")
}

model Industry {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  sortOrder Int      @default(0)
  active    Boolean  @default(true)

  @@map("industry")
}

model Tag {
  id       String       @id @default(cuid())
  slug     String       @unique
  name     String
  listings ListingTag[]

  @@map("tag")
}

model ListingTag {
  listingId String
  tagId     String
  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([listingId, tagId])
  @@index([tagId])
  @@map("listing_tag")
}
```

Additions to `Listing`:

```prisma
  countryCode   String?
  searchText    String   @default("")
  tags          ListingTag[]
  conversations Conversation[]

  @@index([countryCode])
```

Additions to `User`:

```prisma
  buyerConversations  Conversation[] @relation("BuyerConversations")
  sellerConversations Conversation[] @relation("SellerConversations")
  messagesSent        Message[]
```

Raw SQL in the same migration (unqualified names so Prisma's schema `search_path` applies):

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "listing_searchText_trgm_idx" ON "listing" USING gin ("searchText" gin_trgm_ops);
CREATE INDEX "listing_searchText_idx" ON "listing" ("searchText");
```

Seeds: the 9 current category slugs, 6 industries (plus the missing ones from onboarding), a starter tag set.

---

## 4. Phases (small, reviewable commits)

### Phase 1 — Foundations & guardrails
- Verify baseline: `npm run lint`, `npm run build` (record current warnings).
- `lib/login-redirect.ts`-style helper: `next` support in `utils/auth/log-in-action.ts` + `components/Auth/LogInForm.tsx`
  (only accept same-origin relative paths; default stays `dashboardLandingPath`).
- `.env.example`? (not present — skip). No functional UI change.

**Done when:** login with `?next=/en/products/abc?contact=1` lands back on that listing.

### Phase 2 — Taxonomy tables + data
- Migration: `Category`, `Industry`, `Tag`, `ListingTag`, `Listing.countryCode`, `Listing.searchText`.
- `lib/taxonomy.ts`: cached (`react cache`) `getCategories()`, `getCategoryMap()`, `getIndustries()`, `getTags()`; falls back to `LISTING_CATEGORIES` if the table is empty (safe deploy order).
- Seed taxonomy + backfill: category slugs → `Category` rows; `LIB` industry list → `Industry`; derive `countryCode` from `location`/seed data (best effort, rest null).
- `lib/countries.ts`: ISO-2 list with `Intl.DisplayNames` names + flag emoji/`country-flag-icons` helper.

**Done when:** all existing 8 listings resolve to a Category row; no UI change yet.

### Phase 3 — DB-driven taxonomy in the UI (no behavior change)
- Swap `LISTING_CATEGORIES` reads for `getCategories()` in: `products/page.tsx`, `components/product/product-filters.tsx`, `components/dashboard/listing-form.tsx`, `lib/listings.ts` (`categoryLabel` → map-aware), admin listing filters/detail.
- Keep `LISTING_CATEGORIES` as the seed/fallback constant only.
- Listing form: category select from DB, country select (`countryCode`), tags input (comma separated, max 8, normalized to slugs).

**Done when:** renaming a category row changes labels/filters everywhere after refresh; listings page grouping still works.

### Phase 4 — Search
- `lib/search.ts`: `buildListingSearchText()` → `title | description | category name | tag names | location | certifications | companyName | moq`.
- Call it in `createListing` / `updateListing` (and when tags change); backfill existing rows in the migration script.
- `products/page.tsx`: when `q` present, filter `searchText: { contains: q, mode: "insensitive" }`; add `country`, `industry`, `tag` params to the `AND` array (industry joins `user.industry`).
- Add `sort=relevance` (`$queryRaw` with `similarity("searchText", $q)` + existing filters) and `sort=views`; keep `newest/oldest/expiring`.
- Filters UI: country select, industry select, tag chips, sort options. Keep URL params shareable; pagination untouched.
- Migration: GIN trigram index + plain index.

**Done when:** `EXPLAIN` shows a bitmap index scan for `q`, search finds tag/category text, filters compose with pagination, and the page still renders with the extension missing.

### Phase 5 — Inquiry backend
- Migration: `Conversation`, `Message` (+ user relations).
- `lib/validation/inquiry.ts`: `conversationStartSchema` (name/message 1–4000, subject max 160), `messageSchema`.
- `utils/inquiries/actions.ts` (`"use server"`):
  - `startConversation(listingId, formData)` → auth required, cannot message own listing, cannot message banned seller, rate limit (max 20 new threads/day/user), `findUnique` on `(listingId, buyerId)` to reuse the thread, transaction: message create + conversation update (preview/lastMessageAt/unread) + `Listing.inquiries` legacy increment, then `sendEmail` to seller (fire-and-forget).
  - `sendMessage(conversationId, formData)` → must be buyer or seller; same transaction; email the counterpart.
  - `markRead(conversationId)` → zero the caller's unread counter, set `*LastReadAt`.
  - `archiveConversation(conversationId)`.
- Return the project's `{status,message,fieldErrors,redirectTo}` shape.

**Done when:** a signed-in buyer submits from a listing → row exists, seller gets an email (dev log), re-submitting reuses the thread.

### Phase 6 — Product page integration
- `product-contact.tsx`: primary button "Message seller/buyer"; if guest → link to `/log-in?next=<listing url>?contact=1`; open the dialog automatically when `?contact=1`; hide for the listing owner; keep "Email" as secondary `mailto:`.
- Listing page: replace `listing.inquiries` display with real `_count` of conversations; show "X conversations" only when > 0.
- Add a `product-contact` success state ("Message sent — view your inbox").

**Done when:** guest → login → back on listing with dialog open → send → arrives in inbox.

### Phase 7 — Inbox UI
- Routes under the personal dashboard (guarded by `requireOwnDashboard`):
  - `/[userId]/dashboard/messages` — list with tabs All / Buying / Selling / Unread, counterpart, listing title, snippet, relative time, unread dot; empty state.
  - `/[userId]/dashboard/messages/[id]` — thread: bubble list (own messages right), listing context card, reply composer, mark-read on open (server action in the page or a tiny client effect), "Email instead" fallback, archive.
- `components/dashboard/dashboard-nav.tsx`: add "Messages" with unread badge (server layout passes the count).
- User dashboard overview: "Unread messages" stat card + recent threads; seller-side "inquiries" replaces the fake counter.
- Mobile: list/thread full-width, sticky composer above safe area (match existing Drawer/safe-area patterns).

**Done when:** both sides see the same thread, unread counts go up on new message and to 0 on open.

### Phase 8 — Admin + taxonomy management
- `/dashboard/categories` (admin): table of categories with rename, reorder, activate/deactivate, parent; industry tab; tag list with rename + merge-less delete (blocked when in use).
- Admin listing detail: show conversation count and open thread links.
- **Flag:** `requireAdmin()` in `lib/dashboard-access.ts` currently has the role gate **commented out** ("TODO(dev)"). I will not flip it in this branch (out of scope), but it should be re-enabled before shipping — noted here so it isn't forgotten.

### Phase 9 — Polish
- i18n: new `messages/en/inbox.json` (+ `am` mirror) wired into `i18n/request.ts`; keep taxonomy names English per D12.
- Empty/loading/error states, `loading.tsx` for inbox routes.
- Email templates: branded minimal HTML, subject `New inquiry: "<listing>"`, deep link to the thread; reply subject `Re: <subject>`.
- Lint + build clean, manual test script in the PR description.
- PR written against `main`, titled `contact: inquiries + search/taxonomy`.

---

## 5. Verification checklist (no test runner in repo)

Manual, in order:
1. Guest on a listing → "Message seller" → login → back with dialog open → send.
2. Buyer inbox shows thread; seller gets dev-log email; seller dashboard badge shows 1; open → badge 0.
3. Reply from seller → buyer badge + email; thread shows both sides.
4. Owner visiting own listing sees no contact button. Banned seller cannot be messaged.
5. Same buyer re-contacts same listing → same thread (no duplicate).
6. Rate limit: 21st new thread in a day is rejected with a friendly message.
7. Search: exact title word, partial word (`machiner`), tag name, category name; page 2 keeps filters.
8. Filters: country + industry + tag + type compose; clear resets all; query string shareable.
9. New listing with tags + country → appears under those filters; edit → updates search text.
10. Deactivate a category as admin → disappears from filters, existing listings still render their stored label.
11. `npm run lint` and `npm run build` pass.
12. `EXPLAIN (ANALYZE)` on the products query with `q` uses the trigram index.

---

## 6. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| `pg_trgm` not installable in a managed prod DB | `CREATE EXTENSION` in a migration that tolerates failure is **not** possible cleanly → check prod permissions before deploy; ILIKE still works (slow) if the index is absent |
| Taxonomy rename changes existing listings' labels | Labels come from the table; renames are intentional. Old slugs are never deleted, only deactivated |
| `searchText` drift (writer forgets it) | Single helper `buildListingSearchText()` called from every write path; backfill script re-runs safely; add a dev-only admin action "rebuild search index" |
| Email failures blocking message writes | Notification is fire-and-forget after the DB transaction commits |
| Spam / email reputation | Auth requirement, 20 threads/day, 4000-char cap, banned check, no HTML in messages |
| Prisma + raw SQL for relevance sort | Encapsulated in `lib/search.ts`, parameterized only, no string interpolation |
| Login `next` redirect open-redirect | Only accept paths starting with `/` and not `//` |

---

## 7. Explicitly out of scope (separate branches)

Guest threads with token links, attachments/images in messages, read receipts UI ("seen"), typing indicators, realtime/websockets (poll on navigation is enough), notifications bell for other events, saved listings, image uploads, `views` analytics, enabling the admin role gate, translated taxonomy names, Elasticsearch/Meilisearch.
