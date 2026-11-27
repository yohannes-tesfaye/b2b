-- AlterTable
ALTER TABLE "message" ADD COLUMN     "viaListing" BOOLEAN NOT NULL DEFAULT false;

-- Data migration: the first message of every pre-existing conversation was
-- created through the listing contact form, so mark it as referencing its
-- listing. Newer replies keep the default (false).
UPDATE "message" m SET "viaListing" = true
WHERE m.id IN (
  SELECT DISTINCT ON (c.id) msg.id
  FROM "conversation" c
  JOIN "message" msg ON msg."conversationId" = c.id
  ORDER BY c.id, msg."createdAt" ASC
);
