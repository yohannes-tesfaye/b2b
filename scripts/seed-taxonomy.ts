/**
 * Seeds and repairs the taxonomy + search layer.
 *
 * Safe to run repeatedly (upserts only, no deletes):
 *   npx tsx scripts/seed-taxonomy.ts
 *
 * - creates/renames the canonical Category + Industry rows
 * - seeds a starter tag vocabulary
 * - backfills `countryCode` and `searchText` on existing listings
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeCountryCode, countryName } from "../lib/countries";
import { buildListingSearchText } from "../lib/search";

function resolveSchema(): string {
  if (process.env.DATABASE_SCHEMA) return process.env.DATABASE_SCHEMA;
  try {
    return new URL(process.env.DATABASE_URL || "").searchParams.get("schema") || "public";
  } catch {
    return "public";
  }
}

const adapter = new PrismaPg(process.env.DATABASE_URL || "", {
  schema: resolveSchema(),
});
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  ["agriculture", "Agriculture"],
  ["automotive", "Automotive"],
  ["chemicals", "Chemicals"],
  ["electronics", "Electronics"],
  ["food-beverage", "Food & beverage"],
  ["machinery", "Machinery"],
  ["services", "Services"],
  ["textiles", "Textiles"],
  ["other", "Other"],
] as const;

const INDUSTRIES = [
  ["agriculture", "Agriculture"],
  ["automotive", "Automotive"],
  ["chemicals", "Chemicals"],
  ["construction", "Construction"],
  ["electronics", "Electronics"],
  ["energy", "Energy"],
  ["finance", "Financial services"],
  ["food-beverage", "Food & beverage"],
  ["healthcare", "Healthcare"],
  ["logistics", "Logistics & freight"],
  ["machinery", "Machinery"],
  ["packaging", "Packaging"],
  ["services", "Professional services"],
  ["textiles", "Textiles"],
  ["other", "Other"],
] as const;

const STARTER_TAGS = [
  "iso-9001",
  "iso-22000",
  "ce-marked",
  "fda-approved",
  "organic",
  "bulk",
  "oem",
  "private-label",
  "sample-available",
  "custom-packaging",
];

async function seedCategories() {
  for (const [index, [slug, name]] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug },
      update: { name, sortOrder: index },
      create: { slug, name, sortOrder: index },
    });
  }
  console.log(`categories: ${CATEGORIES.length}`);
}

async function seedIndustries() {
  for (const [index, [slug, name]] of INDUSTRIES.entries()) {
    await prisma.industry.upsert({
      where: { slug },
      update: { name, sortOrder: index },
      create: { slug, name, sortOrder: index },
    });
  }
  console.log(`industries: ${INDUSTRIES.length}`);
}

async function seedTags() {
  for (const slug of STARTER_TAGS) {
    const name = slug
      .split("-")
      .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
      .join(" ");
    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { slug, name },
    });
  }
  console.log(`tags: ${STARTER_TAGS.length}`);
}

async function backfillListings() {
  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      location: true,
      countryCode: true,
      quantity: true,
      certifications: true,
      incoterms: true,
      originCountry: true,
      technicalSpecs: true,
      moq: true,
      user: { select: { companyName: true, country: true } },
      tags: { select: { tag: { select: { slug: true, name: true } } } },
    },
  });

  const categoryNames = Object.fromEntries(
    (await prisma.category.findMany({ select: { slug: true, name: true } })).map(
      (category) => [category.slug, category.name]
    )
  );

  let updated = 0;
  for (const listing of listings) {
    const countryCode =
      normalizeCountryCode(listing.countryCode) ??
      normalizeCountryCode(listing.originCountry) ??
      normalizeCountryCode(listing.location) ??
      normalizeCountryCode(listing.user?.country);

    const searchText = buildListingSearchText({
      ...listing,
      categoryLabel: categoryNames[listing.category] ?? listing.category,
      countryName: countryName(countryCode),
      companyName: listing.user?.companyName,
      tags: listing.tags.flatMap((tag) => [tag.tag.slug, tag.tag.name]),
    });

    if (searchText === undefined) continue;

    await prisma.listing.update({
      where: { id: listing.id },
      data: { countryCode, searchText },
    });
    updated += 1;
  }

  console.log(`listings backfilled: ${updated}/${listings.length}`);
}

async function main() {
  await seedCategories();
  await seedIndustries();
  await seedTags();
  await backfillListings();
}

main()
  .catch((error) => {
    console.error("taxonomy seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
