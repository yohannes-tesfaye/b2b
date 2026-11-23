import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function resolveSchema(): string {
  if (process.env.DATABASE_SCHEMA) return process.env.DATABASE_SCHEMA;
  try {
    return new URL(process.env.DATABASE_URL || "").searchParams.get("schema") || "public";
  } catch {
    return "public";
  }
}

const adapter = new PrismaPg(process.env.DATABASE_URL || "", { schema: resolveSchema() });
const prisma = new PrismaClient({ adapter });

type DummyUser = {
  name: string;
  email: string;
  role: string;
  banned: boolean;
  banReason?: string;
  companyName: string;
  country: string;
  industry: string;
  companySize: string;
};

const dummyUsers: DummyUser[] = [
  { name: "Alice Admin", email: "alice.admin@example.com", role: "admin", banned: false, companyName: "TradeHub HQ", country: "US", industry: "electronics", companySize: "51-200" },
  { name: "Super Sam", email: "sam.super@example.com", role: "superadmin", banned: false, companyName: "TradeHub HQ", country: "US", industry: "electronics", companySize: "51-200" },
  { name: "Bob Buyer", email: "bob.buyer@example.com", role: "buyer", banned: false, companyName: "Bob Co", country: "DE", industry: "machinery", companySize: "11-50" },
  { name: "Sara Supplier", email: "sara.supplier@example.com", role: "supplier", banned: false, companyName: "Sara Goods", country: "CN", industry: "textiles", companySize: "201-500" },
  { name: "Charlie TSP", email: "charlie.tsp@example.com", role: "trade-service-provider", banned: false, companyName: "Charlie Logistics", country: "IN", industry: "automotive", companySize: "1-10" },
  { name: "Diana Buyer", email: "diana.buyer@example.com", role: "buyer", banned: true, banReason: "Spam / abuse", companyName: "Diana Imports", country: "FR", industry: "agriculture", companySize: "1-10" },
  { name: "Evan Supplier", email: "evan.supplier@example.com", role: "supplier", banned: false, companyName: "Evan Exports", country: "BR", industry: "agriculture", companySize: "500+" },
  { name: "Fiona Buyer", email: "fiona.buyer@example.com", role: "buyer", banned: false, companyName: "Fiona Trading", country: "UK", industry: "other", companySize: "11-50" },
];

async function main() {
  for (const u of dummyUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      await prisma.user.update({ where: { email: u.email }, data: { ...u, emailVerified: true } });
    } else {
      await prisma.user.create({
        data: {
          id: "seed_" + u.email.split("@")[0].replace(/[^a-z0-9]/gi, "_"),
          ...u,
          emailVerified: true,
        },
      });
    }
  }
  console.log(`Seeded ${dummyUsers.length} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
