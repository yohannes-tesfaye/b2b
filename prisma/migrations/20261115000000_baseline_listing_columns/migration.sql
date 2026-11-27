-- Baseline: columns that were added to the `listing` table with `prisma db push`
-- but never captured in a migration. `IF NOT EXISTS` keeps this safe on
-- databases that already have them (marked as applied locally without running).
ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "certifications" TEXT;
ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "currency" TEXT;
ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "incoterms" TEXT;
ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "moq" TEXT;
ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "originCountry" TEXT;
