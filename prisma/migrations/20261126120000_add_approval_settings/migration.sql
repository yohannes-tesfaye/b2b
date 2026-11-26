-- Add per-user review flag
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "requiresReview" BOOLEAN NOT NULL DEFAULT false;

-- Add global approval settings (singleton row, id = 'default')
CREATE TABLE IF NOT EXISTS "app_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "listingApprovalEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoApproveVerified" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "app_settings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
