-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
