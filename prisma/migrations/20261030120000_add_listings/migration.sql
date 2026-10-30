-- CreateTable
CREATE TABLE "listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "inquiries" INTEGER NOT NULL DEFAULT 0,
    "qualityStandard" TEXT,
    "deliveryTimeline" TEXT,
    "preferredRegion" TEXT,
    "budgetRange" TEXT,
    "technicalDocument" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" TEXT,
    "deliveryOptions" TEXT,
    "technicalSpecs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listing_userId_idx" ON "listing"("userId");

-- CreateIndex
CREATE INDEX "listing_status_idx" ON "listing"("status");

-- CreateIndex
CREATE INDEX "listing_type_idx" ON "listing"("type");

-- CreateIndex
CREATE INDEX "listing_expiresAt_idx" ON "listing"("expiresAt");

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
