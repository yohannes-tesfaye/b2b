-- AlterTable
ALTER TABLE "listing" ADD COLUMN "reviewedById" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "moderationNotes" TEXT;

-- CreateIndex
CREATE INDEX "listing_reviewedById_idx" ON "listing"("reviewedById");

-- CreateTable
CREATE TABLE "listing_status_history" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "reason" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listing_status_history_listingId_idx" ON "listing_status_history"("listingId");

-- CreateIndex
CREATE INDEX "listing_status_history_changedById_idx" ON "listing_status_history"("changedById");

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_status_history" ADD CONSTRAINT "listing_status_history_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_status_history" ADD CONSTRAINT "listing_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
